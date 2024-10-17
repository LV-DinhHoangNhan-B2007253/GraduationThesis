from fastapi import FastAPI
from .models import CommentInput
from .prediction import predict
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
# Thêm middleware CORS
# Cấu hình CORS để cho phép tất cả
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả các origin
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức HTTP
    allow_headers=["*"],  # Cho phép tất cả các headers
)

@app.post("/predict")
def classify_comments(input_data: CommentInput):
    return predict(input_data)

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)