import re
from underthesea import word_tokenize
import numpy as np
from transformers import AutoTokenizer, AutoModel
# import torch

# Khởi tạo tokenizer và model PhoBERT
# tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")
# model = AutoModel.from_pretrained("vinai/phobert-base")

# Hàm tiền xử lý comment
# def clean_comment(comment: str) -> str:
#     comment = re.sub(r"[.,;“”:”\"'!?-]+", " ", comment)
#     return comment.strip()

# # Hàm tokenization
# def tokenize_comment(comment: str) -> str:
#     return word_tokenize(comment, format="text")



import re
from underthesea import word_tokenize
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch

# Khởi tạo tokenizer và model PhoBERT
tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")
model = AutoModel.from_pretrained("vinai/phobert-base")

# Hàm tiền xử lý comment
def clean_comment(comment: str) -> str:
    comment = re.sub(r"[.,;“”:”\"'!?-]+", " ", comment)
    return comment.strip()

# Hàm xử lý văn bản
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s\u00C0-\u1EF9]+', '', text)  # Bao gồm cả chữ số và ký tự tiếng Việt
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Hàm xử lý mảng văn bản
def preprocess_comments(comments):
    return [preprocess_text(comment) for comment in comments]

# Hàm vector hóa văn bản bằng PhoBERT
def encode_texts(texts):
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy()  # Lấy tất cả các embeddings
    return embeddings

# # Hàm xử lý văn bản
# def preprocess_text(text):
#     text = text.lower()
#     text = re.sub(r'[^a-zA-Z\s]', '', text)
#     text = re.sub(r'\s+', ' ', text).strip()
#     return text


# # Hàm xử lý mảng văn bản
# def preprocess_comments(comments):
#     return [preprocess_text(comment) for comment in comments]


# # Hàm vector hóa văn bản bằng PhoBERT
# def encode_texts(texts):
#     embeddings = []
#     for text in texts:
#         inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt", max_length=128)
#         with torch.no_grad():
#             outputs = model(**inputs)
#         embeddings.append(outputs.last_hidden_state[:, 0, :].cpu().numpy())
#     return np.concatenate(embeddings, axis=0)