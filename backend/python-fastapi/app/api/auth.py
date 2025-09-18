from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserCreate, UserLogin, LoginWithPhone, VerifyEmail, VerifyPhone, Token, User
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User as UserModel
from datetime import timedelta
from typing import Dict
import random
from sqlalchemy import select

router = APIRouter(prefix="/auth", tags=["认证"])

# 简单的内存存储用于验证码（生产环境应使用Redis等）
phone_verification_codes: Dict[str, dict] = {}


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """用户注册"""
    # 检查用户是否已存在
    result = await db.execute(select(UserModel).filter(UserModel.email == user.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户已存在"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user.password)
    db_user = UserModel(
        email=user.email,
        password=hashed_password,
        name=user.name,
        phone=user.phone
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """邮箱密码登录"""
    # 查找用户
    result = await db.execute(select(UserModel).filter(UserModel.email == user_credentials.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="邮箱或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 创建访问令牌
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login-phone", response_model=Token)
async def login_with_phone(login_data: LoginWithPhone, db: AsyncSession = Depends(get_db)):
    """手机验证码登录/注册"""
    phone = login_data.phone
    code = login_data.code
    
    # 验证短信验证码
    stored_code = phone_verification_codes.get(phone)
    
    # 检查验证码是否存在
    if not stored_code:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="验证码无效或已过期"
        )
    
    # 检查验证码是否过期
    from datetime import datetime
    if datetime.now() > stored_code["expires_at"]:
        # 删除过期的验证码
        del phone_verification_codes[phone]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="验证码已过期"
        )
    
    # 检查验证码是否正确
    if stored_code["code"] != code:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="验证码错误"
        )
    
    # 验证成功后删除验证码
    del phone_verification_codes[phone]
    
    # 查找用户，如果不存在则创建新用户
    result = await db.execute(select(UserModel).filter(UserModel.phone == phone))
    user = result.scalar_one_or_none()
    
    if not user:
        # 创建新用户（手机号登录）
        db_user = UserModel(
            email=f"{phone}@default.com",  # 为手机号登录用户生成默认邮箱
            password=get_password_hash("default_password"),  # 默认密码，用户可以后续修改
            name=f"User_{phone}",
            phone=phone
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        user = db_user
    
    # 创建访问令牌
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/send-email-code")
async def send_email_code(verify_email: VerifyEmail, background_tasks: BackgroundTasks):
    """发送邮箱验证码"""
    # 生成6位随机验证码
    code = str(random.randint(100000, 999999))
    
    # 这里应该将验证码存储到数据库或缓存中，设置5分钟有效期
    # 为简化起见，我们直接返回成功消息
    
    # 在实际应用中，这里应该调用邮件服务发送验证码
    # background_tasks.add_task(send_email_verification_code, verify_email.email, code)
    
    return {"message": "验证码已发送到您的邮箱"}


@router.post("/send-phone-code")
async def send_phone_code(verify_phone: VerifyPhone):
    """发送手机验证码"""
    # 生成6位随机验证码
    code = str(random.randint(100000, 999999))
    
    # 存储验证码，设置5分钟有效期
    from datetime import datetime, timedelta
    expires_at = datetime.now() + timedelta(minutes=5)
    
    phone_verification_codes[verify_phone.phone] = {
        "code": code,
        "expires_at": expires_at,
    }
    
    # 这里应该调用实际的短信服务发送验证码
    # 为简化起见，我们只是存储验证码并返回成功消息
    print(f"Sending SMS verification code {code} to phone {verify_phone.phone}")
    
    return {
        "message": "验证码已发送到您的手机"
    }