<?php
namespace Database\Seeders;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testUserEmail = 'test@example.com';
        $user        = User::where('email', "=", $testUserEmail)->first();
        $countRandom = fake()->numberBetween(5, 50);
        for ($i = 1; $i <= $countRandom; $i++) {
            $product  = Product::inRandomOrder()->first();
            $quantity = fake()->numberBetween(1, 99);
            CartItem::createOrFirst([
                'user_id'    => $user->id,
                'product_id' => $product->id,
            ], [
                'quantity' => 1,
            ]);
            $this->command->info("$i/$countRandom - CartItem::create $product->id - $testUserEmail");
        }
    }
}
