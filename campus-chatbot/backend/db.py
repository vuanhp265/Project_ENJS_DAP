import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# ================
# MongoDB Connect
# ================

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "campus_chatbot")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]


# ================
# Helper function
# ================

def get_collection(name: str):
    """Trả về collection theo tên"""
    return db[name]


# ================
# Collections
# ================

def faqs_col():
    return get_collection("faqs")


def logs_col():
    return get_collection("logs")


def pending_col():
    return get_collection("pending_questions")


def kb_docs_col():
    return get_collection("kb_docs")


def kb_chunks_col():
    return get_collection("kb_chunks")


def users_col():
    return get_collection("users")
