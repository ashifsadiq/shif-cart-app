<?php
namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $catCount           = fake()->numberBetween(5, 20);
        $productPerCategory = fake()->numberBetween(10, 20);

        $this->command->info("Starting seeding with $catCount categories, each with $productPerCategory products.");

        for ($i = 1; $i <= $catCount; $i++) {
            $this->command->info("Creating category $i/$catCount... [" . ($catCount - $i) . " left]");

            $categoryImage = $this->fetchAndSaveImage('categories');
            $category      = Category::create([
                'name'        => fake()->name(),
                'slug'        => fake()->slug(),
                'description' => fake()->words(3, true),
                'image'       => $categoryImage,
            ]);
            $this->command->info("→ Category created with image: $categoryImage");

            for ($j = 1; $j <= $productPerCategory; $j++) {
                $this->command->info("   Creating product $j/$productPerCategory for category \"{$category->name}\"... [" . ($productPerCategory - $j) . " left]");

                $productImage = $this->fetchAndSaveImage('products');

                if ($productImage) {
                    Product::create([
                        'category_id'    => $category->id,
                        'name'           => fake()->words(rand(2, 4), true),
                        'slug'           => Str::slug(fake()->words(rand(2, 4), true)) . '-' . rand(1000, 9999),
                        'description'    => fake()->paragraph(2),
                        'price'          => fake()->randomFloat(2, 10, 1000),
                        'stock_quantity' => fake()->numberBetween(0, 50),
                        'image'          => $productImage,
                        'is_featured'    => fake()->boolean(),
                    ]);

                    $this->command->info("   → Product created with image: $productImage");
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
        $imageUrl = 'https://picsum.photos/1080/1080';
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
