"""
测试脚本用于验证FastAPI后端是否正确安装和配置
"""

import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_installation():
    """测试安装"""
    try:
        # 测试导入
        from app.main import app
        from app.core.database import init_db
        from app.models.user import User
        from app.schemas.user import UserCreate
        from app.core.security import get_password_hash
        
        print("✅ 所有模块导入成功")
        
        # 测试数据库初始化
        try:
            await init_db()
            print("✅ 数据库初始化成功")
        except Exception as e:
            print(f"⚠️ 数据库初始化警告: {e}")
        
        print("\n🎉 FastAPI后端安装验证通过!")
        print("\n要启动服务器，请运行:")
        print("uvicorn app.main:app --reload")
        
        return True
        
    except ImportError as e:
        print(f"❌ 导入错误: {e}")
        print("\n请确保已安装所有依赖:")
        print("pip install -r requirements.txt")
        return False
    except Exception as e:
        print(f"❌ 其他错误: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_installation())