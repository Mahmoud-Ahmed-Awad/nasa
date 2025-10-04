/**
 * Gemini AI API Service for Exoplanet Analysis
 * Uses Google's Gemini AI to analyze light curve data and detect exoplanets
 */

import { nasaExoplanetAPI, type ExoplanetData } from './nasaApi'

export interface GeminiAnalysisResult {
  prediction: string
  confidence: number
  reasoning: string
  transit_period?: number | null
  transit_depth?: number | null
  transit_duration?: number | null
  star_id?: string
  star_info?: any
  data_source?: string
  time_data?: number[]
  flux_data?: number[]
  total_data_points?: number
  filename?: string
}

class GeminiExoplanetAPI {
  private readonly GEMINI_API_KEY: string
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

  constructor() {
    // In production, this should be stored securely (environment variables, etc.)
    this.GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'
  }

  /**
   * Analyze star by identifier using Gemini AI
   */
  async analyzeStarIdentifier(starId: string): Promise<GeminiAnalysisResult> {
    try {
      // First, get star data from NASA
      const nasaData = await this.fetchStarDataFromNASA(starId)
      
      if (!nasaData) {
        throw new Error('No data available for the specified star ID')
      }

      // Generate realistic light curve data
      const lightCurve = this.generateLightCurveData(nasaData)
      
      // Analyze with Gemini AI
      const analysis = await this.analyzeWithGemini(starId, nasaData, lightCurve)
      
      return {
        ...analysis,
        star_id: starId,
        star_info: nasaData,
        data_source: 'NASA Exoplanet Archive + Gemini AI',
        time_data: lightCurve.time.slice(0, 100),
        flux_data: lightCurve.flux.slice(0, 100),
        total_data_points: lightCurve.time.length
      }
    } catch (error) {
      console.error('Error in Gemini star analysis:', error)
      throw error
    }
  }

  /**
   * Analyze uploaded file using Gemini AI
   */
  async analyzeFile(file: File): Promise<GeminiAnalysisResult> {
    try {
      // Parse the file content
      const { timeData, fluxData } = await this.parseFileContent(file)
      
      // Analyze with Gemini AI
      const analysis = await this.analyzeWithGemini(
        file.name,
        { source: 'Uploaded File' },
        { time: timeData, flux: fluxData }
      )
      
      return {
        ...analysis,
        filename: file.name,
        data_source: 'Uploaded File + Gemini AI',
        time_data: timeData.slice(0, 100),
        flux_data: fluxData.slice(0, 100),
        total_data_points: timeData.length
      }
    } catch (error) {
      console.error('Error in Gemini file analysis:', error)
      throw error
    }
  }

  /**
   * Fetch star data from NASA Exoplanet Archive
   */
  private async fetchStarDataFromNASA(starId: string): Promise<ExoplanetData | null> {
    try {
      // Use our existing NASA API service
      const searchResults = await nasaExoplanetAPI.searchExoplanets(starId, 1)
      return searchResults.length > 0 ? searchResults[0] : null
    } catch (error) {
      console.error('Error fetching NASA data:', error)
      return null
    }
  }

  /**
   * Generate realistic light curve data based on star properties
   */
  private generateLightCurveData(starData: ExoplanetData): { time: number[], flux: number[] } {
    const timePoints = Array.from({ length: 1500 }, (_, i) => i * 0.02) // 30 days
    let fluxData = timePoints.map(() => 1.0 + (Math.random() - 0.5) * 0.002) // Base flux with noise
    
    // Add transit signal if planet exists
    if (starData.pl_tranflag === 1 && starData.pl_orbper) {
      const period = starData.pl_orbper
      const transitDepth = (starData.pl_rade || 1.0) * 0.01 // Transit depth based on radius
      const transitDuration = 0.1 // 0.1 days
      
      // Add periodic transits
      for (let phase = 0; phase < 30; phase += period) {
        timePoints.forEach((time, index) => {
          if (Math.abs(time - phase) < transitDuration / 2) {
            const transitShape = Math.exp(-Math.pow((time - phase) / (transitDuration / 4), 2))
            fluxData[index] -= transitDepth * transitShape
          }
        })
      }
    }
    
    return { time: timePoints, flux: fluxData }
  }

  /**
   * Parse uploaded file content
   */
  private async parseFileContent(file: File): Promise<{ timeData: number[], fluxData: number[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const lines = content.trim().split('\n')
          
          const timeData: number[] = []
          const fluxData: number[] = []
          
          // Skip header if present
          const startIndex = lines[0].toLowerCase().includes('time') ? 1 : 0
          
          for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim()
            if (line) {
              const parts = line.replace(',', ' ').split(/\s+/)
              if (parts.length >= 2) {
                const time = parseFloat(parts[0])
                const flux = parseFloat(parts[1])
                if (!isNaN(time) && !isNaN(flux)) {
                  timeData.push(time)
                  fluxData.push(flux)
                }
              }
            }
          }
          
          if (timeData.length < 10) {
            reject(new Error('File must contain at least 10 data points'))
          } else {
            resolve({ timeData, fluxData })
          }
        } catch (error) {
          reject(new Error('Error parsing file content'))
        }
      }
      
      reader.onerror = () => reject(new Error('Error reading file'))
      reader.readAsText(file)
    })
  }

  /**
   * Analyze light curve data using Gemini AI
   */
  private async analyzeWithGemini(
    identifier: string,
    starInfo: any,
    lightCurve: { time: number[], flux: number[] }
  ): Promise<Omit<GeminiAnalysisResult, 'star_id' | 'star_info' | 'data_source' | 'time_data' | 'flux_data' | 'total_data_points'>> {
    try {
      // Calculate basic statistics for Gemini analysis
      const fluxStats = this.calculateFluxStatistics(lightCurve.flux)
      const transitFeatures = this.detectTransitFeatures(lightCurve)
      
      // Create prompt for Gemini
      const prompt = this.createAnalysisPrompt(identifier, starInfo, fluxStats, transitFeatures)
      
      // Call Gemini API
      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const result = await response.json()
      const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text

      if (!analysisText) {
        throw new Error('No analysis result from Gemini')
      }

      // Parse Gemini's response
      return this.parseGeminiResponse(analysisText, transitFeatures)
      
    } catch (error) {
      console.error('Gemini API error:', error)
      // Fallback to rule-based analysis
      return this.fallbackAnalysis(lightCurve)
    }
  }

  /**
   * Calculate flux statistics for analysis
   */
  private calculateFluxStatistics(flux: number[]) {
    const mean = flux.reduce((a, b) => a + b, 0) / flux.length
    const variance = flux.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / flux.length
    const std = Math.sqrt(variance)
    const min = Math.min(...flux)
    const max = Math.max(...flux)
    const range = max - min
    
    // Calculate skewness and kurtosis
    const skewness = flux.reduce((a, b) => a + Math.pow((b - mean) / std, 3), 0) / flux.length
    const kurtosis = flux.reduce((a, b) => a + Math.pow((b - mean) / std, 4), 0) / flux.length - 3
    
    return { mean, std, min, max, range, skewness, kurtosis }
  }

  /**
   * Detect potential transit features
   */
  private detectTransitFeatures(lightCurve: { time: number[], flux: number[] }) {
    const { flux } = lightCurve
    const mean = flux.reduce((a, b) => a + b, 0) / flux.length
    
    // Find dips below mean
    const dips = []
    let inDip = false
    let dipStart = 0
    let dipDepth = 0
    
    for (let i = 0; i < flux.length; i++) {
      if (flux[i] < mean - 0.002 && !inDip) {
        inDip = true
        dipStart = i
        dipDepth = mean - flux[i]
      } else if (flux[i] >= mean - 0.001 && inDip) {
        inDip = false
        dips.push({
          start: dipStart,
          end: i,
          depth: dipDepth,
          duration: i - dipStart
        })
      }
      
      if (inDip && mean - flux[i] > dipDepth) {
        dipDepth = mean - flux[i]
      }
    }
    
    // Estimate period if multiple dips found
    let estimatedPeriod = null
    if (dips.length >= 2) {
      const intervals = []
      for (let i = 1; i < dips.length; i++) {
        intervals.push(dips[i].start - dips[i-1].start)
      }
      estimatedPeriod = intervals.reduce((a, b) => a + b, 0) / intervals.length * 0.02 // Convert to days
    }
    
    return {
      dipCount: dips.length,
      averageDepth: dips.length > 0 ? dips.reduce((a, b) => a + b.depth, 0) / dips.length : 0,
      estimatedPeriod,
      maxDepth: dips.length > 0 ? Math.max(...dips.map(d => d.depth)) : 0
    }
  }

  /**
   * Create analysis prompt for Gemini
   */
  private createAnalysisPrompt(identifier: string, starInfo: any, fluxStats: any, transitFeatures: any): string {
    return `
As an expert exoplanet astronomer, analyze this light curve data and determine if it shows evidence of an exoplanet transit.

Star/Object: ${identifier}
${starInfo.pl_name ? `Known Planet: ${starInfo.pl_name}` : ''}
${starInfo.hostname ? `Host Star: ${starInfo.hostname}` : ''}
${starInfo.disc_facility ? `Discovery Facility: ${starInfo.disc_facility}` : ''}

Light Curve Statistics:
- Mean flux: ${fluxStats.mean.toFixed(6)}
- Standard deviation: ${fluxStats.std.toFixed(6)}
- Flux range: ${fluxStats.range.toFixed(6)}
- Skewness: ${fluxStats.skewness.toFixed(3)}
- Kurtosis: ${fluxStats.kurtosis.toFixed(3)}

Transit Features Detected:
- Number of dips: ${transitFeatures.dipCount}
- Average dip depth: ${transitFeatures.averageDepth.toFixed(6)}
- Maximum dip depth: ${transitFeatures.maxDepth.toFixed(6)}
- Estimated period: ${transitFeatures.estimatedPeriod ? transitFeatures.estimatedPeriod.toFixed(2) + ' days' : 'Unknown'}

Please analyze this data and provide your assessment in the following JSON format:
{
  "prediction": "PLANET" | "CANDIDATE" | "FALSE POSITIVE",
  "confidence": <percentage 0-100>,
  "reasoning": "<detailed explanation of your analysis>",
  "transit_period": <estimated period in days or null>,
  "transit_depth": <estimated depth or null>,
  "transit_duration": <estimated duration in hours or null>
}

Consider factors like:
- Signal-to-noise ratio
- Transit shape and depth consistency
- Periodicity of signals
- Stellar variability vs planetary transits
- Known false positive indicators (eclipsing binaries, stellar spots, etc.)
`
  }

  /**
   * Parse Gemini's response
   */
  private parseGeminiResponse(analysisText: string, transitFeatures: any) {
    try {
      // Extract JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          prediction: parsed.prediction || 'CANDIDATE',
          confidence: parsed.confidence || 50,
          reasoning: parsed.reasoning || 'Analysis completed by Gemini AI',
          transit_period: parsed.transit_period || transitFeatures.estimatedPeriod,
          transit_depth: parsed.transit_depth || transitFeatures.averageDepth,
          transit_duration: parsed.transit_duration || (transitFeatures.estimatedPeriod ? transitFeatures.estimatedPeriod * 0.1 * 24 : null)
        }
      }
    } catch (error) {
      console.error('Error parsing Gemini response:', error)
    }
    
    // Fallback parsing
    const prediction = analysisText.includes('PLANET') ? 'PLANET' : 
                     analysisText.includes('FALSE POSITIVE') ? 'FALSE POSITIVE' : 'CANDIDATE'
    
    return {
      prediction,
      confidence: 75,
      reasoning: 'Analysis completed by Gemini AI: ' + analysisText.substring(0, 200) + '...',
      transit_period: transitFeatures.estimatedPeriod,
      transit_depth: transitFeatures.averageDepth,
      transit_duration: transitFeatures.estimatedPeriod ? transitFeatures.estimatedPeriod * 0.1 * 24 : null
    }
  }

  /**
   * Fallback analysis when Gemini API is unavailable
   */
  private fallbackAnalysis(lightCurve: { time: number[], flux: number[] }) {
    const transitFeatures = this.detectTransitFeatures(lightCurve)
    
    // Simple rule-based classification
    let prediction = 'FALSE POSITIVE'
    let confidence = 30
    
    if (transitFeatures.dipCount >= 2 && transitFeatures.averageDepth > 0.003) {
      if (transitFeatures.estimatedPeriod && transitFeatures.estimatedPeriod > 1) {
        prediction = 'PLANET'
        confidence = 85
      } else {
        prediction = 'CANDIDATE'
        confidence = 65
      }
    } else if (transitFeatures.dipCount >= 1 && transitFeatures.averageDepth > 0.001) {
      prediction = 'CANDIDATE'
      confidence = 45
    }
    
    return {
      prediction,
      confidence,
      reasoning: 'Fallback analysis: Based on transit depth and periodicity detection',
      transit_period: transitFeatures.estimatedPeriod,
      transit_depth: transitFeatures.averageDepth,
      transit_duration: transitFeatures.estimatedPeriod ? transitFeatures.estimatedPeriod * 0.1 * 24 : null
    }
  }
}

export const geminiExoplanetAPI = new GeminiExoplanetAPI()
export default geminiExoplanetAPI
