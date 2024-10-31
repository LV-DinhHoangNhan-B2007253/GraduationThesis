from fastapi import FastAPI
from .models import CommentInput
from .prediction import predict,predict_svm
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



# @app.post("/predict/svm")
# def classify_comments_svm(input_data: CommentInput):
#     results = predict_svm(input_data.comments)
#     return results.to_dict(orient="records")  # Chuyển DataFrame thành danh sách các dict
#     # return predict(input_data)



@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)