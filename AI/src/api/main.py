from fastapi import FastAPI, HTTPException
from src.models.inference import predict
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="AXON DDI AI Service")

class DDIPayload(BaseModel):
    drugs: List[str]

class DDIResponse(BaseModel):
    risk_level: str
    conflicts: List[str]
    recommendation: str

@app.post("/api/predict-ddi", response_model=DDIResponse)
async def predict_ddi(payload: DDIPayload):
    if len(payload.drugs) < 2:
        raise HTTPException(status_code=400, detail="At least 2 drugs required")

    # TODO: replace with actual model inference
    # from src.model.inference import predict
    # result = predict(payload.drugs)

    return DDIResponse(
        risk_level="low",
        conflicts=[],
        recommendation="No interactions detected."
    )

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
