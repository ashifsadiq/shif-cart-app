<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WebRouteController extends Controller
{
    public function __construct(
        private ProductController $productController,
        private CategoryController $categoryController
    ) {}
    public function index(Request $request)
    {

        return Inertia::render('welcome', [
            'categories' => $this->categoryController->index($request),
            'products' => $this->productController->index($request)
        ]);
    }
}
