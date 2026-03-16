from pathlib import Path

# Base directory (project root)
BASE_DIR = Path(__file__).resolve().parents[2]


# Data paths
DATA_DIR = BASE_DIR / "data"
TWOSIDES_DIR = DATA_DIR / "Twosides"
DDIS_PATH = TWOSIDES_DIR / "ddis.csv"
DRUG_SMILES_PATH = TWOSIDES_DIR / "drug_smiles.csv"

# Models, notebooks, etc.
MODELS_DIR = BASE_DIR / "models"
NOTEBOOKS_DIR = BASE_DIR / "notebooks"
