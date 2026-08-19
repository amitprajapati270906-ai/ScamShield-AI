import pandas as pd
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report


# Project location
BASE_DIR = Path(__file__).resolve().parent.parent

# Dataset location
DATA_PATH = BASE_DIR / "datasets" / "SMSSpamCollection"

# Model save location
MODEL_PATH = BASE_DIR / "models" / "message_model.pkl"


# Load dataset
data = pd.read_csv(
    DATA_PATH,
    sep="\t",
    header=None,
    names=["label", "message"],
    encoding="latin-1"
)

print("Dataset loaded successfully!")
print("Total messages:", len(data))


# Convert labels into numbers
data["label"] = data["label"].map({
    "ham": 0,
    "spam": 1
})


# Remove empty rows
data = data.dropna()


# Input and output
X = data["message"]
y = data["label"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Create ML pipeline
model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2)
        )
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=1000
        )
    )
])


# Train model
print("\nTraining model...")

model.fit(X_train, y_train)


# Test model
y_pred = model.predict(X_test)


# Accuracy
accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:", round(accuracy * 100, 2), "%")


# Detailed results
print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        target_names=["Safe/Ham", "Spam"]
    )
)


# Create models folder
MODEL_PATH.parent.mkdir(
    parents=True,
    exist_ok=True
)


# Save trained model
joblib.dump(model, MODEL_PATH)

print("\nModel saved successfully!")

print("Location:", MODEL_PATH)