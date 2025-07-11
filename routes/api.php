<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::post('cart/add', [CartController::class, 'addToCart']);
    Route::post('cart/update', [CartController::class, 'update']);
    Route::post('cart/remove', [CartController::class, 'remove']);
    Route::get('cart', [CartController::class, 'getCart']);
    Route::apiResource('orders', OrderController::class);
});
Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin'])->group(function () {
    // E-commerce routes
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->except(['show']);
    Route::post('products/{product}/upload-image', [ProductController::class, 'uploadImage']);
    Route::post('checkout', [OrderController::class, 'checkout']);
    Route::apiResource('reviews', ReviewController::class);

    // Content management routes
    Route::apiResource('articles', ArticleController::class);
    Route::apiResource('comments', CommentController::class);

    // Admin/User management routes (with proper authorization)
    Route::apiResource('users', UserController::class)->except(['store']);
    Route::middleware('can:manage-users')->group(function () {
    });
    // ... more admin routes
});
