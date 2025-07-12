<?php
namespace App\Services\Products;

use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductIndexResource;
use App\Models\Product;
use App\Models\RecentlyViewedProduct;
use App\Services\DashboardServices;
use Illuminate\Http\Request;

class ProductService
{
    protected $dashboardServices;
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->dashboardServices = new DashboardServices();
    }
    public function index(Request $request)
    {
        $products = Product::query();
        // RecentlyViewedProduct::with('product')
        //     ->where('user_id', auth()->id())
        //     ->orderByDesc('viewed_at')
        //     ->limit(10)
        //     ->get()
        //     ->pluck('product');
        // Search functionality
        if ($search = $request->query('search')) {
            $products->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        // Filtering by category
        if ($category_id = $request->query('category_id')) {
            $products->where('category_id', $category_id);
        }

        // Sorting
        if ($sortBy = $request->query('sortBy')) {
            $sortOrder = $request->query('sortOrder', 'asc');
            $products->orderBy($sortBy, $sortOrder);
        }
        return ProductIndexResource::collection($products->paginate(12));
    }
    public function show(Product $product)
    {
        if (auth()->check()) {
            RecentlyViewedProduct::updateOrCreate(
                [
                    'user_id'    => auth()->id(),
                    'product_id' => $product->id,
                ],
                [
                    'viewed_at' => now(),
                ]
            );
        }
        $product->load(['images', 'reviews.user']);
        $product->loadMissing(['cartItem']);
        return new ProductDetailResource($product);

    }
}
