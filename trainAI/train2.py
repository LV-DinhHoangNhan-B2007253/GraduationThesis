import pandas as pd
import re
import random
from underthesea import word_tokenize
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn import svm
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import GridSearchCV

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

# Tăng cường dữ liệu bằng cách tạo biến thể
def augment_data(comments, labels):
    augmented_comments = []
    augmented_labels = []
    for comment, label in zip(comments, labels):
        augmented_comments.append(comment)  # Giữ lại comment gốc
        augmented_labels.append(label)       # Giữ lại nhãn gốc
        
        words = comment.split()
        # Nếu comment có nhiều hơn 1 từ
        if len(words) > 1:
            # Thay thế ngẫu nhiên một từ với từ đồng nghĩa 
            idx = random.randint(0, len(words) - 1)
            words[idx] = words[idx]  # Thay thế bằng chính nó,
            augmented_comments.append(' '.join(words))  # Thêm comment đã thay đổi
            augmented_labels.append(label)  # Giữ lại nhãn 
    return augmented_comments, augmented_labels

#  chuẩn hóa và tokenization cho dữ liệu
df['review'] = df['review'].apply(clean_comment).apply(tokenizer)
X_train = df['review'].tolist()
y_train = df['label'].tolist()

# Tăng cường dữ liệu cho tập huấn luyện
augmented_reviews, augmented_labels = augment_data(X_train, y_train)

# Tạo DataFrame mới với dữ liệu đã tăng cường
augmented_df = pd.DataFrame({'review': augmented_reviews, 'label': augmented_labels})

# Tách
X_test = test_data['review'].apply(clean_comment).apply(tokenizer).tolist()
y_test = test_data['label'].tolist()

# Chuyển đổi TF-IDF
def embedding(X_train, X_test):
    emb = TfidfVectorizer(min_df=5, max_df=0.8, max_features=3000, sublinear_tf=True)
    emb.fit(X_train)
    X_train = emb.transform(X_train)
    X_test = emb.transform(X_test)
    joblib.dump(emb, 'new_tfidf.pkl')
    return X_train, X_test

X_train_tfidf, X_test_tfidf = embedding(augmented_df['review'], X_test)

# Tối ưu hóa tham số cho mô hình SVM
param_grid = {
    'C': [0.1, 1, 10, 100],
    'kernel': ['linear', 'rbf'],
}

grid_search = GridSearchCV(svm.SVC(class_weight='balanced'), param_grid, scoring='accuracy', cv=5)
grid_search.fit(X_train_tfidf, augmented_df['label'])

# Lưu mô hình tốt nhất
best_model = grid_search.best_estimator_
joblib.dump(best_model, 'new_saved_model.pkl')

# Đánh giá mô hình
y_pred = best_model.predict(X_test_tfidf)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred, target_names=['Class 0', 'Class 1', 'Class 2']))