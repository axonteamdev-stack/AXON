import os
import sys
import csv
import json
from pathlib import Path
import requests as http_requests

SRC_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SRC_DIR))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
import uvicorn

from model.inference import DDIInference


@asynccontextmanager
async def lifespan(app: FastAPI):
    _load_drug_ids()
    _load_name_map()
    print(
        f"[AXON DDI] Loaded {len(_drug_ids.get('drugbank', []))} DrugBank IDs "
        f"and {len(_drug_ids.get('twosides', []))} Twosides IDs"
    )
    print(f"[AXON DDI] Drug name map loaded ({len(_name_map)} entries)")
    yield


# ─── Config ───
_AI_ROOT = Path(__file__).resolve().parent.parent.parent
DRUGBANK_WEIGHTS = os.environ.get(
    "AXON_DRUGBANK_WEIGHTS", str(_AI_ROOT / "weights" / "drugbank_fold0_best.pth")
)
TWOSIDES_WEIGHTS = os.environ.get(
    "AXON_TWOSIDES_WEIGHTS", str(_AI_ROOT / "weights" / "twosides_fold0_best.pth")
)
PORT = int(os.environ.get("AXON_PORT", "5001"))

app = FastAPI(title="AXON DDI AI Service", version="1.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_predictors = {}
_drug_ids = {}
_name_cache = {}
_name_map = {}


def _load_drug_ids():
    drugbank_file = _AI_ROOT / "data" / "DrugBank" / "drug_smiles.csv"
    twosides_file = _AI_ROOT / "data" / "Twosides" / "drug_smiles.csv"

    if drugbank_file.exists():
        with open(drugbank_file) as f:
            reader = csv.DictReader(f)
            _drug_ids["drugbank"] = {row["drug_id"] for row in reader}
    else:
        _drug_ids["drugbank"] = set()

    if twosides_file.exists():
        with open(twosides_file) as f:
            reader = csv.DictReader(f)
            _drug_ids["twosides"] = {row["drug_id"] for row in reader}
    else:
        _drug_ids["twosides"] = set()


def _load_name_map():
    map_file = _AI_ROOT / "data" / "drug_name_map.json"
    if map_file.exists():
        with open(map_file) as f:
            _name_map.update(json.load(f))


def _save_name_cache(name, drug_id, dataset):
    _name_cache[name.strip().lower()] = {"id": drug_id, "dataset": dataset}


def search_ids(query, dataset):
    q = query.lower()
    return sorted(d for d in _drug_ids.get(dataset, set()) if q in d.lower())


def resolve_drug(name):
    name_lower = name.strip().lower()

    # 1. Session cache
    cached = _name_cache.get(name_lower)
    if cached:
        return cached

    # 2. Pre-built name map (covers 2000+ drugs, no network)
    result = _name_map.get(name_lower)
    if result:
        _save_name_cache(name_lower, result["id"], result["dataset"])
        return result

    # 3. Direct ID match
    upper = name_lower.upper()
    if upper in _drug_ids.get("drugbank", set()):
        return {"id": upper, "dataset": "drugbank"}
    if upper in _drug_ids.get("twosides", set()):
        return {"id": upper, "dataset": "twosides"}

    # 4. Fallback: resolve via PubChem
    try:
        url = (
            f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"
            f"{name_lower}/cids/JSON"
        )
        resp = http_requests.get(
            url, headers={"User-Agent": "AXON-DDI/1.0"}, timeout=4
        )
        if resp.status_code == 200:
            cid = resp.json()["IdentifierList"]["CID"][0]
            cid_str = f"CID{cid:0>9}"
            if cid_str in _drug_ids.get("twosides", set()):
                _save_name_cache(name_lower, cid_str, "twosides")
                return {"id": cid_str, "dataset": "twosides"}
    except Exception:
        pass

    return None


def get_predictor(dataset):
    if dataset not in _predictors:
        weights = DRUGBANK_WEIGHTS if dataset == "drugbank" else TWOSIDES_WEIGHTS
        if not os.path.exists(weights):
            raise RuntimeError(f"Weights not found: {weights}")
        _predictors[dataset] = DDIInference(weights, dataset=dataset)
    return _predictors[dataset]


_REC_MAP = {
    "high": "Severe interaction predicted. Avoid co-administration or monitor closely.",
    "medium": "Moderate interaction possible. Consider alternative or dose adjustment.",
    "low": "Low interaction risk. Standard monitoring recommended.",
}


# ─── Request / Response Models ───


class PredictRequest(BaseModel):
    drugs: List[str]
    relation: Optional[int] = None
    dataset: str = "drugbank"


class PredictResponse(BaseModel):
    risk_level: str
    confidence: float
    interaction_type: int
    drug_a: str
    drug_b: str
    recommendation: Optional[str] = None
    dataset: str
    model: str


class BatchDrugResult(BaseModel):
    drug_a: str
    drug_b: str
    risk_level: str
    confidence: float
    dataset: str


class BatchPredictRequest(BaseModel):
    drugs: List[str]


class BatchPredictResponse(BaseModel):
    risk_level: str
    conflicts: List[BatchDrugResult]
    pairwise_results: List[BatchDrugResult]
    recommendation: str
    model_used: str
    confidence: Optional[float] = None
    unresolved: List[str] = []


# ─── Endpoints ───


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "models_loaded": list(_predictors.keys()),
        "drugbank_drugs": len(_drug_ids.get("drugbank", [])),
        "twosides_drugs": len(_drug_ids.get("twosides", [])),
    }


@app.get("/api/drugs")
def list_drugs(limit: int = Query(100, le=500)):
    return {
        "drugbank": {
            "count": len(_drug_ids.get("drugbank", [])),
            "drugs": sorted(_drug_ids.get("drugbank", set()))[:limit],
        },
        "twosides": {
            "count": len(_drug_ids.get("twosides", [])),
            "drugs": sorted(_drug_ids.get("twosides", set()))[:limit],
        },
    }


@app.get("/api/drugs/search")
def search_drugs(q: str = Query(..., min_length=1)):
    results = []
    for ds in ("drugbank", "twosides"):
        matches = search_ids(q, ds)
        results.extend({"id": d, "dataset": ds} for d in matches)
    return {"results": results[:100]}


@app.post("/api/predict-ddi", response_model=PredictResponse)
def predict_ddi(req: PredictRequest):
    if len(req.drugs) != 2:
        raise HTTPException(status_code=400, detail="Exactly 2 drugs required")
    if req.dataset not in ("drugbank", "twosides"):
        raise HTTPException(
            status_code=400, detail="dataset must be 'drugbank' or 'twosides'"
        )

    predictor = get_predictor(req.dataset)
    result = predictor.predict(req.drugs[0], req.drugs[1], req.relation)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    result["recommendation"] = _REC_MAP.get(result["risk_level"], "Consult pharmacist.")
    return PredictResponse(**result)


@app.post("/api/predict-ddi-batch", response_model=BatchPredictResponse)
def predict_ddi_batch(req: BatchPredictRequest):
    if len(req.drugs) < 2:
        raise HTTPException(status_code=400, detail="At least 2 drugs required")

    # Resolve each drug name → ID + dataset
    resolved = []
    unresolved = []
    for drug in req.drugs:
        r = resolve_drug(drug)
        if r:
            resolved.append(r)
        else:
            unresolved.append(drug)

    print(
        f"[resolve] received={req.drugs}, resolved={len(resolved)}, unresolved={unresolved}"
    )

    if len(resolved) < 2:
        msg = f"Could not resolve enough drugs. Resolved {len(resolved)}/{len(req.drugs)}: {unresolved}"
        print(f"[resolve] {msg}")
        return BatchPredictResponse(
            risk_level="unknown",
            conflicts=[],
            pairwise_results=[],
            recommendation=f"Cannot check interactions: {msg}",
            model_used="HDN-DDI",
            confidence=0.0,
            unresolved=unresolved,
        )

    # Generate unique pairs
    pairwise_results = []
    for i in range(len(resolved)):
        for j in range(i + 1, len(resolved)):
            da, db = resolved[i], resolved[j]

            # Find a common dataset where both drugs exist
            common_ds = None
            for ds_candidate in ("drugbank", "twosides"):
                if da["id"] in _drug_ids.get(ds_candidate, set()) and db[
                    "id"
                ] in _drug_ids.get(ds_candidate, set()):
                    common_ds = ds_candidate
                    break
            ds = common_ds or da["dataset"]

            try:
                predictor = get_predictor(ds)
                result = predictor.predict(da["id"], db["id"])
            except RuntimeError as e:
                pairwise_results.append(
                    {
                        "drug_a": da["id"],
                        "drug_b": db["id"],
                        "risk_level": "unknown",
                        "confidence": 0.0,
                        "dataset": ds,
                    }
                )
                continue

            if "error" in result:
                pairwise_results.append(
                    {
                        "drug_a": da["id"],
                        "drug_b": db["id"],
                        "risk_level": "unknown",
                        "confidence": 0.0,
                        "dataset": ds,
                    }
                )
                continue

            pairwise_results.append(
                {
                    "drug_a": result["drug_a"],
                    "drug_b": result["drug_b"],
                    "risk_level": result["risk_level"],
                    "confidence": result["confidence"],
                    "dataset": result["dataset"],
                }
            )

    if not pairwise_results:
        raise HTTPException(
            status_code=500, detail="No pairwise results could be computed"
        )

    # Determine overall risk (highest)
    risk_order = {"high": 3, "medium": 2, "low": 1, "unknown": 0}
    overall_risk = max(
        pairwise_results, key=lambda r: risk_order.get(r["risk_level"], 0)
    )
    conflicts = [r for r in pairwise_results if r["risk_level"] in ("high", "medium")]
    max_confidence = max(r["confidence"] for r in pairwise_results)

    recommendation = _REC_MAP.get(
        overall_risk["risk_level"],
        "No significant interactions detected between the identified drugs.",
    )

    return BatchPredictResponse(
        risk_level=overall_risk["risk_level"],
        conflicts=[BatchDrugResult(**c) for c in conflicts],
        pairwise_results=[BatchDrugResult(**r) for r in pairwise_results],
        recommendation=recommendation,
        model_used="HDN-DDI",
        confidence=max_confidence,
        unresolved=unresolved,
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
