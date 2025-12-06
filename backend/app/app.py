from fastapi import FastAPI, Depends

from app.routers import user, auth, movie
from app.dependencies import get_current_user
from app.database.db import users_collection
from app.core.security import hash_password

# creating api
app = FastAPI()

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(movie.router)


@app.on_event("startup")
def create_admin():
    admin_name = "admin"
    admin_email = "admin"
    admin_pwd = "admin"

    existing_admin = users_collection.find_one(
        {"role": "admin"},
        {"email": admin_email}
    )

    if existing_admin:
        print("\033[33mINFO:\033[0m     admin already in database")
        return

    admin = {
        "name": admin_name,
        "email": admin_email,
        "password": hash_password(admin_pwd),
        "algorithm": {},
        "role": "admin"
    }

    users_collection.insert_one(admin)


@app.get("/")
def root():
    return {"message": "root"}


@app.get("/home")
def home_page():
    return {"message": "działa"}


@app.get("/for_you")
def propositions(current_user=Depends(get_current_user)):
    pass


@app.get("/top_list")
def top_list():
    pass
