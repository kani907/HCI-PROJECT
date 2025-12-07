from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.database.db import users_collection
from app.schemas.auth_schema import LoginRequest, TokenResponse
from app.core.security import verify_password
from app.core.jwt import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"email": form_data.username})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": user["role"]}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
