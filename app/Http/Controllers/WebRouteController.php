<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\User;
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

        $productsData = Product::paginate(50, ['*'], 'product_page', $productPage);
        $productsData->getCollection()->transform(function ($product) {
            $product->image = $product->image ? asset("storage/{$product->image}") : null;
            return $product;
        });

        return Inertia::render('Welcome/Welcome', [
            'categories' => Category::paginate(100, ['*'], 'category_page', $categoryPage),
            'products'   => $productsData,
        ]);
    }
    public function productShow(Request $request, $slug)
    {
        $product        = Product::where('slug', $slug)->firstOrFail();
        $product->image = $product->image ? asset("storage/{$product->image}") : null;

        $category        = Category::find($product->category_id);
        $category->image = $category->image ? asset("storage/{$category->image}") : null;

        $productImages = ProductImage::where('product_id', $product->id)->get();
        $productImages->transform(function ($image) {
            $image->image = $image->image ? asset("storage/{$image->image}") : null;
            return $image;
        });
        $reviews = Review::where('product_id', $product->id)
            ->orderBy('rating', 'desc')     // sort by rating (highest first)
            ->orderBy('created_at', 'desc') // then by most recent
            ->get();

        $reviews->transform(function ($review) {
            $user = User::select('name', 'picture')->find($review->user_id);

            if ($user) {
                $user->picture = $user->picture ? asset("storage/{$user->picture}") : null;
                $review->user  = $user;
            }

            return $review;
        });

        // $this->image ? asset("storage/{$this->image}") : null
        return Inertia::render('Product/ProductDetails', [
            'product'       => $product,
            'category'      => $category,
            'productImages' => $productImages,
            'reviews'       => $reviews,
        ]);
    }
}
