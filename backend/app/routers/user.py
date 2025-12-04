from fastapi import APIRouter
from fastapi import HTTPException

from app.database.db import users_collection
from app.schemas.user_schema import UserCreate, UserResponse, UserUpdate
from app.models.user_model import user_model

from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate):
    new_user = dict(user)
    result = users_collection.insert_one(new_user)
    created_user = users_collection.find_one({"_id": result.inserted_id})
    return user_model(created_user)


@router.get("/")
def get_users():
    users = []
    for user in users_collection.find():
        users.append(user_model(user))
    return users


@router.get("/{id}", response_model=UserResponse)
def get_user(id: str):
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = users_collection.find_one({"_id": obj_id})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user_model(user)


@router.put("/{id}", response_model=UserResponse)
def update_user(id: str, user: UserUpdate):
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    update_data = {k: v for k, v in user.dict().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400,
                            detail="No data provided to update")

    result = users_collection.update_one(
        {"_id": obj_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    updated_user = users_collection.find_one({"_id": obj_id})
    return user_model(updated_user)


@router.delete("/{id}")
def delete_user(id: str):
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = users_collection.find_one_and_delete({"_id": obj_id})

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return user_model(result)
