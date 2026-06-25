import os
import sys
from pathlib import Path

SRC_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SRC_DIR))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from model.inference import DDIInference

# Config
_AI_ROOT = Path(__file__).resolve().parent.parent.parent
DRUGBANK_WEIGHTS = os.environ.get(
   "AXON_DRUGBANK_WEIGHTS", str(_AI_ROOT / "weights" / "drugbank_fold0_best.pth")
)
TWOSIDES_WEIGHTS = os.environ.get(
    "AXON_TWOSIDES_WEIGHTS", str(_AI_ROOT / "weights" / "twosides_fold0_best.pth")
)
PORT = int(os.environ.get("AXON_PORT", "5001"))

app = FastAPI(title="AXON DDI AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_predictors = {}


def get_predictor(dataset):
    if dataset not in _predictors:
        weights = DRUGBANK_WEIGHTS if dataset == "drugbank" else TWOSIDES_WEIGHTS
        if not os.path.exists(weights):
            raise RuntimeError(f"Weights not found: {weights}")
        _predictors[dataset] = DDIInference(weights, dataset=dataset)
    return _predictors[dataset]


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


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "models_loaded": list(_predictors.keys()),
        "drugbank_drugs": (
            _predictors["drugbank"].get_drug_count() if "drugbank" in _predictors else 0
        ),
        "twosides_drugs": (
            _predictors["twosides"].get_drug_count() if "twosides" in _predictors else 0
        ),
    }


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

    rec_map = {
        "high": "Severe interaction predicted. Avoid co-administration or monitor closely.",
        "medium": "Moderate interaction possible. Consider alternative or dose adjustment.",
        "low": "Low interaction risk. Standard monitoring recommended.",
    }
    result["recommendation"] = rec_map.get(result["risk_level"], "Consult pharmacist.")

    return PredictResponse(**result)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
