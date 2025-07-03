<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\WebRouteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WebRouteController::class, 'index'])->name('home');
Route::get('/product/{slug}', [WebRouteController::class, 'productShow'])->name('product.productShow');
Route::inertia('privacy-policy', 'Policy/PrivacyPolicy');
Route::inertia('terms-conditions', 'Policy/TermsConditions');
Route::inertia('ShiftCartFeedbackForm', 'Forms/ShiftCartFeedbackForm');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('products', [ProductController::class, 'adminIndex'])->name('products');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
