from fastapi import FastAPI
from app.api import auth, agents, community, points
from app.core.database import init_db
import asyncio

app = FastAPI(
    title="Agent Table API",
    description="智能体调音台API文档",
    version="1.0.0"
)

# 包含路由
app.include_router(auth.router)
app.include_router(agents.router)
app.include_router(community.router)
app.include_router(points.router)


@app.on_event("startup")
async def startup_event():
    """应用启动时初始化数据库"""
    await init_db()


@app.get("/")
async def root():
    return {"message": "欢迎使用智能体调音台API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}