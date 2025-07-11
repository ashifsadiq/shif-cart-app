<?php
namespace App\Http\Controllers;

use App\Http\Resources\OrderIndexResource;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', auth()->id())
            ->latest()
            // ->with(['items.product']) // eager load
            ->paginate(10);

        return OrderIndexResource::collection($orders);
    }
    public function show(Request $request)
    {
        return [];
    }
    public function store(Request $request)
    {
        $user = $request->user();

        // Load cart with product prices
        $cartItems = CartItem::with('product')
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty.',
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Calculate total
            $amount = $cartItems->sum(fn($item) =>
                $item->quantity * ($item->product->price ?? 0)
            );

            // Create the order
            $order = Order::create([
                'user_id'      => $user->id,
                'order_number' => strtoupper(Str::random(10)),
                'status'       => 'pending',
                'amount'       => $amount,
                'total'        => $amount, // Add tax/discount if needed
            ]);

            // Create order items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $item->product->price ?? 0,
                ]);
            }

            // Clear user's cart
            CartItem::where('user_id', $user->id)->delete();

            DB::commit();

            return response()->json([
                'message'      => 'Order placed successfully!',
                'order_id'     => $order->id,
                'order_number' => $order->order_number,
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Order failed!',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
    public function checkout(Request $request)
    {
        return [];
    }
    public function create(Request $request)
    {
        return [];
    }
    public function update(Request $request)
    {
        return [];
    }
    public function destroy(Request $request)
    {
        return [];
    }
}
