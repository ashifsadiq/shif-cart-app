<?php
namespace App\Http\Controllers;

use App\Http\Resources\CartItemIndexResource;
use App\Models\Addresses;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;


class CartController extends Controller
{
    public function proceedOrder(Request $request,$order_number)
    {
        $addressController = new AddressController();
        $address = $addressController->userAddress($request);
        return Inertia::render('Cart/ProceedOrder', [
            'address' => $address,
            'order_id'=>$order_number
        ]);
    }
    public function placeOrder(Request $request)
    {
        // Validate request data
        $validated = $request->validate([
            'address_id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($request) {
                    if (! Addresses::where('id', $value)
                        ->where('user_id', $request->user()->id)
                        ->exists()) {
                        $fail('The selected address is invalid.');
                    }
                },
            ],
            'order_id'   => [
                'required',
                'exists:orders,order_number',
                function ($attribute, $value, $fail) use ($request) {
                    $order = Order::where('order_number', $value)
                        ->where('user_id', $request->user()->id)
                        ->first();
                    if (! $order || $order->status !== Order::STATUS_PENDING) {
                        $fail('The order is invalid or cannot be placed.');
                    }
                },
            ],
        ]);

        // Start database transaction
        DB::beginTransaction();

        try {
            // Find the order and lock it for update
            /** @var Order $order */
            $order = Order::where('order_number', $validated['order_id'])
                ->where('user_id', $request->user()->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Enforce business logic: Only pending orders can be placed
            if ($order->status !== Order::STATUS_PENDING) {
                return response()->json([
                    'message' => 'Order cannot be placed.',
                    'errors'  => ['order_id' => ['This order cannot be placed.']],
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // Attach the address and mark as placed
            $order->address_id = $validated['address_id'];
            $order->status     = Order::STATUS_PLACED;
            $order->save();

            // Commit transaction
            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully!',
                'order'   => $order->only(['order_number', 'status', 'address_id', 'created_at']),
            ], 200);

        } catch (\Exception $e) {
            // Rollback on error
            DB::rollBack();
            Log::error('Failed to place order: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to place order. Please try again.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
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
        $responseData = [
            'no_of_items' => $cartItems->count(),
        ];

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
        if ($request->expectsJson()) {
            return response()->json($responseData); // API response
        }
        return Inertia::render('Cart/CartDetails', $responseData);
    }
}
