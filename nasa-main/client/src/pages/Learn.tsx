import './Learn.css'

const Learn = () => {
  return (
    <div className="learn-page">
      <div className="container">
        {/* Header */}
        <div className="learn-header">
          <h1>Understanding Exoplanet Discovery</h1>
          <p>Explore the science behind finding worlds beyond our solar system</p>
        </div>

        {/* What is an Exoplanet Section */}
        <section className="learn-section">
          <div className="section-header">
            <h2>🌍 What is an Exoplanet?</h2>
          </div>
          <div className="section-content">
            <div className="content-text">
              <p>
                An exoplanet, or extrasolar planet, is a planet that orbits a star outside our solar system. 
                Since the first confirmed detection in 1995, astronomers have discovered over 6,000 exoplanets, 
                with thousands more candidates awaiting confirmation.
              </p>
              <p>
                These distant worlds come in all sizes and compositions - from rocky super-Earths to gas giants 
                larger than Jupiter. Some orbit so close to their stars that their surfaces are molten, while 
                others are frozen worlds in the outer reaches of their stellar systems.
              </p>
              <div className="highlight-box">
                <h4>🎯 Key Facts</h4>
                <ul>
                  <li>Over 6,000 confirmed exoplanets discovered</li>
                  <li>6,662 additional candidates under investigation</li>
                  <li>Planets found around stars up to 27,000 light-years away</li>
                  <li>Some planets orbit multiple stars (circumbinary planets)</li>
                </ul>
              </div>
            </div>
            <div className="content-visual">
              <div className="exoplanet-types">
                <div className="planet-type">
                  <div className="planet rocky"></div>
                  <span>Rocky Planet</span>
                </div>
                <div className="planet-type">
                  <div className="planet gas-giant"></div>
                  <span>Gas Giant</span>
                </div>
                <div className="planet-type">
                  <div className="planet ice-giant"></div>
                  <span>Ice Giant</span>
                </div>
                <div className="planet-type">
                  <div className="planet super-earth"></div>
                  <span>Super-Earth</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NASA's Planet Hunters Section */}
        <section className="learn-section">
          <div className="section-header">
            <h2>🚀 NASA's Planet Hunters</h2>
          </div>
          <div className="section-content">
            <div className="missions-grid">
              <div className="mission-card">
                <div className="mission-icon kepler">🔭</div>
                <h3>Kepler Mission</h3>
                <div className="mission-years">2009-2017</div>
                <p>
                  The Kepler Space Telescope revolutionized exoplanet discovery by continuously monitoring 
                  over 150,000 stars for four years. It discovered over 2,600 confirmed exoplanets and 
                  thousands of candidates using the transit method.
                </p>
                <div className="mission-stats">
                  <span>2,600+ planets discovered</span>
                </div>
              </div>

              <div className="mission-card">
                <div className="mission-icon k2">🌟</div>
                <h3>K2 Mission</h3>
                <div className="mission-years">2014-2018</div>
                <p>
                  After Kepler's primary mission ended, the K2 extended mission continued the search for 
                  exoplanets while studying other astronomical phenomena. It observed different regions 
                  of the sky in 80-day campaigns.
                </p>
                <div className="mission-stats">
                  <span>500+ planets discovered</span>
                </div>
              </div>

              <div className="mission-card">
                <div className="mission-icon tess">⭐</div>
                <h3>TESS Mission</h3>
                <div className="mission-years">2018-Present</div>
                <p>
                  The Transiting Exoplanet Survey Satellite (TESS) is surveying the entire sky to find 
                  exoplanets around the brightest stars. It's designed to find planets suitable for 
                  follow-up atmospheric studies.
                </p>
                <div className="mission-stats">
                  <span>4,000+ candidates found</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transit Photometry Section */}
        <section className="learn-section">
          <div className="section-header">
            <h2>📊 The Transit Method</h2>
          </div>
          <div className="section-content">
            <div className="transit-explanation">
              <div className="transit-text">
                <p>
                  Transit photometry is the most successful method for discovering exoplanets. When a planet 
                  passes in front of its host star as viewed from Earth, it blocks a tiny fraction of the 
                  star's light, causing a small but measurable dip in brightness.
                </p>
                <p>
                  These transits are periodic - they repeat every time the planet completes an orbit. 
                  By measuring the depth, duration, and period of these dips, astronomers can determine 
                  the planet's size, orbital period, and distance from its star.
                </p>
                <div className="transit-math">
                  <h4>🧮 The Physics</h4>
                  <p>Transit depth = (Planet radius / Star radius)²</p>
                  <p>For Earth transiting the Sun: ~0.008% brightness decrease</p>
                </div>
              </div>
              <div className="transit-animation-large">
                <div className="star-system">
                  <div className="star-large-anim"></div>
                  <div className="planet-orbit">
                    <div className="planet-transiting"></div>
                  </div>
                </div>
                <div className="light-curve-demo">
                  <h4>Light Curve</h4>
                  <svg width="300" height="120" viewBox="0 0 300 120">
                    <defs>
                      <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#64ffda"/>
                        <stop offset="100%" stopColor="#4fd3b8"/>
                      </linearGradient>
                    </defs>
                    <path d="M 20 40 L 80 40 L 100 60 L 120 60 L 140 40 L 200 40 L 220 60 L 240 60 L 260 40 L 280 40" 
                          stroke="url(#curveGradient)" strokeWidth="3" fill="none"/>
                    <circle cx="110" cy="60" r="4" fill="#ff6b6b">
                      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="230" cy="60" r="4" fill="#ff6b6b">
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="learn-section">
          <div className="section-header">
            <h2>⚠️ The Challenge of Discovery</h2>
          </div>
          <div className="section-content">
            <div className="challenges-grid">
              <div className="challenge-card">
                <div className="challenge-icon">🌟</div>
                <h3>Stellar Variability</h3>
                <p>
                  Stars naturally vary in brightness due to magnetic activity, rotation, and pulsations. 
                  These variations can mimic or mask planetary transit signals, making detection challenging.
                </p>
              </div>

              <div className="challenge-card">
                <div className="challenge-icon">🔧</div>
                <h3>Instrumental Noise</h3>
                <p>
                  Spacecraft and instruments introduce systematic errors and noise that can create 
                  false signals or hide real planetary transits. Careful calibration and data 
                  processing are essential.
                </p>
              </div>

              <div className="challenge-card">
                <div className="challenge-icon">👥</div>
                <h3>Eclipsing Binaries</h3>
                <p>
                  Binary star systems where one star eclipses another can produce transit-like signals. 
                  These "false positives" must be identified and filtered out from genuine planet detections.
                </p>
              </div>

              <div className="challenge-card">
                <div className="challenge-icon">📏</div>
                <h3>Signal Strength</h3>
                <p>
                  Earth-sized planets cause brightness changes of less than 0.01%. Detecting such tiny 
                  signals requires extraordinary precision and sophisticated analysis techniques.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI and Machine Learning Section */}
        <section className="learn-section">
          <div className="section-header">
            <h2>🤖 AI in Exoplanet Discovery</h2>
          </div>
          <div className="section-content">
            <div className="ai-content">
              <div className="ai-text">
                <p>
                  With thousands of stars monitored and millions of data points collected, manual analysis 
                  is impossible. Machine learning algorithms can automatically identify potential transit 
                  signals and classify them as planets, candidates, or false positives.
                </p>
                <p>
                  Our AI model uses advanced techniques to distinguish between genuine planetary transits 
                  and various types of false positives, achieving over 99% accuracy on validated datasets.
                </p>
                <div className="ai-stats">
                  <div className="stat-item">
                    <span className="stat-number">99.8%</span>
                    <span className="stat-label">Model Accuracy</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">&lt;1%</span>
                    <span className="stat-label">Positive Class Rate</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">6,662</span>
                    <span className="stat-label">Candidates to Analyze</span>
                  </div>
                </div>
              </div>
              <div className="ai-visual">
                <div className="neural-network">
                  <div className="network-layer">
                    <div className="neuron"></div>
                    <div className="neuron"></div>
                    <div className="neuron"></div>
                  </div>
                  <div className="network-layer">
                    <div className="neuron"></div>
                    <div className="neuron"></div>
                    <div className="neuron"></div>
                    <div className="neuron"></div>
                  </div>
                  <div className="network-layer">
                    <div className="neuron"></div>
                    <div className="neuron"></div>
                  </div>
                  <div className="network-layer">
                    <div className="neuron output"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Hunt for Exoplanets?</h2>
            <p>Use our AI-powered tool to analyze real astronomical data and discover new worlds!</p>
            <a href="/analyze" className="cta-button">Start Analyzing Data</a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Learn
