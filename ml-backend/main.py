from fastapi import FastAPI
from routers import embeddings, recommendations, search, data
app = FastAPI()

app.include_router(embeddings.router)
app.include_router(recommendations.router)
app.include_router(search.router)
app.include_router(data.router)
@app.get("/")
def read_root():
    return {"message": "Hello, World!"}