#!/usr/bin/env python3
"""
Exoplanet Discovery AI Service
A Flask-based microservice for analyzing light curve data and predicting exoplanet transits.
"""

import os
import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from typing import Dict, List, Tuple, Any
import requests
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global model variable
model = None
scaler = None

class ExoplanetAnalyzer:
    """
    Exoplanet transit detection and analysis class
    """
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = [
            'flux_mean', 'flux_std', 'flux_min', 'flux_max', 'flux_range',
            'flux_skew', 'flux_kurtosis', 'transit_depth_estimate',
            'period_estimate', 'snr_estimate'
        ]
    
    def load_model(self, model_path: str = 'model.pkl'):
        """Load the pre-trained model"""
        try:
            if os.path.exists(model_path):
                model_data = joblib.load(model_path)
                self.model = model_data['model']
                self.scaler = model_data.get('scaler', None)
                logger.info(f"Model loaded successfully from {model_path}")
                return True
            else:
                logger.warning(f"Model file {model_path} not found. Using mock model.")
                self._create_mock_model()
                return False
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self._create_mock_model()
            return False
    
    def _create_mock_model(self):
        """Create a mock model for demonstration purposes"""
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler
        
        # Create mock model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        
        # Generate some mock training data to fit the model
        np.random.seed(42)
        X_mock = np.random.randn(1000, len(self.feature_names))
        y_mock = np.random.choice(['PLANET', 'CANDIDATE', 'FALSE POSITIVE'], 1000, 
                                 p=[0.1, 0.2, 0.7])  # Realistic class distribution
        
        X_scaled = self.scaler.fit_transform(X_mock)
        self.model.fit(X_scaled, y_mock)
        
        logger.info("Mock model created and trained")
    
    def extract_features(self, time_data: List[float], flux_data: List[float]) -> np.ndarray:
        """Extract features from light curve data"""
        flux_array = np.array(flux_data)
        time_array = np.array(time_data)
        
        # Basic statistical features
        flux_mean = np.mean(flux_array)
        flux_std = np.std(flux_array)
        flux_min = np.min(flux_array)
        flux_max = np.max(flux_array)
        flux_range = flux_max - flux_min
        
        # Higher order moments
        flux_skew = self._calculate_skewness(flux_array)
        flux_kurtosis = self._calculate_kurtosis(flux_array)
        
        # Transit-specific features
        transit_depth_estimate = self._estimate_transit_depth(flux_array)
        period_estimate = self._estimate_period(time_array, flux_array)
        snr_estimate = self._estimate_snr(flux_array)
        
        features = np.array([
            flux_mean, flux_std, flux_min, flux_max, flux_range,
            flux_skew, flux_kurtosis, transit_depth_estimate,
            period_estimate, snr_estimate
        ])
        
        return features.reshape(1, -1)
    
    def _calculate_skewness(self, data: np.ndarray) -> float:
        """Calculate skewness of the data"""
        mean = np.mean(data)
        std = np.std(data)
        if std == 0:
            return 0
        return np.mean(((data - mean) / std) ** 3)
    
    def _calculate_kurtosis(self, data: np.ndarray) -> float:
        """Calculate kurtosis of the data"""
        mean = np.mean(data)
        std = np.std(data)
        if std == 0:
            return 0
        return np.mean(((data - mean) / std) ** 4) - 3
    
    def _estimate_transit_depth(self, flux_data: np.ndarray) -> float:
        """Estimate the depth of potential transits"""
        baseline = np.percentile(flux_data, 90)  # Assume 90th percentile is baseline
        minimum = np.min(flux_data)
        depth = (baseline - minimum) / baseline
        return max(0, depth)
    
    def _estimate_period(self, time_data: np.ndarray, flux_data: np.ndarray) -> float:
        """Estimate orbital period using simple autocorrelation"""
        try:
            # Detrend the data
            detrended = flux_data - np.mean(flux_data)
            
            # Simple autocorrelation
            autocorr = np.correlate(detrended, detrended, mode='full')
            autocorr = autocorr[autocorr.size // 2:]
            
            # Find peaks in autocorrelation
            if len(autocorr) > 10:
                # Look for the first significant peak after lag 0
                peak_idx = np.argmax(autocorr[5:]) + 5
                if peak_idx < len(time_data) - 1:
                    period = time_data[peak_idx] - time_data[0]
                    return max(0.5, min(50, period))  # Reasonable period range
            
            return 3.0  # Default period
        except:
            return 3.0
    
    def _estimate_snr(self, flux_data: np.ndarray) -> float:
        """Estimate signal-to-noise ratio"""
        signal = np.abs(np.mean(flux_data) - np.min(flux_data))
        noise = np.std(flux_data)
        if noise == 0:
            return 0
        return signal / noise
    
    def predict(self, time_data: List[float], flux_data: List[float]) -> Dict[str, Any]:
        """Make prediction on light curve data"""
        try:
            # Extract features
            features = self.extract_features(time_data, flux_data)
            
            # Scale features if scaler is available
            if self.scaler is not None:
                features_scaled = self.scaler.transform(features)
            else:
                features_scaled = features
            
            # Make prediction
            prediction = self.model.predict(features_scaled)[0]
            probabilities = self.model.predict_proba(features_scaled)[0]
            
            # Get confidence (max probability)
            confidence = float(np.max(probabilities))
            
            # Calculate additional parameters
            transit_period = self._estimate_period(np.array(time_data), np.array(flux_data))
            transit_depth = self._estimate_transit_depth(np.array(flux_data))
            transit_duration = self._estimate_transit_duration(transit_period, transit_depth)
            
            result = {
                'prediction': prediction,
                'confidence': confidence,
                'transit_period': transit_period,
                'transit_depth': transit_depth,
                'transit_duration': transit_duration,
                'class_probabilities': {
                    class_name: float(prob) 
                    for class_name, prob in zip(self.model.classes_, probabilities)
                }
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            raise
    
    def _estimate_transit_duration(self, period: float, depth: float) -> float:
        """Estimate transit duration in hours"""
        # Simple empirical relationship
        # Real calculation would involve stellar and planetary parameters
        base_duration = 2.0 + (period * 0.5)  # Hours
        depth_factor = 1.0 + (depth * 10)  # Deeper transits tend to be longer
        return min(12.0, base_duration * depth_factor)  # Cap at 12 hours

# Initialize the analyzer
analyzer = ExoplanetAnalyzer()

def create_app():
    """Application factory pattern"""
    # Load the model when the app is created
    analyzer.load_model()
    return app

# Load model on module import
analyzer.load_model()

class NASADataFetcher:
    """Fetch light curve data from NASA APIs"""
    
    def __init__(self):
        self.base_url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
        self.mast_url = "https://mast.stsci.edu/api/v0.1/Download/file"
    
    def fetch_star_data(self, star_id: str) -> Dict[str, Any]:
        """
        Fetch star data from NASA Exoplanet Archive
        Returns mock light curve data for demonstration
        """
        try:
            # Clean the star ID
            clean_id = star_id.replace('-', ' ').strip()
            
            # Query NASA Exoplanet Archive for star information
            query = f"""
                SELECT TOP 1
                    pl_name, hostname, pl_rade, pl_masse, pl_orbper,
                    disc_facility, discoverymethod, disc_year, ra, dec,
                    sy_snum, sy_pnum, pl_tranflag, default_flag
                FROM ps 
                WHERE (UPPER(pl_name) LIKE '%{clean_id.upper()}%' 
                   OR UPPER(hostname) LIKE '%{clean_id.upper()}%')
                  AND default_flag = 1
                  AND pl_name IS NOT NULL
                ORDER BY disc_year DESC
            """.replace('\n', ' ').replace('  ', ' ')
            
            url = f"{self.base_url}?query={requests.utils.quote(query)}&format=json"
            
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data and 'data' in data and len(data['data']) > 0:
                    # Found the star, generate mock light curve data
                    star_info = self._parse_star_data(data)
                    light_curve = self._generate_mock_light_curve(star_info)
                    
                    return {
                        'star_info': star_info,
                        'light_curve': light_curve,
                        'source': 'NASA Exoplanet Archive'
                    }
            
            # If not found in NASA archive, generate generic mock data
            return self._generate_generic_mock_data(star_id)
            
        except Exception as e:
            logger.error(f"Error fetching NASA data for {star_id}: {e}")
            return self._generate_generic_mock_data(star_id)
    
    def _parse_star_data(self, nasa_data: Dict) -> Dict[str, Any]:
        """Parse NASA API response"""
        try:
            columns = nasa_data.get('columns', [])
            row = nasa_data['data'][0]
            
            star_info = {}
            for i, col in enumerate(columns):
                if i < len(row):
                    star_info[col['name']] = row[i]
            
            return star_info
        except Exception as e:
            logger.error(f"Error parsing NASA data: {e}")
            return {}
    
    def _generate_mock_light_curve(self, star_info: Dict) -> Dict[str, List]:
        """Generate realistic mock light curve data based on star info"""
        try:
            # Generate time series (in days)
            time_points = np.linspace(0, 30, 1500)  # 30 days of observations
            
            # Base flux (normalized to 1.0)
            base_flux = np.ones_like(time_points)
            
            # Add realistic noise
            noise = np.random.normal(0, 0.001, len(time_points))
            
            # Add transit signal if planet exists
            if star_info.get('pl_tranflag') == 1:
                period = star_info.get('pl_orbper', 10.0)  # Orbital period in days
                if period and period > 0:
                    # Add transit dips
                    transit_depth = 0.01 * np.random.uniform(0.5, 2.0)  # 0.5-2% depth
                    transit_duration = 0.1  # Transit duration in days
                    
                    for phase in np.arange(0, 30, period):
                        # Create transit dip
                        transit_mask = np.abs(time_points - phase) < transit_duration/2
                        base_flux[transit_mask] -= transit_depth * np.exp(-((time_points[transit_mask] - phase)/(transit_duration/4))**2)
            
            flux_data = base_flux + noise
            
            return {
                'time': time_points.tolist(),
                'flux': flux_data.tolist(),
                'period': star_info.get('pl_orbper'),
                'transit_depth': star_info.get('pl_rade', 1.0) * 0.01 if star_info.get('pl_rade') else None
            }
            
        except Exception as e:
            logger.error(f"Error generating mock light curve: {e}")
            return self._generate_basic_light_curve()
    
    def _generate_generic_mock_data(self, star_id: str) -> Dict[str, Any]:
        """Generate generic mock data when NASA data is not available"""
        return {
            'star_info': {
                'pl_name': star_id,
                'hostname': star_id.split('-')[0] if '-' in star_id else star_id,
                'source': 'Mock Data'
            },
            'light_curve': self._generate_basic_light_curve(),
            'source': 'Generated Mock Data'
        }
    
    def _generate_basic_light_curve(self) -> Dict[str, List]:
        """Generate basic light curve with potential transit"""
        time_points = np.linspace(0, 30, 1500)
        base_flux = np.ones_like(time_points)
        noise = np.random.normal(0, 0.001, len(time_points))
        
        # Add a potential transit signal
        if np.random.random() > 0.5:  # 50% chance of transit
            period = np.random.uniform(5, 20)  # Random period
            transit_depth = np.random.uniform(0.005, 0.02)  # 0.5-2% depth
            
            for phase in np.arange(0, 30, period):
                transit_mask = np.abs(time_points - phase) < 0.1
                base_flux[transit_mask] -= transit_depth * np.exp(-((time_points[transit_mask] - phase)/0.04)**2)
        
        flux_data = base_flux + noise
        
        return {
            'time': time_points.tolist(),
            'flux': flux_data.tolist()
        }

# Initialize NASA data fetcher
nasa_fetcher = NASADataFetcher()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Exoplanet AI Service',
        'model_loaded': analyzer.model is not None,
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        if 'flux_data' not in data:
            return jsonify({'error': 'flux_data is required'}), 400
        
        flux_data = data['flux_data']
        time_data = data.get('time_data', list(range(len(flux_data))))
        
        # Validate data
        if not isinstance(flux_data, list) or len(flux_data) == 0:
            return jsonify({'error': 'flux_data must be a non-empty list'}), 400
        
        if len(time_data) != len(flux_data):
            return jsonify({'error': 'time_data and flux_data must have the same length'}), 400
        
        # Convert to float arrays
        try:
            time_data = [float(x) for x in time_data]
            flux_data = [float(x) for x in flux_data]
        except (ValueError, TypeError):
            return jsonify({'error': 'All data points must be numeric'}), 400
        
        # Make prediction
        result = analyzer.predict(time_data, flux_data)
        
        logger.info(f"Prediction made: {result['prediction']} with confidence {result['confidence']:.3f}")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Prediction endpoint error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    return jsonify({
        'model_type': type(analyzer.model).__name__ if analyzer.model else None,
        'feature_names': analyzer.feature_names,
        'classes': analyzer.model.classes_.tolist() if hasattr(analyzer.model, 'classes_') else None,
        'scaler_available': analyzer.scaler is not None
    })

@app.route('/api/analyze/identifier', methods=['POST'])
def analyze_star_identifier():
    """Analyze star by identifier - fetch data from NASA and predict"""
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        if 'star_id' not in data:
            return jsonify({'error': 'star_id is required'}), 400
        
        star_id = data['star_id'].strip()
        if not star_id:
            return jsonify({'error': 'star_id cannot be empty'}), 400
        
        logger.info(f"Analyzing star identifier: {star_id}")
        
        # Fetch star data from NASA
        nasa_data = nasa_fetcher.fetch_star_data(star_id)
        
        if not nasa_data or 'light_curve' not in nasa_data:
            return jsonify({'error': 'No data available for the specified star ID'}), 404
        
        light_curve = nasa_data['light_curve']
        flux_data = light_curve['flux']
        time_data = light_curve['time']
        
        # Analyze the light curve data
        result = analyzer.predict(time_data, flux_data)
        
        # Add star information to the result
        result.update({
            'star_id': star_id,
            'star_info': nasa_data.get('star_info', {}),
            'data_source': nasa_data.get('source', 'Unknown'),
            'time_data': time_data[:100],  # First 100 points for visualization
            'flux_data': flux_data[:100],  # First 100 points for visualization
            'total_data_points': len(flux_data)
        })
        
        logger.info(f"Analysis complete for {star_id}: {result.get('prediction', 'Unknown')}")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in star identifier analysis: {e}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/analyze/file', methods=['POST'])
def analyze_file():
    """Analyze uploaded light curve file"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read file content
        try:
            content = file.read().decode('utf-8')
            lines = content.strip().split('\n')
            
            time_data = []
            flux_data = []
            
            # Parse CSV or TXT format
            for line in lines[1:] if lines[0].lower().startswith(('time', 'flux')) else lines:
                if line.strip():
                    parts = line.replace(',', ' ').split()
                    if len(parts) >= 2:
                        try:
                            time_data.append(float(parts[0]))
                            flux_data.append(float(parts[1]))
                        except ValueError:
                            continue
            
            if len(time_data) < 10:
                return jsonify({'error': 'File must contain at least 10 data points'}), 400
            
            # Analyze the data
            result = analyzer.predict(time_data, flux_data)
            
            # Add file information
            result.update({
                'filename': file.filename,
                'data_source': 'Uploaded File',
                'time_data': time_data[:100],  # First 100 points for visualization
                'flux_data': flux_data[:100],  # First 100 points for visualization
                'total_data_points': len(flux_data)
            })
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': f'Error reading file: {str(e)}'}), 400
        
    except Exception as e:
        logger.error(f"Error in file analysis: {e}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Load model on startup
    analyzer.load_model()
    
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Exoplanet AI Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
