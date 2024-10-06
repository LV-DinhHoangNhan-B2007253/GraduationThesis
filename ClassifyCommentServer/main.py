from fastapi import FastAPI
from .models import CommentInput
from .prediction import predict

app = FastAPI()

@app.post("/predict")
def classify_comments(input_data: CommentInput):
    return predict(input_data)

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)