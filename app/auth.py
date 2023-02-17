from fastapi import APIRouter, HTTPException
from jose import jwt, JWTError
from typing import Optional
import os

router = APIRouter()

# Define the variables needed to validate the JWT token
ALGORITHM = os.environ["ALGORITHM"]
SECRET_KEY = os.environ["SECRET_KEY"]
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"])

def get_token_header(authorization: str) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if "Bearer" not in authorization:
        raise HTTPException(status_code=401, detail="Invalid authorization type")
    token = authorization.replace("Bearer", "").strip()
    return token


async def verify_token(authorization: Optional[str] = None):
    token = get_token_header(authorization)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Could not validate token")
        token_data = {"sub": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate token")
    return token_data