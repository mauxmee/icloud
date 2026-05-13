from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from isolar_client import ISolarCloudClient
import pandas as pd
import sqlite3

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Credentials(BaseModel):
    email: str
    password: str

@app.post("/sync")
async def sync_data(creds: Credentials):
    client = ISolarCloudClient(creds.email, creds.password)
    if not client.login():
        raise HTTPException(status_code=401, detail="Invalid iSolarCloud Credentials")
    
    stations = client.get_stations()
    all_data = []
    
    for s in stations:
        detail = client.get_history_data(s["station_id"])
        # Simulate processing and saving to DB
        # In a real app, you'd use SQLAlchemy here
        all_data.append({
            "station_name": s["station_name"],
            "daily_yield": detail.get("day_energy", 0),
            "monthly_yield": detail.get("month_energy", 0),
            "yearly_yield": detail.get("year_energy", 0),
            "total_yield": detail.get("total_energy", 0),
            "current_power": detail.get("curr_power", 0)
        })
    
    return {"status": "success", "data": all_data}

@app.get("/analysis")
async def get_analysis():
    # This would typically query your database
    # Returning dummy data for visualization example
    return [
        {"name": "Mon", "yield": 12.5},
        {"name": "Tue", "yield": 15.2},
        {"name": "Wed", "yield": 10.1},
        {"name": "Thu", "yield": 18.5},
        {"name": "Fri", "yield": 22.0},
        {"name": "Sat", "yield": 21.2},
        {"name": "Sun", "yield": 14.8},
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)