import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AnalysisTool.css";

interface StarSuggestion {
  id: string;
  name: string;
  hostname: string;
  type: string;
  description: string;
  mission: string;
  discovery_year?: number;
  radius?: number;
  period?: number;
}

const AnalysisTool = () => {
  const [starId, setStarId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    StarSuggestion[]
  >([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // State for NASA API data
  const [starSuggestions, setStarSuggestions] = useState<StarSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // PHP server API base URL - ensure no trailing slashes
  const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/+$/, '');

  // Fetch live NASA data from PHP server
  useEffect(() => {
    let isMounted = true;
    
    const fetchNASASuggestions = async () => {
      try {
        setLoadingSuggestions(true);
        console.log(
          "Fetching suggestions from:",
          `${API_BASE_URL}/suggestions?limit=50`
        );

        const response = await axios.get(
          `${API_BASE_URL}/suggestions?limit=50`,
          {
            timeout: 30000, // 30 second timeout for suggestions
            withCredentials: false,
          }
        );

        console.log("Full API response:", response);
        console.log("Response data:", response.data);

        // Only update state if component is still mounted
        if (!isMounted) return;

        if (response.data && response.data.suggestions) {
          if (response.data.suggestions.length > 0) {
            setStarSuggestions(response.data.suggestions);
            console.log(
              `✅ Loaded ${response.data.suggestions.length} NASA suggestions from server (${response.data.source}):`,
              response.data.suggestions.slice(0, 3) // Show first 3 for debugging
            );
          } else {
            console.warn("⚠️ No suggestions available from NASA API");
            console.log("Message:", response.data.message);
            console.log("Source:", response.data.source);
            // Don't load fallback suggestions if NASA API is working but has no data
            setStarSuggestions([]);
          }
        } else {
          console.warn(
            "⚠️ Invalid response structure from server, using fallback"
          );
          console.log("Response structure:", Object.keys(response.data || {}));
          setStarSuggestions(getMockSuggestions());
        }
      } catch (error: any) {
        // Only handle error if component is still mounted
        if (!isMounted) return;
        
        console.error("❌ Error fetching NASA suggestions from server:", error);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
        setStarSuggestions(getMockSuggestions());
      } finally {
        // Only update loading state if component is still mounted
        if (isMounted) {
          setLoadingSuggestions(false);
        }
      }
    };

    fetchNASASuggestions();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [API_BASE_URL]);

  // Force fallback suggestions if nothing loaded after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (starSuggestions.length === 0 && !loadingSuggestions) {
        console.log(
          "🔧 Force loading fallback suggestions - API may have failed"
        );
        setStarSuggestions(getMockSuggestions());
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [starSuggestions.length, loadingSuggestions]);

  // Fallback mock suggestions
  const getMockSuggestions = (): StarSuggestion[] => [
    {
      id: "KIC-8462852",
      name: "Tabby's Star",
      hostname: "KIC-8462852",
      type: "Candidate",
      description:
        "Famous for unusual dimming patterns, potential megastructure candidate",
      mission: "Kepler",
    },
    {
      id: "TIC-441420236",
      name: "TOI-715",
      hostname: "TOI-715",
      type: "Confirmed Planet",
      description: "Super-Earth in habitable zone, recent TESS discovery",
      mission: "TESS",
    },
    {
      id: "KIC-8435766",
      name: "Kepler-442",
      hostname: "Kepler-442",
      type: "Confirmed Planet",
      description: "Potentially habitable super-Earth, 1,200 light-years away",
      mission: "Kepler",
    },
    {
      id: "HD-209458",
      name: "HD 209458",
      hostname: "HD 209458",
      type: "Confirmed Planet",
      description: "First exoplanet with detected atmosphere, hot Jupiter",
      mission: "Ground-based",
    },
    {
      id: "TRAPPIST-1",
      name: "TRAPPIST-1",
      hostname: "TRAPPIST-1",
      type: "Confirmed Planet",
      description: "Seven Earth-sized planets, three in habitable zone",
      mission: "Spitzer",
    },
    {
      id: "Kepler-186f",
      name: "Kepler-186f",
      hostname: "Kepler-186",
      type: "Confirmed Planet",
      description: "First Earth-size planet in habitable zone",
      mission: "Kepler",
    },
    {
      id: "Proxima-Centauri-b",
      name: "Proxima Centauri b",
      hostname: "Proxima Centauri",
      type: "Confirmed Planet",
      description: "Closest exoplanet to Earth, potentially habitable",
      mission: "Ground-based",
    },
    {
      id: "TOI-849b",
      name: "TOI-849 b",
      hostname: "TOI-849",
      type: "Confirmed Planet",
      description: "Exposed planetary core, unique discovery",
      mission: "TESS",
    },
  ];

  // Filter suggestions based on input
  useEffect(() => {
    if (starId.trim() === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = starSuggestions.filter(
      (suggestion) =>
        suggestion.id.toLowerCase().includes(starId.toLowerCase()) ||
        suggestion.name.toLowerCase().includes(starId.toLowerCase()) ||
        suggestion.mission.toLowerCase().includes(starId.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    // Only show suggestions if input is focused
    if (isInputFocused) {
      setShowSuggestions(true);
    }
    setSelectedSuggestionIndex(-1);
  }, [starId, starSuggestions, isInputFocused]);

  // Show popular suggestions when input is focused but empty
  const handleInputFocus = () => {
    console.log("🎯 Input focused");
    console.log("Current starSuggestions length:", starSuggestions.length);
    console.log("Loading suggestions:", loadingSuggestions);
    console.log("Current starId:", starId);

    setIsInputFocused(true);
    if (starId.trim() === "") {
      setShowSuggestions(true);
      if (!loadingSuggestions && starSuggestions.length > 0) {
        // Show top 4 popular suggestions
        const popularSuggestions = starSuggestions.slice(0, 4);
        console.log("Setting popular suggestions:", popularSuggestions);
        setFilteredSuggestions(popularSuggestions);
      } else {
        console.log(
          "Not showing suggestions - loading:",
          loadingSuggestions,
          "length:",
          starSuggestions.length
        );
      }
    }
  };

  // Hide suggestions when input loses focus
  const handleInputBlur = () => {
    // Small delay to allow for suggestion clicks
    setTimeout(() => {
      setIsInputFocused(false);
      setShowSuggestions(false);
    }, 150);
  };

  // Handle input change - simplified without live search
  const handleStarIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStarId(value);
    setError("");
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: StarSuggestion) => {
    setStarId(suggestion.id);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    setIsInputFocused(false);
    inputRef.current?.blur(); // Remove focus after selection
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isInputFocused || !showSuggestions || filteredSuggestions.length === 0)
      return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        setIsInputFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStarIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!starId.trim()) {
      setError("Please enter a valid Star ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Log the API URL being called
      const apiUrl = `${API_BASE_URL.replace(/\/+$/, '')}/analyze/identifier`;
      console.log('API Request URL:', apiUrl);
      console.log('Request data:', { star_id: starId });
      
      // Use PHP server for analysis with improved configuration
      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: { star_id: starId },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false, // Changed to false to match CORS config
        timeout: 60000, // Increased to 60 seconds for NASA API calls
        validateStatus: (status) => status < 500, // Don't throw for 4xx errors
      });
      
      console.log('API Response:', response);

      // Check if the response is successful
      if (response.status >= 200 && response.status < 300) {
        // Store results in sessionStorage for the results page
        sessionStorage.setItem("analysisResults", JSON.stringify(response.data));
        navigate("/results");
      } else {
        // Handle error responses
        if (response.status === 404) {
          setError(
            response.data?.message || 
            `No data available for "${starId}". Try a different star identifier like "Kepler-442 b" or "TOI-715 b".`
          );
        } else {
          setError(
            response.data?.message || 
            `Server returned error status: ${response.status}`
          );
        }
      }
    } catch (err: any) {
      console.error("Server API Error:", err);

      // Handle specific error cases
      if (err.code === 'ECONNABORTED') {
        setError("Request timed out. The NASA API might be slow. Please try again.");
      } else if (err.response?.status === 404) {
        setError(
          `No data available for "${starId}". Try a different star identifier like "Kepler-442 b" or "TOI-715 b".`
        );
      } else if (err.response?.status === 500) {
        setError("Server error occurred. Please try again later.");
      } else if (err.code === "ECONNREFUSED" || !err.response) {
        setError(
          "Cannot connect to analysis service. Please make sure the server is running."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to analyze star data"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use PHP server for file analysis
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_BASE_URL}/analyze/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Store results in sessionStorage for the results page
      sessionStorage.setItem("analysisResults", JSON.stringify(response.data));
      navigate("/results");
    } catch (err: any) {
      console.error("Server File Analysis Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to analyze file"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("File size must be less than 10MB");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError("");
      }
    }
  };

  return (
    <div className="analysis-tool">
      <div className="container">
        <div className="tool-header">
          <h1>Exoplanet Analysis Tool</h1>
          <p>
            Submit light curve data to discover potential exoplanets using NASA
            data and AI analysis
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        <div className="analysis-methods">
          {/* Star ID Method */}
          <div className="method-card">
            <div className="method-header">
              <h2>🔍 Analyze by Star ID</h2>
              <p>Enter a star identifier from Kepler, K2, or TESS missions</p>
            </div>

            <form onSubmit={handleStarIdSubmit} className="star-id-form">
              <div className="input-group">
                <label htmlFor="starId">Star Identifier</label>
                <div className="search-container">
                  <input
                    ref={inputRef}
                    type="text"
                    id="starId"
                    value={starId}
                    onChange={handleStarIdChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="e.g., KIC 8462852, TIC 123456789"
                    disabled={loading}
                    autoComplete="off"
                  />

                  {isInputFocused &&
                    (showSuggestions ||
                      starId.length > 0 ||
                      (starId.trim() === "" && starSuggestions.length > 0)) && (
                      <div
                        ref={suggestionsRef}
                        className="suggestions-dropdown"
                      >
                        {loadingSuggestions ? (
                          <div className="suggestions-loading">
                            <span className="spinner"></span>
                            <span>Loading live NASA exoplanet data...</span>
                          </div>
                        ) : filteredSuggestions.length > 0 ||
                          (starId.trim() === "" &&
                            starSuggestions.length > 0) ? (
                          <>
                            {starId.trim() === "" && (
                              <div className="suggestions-header">
                                <span>🚀 Live NASA Exoplanet Data</span>
                              </div>
                            )}
                            {starId.trim() !== "" &&
                              filteredSuggestions.length > 0 && (
                                <div className="suggestions-header">
                                  <span>🔍 Live Search Results</span>
                                </div>
                              )}
                            {(filteredSuggestions.length > 0
                              ? filteredSuggestions
                              : starSuggestions.slice(0, 4)
                            ).map((suggestion, index) => (
                              <div
                                key={suggestion.id}
                                className={`suggestion-item ${
                                  index === selectedSuggestionIndex
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                <div className="suggestion-header">
                                  <span className="suggestion-id">
                                    {suggestion.id}
                                  </span>
                                  <span
                                    className={`suggestion-type ${suggestion.type
                                      .toLowerCase()
                                      .replace(" ", "-")}`}
                                  >
                                    {suggestion.type}
                                  </span>
                                </div>
                                <div className="suggestion-name">
                                  {suggestion.name}
                                </div>
                                <div className="suggestion-description">
                                  {suggestion.description}
                                </div>
                                <div className="suggestion-mission">
                                  <span className="mission-badge">
                                    {suggestion.mission}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="no-suggestions">
                            <span>🔍 No matching stars found</span>
                            <small>
                              Try searching for KIC, TIC, or star names
                            </small>
                          </div>
                        )}
                      </div>
                    )}
                </div>
                <small>
                  Live NASA data - Start typing to search, or click to see
                  recent discoveries
                </small>
              </div>

              <button
                type="submit"
                className="analyze-btn"
                disabled={loading || !starId.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Star"
                )}
              </button>
            </form>
          </div>

          {/* File Upload Method */}
          <div className="method-card">
            <div className="method-header">
              <h2>📁 Upload Light Curve Data</h2>
              <p>
                Upload a CSV or TXT file containing time-series flux
                measurements
              </p>
            </div>

            <form onSubmit={handleFileSubmit} className="file-upload-form">
              <div className="file-input-group">
                <label htmlFor="file-upload" className="file-input-label">
                  <span className="file-icon">📄</span>
                  <span>{file ? file.name : "Choose File"}</span>
                </label>
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  disabled={loading}
                  style={{ display: "none" }}
                />
                <small>Accepted formats: CSV, TXT (max 10MB)</small>
              </div>

              {file && (
                <div className="file-info">
                  <span>
                    ✅ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="analyze-btn"
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  "Analyze File"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Data Format Information */}
        <div className="data-format-info">
          <h2>📊 Data Format Requirements</h2>
          <div className="format-details">
            <div className="format-item">
              <h4>CSV Format</h4>
              <p>Two columns: time (days) and flux (normalized)</p>
              <code>
                time,flux
                <br />
                0.0,1.0000
                <br />
                0.0208,0.9998
                <br />
                0.0417,0.9995
                <br />
                ...
              </code>
            </div>
            <div className="format-item">
              <h4>TXT Format</h4>
              <p>Space or tab-separated values</p>
              <code>
                0.0 1.0000
                <br />
                0.0208 0.9998
                <br />
                0.0417 0.9995
                <br />
                ...
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="tool-footer">
          <div className="footer-content">
            <p>
              🌌 Powered by NASA Space Apps Challenge | Built with NASA Data
              Integration
            </p>
            <div className="footer-links">
              <span>Data Sources: NASA Exoplanet Archive</span>
              <span>•</span>
              <span>Server-Side Processing</span>
              <span>•</span>
              <span>Real-Time NASA API Integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTool;
