# AXON AI/ML System Design

## Overview

The AXON platform includes an AI-powered Drug-Drug Interaction (DDI) prediction service and an AI medical chatbot. This document describes the architecture, models, and design decisions.

---

## 1. DDI Prediction Service

### Architecture

```
┌──────────────┐     HTTP      ┌──────────────────┐     PyTorch      ┌────────────────┐
│  Express API  │ ──────────►  │  FastAPI Server   │ ──────────────► │  HDN-DDI Model  │
│  (Backend)    │ ◄──────────  │  (Port 5001)      │ ◄────────────── │  (Inference)    │
└──────────────┘              └──────────────────┘                  └────────────────┘
                                      │                                      │
                                      │ ┌──────────────────┐                │
                                      │ │ Drug Resolution   │                │
                                      │ │ Pipeline:         │                │
                                      │ │ 1. Session Cache  │                │
                                      │ │ 2. Name Map JSON  │                │
                                      │ │ 3. Direct ID      │                │
                                      │ │ 4. PubChem API    │                │
                                      │ └──────────────────┘                │
                                      │                                      │
                                      │                    ┌────────────────┤
                                      │              DrugBank Weights  Twosides Weights
```

### Model: HDN-DDI

**HDN-DDI** (Hierarchical Molecular Graph Neural Network with Enhanced Dual-view Representation Learning) is a deep learning architecture that operates on molecular graphs.

| Property | DrugBank | Twosides |
|----------|----------|----------|
| **Drugs** | 1,706 | 645 |
| **Relation types** | 86 | 963 |
| **Training instances** | 191,000+ | 4,570,000+ |
| **Model params** | 6 heads × 6 blocks | 4 heads × 4 blocks |
| **Hidden dim** | 128 | 128 |
| **KGE dim** | 128 | 128 |

**Architecture details:**
- Input: 66-dimensional molecular features extracted via RDKit
- Processing: Molecular graph → bipartite graph → forward pass → sigmoid
- Output: Continuous 0-1 score (sigmoid probability)
- Risk thresholds: **High ≥ 0.70**, **Medium ≥ 0.30**, **Low < 0.30**

### Drug Resolution Pipeline

When a user submits drug names, the service resolves them to known IDs via a 4-tier pipeline:

```
User input (e.g., "aspirin", "ibuprofen")
    │
    ▼
Tier 1: Session Cache (in-memory _name_cache)
    │ Hit? → Return ID immediately (<1ms)
    │ Miss? → Continue
    ▼
Tier 2: Pre-built drug_name_map.json (2,000+ drugs)
    │ Hit? → Return ID
    │ Miss? → Continue
    ▼
Tier 3: Direct ID match (check DrugBank/Twosides ID sets)
    │ Hit? → Return ID
    │ Miss? → Continue
    ▼
Tier 4: PubChem REST API fallback (~4s)
    │ Hit? → Cache + Return ID
    │ Miss? → Return as unresolved
    ▼
Return results (resolved + unresolved drugs)
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Service health + loaded models |
| GET | `/api/drugs?limit=100` | List known drugs from both datasets |
| GET | `/api/drugs/search?q=...` | Search drugs by ID prefix |
| POST | `/api/predict-ddi` | Predict interaction for a drug pair |
| POST | `/api/predict-ddi-batch` | Predict all pairwise interactions for a list |

### Prediction Flow

```
1. Backend receives medication data from patient/doctor
2. Backend fetches patient's active medications from MongoDB
3. Backend builds drug list (existing + new medication)
4. Backend sends POST /api/predict-ddi-batch to AI service
5. AI service resolves each drug name → ID via 4-tier pipeline
6. AI service generates all pairwise combinations (N choose 2)
7. For each pair, AI service finds a common dataset (DrugBank/Twosides)
8. AI service runs PyTorch inference → sigmoid → risk level
9. AI service returns results with risk levels and recommendations
10. Backend returns result to frontend with visual indicators
```

**Key design decisions:**
- **Graceful degradation:** When the AI service is unreachable, the backend falls back to a "manual review recommended" response
- **Batched prediction:** All pairwise checks are done in a single request to minimize HTTP overhead
- **Stateless service:** The AI service has no database — all patient data comes from the backend

---

## 2. AI Medical ChatBot

### Architecture

```
User Message ──► Express Backend ──► OpenRouter API (GPT-4o-mini)
                                        │ Timeout (10s)?
                                        ▼
                                  Gemini API Fallback (gemini-1.5-flash)
                                        │
                                        ▼
                                  Response stored in MongoDB
                                        │
                                  Sent back to user via WebSocket
```

### Features

- **Bilingual:** System prompts in Arabic and English, language detected from user profile
- **Patient-aware:** Personalized queries include blood type, conditions, allergies, and active medications
- **Conversation history:** Last 20 messages used as context for each response
- **Fallback chain:** OpenRouter (primary) → Gemini (fallback) if primary times out (10s)
- **Persistent storage:** All conversations and messages stored in MongoDB (BotConversation, BotMessage)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chatbot/ask` | General medical question (no patient context) |
| POST | `/chatbot/personalized` | Question with patient health context |
| GET | `/chatbot/conversations` | List user's chatbot conversations |
| GET | `/chatbot/:conversationId/messages` | Get conversation messages |

---

## 3. Performance Characteristics

### DDI Inference

| Scenario | Time | Notes |
|----------|------|-------|
| Single pair (CPU) | ~50-200ms | Typical for one drug pair |
| Single pair (GPU) | ~10-50ms | If GPU is available |
| Batch (5 drugs = 10 pairs, CPU) | ~0.5-2s | Most common use case |
| Drug resolution (cache hit) | <1ms | Tiers 1-3 (95%+ of requests) |
| Drug resolution (PubChem) | ~4s | Rare fallback (<1% of requests) |

### ChatBot

| Scenario | Time | Notes |
|----------|------|-------|
| OpenRouter response | ~1-3s | GPT-4o-mini |
| Gemini fallback | ~1-3s | Only if OpenRouter times out |
| Total (with fallback) | ~12-15s | 10s primary + fallback |

---

## 4. Deployment

### AI DDI Service

- **Docker image:** CPU-optimized (PyTorch CPU build)
- **Hugging Face Spaces:** Deployed at `https://KTaha0-AXON-DDI.hf.space`
- **Local:** Runs on port 5001
- **Environment variables:** `AXON_PORT`, `AXON_DRUGBANK_WEIGHTS`, `AXON_TWOSIDES_WEIGHTS`

### Future Work

- Dockerize for scalable deployment
- GPU inference support for production
- Larger drug name map with regional aliases
- Caching layer for frequent drug pair predictions
- Drug-food interaction prediction
- Dosage-aware interaction severity scoring
