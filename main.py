from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

app = FastAPI()

MONGO_DETAILS = "mongodb+srv://badhriprasathdr_db_user:HOz3HSK2eNFX6FzI@od-system-cluster.kqapj43.mongodb.net/?appName=OD-System-Cluster"

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.College_OD_System
od_collection = database.get_collection("od_requests")

@app.get("/")
async def root():
    return {"message": "OD System Backend is Running!"}

@app.get("/test-db")
async def test_db():
    try:
        await client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")
        return {"status": "Successfully connected to MongoDB Atlas!"}
    except Exception as e:
        print("Connection failed")
        return {"status": "Connection failed", "error": str(e)}