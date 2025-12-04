
from fastapi import FastAPI
from app.routers import user

# creating api
app = FastAPI()

app.include_router(user.router)


# endpoints
@app.get("/")
def root():
    return {"huj": "ci w dupe"}


@app.get("/home")
def home_page():
    # coś się tu doda
    return {"message": "działa"}
