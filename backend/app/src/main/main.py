from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pymongo

# creating api
app = FastAPI()

# connecting to db
client = pymongo.MongoClient("mongodb://localhost:27017/")
database = client["mongodb_local"]
print(database.list_collection_names())
print(client.server_info())


# endpoints
@app.get("/")
def root():
    return {"huj": "ci w dupe"}
