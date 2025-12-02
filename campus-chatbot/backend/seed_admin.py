from db import users_col
from auth import hash_password
from datetime import datetime

admin = {
    "full_name": "System Admin",
    "email": "admin@chatbot.com",
    "password": hash_password("admin123"),
    "role": "admin",
    "created_at": datetime.utcnow(),
}

if not users_col().find_one({"email": admin["email"]}):
    users_col().insert_one(admin)
    print("Admin seeded: admin@chatbot.com / admin123")
else:
    print("Admin existed.")
