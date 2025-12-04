
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.routers import user
import pymongo

# creating api
app = FastAPI()
# app.include_router(user.router)

# connecting to db
client = pymongo.MongoClient("mongodb://localhost:27017/")
database = client["mongodb_local"]
print(database.list_collection_names())
print(client.server_info())


# endpoints
@app.get("/")
def root():
    return {"huj": "ci w dupe"}
