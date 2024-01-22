from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.router import router

app = FastAPI(title="Main App")

# APP Middlewares
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Common Routers
app.include_router(router)
