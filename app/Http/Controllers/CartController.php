<?php
namespace App\Http\Controllers;

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

        return response()->json(['message' => 'Added to cart']);
    }
}
