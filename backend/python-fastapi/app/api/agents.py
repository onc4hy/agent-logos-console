from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.agent import AgentCreate, AgentUpdate, Agent, DeployAgent
from app.core.database import get_db
from app.models.agent import Agent as AgentModel
from app.models.user import User as UserModel
from sqlalchemy import select
from typing import List

router = APIRouter(prefix="/agents", tags=["智能体"])


async def get_current_user(db: AsyncSession = Depends(get_db)):
    """获取当前用户（简化实现，实际应从JWT中获取）"""
    # 这里应该从JWT令牌中获取用户信息
    # 为简化起见，我们返回一个模拟用户
    result = await db.execute(select(UserModel).filter(UserModel.id == 1))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="用户未认证")
    return user


@router.post("/", response_model=Agent, status_code=status.HTTP_201_CREATED)
async def create_agent(
    agent: AgentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """创建智能体"""
    db_agent = AgentModel(
        name=agent.name,
        description=agent.description,
        personality=agent.personality,
        knowledge=agent.knowledge,
        is_public=agent.is_public or False,
        user_id=current_user.id
    )
    
    db.add(db_agent)
    await db.commit()
    await db.refresh(db_agent)
    
    return db_agent


@router.get("/", response_model=List[Agent])
async def get_agents(db: AsyncSession = Depends(get_db)):
    """获取所有智能体"""
    result = await db.execute(select(AgentModel))
    agents = result.scalars().all()
    return agents


@router.get("/{agent_id}", response_model=Agent)
async def get_agent(agent_id: int, db: AsyncSession = Depends(get_db)):
    """获取指定智能体"""
    result = await db.execute(select(AgentModel).filter(AgentModel.id == agent_id))
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(status_code=404, detail="智能体不存在")
    
    return agent


@router.put("/{agent_id}", response_model=Agent)
async def update_agent(
    agent_id: int,
    agent_update: AgentUpdate,
    db: AsyncSession = Depends(get_db)
):
    """更新智能体"""
    result = await db.execute(select(AgentModel).filter(AgentModel.id == agent_id))
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(status_code=404, detail="智能体不存在")
    
    # 更新字段
    for field, value in agent_update.dict(exclude_unset=True).items():
        setattr(agent, field, value)
    
    await db.commit()
    await db.refresh(agent)
    
    return agent


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(agent_id: int, db: AsyncSession = Depends(get_db)):
    """删除智能体"""
    result = await db.execute(select(AgentModel).filter(AgentModel.id == agent_id))
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(status_code=404, detail="智能体不存在")
    
    await db.delete(agent)
    await db.commit()
    
    return None


@router.get("/my-agents", response_model=List[Agent])
async def get_my_agents(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """获取当前用户的所有智能体"""
    result = await db.execute(
        select(AgentModel).filter(AgentModel.user_id == current_user.id)
    )
    agents = result.scalars().all()
    return agents


@router.post("/deploy")
async def deploy_agent(deploy_data: DeployAgent, db: AsyncSession = Depends(get_db)):
    """部署智能体到第三方平台"""
    # 这里应该实现部署到第三方平台的逻辑
    # 为简化起见，我们返回模拟数据
    
    agent_id = deploy_data.agent_id
    platforms = deploy_data.platforms
    
    # 模拟部署过程
    deployment_results = []
    for platform in platforms:
        deployment_results.append({
            "platform": platform,
            "status": "success",
            "message": f"Agent {agent_id} deployed to {platform}",
            "deployed_at": "2023-01-01T00:00:00Z"  # 实际应使用datetime
        })
    
    return {
        "agent_id": agent_id,
        "deployments": deployment_results
    }