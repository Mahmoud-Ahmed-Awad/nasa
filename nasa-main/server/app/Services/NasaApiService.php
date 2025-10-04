<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class NasaApiService
{
    protected $baseUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
    protected $defaultParams = [
        'format' => 'json',
        'table' => 'ps',
        'select' => 'pl_name,hostname,pl_rade,pl_bmasse,pl_orbper,pl_orbsmax,st_spectype,st_teff,st_rad,st_mass,st_met,st_metratio,pl_eqt,pl_dens,sy_dist,discoverymethod,disc_year,disc_facility',
    ];

    /**
     * Search for exoplanets by name or host star
     * 
     * @param string $query
     * @return array
     */
    public function searchExoplanets(string $query): array
    {
        $cacheKey = 'nasa_search_' . md5($query);
        
        return Cache::remember($cacheKey, now()->addHours(24), function () use ($query) {
            $query = $this->sanitizeQuery($query);
            
            // Try different search strategies
            $strategies = [
                $this->buildExactPlanetNameQuery($query),
                $this->buildPlanetNameLikeQuery($query),
                $this->buildHostStarLikeQuery($query),
                $this->buildBroadSearchQuery($query),
            ];

            foreach ($strategies as $strategy) {
                try {
                    $response = Http::timeout(15)
                        ->get($this->baseUrl, array_merge($this->defaultParams, [
                            'query' => $strategy
                        ]));

                    if ($response->successful()) {
                        $results = $response->json();
                        if (!empty($results)) {
                            return $results;
                        }
                    }
                } catch (\Exception $e) {
                    Log::error("NASA API search error: " . $e->getMessage());
                }
            }

            return [];
        });
    }

    /**
     * Get details of a specific exoplanet
     * 
     * @param string $planetName
     * @return array|null
     */
    public function getExoplanetDetails(string $planetName): ?array
    {
        $cacheKey = 'nasa_planet_' . md5($planetName);
        
        return Cache::remember($cacheKey, now()->addHours(24), function () use ($planetName) {
            $query = $this->buildExactPlanetNameQuery($this->sanitizeQuery($planetName));
            
            try {
                $response = Http::timeout(15)
                    ->get($this->baseUrl, array_merge($this->defaultParams, [
                        'query' => $query
                    ]));

                if ($response->successful()) {
                    $results = $response->json();
                    return $results[0] ?? null;
                }
            } catch (\Exception $e) {
                Log::error("NASA API details error: " . $e->getMessage());
                return null;
            }

            return null;
        });
    }

    /**
     * Get recently discovered exoplanets
     * 
     * @param int $limit
     * @return array
     */
    public function getRecentlyDiscovered(int $limit = 10): array
    {
        $cacheKey = 'nasa_recent_' . $limit;
        
        return Cache::remember($cacheKey, now()->addHours(6), function () use ($limit) {
            try {
                $response = Http::timeout(15)
                    ->get($this->baseUrl, array_merge($this->defaultParams, [
                        'query' => "SELECT * FROM ps WHERE default_flag = 1 ORDER BY disc_year DESC, disc_facility, pl_name LIMIT {$limit}"
                    ]));

                if ($response->successful()) {
                    return $response->json();
                }
            } catch (\Exception $e) {
                Log::error("NASA API recent error: " . $e->getMessage());
            }

            return [];
        });
    }

    /**
     * Build exact planet name query
     */
    protected function buildExactPlanetNameQuery(string $query): string
    {
        $query = strtoupper($query);
        return "SELECT * FROM ps WHERE UPPER(pl_name) = '{$query}' AND default_flag = 1";
    }

    /**
     * Build partial planet name query
     */
    protected function buildPlanetNameLikeQuery(string $query): string
    {
        $query = strtoupper($query);
        return "SELECT * FROM ps WHERE UPPER(pl_name) LIKE '%{$query}%' AND default_flag = 1";
    }

    /**
     * Build host star query
     */
    protected function buildHostStarLikeQuery(string $query): string
    {
        $query = strtoupper($query);
        return "SELECT * FROM ps WHERE UPPER(hostname) LIKE '%{$query}%' AND default_flag = 1";
    }

    /**
     * Build broad search query
     */
    protected function buildBroadSearchQuery(string $query): string
    {
        $query = strtoupper($query);
        return "SELECT * FROM ps WHERE (UPPER(pl_name) LIKE '%{$query}%' OR UPPER(hostname) LIKE '%{$query}%') AND default_flag = 1";
    }

    /**
     * Sanitize search query
     */
    protected function sanitizeQuery(string $query): string
    {
        // Remove any SQL injection attempts
        $query = preg_replace('/[^\w\s-]/', '', $query);
        return trim($query);
    }

    /**
     * Get all exoplanets with pagination
     * 
     * @param int $page
     * @param int $perPage
     * @return array
     */
    public function getAllExoplanets(int $page = 1, int $perPage = 20): array
    {
        $cacheKey = 'nasa_all_planets_' . $page . '_' . $perPage;
        
        return Cache::remember($cacheKey, now()->addHours(24), function () use ($page, $perPage) {
            $offset = ($page - 1) * $perPage;
            
            try {
                $response = Http::timeout(30)
                    ->get($this->baseUrl, array_merge($this->defaultParams, [
                        'query' => "SELECT * FROM ps WHERE default_flag = 1 ORDER BY pl_name LIMIT {$perPage} OFFSET {$offset}"
                    ]));

                if ($response->successful()) {
                    return [
                        'data' => $response->json(),
                        'pagination' => [
                            'current_page' => $page,
                            'per_page' => $perPage,
                            'has_more' => count($response->json()) === $perPage
                        ]
                    ];
                }
            } catch (\Exception $e) {
                Log::error("NASA API get all exoplanets error: " . $e->getMessage());
            }

            return ['data' => [], 'pagination' => []];
        });
    }
}
