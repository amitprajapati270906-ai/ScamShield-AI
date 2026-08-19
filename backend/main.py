from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pathlib import Path

app = FastAPI()


# -----------------------------
# CORS Configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Load trained ML model
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "ml" / "models" / "message_model.pkl"

model = joblib.load(MODEL_PATH)


# -----------------------------
# Home endpoint
# -----------------------------
@app.get("/")
def home():
    return {
        "message": "ScamShield AI Backend is Running!"
    }


# -----------------------------
# Prediction endpoint
# -----------------------------
@app.post("/predict")
def predict(message: str):

    # ML prediction
    prediction = model.predict([message])[0]

    # Prediction probability
    probabilities = model.predict_proba([message])[0]
    classes = list(model.classes_)

    if 1 in classes:
        scam_index = classes.index(1)
        scam_probability = probabilities[scam_index]
    else:
        scam_probability = 0.0

    # Risk score
    risk_score = round(float(scam_probability) * 100)

    # Final prediction
    if str(prediction) == "1":
        result = "SCAM"
    else:
        result = "SAFE"

    # Risk level
    if risk_score >= 70:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # -----------------------------
    # Suspicious indicator detection
    # -----------------------------
    indicators = []

    text = message.lower()

    urgent_words = [
        "urgent",
        "immediately",
        "act now",
        "limited time",
        "hurry",
        "expires",
    ]

    prize_words = [
        "won",
        "winner",
        "prize",
        "reward",
        "lottery",
        "free",
    ]

    financial_words = [
        "bank",
        "account",
        "payment",
        "upi",
        "money",
        "transfer",
        "otp",
    ]

    link_words = [
        "http://",
        "https://",
        "www.",
        "click here",
        "link",
    ]

    # Urgency detection
    if any(word in text for word in urgent_words):
        indicators.append(
            "Urgency or pressure language detected"
        )

    # Prize detection
    if any(word in text for word in prize_words):
        indicators.append(
            "Prize or reward language detected"
        )

    # Financial detection
    if any(word in text for word in financial_words):
        indicators.append(
            "Financial or sensitive-information language detected"
        )

    # Link detection
    if any(word in text for word in link_words):
        indicators.append(
            "Potential suspicious link or click request detected"
        )

    # No indicators
    if not indicators:
        indicators.append(
            "No major suspicious keywords detected"
        )

    # -----------------------------
    # API response
    # -----------------------------
    return {
        "message": message,
        "prediction": result,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "indicators": indicators,
    }