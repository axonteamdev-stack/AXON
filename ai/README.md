# AXON DDI AI Service

FastAPI-powered microservice for **drug-drug interaction (DDI) prediction** using the **HDN-DDI** deep learning model. Part of the [AXON](../README.md) healthcare management platform.

## Features

- **DDI prediction** — Predict interaction risk (high / medium / low) between drug pairs
- **Single & batch endpoints** — Check one pair or scan all combinations in a list
- **Drug resolution** — Resolve drug names to IDs via local maps, direct ID matching, or PubChem fallback
- **Dual datasets** — Supports both **DrugBank** (86 relation types) and **Twosides** (963 relation types)
- **Drug search** — Look up known drugs by ID prefix

## Architecture

```
FastAPI server  ──►  DDIInference class  ──►  HDN-DDI PyTorch model
      │                                              │
      │                                    ┌─────────┴──────────┐
      │                              DrugBank weights    Twosides weights
      │
      └── Drug resolution pipeline
           ┌─ Session cache
           ├─ Pre-built name map (2000+ drugs)
           ├─ Direct ID match
           └─ PubChem API fallback
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | FastAPI + Uvicorn |
| ML Framework | PyTorch 2.0.1 |
| Graph NN | PyTorch Geometric 2.3.1 |
| Cheminformatics | RDKit |
| Misc | scikit-learn, pandas, numpy, requests |

## Getting Started

```bash
# 1. Navigate to the AI service
cd ai

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Download model weights and place them in:
#    weights/drugbank_fold0_best.pth
#    weights/twosides_fold0_best.pth

# 5. Configure environment (optional — defaults work out of the box)
cp .env.example .env

# 6. Start the server
python src/api/main.py
```

The service starts on `http://localhost:5001`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AXON_PORT` | `5001` | Server port |
| `AXON_DRUGBANK_WEIGHTS` | `weights/drugbank_fold0_best.pth` | Path to DrugBank model weights |
| `AXON_TWOSIDES_WEIGHTS` | `weights/twosides_fold0_best.pth` | Path to Twosides model weights |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Service health and loaded model status |
| `GET` | `/api/drugs?limit=100` | List known drugs from both datasets |
| `GET` | `/api/drugs/search?q=...` | Search drugs by ID prefix |
| `POST` | `/api/predict-ddi` | Predict interaction between two drugs |
| `POST` | `/api/predict-ddi-batch` | Predict all pairwise interactions across a drug list |

### `/api/predict-ddi`

```json
{
  "drugs": ["DB01050", "DB00201"],
  "dataset": "drugbank"
}
```

### `/api/predict-ddi-batch`

```json
{
  "drugs": ["ibuprofen", "aspirin", "warfarin"]
}
```

## Project Structure

```
ai/
├── src/
│   ├── api/
│   │   └── main.py              # FastAPI server & endpoints
│   └── model/
│       └── inference.py          # DDIInference class
├── model/
│   └── HDN-DDI/                  # HDN-DDI model source (submodule)
│       ├── drugbank_test/
│       ├── twosides_test/
│       └── README.md             # Model training details
├── data/
│   ├── drug_name_map.json        # Drug name → ID mappings
│   ├── DrugBank/                 # DrugBank SMILES data
│   └── Twosides/                 # Twosides SMILES data
├── weights/                      # Model weight files (gitignored)
├── scripts/                      # Utility scripts
├── requirements.txt
└── .env.example
```

## Model

The DDI predictor uses **HDN-DDI** (Hierarchical Molecular Graph Neural Network), a deep learning architecture operating on molecular graphs. See [`model/HDN-DDI/README.md`](model/HDN-DDI/README.md) for training details, evaluation, and reproduction steps.

## Related

- [Backend API](../backend/README.md) — Express API that consumes this service
- [Web Frontend](../frontend/README.md) — React web application
- [Mobile App](../flutter/README.md) — Flutter mobile application
