<?php
namespace App\Http\Controllers;

use App\Services\DashboardServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class UserDashboard extends Controller
{
    protected $dashboardServices;
    protected $flashSale;
    public function __construct(DashboardServices $DashboardServices)
    {
        $this->dashboardServices = $DashboardServices;
    }
    public function dashboard(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            // Find the token
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken) {
                $user = $accessToken->tokenable;

                // Optionally log in the user for this request
                Auth::setUser($user);
            }
        }
        // $recentlyViewedService = [];
        // if (Auth::check()) {
        //     $user                  = Auth::user()->id;
        //     $recentlyViewedService = $this->recentlyViewedService->getAuthenticatedUserRecentlyViewedProducts(
        //         $request->user()
        //     );
        // }
        return response()->json([
            'categories'  => $this->dashboardServices->categories(),
            'topProducts'  => $this->dashboardServices->topProducts(),
            'newItems'    => $this->dashboardServices->newItems(),
            'flashSale'   => $this->dashboardServices->flashSaleProducts(),
            'mostPopular' => $this->dashboardServices->mostPopular(),
            'justForYou'  => $this->dashboardServices->justForYou(),
        ]);

    }
    public function profile(Request $request)
    {

        return response()->json([
            'user'                   => $this->dashboardServices->userDetails($request),
            'recentlyViewedProducts' => $this->dashboardServices->getAuthenticatedUserRecentlyViewedProducts($request->user()),
            'orderStatus'=> $this->dashboardServices->orderStatus($request),
            'newItems'    => $this->dashboardServices->newItems(),
            'mostPopular' => $this->dashboardServices->mostPopular(),
            'categories'  => $this->dashboardServices->categories(),
            'flashSale'   => $this->dashboardServices->flashSaleProducts(),
            'topProducts'  => $this->dashboardServices->topProducts(),
            'justForYou'  => $this->dashboardServices->justForYou(),
        ]);
    }
}
