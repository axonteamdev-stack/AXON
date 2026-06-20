"""
AXON DDI Inference Module
Lightweight lookup + embedding-based prediction (no torch)
"""

import os
import pickle
import pandas as pd
import numpy as np
from typing import List, Dict, Tuple, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")


class DrugMapper:
    """Maps drug names to IDs across different datasets."""

    def __init__(self):
        self.db_id_to_smiles = {}  # DBxxxxx -> SMILES
        self.cid_id_to_smiles = {}  # CIDxxxxxx -> SMILES
        self.name_to_id = {}  # name -> (id_type, id)
        self.id_to_name = {}  # id -> preferred name
        self._load_mappings()

    def _load_mappings(self):
        """Load drug mappings from all datasets."""
        # DrugBank mapping
        db_smiles_path = os.path.join(DATA_DIR, "drugbank", "drug_smiles.csv")
        if os.path.exists(db_smiles_path):
            df = pd.read_csv(db_smiles_path)
            for _, row in df.iterrows():
                drug_id = row["drug_id"]
                smiles = row["smiles"]
                self.db_id_to_smiles[drug_id] = smiles
                self.name_to_id[drug_id.lower()] = ("db", drug_id)
                self.id_to_name[drug_id] = drug_id

        # TwoSides mapping (from SMILES file)
        tw_smiles_path = os.path.join(DATA_DIR, "twosides", "drug_smiles.csv")
        if os.path.exists(tw_smiles_path):
            df = pd.read_csv(tw_smiles_path)
            for _, row in df.iterrows():
                drug_id = row["drug_id"]
                smiles = row["smiles"]
                self.cid_id_to_smiles[drug_id] = smiles
                self.name_to_id[drug_id.lower()] = ("cid", drug_id)

        # Try to load pickle dict for additional mappings
        pkl_path = os.path.join(
            DATA_DIR, "drugbank", "id_data_dict_dsn_full_connect.pkl"
        )
        if os.path.exists(pkl_path):
            try:
                with open(pkl_path, "rb") as f:
                    extra_data = pickle.load(f)
                logger.info(f"Loaded extra mapping with {len(extra_data)} entries")
            except Exception as e:
                logger.warning(f"Could not load pickle: {e}")

        logger.info(f"Loaded {len(self.db_id_to_smiles)} DrugBank drugs")
        logger.info(f"Loaded {len(self.cid_id_to_smiles)} TwoSides drugs")

    def resolve(self, name: str) -> Optional[Tuple[str, str]]:
        """
        Resolve a drug name to (id_type, id).
        Returns None if not found.
        """
        name = name.strip().lower()

        # Direct match
        if name in self.name_to_id:
            return self.name_to_id[name]

        # Try partial match
        for key, value in self.name_to_id.items():
            if name in key or key in name:
                return value

        # Check if it's already an ID format
        if name.upper().startswith("DB"):
            db_id = name.upper()
            if db_id in self.db_id_to_smiles:
                return ("db", db_id)

        if name.upper().startswith("CID"):
            cid_id = name.upper()
            if cid_id in self.cid_id_to_smiles:
                return ("cid", cid_id)

        return None

    def get_smiles(self, id_type: str, drug_id: str) -> Optional[str]:
        """Get SMILES for a drug ID."""
        if id_type == "db":
            return self.db_id_to_smiles.get(drug_id)
        elif id_type == "cid":
            return self.cid_id_to_smiles.get(drug_id)
        return None


class DDIPredictor:
    """Main DDI prediction class."""

    def __init__(self):
        self.mapper = DrugMapper()
        self.known_interactions = set()  # (id1, id2) tuples
        self.drug_embeddings = {}  # id -> embedding vector
        self._load_interactions()
        self._load_embeddings()

    def _load_interactions(self):
        """Load known DDI pairs from all datasets."""
        # DrugBank DDIs
        db_ddi_path = os.path.join(DATA_DIR, "drugbank", "ddis.csv")
        if os.path.exists(db_ddi_path):
            df = pd.read_csv(db_ddi_path)
            for _, row in df.iterrows():
                d1, d2 = row["d1"], row["d2"]
                self.known_interactions.add((d1, d2))
                self.known_interactions.add((d2, d1))
            logger.info(f"Loaded {len(df)} DrugBank interactions")

        # TwoSides DDIs
        tw_ddi_path = os.path.join(DATA_DIR, "twosides", "ddis.csv")
        if os.path.exists(tw_ddi_path):
            df = pd.read_csv(tw_ddi_path)
            for _, row in df.iterrows():
                d1, d2 = row["d1"], row["d2"]
                self.known_interactions.add((d1, d2))
                self.known_interactions.add((d2, d1))
            logger.info(f"Loaded {len(df)} TwoSides interactions")

    def _load_embeddings(self):
        """Load drug embeddings if available."""
        # Try DeepLGF DS2 embeddings
        emb_path = os.path.join(
            DATA_DIR, "deeplgf", "DS2", "L_BF", "drug_representations_my.csv"
        )
        if os.path.exists(emb_path):
            try:
                df = pd.read_csv(emb_path, index_col=0)
                for drug_id in df.index:
                    self.drug_embeddings[drug_id] = df.loc[drug_id].values
                logger.info(f"Loaded {len(df)} drug embeddings")
            except Exception as e:
                logger.warning(f"Could not load embeddings: {e}")

    def _similarity_score(self, id1: str, id2: str) -> float:
        """Calculate similarity between two drugs using embeddings."""
        emb1 = self.drug_embeddings.get(id1)
        emb2 = self.drug_embeddings.get(id2)

        if emb1 is None or emb2 is None:
            return 0.5  # neutral if no embeddings

        # Cosine similarity using numpy
        dot = np.dot(emb1, emb2)
        norm1 = np.linalg.norm(emb1)
        norm2 = np.linalg.norm(emb2)

        if norm1 == 0 or norm2 == 0:
            return 0.5

        sim = dot / (norm1 * norm2)
        # Convert similarity to risk score (higher similarity = higher risk)
        # Scale from [-1, 1] to [0, 1]
        risk = (sim + 1) / 2
        return risk

    def predict(self, drugs: List[str]) -> Dict:
        """
        Predict DDI for a list of drug names/IDs.

        Returns:
            {
                "risk_level": "low" | "medium" | "high" | "unknown",
                "conflicts": ["drugA + drugB: ...", ...],
                "recommendation": str
            }
        """
        if len(drugs) < 2:
            return {
                "risk_level": "low",
                "conflicts": [],
                "recommendation": "Single drug - no interactions to check.",
            }

        # Resolve all drugs
        resolved = []  # list of (original_name, id_type, id)
        unresolved = []

        for drug in drugs:
            result = self.mapper.resolve(drug)
            if result:
                resolved.append((drug, result[0], result[1]))
            else:
                unresolved.append(drug)

        if len(resolved) < 2:
            return {
                "risk_level": "unknown",
                "conflicts": [],
                "recommendation": f"Could not identify enough drugs. Unknown: {', '.join(unresolved)}",
            }

        # Check all pairs
        conflicts = []
        total_risk = 0
        pair_count = 0

        for i in range(len(resolved)):
            for j in range(i + 1, len(resolved)):
                name1, type1, id1 = resolved[i]
                name2, type2, id2 = resolved[j]
                pair_count += 1

                # Check known interactions
                pair = (id1, id2)
                if pair in self.known_interactions:
                    conflicts.append(
                        f"{name1} + {name2}: Known interaction in database"
                    )
                    total_risk += 1.0
                else:
                    # Use embedding similarity for unknown pairs
                    sim_risk = self._similarity_score(id1, id2)
                    total_risk += sim_risk

                    if sim_risk > 0.7:
                        conflicts.append(
                            f"{name1} + {name2}: High structural similarity (risk: {sim_risk:.2f})"
                        )

        avg_risk = total_risk / pair_count if pair_count > 0 else 0

        # Determine risk level
        if avg_risk > 0.7:
            risk_level = "high"
        elif avg_risk > 0.4:
            risk_level = "medium"
        elif avg_risk > 0:
            risk_level = "low"
        else:
            risk_level = "unknown"

        # Build recommendation
        if conflicts:
            recommendation = f"Found {len(conflicts)} potential interaction(s) out of {pair_count} pairs checked."
            if risk_level == "high":
                recommendation += " These combinations may be dangerous. Consult a doctor immediately."
            elif risk_level == "medium":
                recommendation += " Monitor closely and consult your doctor."
        else:
            recommendation = "No interactions detected in our database. Always consult your doctor before combining medications."

        if unresolved:
            recommendation += f" Note: Could not identify {', '.join(unresolved)}."

        return {
            "risk_level": risk_level,
            "conflicts": conflicts,
            "recommendation": recommendation,
        }


# Singleton instances
_mapper = None
_predictor = None


def get_mapper() -> DrugMapper:
    global _mapper
    if _mapper is None:
        _mapper = DrugMapper()
    return _mapper


def get_predictor() -> DDIPredictor:
    global _predictor
    if _predictor is None:
        _predictor = DDIPredictor()
    return _predictor


def predict(drugs: List[str]) -> Dict:
    """Main prediction function used by the API."""
    return get_predictor().predict(drugs)
