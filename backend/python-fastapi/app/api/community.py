from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.post import PostCreate, PostUpdate, Post, CommentCreate, Comment
from app.core.database import get_db
from app.models.post import Post as PostModel, Comment as CommentModel
from app.models.user import User as UserModel
from sqlalchemy import select
from typing import List

router = APIRouter(prefix="/community", tags=["社区"])


async def get_current_user(db: AsyncSession = Depends(get_db)):
    """获取当前用户（简化实现，实际应从JWT中获取）"""
    # 这里应该从JWT令牌中获取用户信息
    # 为简化起见，我们返回一个模拟用户
    result = await db.execute(select(UserModel).filter(UserModel.id == 1))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="用户未认证")
    return user


@router.post("/posts", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(
    post: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """创建帖子"""
    db_post = PostModel(
        title=post.title,
        content=post.content,
        author_id=current_user.id
    )
    
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    
    return db_post


@router.get("/posts", response_model=List[Post])
async def get_posts(db: AsyncSession = Depends(get_db)):
    """获取所有帖子"""
    result = await db.execute(select(PostModel))
    posts = result.scalars().all()
    return posts


@router.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: int, db: AsyncSession = Depends(get_db)):
    """获取指定帖子"""
    result = await db.execute(select(PostModel).filter(PostModel.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="帖子不存在")
    
    return post


@router.put("/posts/{post_id}", response_model=Post)
async def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """更新帖子"""
    result = await db.execute(
        select(PostModel).filter(PostModel.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="帖子不存在")
    
    # 检查权限（只有作者可以编辑）
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限编辑此帖子")
    
    # 更新字段
    for field, value in post_update.dict(exclude_unset=True).items():
        setattr(post, field, value)
    
    await db.commit()
    await db.refresh(post)
    
    return post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """删除帖子"""
    result = await db.execute(
        select(PostModel).filter(PostModel.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="帖子不存在")
    
    # 检查权限（只有作者可以删除）
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限删除此帖子")
    
    await db.delete(post)
    await db.commit()
    
    return None


@router.post("/comments", response_model=Comment, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """创建评论"""
    # 检查帖子是否存在
    result = await db.execute(
        select(PostModel).filter(PostModel.id == comment.post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="帖子不存在")
    
    db_comment = CommentModel(
        content=comment.content,
        author_id=current_user.id,
        post_id=comment.post_id
    )
    
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)
    
    return db_comment


@router.get("/posts/{post_id}/comments", response_model=List[Comment])
async def get_comments(post_id: int, db: AsyncSession = Depends(get_db)):
    """获取帖子的所有评论"""
    # 检查帖子是否存在
    result = await db.execute(
        select(PostModel).filter(PostModel.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="帖子不存在")
    
    result = await db.execute(
        select(CommentModel).filter(CommentModel.post_id == post_id)
    )
    comments = result.scalars().all()
    
    return comments