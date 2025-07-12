<?php
namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductIndexResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\RecentlyViewedProduct;
use App\Services\Products\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected $productService;
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->productService = new ProductService();
    }
    public function index(Request $request)
    {
        $data           = $this->productService->index($request);
        //     $products       = Product::query();
        // $recentProducts = RecentlyViewedProduct::with('product')
        //     ->where('user_id', auth()->id())
        //     ->orderByDesc('viewed_at')
        //     ->limit(10)
        //     ->get()
        //     ->pluck('product');
        // // Search functionality
        // if ($search = $request->query('search')) {
        //     $products->where('name', 'like', "%{$search}%")
        //         ->orWhere('description', 'like', "%{$search}%");
        // }

        // // Filtering by category
        // if ($category_id = $request->query('category_id')) {
        //     $products->where('category_id', $category_id);
        // }

        // // Sorting
        // if ($sortBy = $request->query('sortBy')) {
        //     $sortOrder = $request->query('sortOrder', 'asc');
        //     $products->orderBy($sortBy, $sortOrder);
        // }
        return $data;
    }
    public function adminIndex(Request $request)
    {
        $CategoryController = new CategoryController;
        $category           = $CategoryController->index($request);
        return Inertia::render('admin/products/Products', [
            'products' => $this->index($request),
            'category' => $category,
        ]);
    }

    public function store(ProductStoreRequest $request)
    {
        $product = Product::create($request->validated());
        return new ProductResource($product);
    }

    public function show(Product $product)
    {
        return $this->productService->show($product);
    }

    public function update(ProductUpdateRequest $request, Product $product)
    {
        $product->update($request->validated());
        return new ProductResource($product);
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::delete('public/' . $product->image);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function uploadImage(Request $request, Product $product)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($product->image) {
            Storage::delete('public/' . $product->image);
        }

        $path           = $request->file('image')->store('products', 'public');
        $product->image = $path;
        $product->save();

        return response()->json(['message' => 'Image uploaded successfully', 'image_url' => Storage::url($path)]);
    }
}
