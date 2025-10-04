<?php

namespace App\Providers;

use App\Services\NasaApiService;
use Illuminate\Support\ServiceProvider;

class NasaServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(NasaApiService::class, function ($app) {
            return new NasaApiService();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
