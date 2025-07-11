<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Http\Resources\CategoriesIndexResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoriesIndexResource::collection(Category::paginate());
    }
    public function show($slug)
    {
        $category = Category::where("slug", $slug)->firstOrFail();
        $products = Product::where("category_id", $category->id);
        return ProductResource::collection($products->paginate(10));
    }
}
