from fastapi import FastAPI
from .models import CommentInput
from .prediction import predict_model
import joblib
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

svm = joblib.load('./saved_models/svm_phoBert_model4.pkl')
logistic = joblib.load('./saved_models/logistic_phoBert_model4.pkl')
random_forest=joblib.load('./saved_models/random_forest_phoBert_model4.pkl')




@app.post("/predict/svm")
def classify_comments_svm(input_data: CommentInput):
    results = predict_model(input_data.comments,svm)
    return results.to_dict(orient="records")  # Chuyển DataFrame thành danh sách các dict
    # return predict(input_data)




@app.post("/predict/logistic")
def classify_comments_svm(input_data: CommentInput):
    results = predict_model(input_data.comments,logistic)
    return results.to_dict(orient="records")  # Chuyển DataFrame thành danh sách các dict
    # return predict(input_data)



@app.post("/predict/random_forest")
def classify_comments_svm(input_data: CommentInput):
    results = predict_model(input_data.comments,random_forest)
    return results.to_dict(orient="records")  # Chuyển DataFrame thành danh sách các dict
    # return predict(input_data)

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

# SVM Accuracy:0.586897671900379
# Logistic Regression Accuracy:  0.6069301570113698
# Random Forest Accuracy:0.5668651867893882
# KNN Accuracy: 0.4653776978417266

# -> dùng LR làm model chính lúc gọi api