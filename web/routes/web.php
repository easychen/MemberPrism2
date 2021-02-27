<?php

use Illuminate\Support\Facades\Route;
use App\Models\Content;
use App\Models\Plan;
use App\Models\User;

use App\Http\Controllers\WebhookController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post(
    '/stripe/webhook',
    [WebhookController::class, 'handleWebhook']
);

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');


Route::middleware(['auth:sanctum', 'verified','admin'])->get('/members', function () {
    return view('admin.members.list');
})->name('members');

Route::middleware(['auth:sanctum', 'verified','admin'])->get('/members/modify/{user:id}', function (User $user) {
    return view('admin.members.modify',['user'=>$user]);
})->name('members.modify');


Route::middleware(['auth:sanctum', 'verified','admin'])->get('/settings', function () {
    return view('admin.settings');
})->name('settings');

Route::middleware(['auth:sanctum', 'verified','admin'])->get('/plans', function () {
    return view('admin.plans.list');
})->name('plans.list');

Route::middleware(['auth:sanctum', 'verified','admin'])->get('/plans/create', function () {
    return view('admin.plans.create');
})->name('plans.create');

Route::middleware(['auth:sanctum', 'verified','admin'])->get('/plans/modify/{plan:id}', function (Plan $plan) {
    return view('admin.plans.modify',['plan'=>$plan]);
})->name('plans.modify');

Route::middleware(['auth:sanctum', 'verified','admin'])->get('/content', function () {
    return view('admin.content.list');
})->name('content.list');

Route::middleware(['auth:sanctum', 'verified','admin'])->get('/content/create', function () {
    return view('admin.content.create');
})->name('content.create');

Route::middleware(['auth:sanctum', 'verified','admin'])->get('/content/modify/{content:id}', function (Content $content) {
    return view('admin.content.modify',['content'=>$content]);
})->name('content.modify');

Route::middleware(['auth:sanctum', 'verified','admin'])->get('/links', function () {
    return view('admin.links');
})->name('links');
