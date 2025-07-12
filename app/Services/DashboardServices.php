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
    public function categories(): Collection
    {
        return Category::inRandomOrder()
            ->with(['products' => function ($query) {
                $query->inRandomOrder()->limit(4);
            }])
            ->limit(5)
            ->get()
            ->map(function ($category) {
                return [
                    'name'   => $category->name,
                    'images' => $category->products->pluck('image')->toArray(), // assuming 'image' column
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
        return Product::latest()->limit(5)->get()
            ->map(function ($product) {
                return new ProductIndexResource($product);
            });
    }
    public function flashSaleProducts(): Collection
    {
        $flashSaleProducts = Product::orderBy('rating_count', 'desc')
            ->orderBy('rating', 'desc')
            ->orderBy('discount', 'desc')
            ->orderBy('sales', 'desc')
            ->inRandomOrder()
            ->limit(5)
            ->get();
        return $flashSaleProducts->map(function ($product) {
            return new ProductIndexResource($product);
        });
    }
    public function mostPopular(): Collection
    {
        $mostPopular = Product::orderBy('sales', 'desc')->inRandomOrder()->limit(5)->get();

        return $mostPopular->map(function ($product) {
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
