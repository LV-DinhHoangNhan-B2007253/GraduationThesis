from pydantic import BaseModel

class CommentInput(BaseModel):
    comments: list[str]

class CommentResponse(BaseModel):
    comment: str
    label: int
