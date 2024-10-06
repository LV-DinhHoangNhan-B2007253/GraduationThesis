import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Hàm để dự đoán label cho mảng comment
def predict_comments(comments):
    # Tải mô hình và vectorizer đã lưu
    model = joblib.load('saved_model.pkl')
    vectorizer = joblib.load('tfidf.pkl')

    # Chuyển đổi comments thành TF-IDF
    comments_tfidf = vectorizer.transform(comments)

    # Dự đoán label cho các comments
    predictions = model.predict(comments_tfidf)
    print(predictions)
    # Xuất kết quả
    results = pd.DataFrame({
        'comment': comments,
        'predicted_label': predictions
    })

    return results

if __name__ == '__main__':
    # Một ví dụ về các comment để dự đoán
    sample_comments = [
    "San pham khong co gi dac biet, chi binh thuong.",
    "Đợi mãi mà vẫn chưa thấy hàng.",
    "Sản phẩm này cũng bình thường, không có gì nổi bật.",
    "Giao hàng chậm, không như hứa hẹn.",
    "San pham binh thuong, khong co gi dac biet.",
    "Hàng không đúng như hình ảnh, rất chán.",
    "Mặc dù túi và hình ảnh trên ly k liên quan nhưng chất liệu, màu sắc rất ok. Chất lượng chưa dùng nên chưa biết 😊😊.",
    "Hàng giao đúng mẫu, nhưng chất lượng không đạt yêu cầu.",
    "San pham rat kem chat luong, khong như mong đợi.",
    "Hàng không giống như mô tả, thật sự thất vọng.",
    "Chất liệu kém, không như mong đợi.",
    ]

    # Dự đoán và in kết quả
    results = predict_comments(sample_comments)
    print(results)