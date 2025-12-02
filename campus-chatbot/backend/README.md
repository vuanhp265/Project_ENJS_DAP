# Backend - Campus ChatBot

## Run (Windows PowerShell)
```powershell
python -m venv venv
.env\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# chỉnh MONGODB_URI nếu cần
python seed_faqs.py
python app.py
```
