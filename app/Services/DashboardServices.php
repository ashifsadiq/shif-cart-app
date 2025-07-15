<?php
namespace App\Services;

use App\Http\Resources\ProductIndexResource;
use App\Http\Resources\UserResource;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\RecentlyViewedProduct;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class DashboardServices
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    public function getAvailableDiscountBuckets(): array
    {
        $discounts = Product::select('discount')
            ->where('discount', '>=', 10)
            ->pluck('discount')
            ->unique()
            ->sort()
            ->values();
        $data      = [];
        $discounts = $discounts->toArray();
        for ($i = 1; $i <= 9; $i++) {
            $array = [];
            $start = $i * 10;
            $end   = $start + 9;
            foreach ($discounts as $key => $value) {
                if (($value >= $start) && ($value <= $end)) {
                    array_push($array, $value);
                }
            }
            if (count($array)) {
                array_push($data, $start);
            }

        }
        return $data;
    }
    public function flashSaleProductsDetails(Request $request)
    {
        $selectedDiscount = $request->query('discount'); // ex: 10, 20, 30

        $query = Product::query();
        if ($selectedDiscount != null) {
            for ($i = 1; $i <= 9; $i++) {
                $start = $i * 10;
                $end   = $start + 9;
                if ($selectedDiscount == $start) {
                    $query->whereBetween('discount', [$start, $end]);
                }
            }
        }

        $products = $query->latest()->paginate(10);
        return response()->json([
            'offers'   => $this->getAvailableDiscountBuckets(),
            'products' => ProductIndexResource::collection($products),
        ]);
    }

    public function categories(): Collection
    {
        return Category::inRandomOrder()
            ->with(['products' => function ($query) {
                $query->inRandomOrder()->limit(4);
            }])
            ->limit(6)
            ->get()
            ->map(function ($category) {
                return [
                    'name'   => $category->name,
                    'id'     => $category->id,
                    'slug'     => $category->slug,
                    'images' => $category->products->pluck('image')->map(function ($image) {
                        return asset('storage/' . $image);
                    })->toArray(),
                ];
            });
    }
    public function topProducts(): Collection
    {
        return Product::orderBy('sales', 'desc')->limit(5)->get()
            ->map(function ($product) {
                return new ProductIndexResource($product);
            });
    }
    public function newItems(): Collection
    {
        return Product::latest()
            ->limit(50) // Get 50 latest products
            ->get()
            ->shuffle() // Shuffle them randomly
            ->take(5)   // Pick 5 random from the latest 50
            ->map(fn($product) => new ProductIndexResource($product));
    }
    public function flashSaleProducts(): Collection
    {
        $flashSaleProducts = Product::orderBy('rating_count', 'desc')
            ->orderBy('rating', 'desc')
            ->orderBy('discount', 'desc')
            ->orderBy('sales', 'desc')
            ->limit(5)
            ->get();
        return $flashSaleProducts->map(function ($product) {
            return new ProductIndexResource($product);
        });
    }
    public function mostPopular(): Collection
    {
        $topSelling = Product::orderBy('sales', 'desc')->limit(50)->get();

        return $topSelling->shuffle()->take(5)->map(function ($product) {
            return new ProductIndexResource($product);
        });
    }
    public function justForYou(): Collection
    {
        $mostPopular = Product::inRandomOrder()->limit(20)->get();

        return $mostPopular->map(function ($product) {
            return new ProductIndexResource($product);
        });
    }
    public function getRecentlyViewedProductsForUser(int $userId): Collection
    {
        $recentlyViewedProducts = RecentlyViewedProduct::where('user_id', $userId)
            ->with('product')
            ->orderBy('viewed_at', 'desc')
            ->inRandomOrder()
            ->limit(5)
            ->get()
            ->unique('product_id');

        return $recentlyViewedProducts->map(function ($recentlyViewed) {
            return new ProductIndexResource($recentlyViewed->product);
        });
    }

    /**
     * Get unique recently viewed products for the authenticated user,
     * sorted by their last viewed time, as ProductIndexResource.
     *
     * @return Collection<ProductIndexResource>
     */
    public function userDetails(Request $request): Collection
    {
        $user = null;

        $token = $request->bearerToken();
        if ($token) {
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken) {
                $user = $accessToken->tokenable;
                Auth::setUser($user);
            }
        }

        if (Auth::check()) {
            $user = Auth::user();
        }

        if ($user) {
            return collect([new UserResource($user)]);
        }

        return collect();
    }
    public function getAuthenticatedUserRecentlyViewedProducts($user): Collection
    {
        // This method assumes you're calling it from a context where Auth::id() is available,
        // typically a controller or middleware.
        if (auth()->check()) {
            return $this->getRecentlyViewedProductsForUser($user->id);
        }

        return collect(); // Return an empty collection if no user is authenticated
    }
    public function orderStatus(Request $request): Collection
    {
        $user = null;

        $token = $request->bearerToken();
        if ($token) {
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken) {
                $user = $accessToken->tokenable;
                Auth::setUser($user);
            }
        }

        if (Auth::check()) {
            $user = Auth::user();
        }

        $toPay             = Order::where('status', 'pending')->count() != 0;
        $toReceive         = Order::where('status', 'shipped')->count() != 0;
        $hasCompletedOrder = Order::where('status', 'completed')->count() > 0;
        $hasNoReviews      = Review::where('user_id', $user->id)->count() == 0;
        $toReview          = $hasCompletedOrder && $hasNoReviews;
        return collect([
            'toPay'     => $toPay,
            'toReceive' => $toReceive,
            'toReview'  => $toReview,
        ]);
    }
}
