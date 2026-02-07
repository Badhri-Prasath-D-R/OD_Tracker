from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb+srv://badhriprasathdr_db_user:<--------------->@od-system-cluster.kqapj43.mongodb.net/?appName=OD-System-Cluster"

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.College_OD_System

od_collection = database.get_collection("od_requests")