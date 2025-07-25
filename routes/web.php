<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WebRouteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WebRouteController::class, 'index'])->name('home');
Route::get('/product/{slug}', [WebRouteController::class, 'productShow'])->name('product.productShow');
Route::inertia('privacy-policy', 'Policy/PrivacyPolicy');
Route::inertia('terms-conditions', 'Policy/TermsConditions');
Route::inertia('ShiftCartFeedbackForm', 'Forms/ShiftCartFeedbackForm');
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('dashboard');
    Route::post('cart/add', [CartController::class, 'addToCart'])->name('cart.add');
    Route::post('cart/remove', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('cart/update', [CartController::class, 'update'])->name('cart.update');
    Route::get('cart', [CartController::class, 'getCart'])->name('cart.get');
    Route::get('cart/{order_number}', [CartController::class, 'proceedOrder'])->name('cart.proceedOrder');
    Route::post('cart/place-order', [CartController::class, 'placeOrder'])->name('cart.placeOrder');
    Route::resource('orders', OrderController::class);
    Route::get('address', [AddressController::class, 'userAddress']);
    Route::resource('orders', OrderController::class);
    Route::get('products', [ProductController::class, 'adminIndex'])->name('products');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
