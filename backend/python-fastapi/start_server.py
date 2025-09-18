"""
启动FastAPI服务器的脚本
"""

import os
import sys
import subprocess

def main():
    """启动服务器"""
    try:
        # 检查是否安装了uvicorn
        import uvicorn
    except ImportError:
        print("❌ 未找到uvicorn，请先安装依赖:")
        print("pip install -r requirements.txt")
        return
    
    print("🚀 启动FastAPI服务器...")
    print("访问地址:")
    print("- 应用: http://localhost:8000")
    print("- API文档: http://localhost:8000/docs")
    print("- ReDoc文档: http://localhost:8000/redoc")
    print("\n按 Ctrl+C 停止服务器\n")
    
    # 启动服务器
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
    except Exception as e:
        print(f"❌ 启动服务器时出错: {e}")

if __name__ == "__main__":
    main()