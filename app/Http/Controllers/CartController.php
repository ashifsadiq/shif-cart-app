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
        $cartItems = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->quantity * ($item->product->price ?? 0);
        });

        return response()->json([
            'items' => CartItemIndexResource::collection($cartItems),
            'total' => round($total, 2), // 2 decimal precision
        ]);
    }
}
