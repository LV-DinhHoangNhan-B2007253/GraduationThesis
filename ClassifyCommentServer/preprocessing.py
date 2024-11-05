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


# # Hàm xử lý văn bản
def preprocess_text(text):
    # Loại bỏ ký tự đặc biệt và số
    text = re.sub(r"[.,;“”:”\"'!?-]+", " ", text)  # Loại bỏ ký tự đặc biệt
    text = re.sub(r"\d+", "", text)  # Loại bỏ số
    text = text.lower()  # Chuyển về chữ thường
    # Tokenize và loại bỏ stopwords
    words = word_tokenize(text, format="text").split()
    words = [word for word in words if word not in stopwords]  # Bỏ stopwords
    return " ".join(words)

# Hàm xử lý mảng văn bản
def preprocess_comments(comments):
    return [preprocess_text(comment) for comment in comments]



def encode_texts(texts):
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy()
    return embeddings


