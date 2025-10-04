/**
 * NASA Exoplanet Archive API Service
 * Uses the Table Access Protocol (TAP) to fetch real exoplanet data
 */

export interface ExoplanetData {
  pl_name: string;          // Planet name
  hostname: string;         // Host star name
  pl_rade?: number;         // Planet radius (Earth radii)
  pl_masse?: number;        // Planet mass (Earth masses)
  pl_orbper?: number;       // Orbital period (days)
  disc_facility?: string;   // Discovery facility
  discoverymethod?: string; // Discovery method
  disc_year?: number;       // Discovery year
  ra?: number;              // Right ascension
  dec?: number;             // Declination
  sy_snum?: number;         // Number of stars in system
  sy_pnum?: number;         // Number of planets in system
  pl_tranflag?: number;     // Transit flag (1 if transiting)
  default_flag?: number;    // Default parameter set flag
}

export interface StarSuggestion {
  id: string;
  name: string;
  type: string;
  description: string;
  mission: string;
  discoveryYear?: number;
  planetCount?: number;
}

class NASAExoplanetAPI {
  private readonly BASE_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
  
  // Note: If CORS issues occur in production, consider using a backend proxy
  // or a CORS proxy service like: https://cors-anywhere.herokuapp.com/

  /**
   * Fetch confirmed exoplanets from NASA Exoplanet Archive
   */
  async fetchConfirmedExoplanets(limit: number = 100): Promise<ExoplanetData[]> {
    const query = `
      SELECT TOP ${limit}
        pl_name, hostname, pl_rade, pl_masse, pl_orbper, 
        disc_facility, discoverymethod, disc_year, ra, dec,
        sy_snum, sy_pnum, pl_tranflag, default_flag
      FROM ps 
      WHERE default_flag = 1 
        AND pl_name IS NOT NULL
        AND hostname IS NOT NULL
      ORDER BY disc_year DESC, pl_name ASC
    `.replace(/\s+/g, '+').replace(/\n/g, '');

    const url = `${this.BASE_URL}?query=${encodeURIComponent(query)}&format=json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseExoplanetData(data);
    } catch (error) {
      console.error('Error fetching NASA exoplanet data:', error);
      // Fallback to mock data if API fails
      return this.getMockExoplanetData();
    }
  }

  /**
   * Fetch TESS candidates for search suggestions
   */
  async fetchTESSCandidates(limit: number = 50): Promise<ExoplanetData[]> {
    const query = `
      SELECT TOP ${limit}
        pl_name, hostname, pl_rade, pl_masse, pl_orbper,
        disc_facility, discoverymethod, disc_year, ra, dec,
        sy_snum, sy_pnum, pl_tranflag, default_flag
      FROM ps 
      WHERE disc_facility LIKE '%TESS%'
        AND pl_name IS NOT NULL
        AND hostname IS NOT NULL
      ORDER BY disc_year DESC, pl_name ASC
    `.replace(/\s+/g, '+').replace(/\n/g, '');

    const url = `${this.BASE_URL}?query=${encodeURIComponent(query)}&format=json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseExoplanetData(data);
    } catch (error) {
      console.error('Error fetching TESS candidates:', error);
      return [];
    }
  }

  /**
   * Fetch Kepler exoplanets for search suggestions
   */
  async fetchKeplerExoplanets(limit: number = 50): Promise<ExoplanetData[]> {
    const query = `
      SELECT TOP ${limit}
        pl_name, hostname, pl_rade, pl_masse, pl_orbper,
        disc_facility, discoverymethod, disc_year, ra, dec,
        sy_snum, sy_pnum, pl_tranflag, default_flag
      FROM ps 
      WHERE disc_facility LIKE '%Kepler%'
        AND pl_name IS NOT NULL
        AND hostname IS NOT NULL
      ORDER BY disc_year DESC, pl_name ASC
    `.replace(/\s+/g, '+').replace(/\n/g, '');

    const url = `${this.BASE_URL}?query=${encodeURIComponent(query)}&format=json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseExoplanetData(data);
    } catch (error) {
      console.error('Error fetching Kepler exoplanets:', error);
      return [];
    }
  }

  /**
   * Advanced search exoplanets with multiple search strategies
   */
  async searchExoplanets(searchTerm: string, limit: number = 20): Promise<ExoplanetData[]> {
    // Parse search term for different search strategies
    let whereClause = '';
    const cleanTerm = searchTerm.replace(/^(host:|facility:)/, '').trim().toUpperCase();
    
    if (searchTerm.startsWith('host:')) {
      // Search by host star name only
      whereClause = `UPPER(hostname) LIKE '%${cleanTerm}%'`;
    } else if (searchTerm.startsWith('facility:')) {
      // Search by discovery facility
      whereClause = `UPPER(disc_facility) LIKE '%${cleanTerm}%'`;
    } else if (searchTerm.toLowerCase().includes('habitable')) {
      // Search for potentially habitable planets
      whereClause = `
        (pl_rade BETWEEN 0.5 AND 2.0 OR pl_masse BETWEEN 0.1 AND 10.0)
        AND pl_orbper IS NOT NULL
        AND (UPPER(disc_facility) LIKE '%KEPLER%' OR UPPER(disc_facility) LIKE '%TESS%')
      `;
    } else {
      // General search across planet name, host name, and facility
      whereClause = `
        (UPPER(pl_name) LIKE '%${cleanTerm}%' 
         OR UPPER(hostname) LIKE '%${cleanTerm}%'
         OR UPPER(disc_facility) LIKE '%${cleanTerm}%')
      `;
    }

    const query = `
      SELECT TOP ${limit}
        pl_name, hostname, pl_rade, pl_masse, pl_orbper,
        disc_facility, discoverymethod, disc_year, ra, dec,
        sy_snum, sy_pnum, pl_tranflag, default_flag
      FROM ps 
      WHERE ${whereClause}
        AND default_flag = 1
        AND pl_name IS NOT NULL
        AND hostname IS NOT NULL
      ORDER BY disc_year DESC, pl_name ASC
    `.replace(/\s+/g, '+').replace(/\n/g, '');

    const url = `${this.BASE_URL}?query=${encodeURIComponent(query)}&format=json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseExoplanetData(data);
    } catch (error) {
      console.error('Error searching exoplanets:', error);
      return [];
    }
  }

  /**
   * Get trending/recent discoveries
   */
  async getTrendingExoplanets(limit: number = 20): Promise<ExoplanetData[]> {
    const currentYear = new Date().getFullYear();
    const query = `
      SELECT TOP ${limit}
        pl_name, hostname, pl_rade, pl_masse, pl_orbper,
        disc_facility, discoverymethod, disc_year, ra, dec,
        sy_snum, sy_pnum, pl_tranflag, default_flag
      FROM ps 
      WHERE default_flag = 1
        AND disc_year >= ${currentYear - 3}
        AND pl_name IS NOT NULL
        AND hostname IS NOT NULL
      ORDER BY disc_year DESC, pl_name ASC
    `.replace(/\s+/g, '+').replace(/\n/g, '');

    const url = `${this.BASE_URL}?query=${encodeURIComponent(query)}&format=json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseExoplanetData(data);
    } catch (error) {
      console.error('Error fetching trending exoplanets:', error);
      return [];
    }
  }

  /**
   * Convert NASA API data to our format
   */
  private parseExoplanetData(apiResponse: any): ExoplanetData[] {
    if (!apiResponse || !apiResponse.data) {
      return [];
    }

    const columns = apiResponse.columns || [];
    const rows = apiResponse.data || [];

    return rows.map((row: any[]) => {
      const exoplanet: any = {};
      columns.forEach((column: any, index: number) => {
        exoplanet[column.name] = row[index];
      });
      return exoplanet as ExoplanetData;
    });
  }

  /**
   * Convert exoplanet data to search suggestions format
   */
  convertToSuggestions(exoplanets: ExoplanetData[]): StarSuggestion[] {
    return exoplanets.map((planet) => {
      const mission = this.getMissionFromFacility(planet.disc_facility);
      const type = this.getPlanetType(planet);
      const description = this.generateDescription(planet);

      return {
        id: planet.pl_name || planet.hostname || 'Unknown',
        name: planet.hostname || 'Unknown Host',
        type,
        description,
        mission,
        discoveryYear: planet.disc_year,
        planetCount: planet.sy_pnum
      };
    });
  }

  /**
   * Determine mission from discovery facility
   */
  private getMissionFromFacility(facility?: string): string {
    if (!facility) return 'Unknown';
    
    if (facility.includes('TESS')) return 'TESS';
    if (facility.includes('Kepler')) return 'Kepler';
    if (facility.includes('K2')) return 'K2';
    if (facility.includes('CoRoT')) return 'CoRoT';
    if (facility.includes('Spitzer')) return 'Spitzer';
    
    return 'Ground-based';
  }

  /**
   * Determine planet type based on properties
   */
  private getPlanetType(planet: ExoplanetData): string {
    if (planet.default_flag === 1) {
      if (planet.pl_tranflag === 1) {
        return 'Confirmed Planet';
      }
      return 'Confirmed Planet';
    }
    return 'Candidate';
  }

  /**
   * Generate descriptive text for the planet
   */
  private generateDescription(planet: ExoplanetData): string {
    const parts = [];
    
    if (planet.pl_rade) {
      if (planet.pl_rade < 1.25) {
        parts.push('Earth-sized planet');
      } else if (planet.pl_rade < 2.0) {
        parts.push('Super-Earth');
      } else if (planet.pl_rade < 4.0) {
        parts.push('Sub-Neptune');
      } else {
        parts.push('Giant planet');
      }
    }

    if (planet.pl_orbper) {
      if (planet.pl_orbper < 10) {
        parts.push('with very short orbital period');
      } else if (planet.pl_orbper < 100) {
        parts.push('with short orbital period');
      } else if (planet.pl_orbper < 365) {
        parts.push('with moderate orbital period');
      } else {
        parts.push('with long orbital period');
      }
    }

    if (planet.discoverymethod) {
      parts.push(`discovered via ${planet.discoverymethod.toLowerCase()}`);
    }

    if (planet.disc_year) {
      parts.push(`in ${planet.disc_year}`);
    }

    return parts.join(' ') || 'Exoplanet system';
  }

  /**
   * Fallback mock data when API is unavailable
   */
  private getMockExoplanetData(): ExoplanetData[] {
    return [
      {
        pl_name: 'Kepler-442 b',
        hostname: 'Kepler-442',
        pl_rade: 1.34,
        pl_masse: 2.3,
        pl_orbper: 112.3,
        disc_facility: 'Kepler',
        discoverymethod: 'Transit',
        disc_year: 2015,
        sy_pnum: 1,
        pl_tranflag: 1,
        default_flag: 1
      },
      {
        pl_name: 'TOI-715 b',
        hostname: 'TOI-715',
        pl_rade: 1.55,
        pl_masse: 3.02,
        pl_orbper: 19.3,
        disc_facility: 'Transiting Exoplanet Survey Satellite (TESS)',
        discoverymethod: 'Transit',
        disc_year: 2023,
        sy_pnum: 1,
        pl_tranflag: 1,
        default_flag: 1
      }
    ];
  }
}

export const nasaExoplanetAPI = new NASAExoplanetAPI();
export default nasaExoplanetAPI;
