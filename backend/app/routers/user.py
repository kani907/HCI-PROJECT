from fastapi import APIRouter, Depends
from fastapi import HTTPException

from app.database.db import users_collection
from app.schemas.user_schema import UserCreate, UserResponse, UserUpdate
from app.models.user_model import user_model
from app.core.security import hash_password
from app.dependencies import get_current_user, require_admin
from app.routers.movie import get_movie_id

from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


def action_permitted(current_user, id):
    if current_user.get("role") == "admin":
        return True

    return str(current_user["_id"]) == id


@router.post("/add", response_model=UserResponse)
def create_user(user: UserCreate):
    new_user = dict(user)
    new_user["password"] = hash_password(user.password)
    new_user['role'] = user.role

    # is email unique?
    if users_collection.find_one({"email": new_user["email"]}):
        raise HTTPException(status_code=409,
                            detail="this email is already registered")

    result = users_collection.insert_one(new_user)
    created_user = users_collection.find_one({"_id": result.inserted_id})

    return user_model(created_user)


@router.get("/all", response_model=list[UserResponse])
def get_users(admin=Depends(require_admin)):
    users = []
    for user in users_collection.find():
        users.append(user_model(user))
    return users


@router.get("/find/{id}", response_model=UserResponse)
def get_user(id: str, current_user=Depends(get_current_user)):
    if not action_permitted(current_user, id):
        raise HTTPException(status_code=403, detail="access denied")
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = users_collection.find_one({"_id": obj_id})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user_model(user)


@router.put("/update/{id}", response_model=UserResponse)
def update_user(id: str,
                user: UserUpdate,
                current_user=Depends(get_current_user)):
    if not action_permitted(current_user, id):
        raise HTTPException(status_code=403, detail="access denied")
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    update_data = {k: v for k, v in user.dict().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400,
                            detail="No data provided to update")

    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])
    if "role" in update_data:
        del update_data["role"]

    result = users_collection.update_one(
        {"_id": obj_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    updated_user = users_collection.find_one({"_id": obj_id})
    return user_model(updated_user)


@router.delete("/delete/{id}")
def delete_user(id: str, current_user=Depends(get_current_user)):
    if not action_permitted(current_user, id):
        raise HTTPException(status_code=403, detail="access denied")
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = users_collection.find_one_and_delete({"_id": obj_id})

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "message": "user deleted succesfully",
        "deleted_user_id": id
    }


@router.delete("/delete_self")
def delete_my_account(current_user=Depends(get_current_user)):
    users_collection.delete_one({"_id": current_user["_id"]})

    return {
        "message": "Your account has been permanently deleted"
    }


@router.post("/add_movie/{movie_id}")
def add_movie(
    movie_id: str,
    current_user=Depends(get_current_user)
):
    try:
        get_movie_id(movie_id)
    except HTTPException:
        raise HTTPException(status_code=404, detail="movie not found")

    user_id = ObjectId(current_user["_id"])

    result = users_collection.update_one(
        {"_id": user_id},
        {"$push": {"history": movie_id}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "message": "Movie added to history",
        "movie_id": movie_id
    }
