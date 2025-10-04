import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Plot from "react-plotly.js";
import type { Layout } from 'plotly.js';
import "./ResultsDisplay.css";

interface AnalysisResult {
  prediction: string;
  confidence: number;
  reasoning?: string;
  flux_data: number[];
  time_data: number[];
  transit_period?: number | null;
  transit_depth?: number | null;
  transit_duration?: number | null;
  star_id?: string;
  star_info?: {
    pl_name?: string;
    hostname?: string;
    disc_facility?: string;
    disc_year?: number;
    pl_rade?: number;
    pl_masse?: number;
    pl_orbper?: number;
  };
  data_source?: string;
  total_data_points?: number;
  filename?: string;
}

const ResultsDisplay = () => {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = sessionStorage.getItem("analysisResults");
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      } catch (error) {
        console.error("Error parsing results:", error);
        navigate("/analyze");
      }
    } else {
      navigate("/analyze");
    }
    setLoading(false);
  }, [navigate]);

  const getPredictionColor = (prediction: string | undefined) => {
    if (!prediction) return "#64ffda";
    switch (prediction.toUpperCase()) {
      case "PLANET":
        return "#4caf50";
      case "CANDIDATE":
        return "#ff9800";
      case "FALSE POSITIVE":
        return "#f44336";
      default:
        return "#64ffda";
    }
  };

  const getPredictionIcon = (prediction: string | undefined) => {
    if (!prediction) return "❓";
    switch (prediction.toUpperCase()) {
      case "PLANET":
        return "🌍";
      case "CANDIDATE":
        return "🔍";
      case "FALSE POSITIVE":
        return "❌";
      default:
        return "❓";
    }
  };

  const generateFoldedData = (
    timeData: number[],
    fluxData: number[],
    period: number
  ) => {
    if (!period || period <= 0) return { foldedTime: [], foldedFlux: [] };

    const foldedTime = timeData.map((t) => (t % period) / period - 0.5);
    return { foldedTime, foldedFlux: fluxData };
  };

  if (loading) {
    return (
      <div className="results-loading">
        <div className="spinner-large"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-error">
        <h2>No Results Found</h2>
        <p>Please go back and analyze some data first.</p>
        <button onClick={() => navigate("/analyze")} className="back-btn">
          Back to Analysis
        </button>
      </div>
    );
  }

  const { foldedTime, foldedFlux } = generateFoldedData(
    results.time_data,
    results.flux_data,
    results.transit_period || 0
  );

  return (
    <div className="results-display">
      <div className="container">
        {/* Header */}
        <div className="results-header">
          <button onClick={() => navigate("/analyze")} className="back-button">
            ← Back to Analysis
          </button>
          <h1>Analysis Results</h1>
          {results.star_id && (
            <p className="star-id">Star ID: {results.star_id}</p>
          )}
        </div>

        {/* Prediction Summary */}
        <div className="prediction-summary">
          <div
            className="prediction-card"
            style={{ borderColor: getPredictionColor(results.prediction) }}
          >
            <div className="prediction-icon">
              {getPredictionIcon(results.prediction)}
            </div>
            <div className="prediction-details">
              <h2 style={{ color: getPredictionColor(results.prediction) }}>
                {results.prediction || "Unknown"}
              </h2>
              <div className="confidence-bar">
                <div className="confidence-label">
                  Confidence: {((results.confidence || 0) * 100).toFixed(1)}%
                </div>
                <div className="confidence-progress">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${(results.confidence || 0) * 100}%`,
                      backgroundColor: getPredictionColor(results.prediction),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Full Light Curve */}
          <div className="chart-container">
            <h3>📈 Full Light Curve</h3>
            <div className="chart-wrapper">
              <Plot
                data={[
                  {
                    x: results.time_data,
                    y: results.flux_data,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: {
                      color: "#64ffda",
                      size: 3,
                      opacity: 0.7,
                    },
                    line: {
                      color: "#64ffda",
                      width: 1,
                    },
                    name: "Flux",
                  },
                ]}
                layout={{
                  title: {
                    text: "Stellar Brightness Over Time",
                    font: { color: "#e0e0e0" },
                  },
                  xaxis: {
                    title: "Time (days)",
                    color: "#e0e0e0",
                    gridcolor: "rgba(255,255,255,0.1)",
                  },
                  yaxis: {
                    title: "Normalized Flux",
                    color: "#e0e0e0",
                    gridcolor: "rgba(255,255,255,0.1)",
                  },
                  plot_bgcolor: "rgba(0,0,0,0)",
                  paper_bgcolor: "rgba(0,0,0,0)",
                  font: { color: "#e0e0e0" },
                } as Partial<Layout>}
                config={{ responsive: true }}
                style={{ width: "100%", height: "400px" }}
              />
            </div>
          </div>

          {/* Folded Transit Profile */}
          {results.transit_period && foldedTime.length > 0 && (
            <div className="chart-container">
              <h3>🔄 Folded Transit Profile</h3>
              <div className="chart-wrapper">
                <Plot
                  data={[
                    {
                      x: foldedTime,
                      y: foldedFlux,
                      type: "scatter",
                      mode: "markers",
                      marker: {
                        color: "#ff6b6b",
                        size: 4,
                        opacity: 0.6,
                      },
                      name: "Folded Data",
                    },
                  ]}
                  layout={{
                    title: {
                      text: "Folded Transit Profile",
                      font: { color: "#e0e0e0" },
                    },
                    xaxis: {
                      title: "Phase",
                      color: "#e0e0e0",
                      gridcolor: "rgba(255,255,255,0.1)",
                    },
                    yaxis: {
                      title: "Normalized Flux",
                      color: "#e0e0e0",
                      gridcolor: "rgba(255,255,255,0.1)",
                    },
                    plot_bgcolor: "rgba(0,0,0,0)",
                    paper_bgcolor: "rgba(0,0,0,0)",
                    font: { color: "#e0e0e0" },
                  } as Partial<Layout>}
                  config={{ responsive: true }}
                  style={{ width: "100%", height: "400px" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Gemini AI Reasoning */}
        {results.reasoning && (
          <div className="reasoning-section">
            <h3>🤖 Gemini AI Analysis</h3>
            <div className="reasoning-card">
              <p>{results.reasoning}</p>
            </div>
          </div>
        )}

        {/* Data Details */}
        <div className="data-details">
          <h3>📊 Transit Parameters</h3>
          <div className="parameters-grid">
            <div className="parameter-card">
              <div className="parameter-icon">⏱️</div>
              <div className="parameter-info">
                <h4>Transit Period</h4>
                <p>
                  {results.transit_period
                    ? `${results.transit_period.toFixed(4)} days`
                    : "Not detected"}
                </p>
              </div>
            </div>

            <div className="parameter-card">
              <div className="parameter-icon">📉</div>
              <div className="parameter-info">
                <h4>Transit Depth</h4>
                <p>
                  {results.transit_depth
                    ? `${(results.transit_depth * 100).toFixed(3)}%`
                    : "Not detected"}
                </p>
              </div>
            </div>

            <div className="parameter-card">
              <div className="parameter-icon">⏰</div>
              <div className="parameter-info">
                <h4>Transit Duration</h4>
                <p>
                  {results.transit_duration
                    ? `${results.transit_duration.toFixed(2)} hours`
                    : "Not detected"}
                </p>
              </div>
            </div>

            <div className="parameter-card">
              <div className="parameter-icon">📈</div>
              <div className="parameter-info">
                <h4>Data Points</h4>
                <p>{results.flux_data.length.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="interpretation">
          <h3>🧠 AI Interpretation</h3>
          <div className="interpretation-content">
            {results.prediction?.toUpperCase() === "PLANET" && (
              <div className="interpretation-text">
                <div className="planet"></div>
                <p>
                  <strong>Confirmed Planet Detection!</strong> The AI model has
                  identified a high-confidence planetary transit signal in the
                  light curve data. The periodic dips show the characteristic
                  U-shaped profile expected from a planet passing in front of
                  its host star.
                </p>
              </div>
            )}

            {results.prediction?.toUpperCase() === "CANDIDATE" && (
              <div className="interpretation-text">
                <div className="candidate"></div>
                <p>
                  <strong>Planet Candidate Detected.</strong> The data shows
                  potential transit signals, but additional observations or
                  analysis may be needed to confirm this as a genuine exoplanet.
                  The signal could be a planet or might be caused by other
                  astrophysical phenomena.
                </p>
              </div>
            )}

            {results.prediction?.toUpperCase() === "FALSE POSITIVE" && (
              <div className="interpretation-text">
                <div className="false-positive"></div>
                <p>
                  <strong>False Positive Detected.</strong> While the data shows
                  periodic dimming, the AI model suggests this is likely not
                  caused by a transiting planet. This could be due to eclipsing
                  binary stars, stellar variability, or instrumental effects.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate("/analyze")}
            className="analyze-another-btn"
          >
            Analyze Another Target
          </button>
          <button onClick={() => navigate("/learn")} className="learn-more-btn">
            Learn More About Exoplanets
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
