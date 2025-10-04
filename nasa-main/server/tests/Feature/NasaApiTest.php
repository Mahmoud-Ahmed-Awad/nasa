<?php

namespace Tests\Feature;

use App\Services\NasaApiService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NasaApiTest extends TestCase
{
    protected NasaApiService $nasaService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->nasaService = new NasaApiService();
    }

    /** @test */
    public function it_can_search_for_exoplanets()
    {
        $results = $this->nasaService->searchExoplanets('Kepler-442');
        
        $this->assertIsArray($results);
        $this->assertNotEmpty($results);
        $this->assertArrayHasKey('pl_name', $results[0]);
        $this->assertStringContainsStringIgnoringCase('Kepler-442', $results[0]['pl_name']);
    }

    /** @test */
    public function it_can_get_exoplanet_details()
    {
        $planet = $this->nasaService->getExoplanetDetails('Kepler-442 b');
        
        $this->assertIsArray($planet);
        $this->assertArrayHasKey('pl_name', $planet);
        $this->assertEquals('Kepler-442 b', $planet['pl_name']);
    }

    /** @test */
    public function it_can_get_recently_discovered_exoplanets()
    {
        $results = $this->nasaService->getRecentlyDiscovered(5);
        
        $this->assertIsArray($results);
        $this->assertCount(5, $results);
        $this->assertArrayHasKey('pl_name', $results[0]);
        $this->assertArrayHasKey('disc_year', $results[0]);
    }
}
