<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
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
        $categoryPage = $request->input('category_page', 1);
        $productPage  = $request->input('product_page', 1);

        return Inertia::render('Welcome/Welcome', [
            'categories' => Category::paginate(100, ['*'], 'category_page', $categoryPage),
            'products'   => Product::paginate(50, ['*'], 'product_page', $productPage),
        ]);
    }
}
