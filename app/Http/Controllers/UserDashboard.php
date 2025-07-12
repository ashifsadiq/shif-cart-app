<?php
namespace App\Http\Controllers;

use App\Services\DashboardServices;
use Illuminate\Http\Request;

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
        $availableSections = [
            'categories'  => fn()  => $this->dashboardServices->categories(),
            'topProducts' => fn() => $this->dashboardServices->topProducts(),
            'newItems'    => fn()    => $this->dashboardServices->newItems(),
            'flashSale'   => fn()   => $this->dashboardServices->flashSaleProducts(),
            'mostPopular' => fn() => $this->dashboardServices->mostPopular(),
            'justForYou'  => fn()  => $this->dashboardServices->justForYou(),
        ];

        $requested = $request->query(); // get query params
        $response  = [];

        // If no specific keys are requested, return all
        if (empty($requested)) {
            foreach ($availableSections as $key => $callback) {
                $response[$key] = $callback();
            }
            return response()->json($response);
        }

        // Otherwise, return only requested keys
        foreach ($availableSections as $key => $callback) {
            if ($request->has($key)) {
                $response[$key] = $callback();
            }
        }

        return response()->json($response);
    }

    public function profile(Request $request)
    {

        return response()->json([
            'user'                   => $this->dashboardServices->userDetails($request),
            'recentlyViewedProducts' => $this->dashboardServices->getAuthenticatedUserRecentlyViewedProducts($request->user()),
            'orderStatus'            => $this->dashboardServices->orderStatus($request),
            'newItems'               => $this->dashboardServices->newItems(),
            'mostPopular'            => $this->dashboardServices->mostPopular(),
            'categories'             => $this->dashboardServices->categories(),
            'flashSale'              => $this->dashboardServices->flashSaleProducts(),
            'topProducts'            => $this->dashboardServices->topProducts(),
            'justForYou'             => $this->dashboardServices->justForYou(),
        ]);
    }
}
