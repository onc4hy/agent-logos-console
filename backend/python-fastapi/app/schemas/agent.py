from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AgentBase(BaseModel):
    name: str
    description: str
    personality: Optional[str] = None
    knowledge: Optional[str] = None
    is_public: Optional[bool] = False


class AgentCreate(AgentBase):
    pass


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    personality: Optional[str] = None
    knowledge: Optional[str] = None
    is_public: Optional[bool] = None


class DeployAgent(BaseModel):
    agent_id: int
    platforms: list[str]


class Agent(AgentBase):
    id: int
    usage_count: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True