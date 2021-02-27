<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/register' , 'Laravel\Fortify\Http\Controllers\RegisteredUserController@store' );

Route::post('/login' , 'App\Http\Controllers\ApiController@login' );
Route::get('/lock' , 'App\Http\Controllers\ApiController@lock' );

Route::middleware('jwt')->post('/subscribe' , 'App\Http\Controllers\ApiController@subscribe' );

Route::middleware('jwt')->post('/stripe_port' , 'App\Http\Controllers\ApiController@stripeport' );

Route::get('/stripe/callback' , 'App\Http\Controllers\ApiController@payback' )->name('stripe.payback');

Route::post('/forgot-password' , 'Laravel\Fortify\Http\Controllers\PasswordResetLinkController@store' );

Route::get('/page/{page_name}',  'App\Http\Controllers\AssertController@page' );
Route::get('/app.js',  'App\Http\Controllers\AssertController@js' );
Route::get('/app.css',  'App\Http\Controllers\AssertController@css' );
