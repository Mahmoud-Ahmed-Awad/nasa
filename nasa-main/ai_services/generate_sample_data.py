#!/usr/bin/env python3
"""
Generate sample light curve data files for testing the exoplanet detection system
"""

import numpy as np
import pandas as pd
import os

def generate_planet_lightcurve(duration_days=30, cadence_hours=0.5, period_days=3.2, 
                              transit_depth=0.01, transit_duration_hours=4.0):
    """Generate a light curve with a planetary transit signal"""
    
    # Time array
    cadence_days = cadence_hours / 24.0
    time = np.arange(0, duration_days, cadence_days)
    
    # Base flux (normalized to 1.0)
    flux = np.ones_like(time)
    
    # Add stellar noise
    noise_level = 0.0005
    flux += np.random.normal(0, noise_level, len(time))
    
    # Add transit signals
    transit_duration_days = transit_duration_hours / 24.0
    
    for t in time:
        # Calculate phase
        phase = (t % period_days) / period_days
        
        # Check if we're in transit (centered at phase 0.5)
        if abs(phase - 0.5) < (transit_duration_days / period_days / 2):
            # U-shaped transit profile
            phase_from_center = abs(phase - 0.5) / (transit_duration_days / period_days / 2)
            transit_profile = 1 - np.sqrt(1 - phase_from_center**2)
            flux[np.where(time == t)[0][0]] -= transit_depth * transit_profile
    
    return time, flux

def generate_candidate_lightcurve(duration_days=30, cadence_hours=0.5):
    """Generate a light curve with a weak candidate signal"""
    
    cadence_days = cadence_hours / 24.0
    time = np.arange(0, duration_days, cadence_days)
    
    # Base flux with more noise
    flux = np.ones_like(time)
    noise_level = 0.001
    flux += np.random.normal(0, noise_level, len(time))
    
    # Add weak, irregular transit-like signals
    period_days = 5.7
    transit_depth = 0.003
    
    for i, t in enumerate(time):
        phase = (t % period_days) / period_days
        if 0.48 < phase < 0.52:
            # Weak, noisy transit
            flux[i] -= transit_depth * (1 + np.random.normal(0, 0.3))
    
    return time, flux

def generate_false_positive_lightcurve(duration_days=30, cadence_hours=0.5):
    """Generate a light curve with false positive signals (eclipsing binary)"""
    
    cadence_days = cadence_hours / 24.0
    time = np.arange(0, duration_days, cadence_days)
    
    # Base flux
    flux = np.ones_like(time)
    noise_level = 0.0008
    flux += np.random.normal(0, noise_level, len(time))
    
    # Add eclipsing binary signal (V-shaped eclipses)
    period_days = 2.1
    primary_depth = 0.02
    secondary_depth = 0.005
    
    for i, t in enumerate(time):
        phase = (t % period_days) / period_days
        
        # Primary eclipse (deeper, V-shaped)
        if 0.47 < phase < 0.53:
            eclipse_phase = abs(phase - 0.5) / 0.03
            flux[i] -= primary_depth * eclipse_phase  # V-shaped
        
        # Secondary eclipse
        elif abs(phase) < 0.03 or abs(phase - 1) < 0.03:
            eclipse_phase = min(abs(phase), abs(phase - 1)) / 0.03
            flux[i] -= secondary_depth * eclipse_phase
    
    return time, flux

def generate_noisy_lightcurve(duration_days=30, cadence_hours=0.5):
    """Generate a light curve with only noise (no transit)"""
    
    cadence_days = cadence_hours / 24.0
    time = np.arange(0, duration_days, cadence_days)
    
    # Base flux with stellar variability
    flux = np.ones_like(time)
    
    # Add various noise sources
    # White noise
    flux += np.random.normal(0, 0.001, len(time))
    
    # Stellar variability (low-frequency)
    variability_period = 15.0  # days
    variability_amplitude = 0.002
    flux += variability_amplitude * np.sin(2 * np.pi * time / variability_period)
    
    # Instrumental drift
    drift = 0.0001 * time / duration_days
    flux += drift
    
    return time, flux

def save_lightcurve(time, flux, filename, format='csv'):
    """Save light curve data to file"""
    
    if format == 'csv':
        df = pd.DataFrame({
            'time': time,
            'flux': flux
        })
        df.to_csv(filename, index=False)
    else:  # txt format
        with open(filename, 'w') as f:
            f.write("# Time (days)  Flux (normalized)\n")
            for t, f in zip(time, flux):
                f.write(f"{t:.6f}  {f:.8f}\n")

def main():
    """Generate all sample data files"""
    
    # Create sample_data directory
    os.makedirs('sample_data', exist_ok=True)
    
    print("Generating sample light curve data files...")
    
    # Generate different types of light curves
    datasets = [
        {
            'name': 'confirmed_planet_kepler186f',
            'generator': lambda: generate_planet_lightcurve(
                duration_days=40, period_days=3.2, transit_depth=0.008
            ),
            'description': 'Confirmed exoplanet with clear transit signal'
        },
        {
            'name': 'hot_jupiter_hd209458b',
            'generator': lambda: generate_planet_lightcurve(
                duration_days=25, period_days=3.5, transit_depth=0.015, 
                transit_duration_hours=3.0
            ),
            'description': 'Hot Jupiter with deep transit'
        },
        {
            'name': 'planet_candidate_toi1234',
            'generator': lambda: generate_candidate_lightcurve(duration_days=35),
            'description': 'Planet candidate with weak signal'
        },
        {
            'name': 'eclipsing_binary_kic8462852',
            'generator': lambda: generate_false_positive_lightcurve(duration_days=30),
            'description': 'Eclipsing binary system (false positive)'
        },
        {
            'name': 'stellar_variability_only',
            'generator': lambda: generate_noisy_lightcurve(duration_days=45),
            'description': 'Star with variability but no transits'
        },
        {
            'name': 'super_earth_k2138b',
            'generator': lambda: generate_planet_lightcurve(
                duration_days=50, period_days=7.2, transit_depth=0.004,
                transit_duration_hours=5.5
            ),
            'description': 'Super-Earth with shallow transit'
        }
    ]
    
    # Generate and save each dataset
    for dataset in datasets:
        print(f"Generating {dataset['name']}...")
        
        time, flux = dataset['generator']()
        
        # Save in both CSV and TXT formats
        csv_filename = f"sample_data/{dataset['name']}.csv"
        txt_filename = f"sample_data/{dataset['name']}.txt"
        
        save_lightcurve(time, flux, csv_filename, 'csv')
        save_lightcurve(time, flux, txt_filename, 'txt')
        
        print(f"  Saved: {csv_filename}")
        print(f"  Saved: {txt_filename}")
        print(f"  Description: {dataset['description']}")
        print(f"  Data points: {len(time)}")
        print()
    
    # Create a README for the sample data
    readme_content = """# Sample Light Curve Data

This directory contains sample light curve data files for testing the exoplanet detection system.

## File Formats

- **CSV files**: Comma-separated values with headers (time, flux)
- **TXT files**: Space-separated values with comment header

## Datasets

"""
    
    for dataset in datasets:
        readme_content += f"### {dataset['name']}\n"
        readme_content += f"- **Description**: {dataset['description']}\n"
        readme_content += f"- **Files**: `{dataset['name']}.csv`, `{dataset['name']}.txt`\n\n"
    
    readme_content += """
## Usage

1. Upload any of these files through the web interface
2. Or use the star IDs in the analysis tool:
   - KIC-8462852 (eclipsing binary)
   - TIC-123456789 (hot jupiter)
   - KIC-11446443 (false positive)
   - TIC-987654321 (confirmed planet)
   - KIC-9941662 (candidate)

## Data Characteristics

- **Time**: Days since start of observation
- **Flux**: Normalized stellar brightness (1.0 = baseline)
- **Cadence**: ~30 minutes (0.5 hours)
- **Duration**: 25-50 days per dataset
- **Noise**: Realistic levels based on Kepler/TESS missions

## Expected Results

- **Confirmed planets**: Should classify as "PLANET" with high confidence
- **Candidates**: Should classify as "CANDIDATE" with moderate confidence  
- **False positives**: Should classify as "FALSE POSITIVE"
- **Noise only**: Should classify as "FALSE POSITIVE" or "CANDIDATE" with low confidence
"""
    
    with open('sample_data/README.md', 'w') as f:
        f.write(readme_content)
    
    print("Sample data generation completed!")
    print(f"Generated {len(datasets)} datasets in both CSV and TXT formats")
    print("Files saved in the 'sample_data' directory")

if __name__ == '__main__':
    main()
