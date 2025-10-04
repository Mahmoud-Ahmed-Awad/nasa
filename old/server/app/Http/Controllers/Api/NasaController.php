<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NasaApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NasaController extends Controller
{
    protected $nasaService;

    public function __construct(NasaApiService $nasaService)
    {
        $this->nasaService = $nasaService;
    }

    /**
     * Search for exoplanets
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $results = $this->nasaService->searchExoplanets($request->query('query'));

        return response()->json([
            'success' => true,
            'count' => count($results),
            'data' => $results
        ]);
    }

    /**
     * Get exoplanet details
     * 
     * @param string $planetName
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($planetName)
    {
        $planet = $this->nasaService->getExoplanetDetails($planetName);

        if (!$planet) {
            return response()->json([
                'success' => false,
                'message' => 'Exoplanet not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $planet
        ]);
    }

    /**
     * Get recently discovered exoplanets
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function recent(Request $request)
    {
        $limit = min($request->query('limit', 10), 50); // Max 50 results
        
        $results = $this->nasaService->getRecentlyDiscovered($limit);

        return response()->json([
            'success' => true,
            'count' => count($results),
            'data' => $results
        ]);
    }

    /**
     * Get all exoplanets with pagination
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $page = max(1, (int) $request->query('page', 1));
        $perPage = min(max(1, (int) $request->query('per_page', 20)), 100); // Max 100 per page

        $result = $this->nasaService->getAllExoplanets($page, $perPage);

        return response()->json([
            'success' => true,
            'data' => $result['data'],
            'pagination' => $result['pagination']
        ]);
    }
}
