# icloud

iSolarCloud Data Analysis Web App (Australia Edition)

## Architecture
- **Backend**: FastAPI (Python 3.12+)
- **Frontend**: React + Tailwind CSS + Recharts
- **Database**: PostgreSQL (or SQLite for local dev)
- **API Target**: `https://api.isolarcloud.com.hk`

## Setup

### Backend
1. `cd backend`
2. `python -m pip install fastapi uvicorn requests pandas sqlalchemy psutil pydantic`
3. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install axios recharts lucide-react`
3. `npm start`

## Features
- Secure credential input via UI
- Automated data synchronization
- Daily, Monthly, and Yearly generation analysis