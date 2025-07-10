<?php
namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Storage::disk('public')->deleteDirectory('products');
        Storage::disk('public')->deleteDirectory('categories');
        $maxCatCount                = 30;
        $maxProductCountPerCategory = 45;
        $catCount                   = fake()->numberBetween(1, $maxCatCount);
        $productPerCategory         = null;
        for ($i = 1; $i <= $catCount; $i++) {
            $productPerCategory = fake()->numberBetween(1, $maxProductCountPerCategory);
            $this->command->warn("Starting seeding with $catCount categories, each with $productPerCategory products.");
            $this->command->info("Creating category $i/$catCount... [" . ($catCount - $i) . " left]");

            $categoryImage = $this->fetchAndSaveImage('categories');
            while ($categoryImage === null) {
                $categoryImage = $this->fetchAndSaveImage('categories');
            }
            $category = Category::create([
                'name'        => fake()->name(),
                'slug'        => fake()->slug(),
                'description' => fake()->words(fake()->numberBetween(3, 10), true),
                'image'       => $categoryImage,
            ]);
            $this->command->info("→ Category created with image: $categoryImage");

            for ($j = 1; $j <= $productPerCategory; $j++) {
                $mrp   = fake()->randomFloat(2, 100, 1000);
                $price = round($mrp * fake()->randomFloat(2, 0.5, 0.95), 2);
                $this->command->info("   Creating product $j/$productPerCategory for category \"{$category->name}\"... [" . ($productPerCategory - $j) . "/$productPerCategory left ($i/$catCount category)]");

                $productImage = null;
                while ($productImage === null) {
                    $productImage = $this->fetchAndSaveImage('products');
                }

                if ($productImage) {
                    $productTitle = fake()->words(rand(2, 20), true);
                    $product      = Product::create([
                        'category_id'    => $category->id,
                        'name'           => ucwords($productTitle),
                        'slug'           => Str::slug($productTitle) . '-' . rand(1000, 9999),
                        'description'    => fake()->words(fake()->numberBetween(3, 1000), true),
                        'price'          => $price,
                        'mrp'            => $mrp,
                        'stock_quantity' => fake()->numberBetween(0, 50),
                        'image'          => $productImage,
                        'is_featured'    => fake()->boolean(),
                        'rating'         => fake()->numberBetween(0, 5),
                    ]);
                    $imageCount = rand(0, 5);
                    for ($i = 0; $i < $imageCount; $i++) {
                        $filePath = $this->fetchAndSaveImage("products/{$product->id}");
                        if ($filePath) {
                            ProductImage::create([
                                'product_id' => $product->id,
                                'image'      => $filePath,
                                'position'   => $i,
                            ]);
                        }
                    }
                    $reviewCount = rand(0, 100);

                    for ($i = 1; $i <= $reviewCount; $i++) {
                        $user = User::inRandomOrder()->first();

                        if (! $user) {
                            $this->command->warn("No users found, skipping review generation.");
                            continue;
                        }

                        $this->command->info("Creating review $i/$reviewCount for {$product->name} by {$user->name}");

                        Review::create([
                            'user_id'    => $user->id,
                            'product_id' => $product->id,
                            'rating'     => fake()->numberBetween(1, 5),
                            'title'      => ucwords(fake()->words(rand(2, 8), true)),
                            'comment'    => fake()->boolean(80) // 80% chance to have a comment
                            ? fake()->sentence(rand(5, 20))
                            : null,
                        ]);
                    }

                    // $this->command->info("   → Product created with image: $productImage");
                }
            }
        }

        $this->command->info("✅ Seeding completed: $catCount categories and " . ($catCount * $productPerCategory) . " products created.");
    }

    /**
     * Fetches a random image from picsum and stores it in storage.
     * Returns the relative path or null on failure.
     */
    private function fetchAndSaveImage(string $folder): ?string
    {
        $imageUrl = 'https://picsum.photos/2160/2160';
        try {
            $response = Http::get($imageUrl);
            if ($response->successful()) {
                $imageContent = $response->body();

                $extension = 'jpg';
                if ($response->hasHeader('Content-Type')) {
                    $contentType = $response->header('Content-Type');
                    if (Str::contains($contentType, 'png')) {
                        $extension = 'png';
                    }
                }

                $filename = $folder . '/' . Str::uuid() . '.' . $extension;
                Storage::disk('public')->put($filename, $imageContent);
                $this->command->info('Saving images in ' . $filename);
                return $filename;
            } else {
                $this->command->error("Failed to fetch image from $imageUrl");
            }
        } catch (\Exception $e) {
            $this->command->error("Image fetch error: " . $e->getMessage());
        }

        return null;
    }
}
