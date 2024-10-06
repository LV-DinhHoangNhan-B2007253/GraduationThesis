import joblib
import pandas as pd
from .preprocessing import clean_comment, tokenize_comment

# Đọc mô hình đã lưu và TF-IDF
model = joblib.load('./saved_models/new_saved_model.pkl')
tfidf = joblib.load('./saved_models/new_tfidf.pkl')

def predict(input_data):
    # Tiền xử lý comment
    comments = [clean_comment(comment) for comment in input_data.comments]
    comments_tokenized = [tokenize_comment(comment) for comment in comments]

    print("Processed Comments:", comments)  # Kiểm tra comments đã được xử lý
    print("Tokenized Comments:", comments_tokenized) 
    # Chuyển đổi comment bằng TF-IDF
    comments_tfidf = tfidf.transform(comments_tokenized)

    # Dự đoán nhãn
    predictions = model.predict(comments_tfidf)
    print("Predictions:", predictions)  # Kiểm tra các dự đoán
    # Tạo DataFrame để định dạng đầu ra
    results = pd.DataFrame({
        "comment": comments,
        "label": predictions.tolist()  # Chuyển đổi từ NumPy array sang danh sách
    })

    return results.to_dict(orient="records")