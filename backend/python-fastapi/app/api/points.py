from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User as UserModel
from sqlalchemy import select
from datetime import datetime, timedelta

router = APIRouter(prefix="/points", tags=["积分"])


async def get_current_user(db: AsyncSession = Depends(get_db)):
    """获取当前用户（简化实现，实际应从JWT中获取）"""
    # 这里应该从JWT令牌中获取用户信息
    # 为简化起见，我们返回一个模拟用户
    result = await db.execute(select(UserModel).filter(UserModel.id == 1))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="用户未认证")
    return user


@router.post("/checkin")
async def checkin(db: AsyncSession = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    """签到获取积分"""
    # 在实际应用中，这里应该检查用户今天是否已经签到
    # 为简化起见，我们直接给用户增加积分
    
    # 增加10积分
    current_user.points += 10
    
    await db.commit()
    await db.refresh(current_user)
    
    return {
        "message": "签到成功",
        "points_added": 10,
        "total_points": current_user.points
    }


@router.get("/balance")
async def get_points_balance(db: AsyncSession = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    """获取积分余额"""
    return {
        "points": current_user.points
    }