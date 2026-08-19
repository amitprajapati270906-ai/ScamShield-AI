import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const analyzeMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/predict?message=${encodeURIComponent(message)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();

      setResult(data);

      setHistory((previousHistory) => [
        {
          id: Date.now(),
          message: data.message,
          prediction: data.prediction,
          risk_score: data.risk_score,
          risk_level: data.risk_level,
        },
        ...previousHistory,
      ]);
    } catch (error) {
      setResult({
        prediction: "ERROR",
        message: "Backend se connection nahi ho pa raha hai.",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Dashboard statistics
  const totalScans = history.length;

  const scamsDetected = history.filter(
    (scan) => scan.prediction === "SCAM"
  ).length;

  const safeMessages = history.filter(
    (scan) => scan.prediction === "SAFE"
  ).length;

  const averageRisk =
    totalScans > 0
      ? Math.round(
          history.reduce(
            (sum, scan) => sum + scan.risk_score,
            0
          ) / totalScans
        )
      : 0;

  const isScam = result?.prediction === "SCAM";

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🛡️ ScamShield <span>AI</span>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI Protection Active
        </div>
      </nav>

      <main className="hero">

        {/* Dashboard Stats */}
        <div className="stats-grid">

          <div className="stat-card">
            <span>📊</span>
            <strong>{totalScans}</strong>
            <p>Total Scans</p>
          </div>

          <div className="stat-card">
            <span>🚨</span>
            <strong>{scamsDetected}</strong>
            <p>Scams Detected</p>
          </div>

          <div className="stat-card">
            <span>✅</span>
            <strong>{safeMessages}</strong>
            <p>Safe Messages</p>
          </div>

          <div className="stat-card">
            <span>⚡</span>
            <strong>{averageRisk}</strong>
            <p>Average Risk</p>
          </div>

        </div>

        {/* Hero */}
        <div className="badge">
          🤖 AI-POWERED SCAM DETECTION
        </div>

        <h1>
          Detect Scams Before
          <br />
          <span>They Detect You.</span>
        </h1>

        <p className="subtitle">
          Paste a suspicious SMS or message below and let
          ScamShield AI analyze it instantly.
        </p>

        {/* Scanner */}
        <div className="scanner-card">

          <label>Enter suspicious message</label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Example: Congratulations! You have won a free prize..."
          />

          <button
            onClick={analyzeMessage}
            disabled={loading || !message.trim()}
          >
            {loading
              ? "⏳ Analyzing..."
              : "🔍 Analyze Message"}
          </button>

        </div>

        {/* Current Result */}
        {result && result.prediction !== "ERROR" && (
          <div
            className={`result-card ${
              isScam ? "scam" : "safe"
            }`}
          >

            <div className="result-icon">
              {isScam ? "🚨" : "✅"}
            </div>

            <div className="result-content">

              <h2>
                {isScam
                  ? "SCAM DETECTED"
                  : "MESSAGE LOOKS SAFE"}
              </h2>

              <p className="risk-level">
                Risk Level:{" "}
                <strong>{result.risk_level}</strong>
              </p>

              {/* Risk Score */}
              <div className="risk-score">

                <div className="risk-header">
                  <span>Risk Score</span>

                  <strong>
                    {result.risk_score}/100
                  </strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${result.risk_score}%`,
                    }}
                  ></div>
                </div>

              </div>

              {/* Indicators */}
              <div className="indicators">

                <h3>
                  🔍 Why was this flagged?
                </h3>

                <ul>
                  {result.indicators?.map(
                    (indicator, index) => (
                      <li key={index}>
                        <span>⚠️</span>
                        {indicator}
                      </li>
                    )
                  )}
                </ul>

              </div>

              {/* Analyzed Message */}
              <div className="analyzed-message">

                <strong>
                  Analyzed message:
                </strong>

                <p>
                  {result.message}
                </p>

              </div>

            </div>
          </div>
        )}

        {/* Error */}
        {result?.prediction === "ERROR" && (
          <div className="result-card error">

            <div className="result-icon">
              ⚠️
            </div>

            <div>
              <h2>Connection Error</h2>

              <p>{result.message}</p>
            </div>

          </div>
        )}

        {/* Scan History */}
        {history.length > 0 && (
          <section className="history-section">

            <div className="history-header">

              <div>
                <h2>🕘 Recent Scans</h2>

                <p>
                  Your latest message analysis results
                </p>
              </div>

              <button
                className="clear-button"
                onClick={clearHistory}
              >
                Clear History
              </button>

            </div>

            <div className="history-list">

              {history.map((scan) => (
                <div
                  className="history-item"
                  key={scan.id}
                >

                  <div className="history-icon">
                    {scan.prediction === "SCAM"
                      ? "🚨"
                      : "✅"}
                  </div>

                  <div className="history-message">

                    <strong>
                      {scan.prediction === "SCAM"
                        ? "SCAM"
                        : "SAFE"}
                    </strong>

                    <p>
                      {scan.message}
                    </p>

                  </div>

                  <div className="history-risk">

                    <strong>
                      {scan.risk_score}/100
                    </strong>

                    <span>
                      {scan.risk_level}
                    </span>

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

      </main>

      <footer>
        ScamShield AI • AI-powered message protection
      </footer>

    </div>
  );
}

export default App;