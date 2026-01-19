from fastapi import FastAPI
from .api import reports, dashboard, extraction

app = FastAPI()

app.include_router(reports.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1/dashboard")
app.include_router(extraction.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to TrailWatch"}
