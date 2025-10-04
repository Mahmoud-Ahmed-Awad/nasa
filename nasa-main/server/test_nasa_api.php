<?php

require __DIR__.'/vendor/autoload.php';

use App\Services\NasaApiService;

// Initialize the service
$nasaService = new NasaApiService();

// Test search functionality
echo "Testing search for 'Kepler-442':\n";
$results = $nasaService->searchExoplanets('Kepler-442');
print_r($results);

// Test getting planet details
echo "\n\nTesting get details for 'Kepler-442 b':\n";
$planet = $nasaService->getExoplanetDetails('Kepler-442 b');
print_r($planet);

// Test getting recent discoveries
echo "\n\nTesting recent discoveries (limit 3):\n";
$recent = $nasaService->getRecentlyDiscovered(3);
print_r($recent);

echo "\n\nTests completed.\n";
