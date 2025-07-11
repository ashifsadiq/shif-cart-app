<?php
namespace Database\Seeders;

use App\Models\Product;
use App\Models\RecentlyViewedProduct;
use App\Models\User;
use Illuminate\Database\Seeder;

class RecentlyViewedProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countRandom = fake()->numberBetween(400, 10000);
        for ($i = 1; $i <= $countRandom; $i++) {
            $product = Product::inRandomOrder()->first();
            $user    = User::inRandomOrder()->first();
            RecentlyViewedProduct::updateOrCreate(
                [
                    'user_id'    => $user->id,
                    'product_id' => $product->id,
                ],
                [
                    'viewed_at' => now(),
                ]
            );
            $this->command->info("RecentlyViewedProduct for ".$i."/".$countRandom." - ".$product->name);
        }
    }
}
