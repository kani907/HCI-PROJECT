
from fastapi import FastAPI, Depends
from app.routers import user, auth, movie
from app.dependencies import get_current_user

# creating api
app = FastAPI()

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(movie.router)


# endpoints
@app.get("/home")
def home_page():
    # coś się tu doda
    return {"message": "działa"}


@app.get("/for_you")
def propositions(current_user=Depends(get_current_user)):
    pass


@app.get("/top_list")
def top_list():
    pass
