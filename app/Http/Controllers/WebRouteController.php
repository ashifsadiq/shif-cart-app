<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductIndexResource;
use App\Models\Category;
use App\Models\Product;
use App\Services\DashboardServices;
use App\Services\Products\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebRouteController extends Controller
{
    protected $productService;
    protected $dashboardServices;
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->dashboardServices = new DashboardServices();
        $this->productService    = new ProductService();
    }
    public function index(Request $request)
    {
        $categoryPage = $request->input('category_page', 1);
        $productPage  = $request->input('product_page', 1);
        $randomCount  = rand(5, 15); // e.g., fetch between 5 to 15 products

        $products = Product::inRandomOrder()
            ->limit($randomCount)
            ->get();
        $productsData = ProductIndexResource::collection($products);
        return Inertia::render('Welcome/Welcome', [
            'categories' => Category::paginate(100, ['*'], 'category_page', $categoryPage),
            'products'   => $productsData,
        ]);
    }
    public function productShow(Request $request, $slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $show    = $this->productService->show($product)->toArray($request);
        $productService = $this->productService->show($product);
        return Inertia::render('Product/ProductDetails', $productService->toArray($request));
        // $product->image = $product->image ? asset("storage/{$product->image}") : null;

        // $category        = Category::find($product->category_id);
        // $category->image = $category->image ? asset("storage/{$category->image}") : null;

        // $productImages = ProductImage::where('product_id', $product->id)->get();
        // $productImages->transform(function ($image) {
        //     $image->image = $image->image ? asset("storage/{$image->image}") : null;
        //     return $image;
        // });
        // $reviews = Review::where('product_id', $product->id)
        //     ->orderBy('rating', 'desc')     // sort by rating (highest first)
        //     ->orderBy('created_at', 'desc') // then by most recent
        //     ->get();

        // $reviewsSchema = [];

        // $reviews->transform(function ($review) use (&$reviewsSchema) {
        //     $user = User::select('name', 'picture')->find($review->user_id);

        //     $reviewSchema = [
        //         "@type"         => "Review",
        //         "datePublished" => $review->created_at->toDateString(), // use actual date
        //         "name"          => $review->title,
        //         "reviewBody"    => $review->comment,
        //         "reviewRating"  => [
        //             "@type"       => "Rating",
        //             "bestRating"  => "5",
        //             "ratingValue" => $review->rating,
        //             "worstRating" => "1",
        //         ],
        //     ];

        //     if ($user) {
        //         $user->picture          = $user->picture ? asset("storage/{$user->picture}") : null;
        //         $review->user           = $user;
        //         $reviewSchema['author'] = $user->name;
        //     }

        //     $reviewsSchema[] = $reviewSchema;
        //     return $review;
        // });
        // $MetaTags = [
        //     // Basic SEO
        //     '<title>Buy ' . $product->name . ' at Best Price | ' . config('app.name') . '</title>',
        //     '<meta name="description" content="' . Str::limit($product->description, 150) . '">',
        //     '<link rel="canonical" href="' . url()->current() . '">',
        //     // Open Graph Tags
        //     '<meta property="og:type" content="product">',
        //     '<meta property="og:title" content="Buy ' . $product->name . ' | ' . config('app.name') . '">',
        //     '<meta property="og:description" content="' . Str::limit($product->description, 150) . '">',
        //     '<meta property="og:url" content="' . url()->current() . '">',
        //     '<meta property="og:image" content="' . $product->image . '">',
        //     '<meta property="og:site_name" content="' . config('app.name') . '">',

        //     // Twitter Card Tags
        //     '<meta name="twitter:card" content="summary_large_image">',
        //     '<meta name="twitter:title" content="Buy ' . $product->name . '">',
        //     '<meta name="twitter:description" content="' . Str::limit($product->description, 150) . '">',
        //     '<meta name="twitter:image" content="' . $product->image . '">',
        // ];
        // $schema = [
        //     "@context"    => "https://schema.org",
        //     "@type"       => "Product",
        //     "name"        => $product->name,
        //     "image"       => $product->image,
        //     "description" => Str::limit($product->description, 150),
        //     "review"      => $reviewsSchema,
        //     "category"    => $category->name,
        // ];
        // if ($product->price < $product->mrp) {
        //     $schema["offers"] = [
        //         "@type" => "Offer",
        //         "price" => number_format($product->price),
        //     ];
        // }
        // $this->image ? asset("storage/{$this->image}") : null
    }
}
