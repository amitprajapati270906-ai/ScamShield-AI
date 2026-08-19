# 🛡️ ScamShield AI

ScamShield AI is an AI-powered scam message detection system that analyzes suspicious SMS and messages and identifies whether they are potentially fraudulent.

## 🚀 Features

- 🔍 AI-powered scam detection
- 🚨 SCAM / SAFE classification
- 📊 Risk score from 0–100
- ⚠️ Risk level detection
- 🔎 Suspicious indicator detection
- 🕘 Recent scan history
- 📈 Dashboard statistics
- ⚡ FastAPI backend
- 💻 React + Vite frontend

## 🧠 How It Works

1. User enters a suspicious message.
2. React frontend sends the message to the FastAPI backend.
3. The trained machine learning model analyzes the message.
4. The backend calculates the risk score.
5. ScamShield AI returns the prediction and suspicious indicators.
6. The result is displayed on the dashboard.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Uvicorn

### Machine Learning
- Scikit-learn
- Joblib

## 📁 Project Structure

```text
ScamShield-AI/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── ml/
│   └── models/
│       └── message_model.pkl
│
├── screenshots/
├── requirements.txt
└── README.md