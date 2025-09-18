from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from app.models.user import User
from app.models.agent import Agent
from app.models.post import Post, Comment
from app.database import Base
import os


# 创建异步引擎
engine = create_async_engine(settings.database_url, echo=True)

# 创建异步会话
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db():
    """初始化数据库"""
    async with engine.begin() as conn:
        # 创建所有表
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """数据库依赖"""
    async with AsyncSessionLocal() as session:
        yield session