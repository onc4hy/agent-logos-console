from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PostBase(BaseModel):
    title: str
    content: str


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class Post(PostBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    post_id: int


class Comment(CommentBase):
    id: int
    author_id: int
    post_id: int
    created_at: datetime

    class Config:
        from_attributes = True