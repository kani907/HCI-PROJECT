from fastapi import APIRouter, Depends
from fastapi import HTTPException
from fastapi import Query

from typing import Optional

from app.database.db import movie_collection
from app.schemas.movie_schema import MovieCreate, MovieUpdate
from app.models.movie_model import movie_model
from app.dependencies import require_admin

from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter(
    prefix="/movie",
    tags=["movies"]
)


@router.post("/add")
def add_movie(movie: MovieCreate, admin=Depends(require_admin)):
    new_movie = dict(movie)

    isUnique = True
    for movie in movie_collection.find():
        if movie_model(movie)['name'] == new_movie['name']:
            isUnique = False
    if not isUnique:
        raise HTTPException(status_code=409,
                            detail="this name is already registered")

    result = movie_collection.insert_one(new_movie)
    inserted_movie = movie_collection.find_one({"_id": result.inserted_id})

    return movie_model(inserted_movie)


@router.get("/all")
def get_movies():
    movies = [movie_model(movie) for movie in movie_collection.find()]
    return movies


@router.get("/specific")
def get_movies_specific(
    release_date: Optional[str] = None,
    rating: Optional[int] = None,
    tag: Optional[str] = None,
    limit: int = Query(10, gt=0, le=100)
):
    query = {}

    if release_date:
        query["release_date"] = release_date

    if rating:
        query["rating"] = rating

    if tag:
        query[f"tags.{tag}"] = {"$exists": True}

    movies = movie_collection.find(query).limit(limit)

    return [movie_model(movie) for movie in movies]


@router.get("/find_id/{id}")
def get_movie_id(id: str):
    try:
        movie_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="invalid movie id")

    movie = movie_collection.find_one({"_id": movie_id})

    if not movie:
        raise HTTPException(status_code=404,
                            detail="movie with specified id not found")

    return movie_model(movie)


@router.get("/find_name/{name}")
def get_movie_name(name: str):
    movie = movie_collection.find_one({"name": name})

    if not movie:
        raise HTTPException(status_code=404,
                            detail="movie with specified id not found")

    return movie_model(movie)


@router.put("/update/{id}")
def update_movie(id: str,
                 movie: MovieUpdate,
                 admin=Depends(require_admin)):
    try:
        movie_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="invalid movie id")

    update_data = {k: v for k, v in movie.dict().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400,
                            detail="no data provided to update")

    result = movie_collection.update_one(
        {"_id": movie_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="movie not found")

    updated_movie = movie_collection.find_one({"_id": movie_id})
    return movie_model(updated_movie)


@router.delete("/delete/{id}")
def delete_movie(id: str, admin=Depends(require_admin)):
    try:
        movie_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="invalid movie id")

    result = movie_collection.find_one_and_delete({"_id": movie_id})

    if not result:
        raise HTTPException(status_code=404,
                            detail="movie with specified id not found")

    return {
        "message": "succesfully deleated movie",
        "movie_id": id
    }
