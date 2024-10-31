import joblib
import pandas as pd
from .preprocessing import clean_comment, tokenize_comment,preprocess_text,encode_texts,preprocess_comments
import joblib

# các model mới
svm = joblib.load('./saved_models/svm_phoBert_model.pkl')
knn = joblib.load('./saved_models/knn_phoBert_model.pkl')
logistic = joblib.load('./saved_models/logistic_phoBert_model.pkl')
random_forest=joblib.load('./saved_models/random_forest_phoBert_model.pkl')
phoBert=joblib.load('./saved_models/X_train_phobert.pkl')



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

# # Các hàm dự đoán khác cho SVM và Logistic Regression
# def predict_svm(comments):
#     cleaned_comments = preprocess_comments(comments)
#     embeddings = encode_texts(cleaned_comments)
#     predictions = svm.predict(embeddings)
#        # Tạo DataFrame từ comment và dự đoán
#     results = pd.DataFrame({
#         "comment": comments,
#         "label": predictions.tolist()  # Chuyển đổi từ NumPy array sang danh sách
#     })
#     return results