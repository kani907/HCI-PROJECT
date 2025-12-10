from fastapi import FastAPI, Depends, HTTPException

from app.routers import user, auth, movie
from app.routers.movie import get_movies_specific
from app.models.user_model import user_model
from app.dependencies import get_current_user
from app.database.db import users_collection, movie_collection
from app.core.security import hash_password
from app.config import settings

from app.algorithm.matcher import Matcher
from fastapi.middleware.cors import CORSMiddleware

import json
import pandas as pd


# creating api
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(movie.router)


@app.on_event("startup")
def create_predefined_users():
    admin_name = settings.ADMIN_NAME
    admin_email = settings.ADMIN_EMAIL
    admin_pwd = settings.ADMIN_PASSWORD

    with open(settings.PREFERENCES_PATH) as fh:
        preferences = json.load(fh)

    for user_name in list(preferences.keys()):
        if user_name == 'admin':
            existing_admin = users_collection.find_one(
                {
                    "role": "admin",
                    "email": admin_email
                }
            )

            if existing_admin:
                print("\033[33mINFO:\033[0m     admin already in database")
                continue

            admin = {
                "name": admin_name,
                "email": admin_email,
                "password": hash_password(admin_pwd),
                "algorithm": preferences['admin'],
                "role": "admin",
                "history": []
            }

            users_collection.insert_one(admin)

            print("\033[33mINFO:\033[0m     admin inserted")

            continue

        existing_user = users_collection.find_one({
            "email": user_name,
            "role": "user"
        })

        if existing_user:
            print(f"\033[33mINFO:\033[0m     {user_name} already in database")
            continue

        new_user = {
            "name": user_name,
            "email": user_name,
            "password": hash_password(user_name),
            "algorithm": preferences[user_name],
            "role": "user",
            "history": []
        }

        users_collection.insert_one(new_user)

        print(f"\033[33mINFO:\033[0m     {user_name} inserted")


# @app.on_event("startup")
# def create_admin():
#     admin_name = settings.ADMIN_NAME
#     admin_email = settings.ADMIN_EMAIL
#     admin_pwd = settings.ADMIN_PASSWORD

#     existing_admin = users_collection.find_one(
#         {
#             "role": "admin",
#             "email": admin_email
#         }
#     )

#     if existing_admin:
#         print("\033[33mINFO:\033[0m     admin already in database")
#         return

#     admin = {
#         "name": admin_name,
#         "email": admin_email,
#         "password": hash_password(admin_pwd),
#         "algorithm": {
#             "happy": {
#                 "Comedy": 42,
#                 "Animation": 36,
#                 "Family": 28,
#                 "Music": 19,
#                 "Musical": 16,
#                 "Romance": 14,
#                 "Fantasy": 12
#             },
#             "sad": {
#                 "Drama": 45,
#                 "Romance": 32,
#                 "Biography": 21,
#                 "War": 18,
#                 "History": 16,
#                 "Music": 12,
#                 "Animation": 9
#             },
#             "angry": {
#                 "Action": 48,
#                 "Thriller": 39,
#                 "Crime": 28,
#                 "Sci-Fi": 22,
#                 "War": 20,
#                 "Horror": 18,
#                 "Animation": 8
#             },
#             "relaxed": {
#                 "Family": 34,
#                 "Animation": 38,
#                 "Fantasy": 22,
#                 "Documentary": 20,
#                 "Romance": 17,
#                 "Comedy": 15
#             },
#             "excited": {
#                 "Action": 50,
#                 "Adventure": 41,
#                 "Sci-Fi": 33,
#                 "Thriller": 29,
#                 "Fantasy": 25,
#                 "Sport": 18,
#                 "Animation": 16
#             },
#             "anxious": {
#                 "Thriller": 36,
#                 "Horror": 34,
#                 "Mystery": 27,
#                 "Crime": 24,
#                 "Sci-Fi": 19,
#                 "Animation": 7
#             },
#             "bored": {
#                 "Comedy": 37,
#                 "Game-Show": 32,
#                 "Reality-TV": 29,
#                 "Talk-Show": 21,
#                 "Animation": 26
#             },
#             "nostalgic": {
#                 "Family": 33,
#                 "Animation": 35,
#                 "Fantasy": 23,
#                 "Adventure": 21,
#                 "Music": 19,
#                 "Romance": 15
#             },
#             "confident": {
#                 "Action": 35,
#                 "Sport": 28,
#                 "Biography": 26,
#                 "History": 20,
#                 "Adventure": 18,
#                 "Animation": 9
#             },
#             "romantic": {
#                 "Romance": 48,
#                 "Drama": 34,
#                 "Music": 26,
#                 "Comedy": 20,
#                 "Fantasy": 14,
#                 "Animation": 11
#             }
#         },
#         "role": "admin",
#         "history": []
#     }

#     users_collection.insert_one(admin)


@app.on_event("startup")
def load_movies_if_empty():
    count = movie_collection.count_documents({})
    if count > 0:
        print("\033[33mINFO:\033[0m     movies already loaded")
        return

    print("\033[33mINFO:\033[0m     movies "
          "database empty, wait for loading...")

    basics_path = settings.BASIC_PATH
    ratings_path = settings.RATINGS_PATH

    # Load ratings
    ratings_df = pd.read_csv(ratings_path, sep="\t")
    ratings_map = dict(
        zip(
            ratings_df["tconst"],
            zip(ratings_df["averageRating"], ratings_df["numVotes"])
        )
    )

    CHUNK_SIZE = 25_000
    processed_rows = 0
    total_inserted = 0
    batch_index = 0

    for chunk in pd.read_csv(
        basics_path,
        sep="\t",
        na_values="\\N",
        chunksize=CHUNK_SIZE
    ):
        batch_index += 1
        processed_rows += len(chunk)

        chunk = chunk[chunk["titleType"].isin(["movie", "tvSeries"])]

        chunk["runtimeMinutes"] = pd.to_numeric(chunk["runtimeMinutes"],
                                                errors="coerce")
        chunk["startYear"] = pd.to_numeric(chunk["startYear"], errors="coerce")

        chunk = chunk[[
            "tconst",
            "primaryTitle",
            "startYear",
            "runtimeMinutes",
            "genres"
        ]]

        chunk = chunk.dropna(subset=[
            "primaryTitle",
            "startYear",
            "runtimeMinutes",
            "genres"
        ])

        movies = []

        for _, row in chunk.iterrows():
            rating, _ = ratings_map.get(row["tconst"], (0, 0))

            movie = {
                "name": row["primaryTitle"],
                "release_date": int(row["startYear"]),
                "rating": float(rating),
                "tags": {
                    "genres": row["genres"].split(",")
                }
            }

            movies.append(movie)

        if movies:
            movie_collection.insert_many(movies)
            total_inserted += len(movies)

        if batch_index % 25 == 0:
            print(
                f"Inserted so far: {total_inserted} | "
                f"remaining: {settings.TOTAL_VIDEOS - total_inserted}"
            )

    print(f"\033[33mINFO:\033[0m     Finished loading."
          f" Total inserted: {total_inserted}")


@app.get("/")
def root():
    return {"message": "root"}


@app.get("/for_you")
def propositions(
    emotions: str,
    current_user=Depends(get_current_user)
):
    emotions_list = emotions.split(',')
    user = user_model(current_user)

    try:
        result = Matcher().get_matches(
            emotions_list,
            get_movies_specific,
            user["algorithm"],
            user['history']
        )
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail="bhfvuwlbf")
    return result

    # query = funkcja_kajetana(emotions_list)
    # pass user to some Kajetan function
    # get some query parameters
    # query = {
    #     "genres": "Animation,Action,Adventure",
    #     "rating_gte": 8,
    #     "limit": 10
    # }
    # return get_movies_specific(
    #     name=query.get("name", None),
    #     rating_gte=query.get("rating_gte", None),
    #     rating_lte=query.get("rating_lte", None),
    #     year_gte=query.get("year_gte", None),
    #     year_lte=query.get("year_lte", None),
    #     genres=query.get("genres", None),
    #     limit=query.get("limit", None)
    # )


@app.get("/top_list")
def top_list():
    return get_movies_specific(
        rating_gte=8,
        rating_lte=10,
        year_gte=2025, year_lte=2025,
        limit=20
    )
