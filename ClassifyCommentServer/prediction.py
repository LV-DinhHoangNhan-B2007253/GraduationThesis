import pandas as pd
from .preprocessing import encode_texts,preprocess_comments
import joblib

# # các model mới
phoBert=joblib.load('./saved_models/X_train_phobert.pkl')


# # # Các hàm dự đoán khác cho SVM và Logistic Regression
def predict_model(comments,model):
    cleaned_comments = preprocess_comments(comments)
    print('cleaned_comments',cleaned_comments)
    embeddings = encode_texts(cleaned_comments)
    print('embbedings',embeddings)
      # Hiển thị số chiều của embeddings
    print('Shape of embeddings:', embeddings.shape)
    predictions = model.predict(embeddings)
    print('prediction',predictions)
       # Tạo DataFrame từ comment và dự đoán
    results = pd.DataFrame({
        "comment": comments,
        "label": predictions.tolist()  # Chuyển đổi từ NumPy array sang danh sách
    })
    print('result',results)
    return results