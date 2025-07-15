<?php
namespace App\Http\Controllers;

use App\Http\Resources\CategoriesIndexResource;
use App\Http\Resources\ProductIndexResource;
use App\Models\Category;
use App\Models\Product;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoriesIndexResource::collection(Category::paginate());
    }
    public function show($slug)
    {
        $category = Category::where("slug", $slug)->firstOrFail();
        $products = Product::
            where("category_id", $category->id)->inRandomOrder();
            // ->with('category')
            // ->with('reviews');
        return ProductIndexResource::collection($products->paginate(10));
    }
}
