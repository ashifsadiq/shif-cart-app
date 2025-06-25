<?php
namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query();

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

        return ProductResource::collection($products->paginate(12));
    }
    public function adminIndex(Request $request){
        return Inertia::render('admin/products/Products',[
            'products'=> $this->index($request)
        ]);
    }

    public function store(ProductStoreRequest $request)
    {
        $product = Product::create($request->validated());
        return new ProductResource($product);
    }

    public function show(Product $product)
    {
        return new ProductResource($product);
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
