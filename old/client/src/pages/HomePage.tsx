import { Link } from 'react-router-dom'
import './HomePage.css'

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover New Worlds with AI</h1>
          <p className="hero-subtitle">
            Use cutting-edge artificial intelligence to analyze stellar light curves 
            and hunt for exoplanets in the vast cosmos. Join the search for worlds beyond our solar system.
          </p>
          <Link to="/analyze" className="cta-button">
            Start Analyzing
          </Link>
        </div>
        <div className="hero-visual">
          <div className="planet-animation">
            <div className="star"></div>
            <div className="planet"></div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-icon">📊</div>
              <h3>1. Upload Data</h3>
              <p>Submit light curve data by entering a star ID or uploading a CSV file containing time-series flux measurements.</p>
            </div>
            <div className="step">
              <div className="step-icon">🤖</div>
              <h3>2. AI Analysis</h3>
              <p>Our trained machine learning model analyzes the data for periodic dips that indicate potential exoplanet transits.</p>
            </div>
            <div className="step">
              <div className="step-icon">🌍</div>
              <h3>3. View Results</h3>
              <p>Get detailed results including classification confidence, interactive charts, and key orbital parameters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Science Section */}
      <section className="science-section">
        <div className="container">
          <h2>The Science Behind Transit Photometry</h2>
          <div className="science-content">
            <div className="science-text">
              <p>
                When an exoplanet passes in front of its host star, it blocks a tiny fraction of the star's light, 
                creating a characteristic dip in brightness. This method, called transit photometry, has been 
                responsible for discovering thousands of exoplanets.
              </p>
              <p>
                Our AI model is trained to distinguish between genuine planetary transits and false positives 
                such as eclipsing binary stars, stellar variability, and instrumental noise.
              </p>
              <Link to="/learn" className="learn-more-btn">Learn More</Link>
            </div>
            <div className="transit-demo">
              <div className="transit-animation">
                <div className="star-large"></div>
                <div className="planet-transit"></div>
              </div>
              <div className="light-curve">
                <svg width="300" height="150" viewBox="0 0 300 150">
                  <path d="M 20 50 L 100 50 L 120 70 L 180 70 L 200 50 L 280 50" 
                        stroke="#64ffda" strokeWidth="2" fill="none"/>
                  <circle cx="150" cy="70" r="3" fill="#ff6b6b"/>
                </svg>
                <p>Light Curve showing transit dip</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats">
            <div className="stat">
              <h3>6,000+</h3>
              <p>Confirmed Exoplanets</p>
            </div>
            <div className="stat">
              <h3>6,662</h3>
              <p>Unconfirmed Candidates</p>
            </div>
            <div className="stat">
              <h3>99.8%</h3>
              <p>AI Model Accuracy</p>
            </div>
            <div className="stat">
              <h3>3</h3>
              <p>NASA Missions (Kepler, K2, TESS)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <p>🌌 Discover New Worlds with AI | NASA Space Apps Challenge 2024</p>
            <div className="footer-stats">
              <span>6,000+ Confirmed Exoplanets</span>
              <span>•</span>
              <span>6,662 Candidates</span>
              <span>•</span>
              <span>99.8% AI Accuracy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
