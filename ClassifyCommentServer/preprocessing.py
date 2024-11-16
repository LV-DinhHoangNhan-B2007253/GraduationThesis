import joblib
import re
from underthesea import word_tokenize
# import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch

# # Khởi tạo tokenizer và model PhoBERT
tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")
model = AutoModel.from_pretrained("vinai/phobert-base")

def load_stopwords(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        stopwords = file.read().splitlines()
    return stopwords
stopwords = load_stopwords('./saved_models/stopword.txt')




import re
import unicodedata

def clean_text(text):
    # Đưa văn bản về dạng chuẩn Unicode NFC
    text = unicodedata.normalize("NFC", text)

    # Chuẩn hóa các từ bị lặp ký tự (ví dụ: haaai -> hai, hoaa -> hoa)
    text = re.sub(r"(\w)\1+", r"\1", text)

    # Loại bỏ số và ký tự đặc biệt, chỉ giữ lại chữ cái, dấu câu và khoảng trắng
    text = re.sub(r"[.,;“”:”\"'!?-]+", " ", text)  # Loại bỏ số

    # Chuyển về chữ thường
    text = text.lower()

    # Tách từ và trả về văn bản đã làm sạch
    words = text.split()  # Tách từ theo khoảng trắng
    cleaned_text = " ".join(words)

    return cleaned_text

# # Hàm xử lý văn bản
# def preprocess_text(text):
#     # Loại bỏ ký tự đặc biệt và số
#     text = re.sub(r"[.,;“”:”\"'!?-]+", " ", text)  # Loại bỏ ký tự đặc biệt
#     text = re.sub(r"\d+", "", text)  # Loại bỏ số
#     text = text.lower()  # Chuyển về chữ thường
#     # Tokenize và loại bỏ stopwords
#     # words = word_tokenize(text, format="text").split()
#     words = [word for word in words if word not in stopwords]  # Bỏ stopwords
#     return " ".join(words)

# Hàm xử lý mảng văn bản
def preprocess_comments(comments):
    return [clean_text(comment) for comment in comments]



def encode_texts(texts):
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy()
    return embeddings


