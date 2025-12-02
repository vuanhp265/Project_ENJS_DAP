# Campus ChatBot (React + Flask + MongoDB)

## 1) Backend
```powershell
cd backend
python -m venv venv
.env\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python seed_faqs.py
python app.py
```

## 2) Frontend
```powershell
cd ../frontend
npm i
npm run dev
```

## Test API (PowerShell)
```powershell
curl.exe -X POST http://127.0.0.1:5000/api/chat/query `
  -H "Content-Type: application/json" `
  -d "{""query"":""Học phí mỗi tín chỉ là bao nhiêu?""}"
```
