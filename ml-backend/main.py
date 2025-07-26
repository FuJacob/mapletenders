from fastapi import FastAPI
from routers import embeddings, data, elasticsearch,
import uvicorn

app = FastAPI(
    title="MapleTenders ML Backend",
    description="AI-powered search and analysis for Canadian government tenders",
    version="1.0.0"
)

# Include routers
app.include_router(embeddings.router)
app.include_router(data.router)
app.include_router(elasticsearch.router)

@app.get("/")
def read_root():
    return {
        "message": "MapleTenders ML Backend API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)