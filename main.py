from fastapi import FastAPI
from app.mongo import router as mongo_router
#from app.auth import router as auth_router
from app.health import router as health_router  # import the health router

app = FastAPI()
app.include_router(mongo_router)
#app.include_router(auth_router)
app.include_router(health_router)

