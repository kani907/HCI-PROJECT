from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"huj": "ci w dupe"}
