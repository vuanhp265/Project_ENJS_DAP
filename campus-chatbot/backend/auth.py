import os
from functools import wraps

import bcrypt
import jwt
from bson import ObjectId
from flask import request, jsonify, g

from db import users_col

# ==========================
# Config
# ==========================

SECRET_KEY = os.getenv("JWT_SECRET", "dev_secret_key_change_me")
JWT_ALGO = "HS256"


# ==========================
# Password helpers
# ==========================

def hash_password(password: str) -> str:
    if not password:
        return ""
    if isinstance(password, str):
        password = password.encode("utf-8")
    return bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    if not password or not hashed:
        return False
    if isinstance(password, str):
        password = password.encode("utf-8")
    if isinstance(hashed, str):
        hashed = hashed.encode("utf-8")
    try:
        return bcrypt.checkpw(password, hashed)
    except Exception:
        return False


# ==========================
# JWT helpers
# ==========================

def generate_token(user) -> str:
    """
    Tạo JWT token với user_id, email, role.
    """
    payload = {
      "user_id": str(user["_id"]),
      "email": user.get("email"),
      "role": user.get("role", "student"),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGO)
    # PyJWT v2 trả về str luôn
    return token


def require_auth(role: str | None = None):
    """
    Decorator bảo vệ route.
    - Nếu role=None: chỉ cần user login.
    - Nếu role="admin": chỉ admin mới truy cập được.
    Sau khi verify xong: g.current_user = user.
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")

            if not auth_header.startswith("Bearer "):
                return jsonify({"message": "Missing token"}), 401

            token = auth_header.split(" ", 1)[1].strip()
            if not token:
                return jsonify({"message": "Missing token"}), 401

            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGO])
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token expired"}), 401
            except Exception:
                return jsonify({"message": "Invalid token"}), 401

            user_id = payload.get("user_id")
            if not user_id:
                return jsonify({"message": "Invalid token payload"}), 401

            user = users_col().find_one({"_id": ObjectId(user_id)})
            if not user:
                return jsonify({"message": "User not found"}), 401

            if role and user.get("role") != role:
                return jsonify({"message": "Forbidden"}), 403

            # RẤT QUAN TRỌNG: gắn user vào context
            g.current_user = user

            return f(*args, **kwargs)
        return wrapper
    return decorator
