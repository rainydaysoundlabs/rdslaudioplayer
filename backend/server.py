from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class Track(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    audioUrl: str
    imageUrl: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TrackCreate(BaseModel):
    title: str
    description: str
    audioUrl: str
    imageUrl: str


class TrackUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    audioUrl: Optional[str] = None
    imageUrl: Optional[str] = None


@api_router.get("/")
async def root():
    return {"message": "Guitar Pickup Comparison API"}


@api_router.get("/tracks", response_model=List[Track])
async def get_tracks():
    tracks = await db.tracks.find({}, {"_id": 0}).sort("createdAt", 1).to_list(1000)
    
    for track in tracks:
        if isinstance(track.get('createdAt'), str):
            track['createdAt'] = datetime.fromisoformat(track['createdAt'])
    
    return tracks


@api_router.post("/tracks", response_model=Track)
async def create_track(track_data: TrackCreate):
    track = Track(**track_data.model_dump())
    doc = track.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.tracks.insert_one(doc)
    return track


@api_router.put("/tracks/{track_id}", response_model=Track)
async def update_track(track_id: str, track_update: TrackUpdate):
    existing_track = await db.tracks.find_one({"id": track_id}, {"_id": 0})
    if not existing_track:
        raise HTTPException(status_code=404, detail="Track not found")
    
    update_data = {k: v for k, v in track_update.model_dump().items() if v is not None}
    
    if update_data:
        await db.tracks.update_one({"id": track_id}, {"$set": update_data})
    
    updated_track = await db.tracks.find_one({"id": track_id}, {"_id": 0})
    
    if isinstance(updated_track.get('createdAt'), str):
        updated_track['createdAt'] = datetime.fromisoformat(updated_track['createdAt'])
    
    return Track(**updated_track)


@api_router.delete("/tracks/{track_id}")
async def delete_track(track_id: str):
    result = await db.tracks.delete_one({"id": track_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Track not found")
    return {"message": "Track deleted successfully"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
