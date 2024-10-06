import re
from underthesea import word_tokenize

# Hàm tiền xử lý comment
def clean_comment(comment: str) -> str:
    comment = re.sub(r"[.,;“”:”\"'!?-]+", " ", comment)
    return comment.strip()

# Hàm tokenization
def tokenize_comment(comment: str) -> str:
    return word_tokenize(comment, format="text")