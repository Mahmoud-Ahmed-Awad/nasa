<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NasaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public API routes
Route::prefix('v1')->group(function () {
    // Get all exoplanets with pagination
    Route::get('/exoplanets', [NasaController::class, 'index']);
    
    // Search exoplanets
    Route::get('/exoplanets/search', [NasaController::class, 'search']);
    
    // Get exoplanet details
    Route::get('/exoplanets/{planetName}', [NasaController::class, 'show']);
    
    // Get recently discovered exoplanets
    Route::get('/exoplanets/recent/discovered', [NasaController::class, 'recent']);
});

// Fallback route for undefined API endpoints
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found',
    ], 404);
});
