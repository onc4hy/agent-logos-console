from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # 数据库配置
    database_url: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./app.db")
    
    # JWT配置
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # 邮件配置
    mail_host: str = os.getenv("MAIL_HOST", "smtp.example.com")
    mail_port: int = int(os.getenv("MAIL_PORT", 587))
    mail_username: str = os.getenv("MAIL_USERNAME", "your-email@example.com")
    mail_password: str = os.getenv("MAIL_PASSWORD", "your-email-password")
    mail_use_tls: bool = os.getenv("MAIL_USE_TLS", "True").lower() == "true"

    class Config:
        env_file = ".env"


settings = Settings()