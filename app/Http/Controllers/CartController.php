<?php
namespace App\Http\Controllers;

use App\Http\Resources\CartItemIndexResource;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity'   => ['nullable', 'integer', 'min:1'],
        ]);

        $productId = $validated['product_id'];
        $qty       = $validated['quantity'] ?? 1;
        $userId    = auth()->id();

        $item = CartItem::firstOrNew([
            'user_id'    => $userId,
            'product_id' => $productId,
        ]);

        $item->quantity += $qty;
        $item->save();

        return response()->json(['message' => 'Added to cart', 'item' => $item]);
    }
    public function update(Request $request)
    {}
    public function remove(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $userId = auth()->id();

        $item = CartItem::where('user_id', $userId)
            ->where('product_id', $validated['product_id'])
            ->first();

        if (! $item) {
            return response()->json([
                'message' => 'No cart item found for this product.',
            ], 404);
        }

        if ($item->quantity > 1) {
            $item->decrement('quantity');
            $message = 'Cart item quantity reduced by 1.';
        } else {
            $item->delete();
            $item = [
                'quantity' => 0,
            ];
            $message = 'Cart item removed completely.';
        }

        return response()->json([
            'message' => $message,
            'item'    => $item,
        ]);
    }
    public function getCart(Request $request)
    {
        // Get query parameters
        $getOnlyTotal = $request->query('total_only');
        $getOnlyItems = $request->query('items_only');

        // Initialize variables for response data
        $cartItems = null;
        $total     = null;

        // Fetch cart items only if 'items_only' is not requested OR
        // if neither 'total_only' nor 'items_only' are requested (i.e., return all)
        if (! $getOnlyTotal || $getOnlyItems) {
            $cartItems = CartItem::with('product')
                ->where('user_id', auth()->id())
                ->latest()
                ->get();
        }

        // Calculate total only if 'total_only' is requested OR
        // if neither 'total_only' nor 'items_only' are requested (i.e., return all)
        if (! $getOnlyItems || $getOnlyTotal) {
            // If cartItems were not fetched already (because only total was requested), fetch them now.
            // This avoids fetching them twice if both are requested, and ensures they are fetched if only total is needed.
            if (is_null($cartItems)) {
                $cartItems = CartItem::with('product')
                    ->where('user_id', auth()->id())
                    ->latest()
                    ->get();
            }

            $total = $cartItems->sum(function ($item) {
                // Ensure product exists before accessing price
                return $item->quantity * ($item->product->price ?? 0);
            });
        }

        // Prepare the response array dynamically
        $responseData = [];

        if ($cartItems && ! $getOnlyTotal) { // If items were fetched and total_only is not true
            $responseData['items'] = CartItemIndexResource::collection($cartItems);
        }

        if (! is_null($total) && ! $getOnlyItems) { // If total was calculated and items_only is not true
            $responseData['total'] = number_format($total, 2, '.', ',');
        }

        // If no specific request (e.g., neither total_only nor items_only), ensure both are returned
        if (! $getOnlyTotal && ! $getOnlyItems) {
            if (empty($responseData['items']) && ! is_null($cartItems)) { // Ensure items are there if not already added
                $responseData['items'] = CartItemIndexResource::collection($cartItems);
            }
            if (empty($responseData['total']) && ! is_null($total)) { // Ensure total is there if not already added
                $responseData['total'] = number_format($total, 2, '.', ',');
            }
        }

        return response()->json($responseData);
    }
}
