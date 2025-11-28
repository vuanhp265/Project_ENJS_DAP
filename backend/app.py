# app.py
from flask import Flask
from flask_cors import CORS
from routes.auth import auth

app = Flask(__name__)
CORS(app)  # Cho phép frontend gọi API

# Đăng ký các route
app.register_blueprint(auth, url_prefix='/api')

@app.route('/')
def home():
    return "<h1>Backend Student Portal đang chạy!</h1><p>API: /api/register và /api/login</p>"

if __name__ == '__main__':
    print("Backend đang khởi động...")
    app.run(port=5000, debug=True)