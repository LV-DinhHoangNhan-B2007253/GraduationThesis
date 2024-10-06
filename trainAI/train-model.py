import pandas as pd
import re
from underthesea import word_tokenize
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn import svm
from sklearn.metrics import classification_report, accuracy_score  # Thêm dòng này

# Đọc dữ liệu từ file CSV
df = pd.read_csv('train_data.csv', delimiter=',', header=0)
test_data = pd.read_csv('test_data.csv', delimiter=',', header=0)


# Xử lý comment
def clean_comment(row):
    row = re.sub(r"[.,;“”:”\"'!?-]+", " ", row)
    row = row.strip()
    return row

# Tokenizer trả về chuỗi
def tokenizer(row):
    return word_tokenize(row, format="text")

# Tạo TF-IDF embedding
def embedding(X_train, X_test):
    emb = TfidfVectorizer(min_df=5, max_df=0.8, max_features=3000, sublinear_tf=True)
    emb.fit(X_train)
    X_train = emb.transform(X_train)
    X_test = emb.transform(X_test)
    joblib.dump(emb, 'new_tfidf.pkl')
    return X_train, X_test

# Áp dụng chuẩn hóa và tokenization cho dữ liệu
df['review'] = df['review'].apply(clean_comment).apply(tokenizer)
test_data['review'] = test_data['review'].apply(clean_comment).apply(tokenizer)

# Tách dữ liệu
X_train = df['review']
y_train = df['label']
X_test = test_data['review']
y_test = test_data['label']


print("X_train samples:", X_train.sample(5))  # Hiển thị 5 mẫu từ X_train
print("X_test samples:", X_test.sample(5))    # Hiển thị 5 mẫu từ X_test
# Chuyển đổi dữ liệu bằng TF-IDF
X_train_tfidf, X_test_tfidf = embedding(X_train, X_test)


print("X_train samples:", X_train_tfidf)  # Hiển thị 5 mẫu từ X_train
print("X_test samples:", X_test_tfidf)  

# Train mô hình SVM với verbose
model = svm.SVC(kernel='linear', C=1, verbose=True)
model.fit(X_train_tfidf, y_train)



# # Lưu mô hình
joblib.dump(model, 'new_saved_model.pkl')


# # Đánh giá mô hình
y_pred = model.predict(X_test_tfidf)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))