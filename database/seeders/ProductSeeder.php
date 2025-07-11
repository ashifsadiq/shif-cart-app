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
        // https://dummyjson.com/products/categories -> name, slug, description, image
        $categoryRequest = Http::get('https://dummyjson.com/products/categories');
        if ($categoryRequest->ok()) {
            $categories = $categoryRequest->json();
            foreach ($categories as $categoryJson) {
                $categoryImage = null;
                $category      = Category::create([
                    'name'        => $categoryJson['name'],
                    'slug'        => $categoryJson['slug'],
                    'description' => "Sample product under the " . $categoryJson['name'] . " category.",
                    'image'       => $categoryImage,
                ]);
                $productsByCategoryRequest = Http::get($categoryJson['url']);
                if ($productsByCategoryRequest->ok()) {
                    $products           = $productsByCategoryRequest->json();
                    $categoryImageIndex = fake()->numberBetween(0, count($products['products']) - 1);
                    $dollarsValue       = fake()->numberBetween(1, 20);
                    foreach ($products['products'] as $productIndex => $productJson) {
                        $price        = $productJson['price'] * $dollarsValue;
                        $mrp          = $price / (1 - ($productJson['discountPercentage'] / 100));
                        $productImage = null;
                        while ($productImage === null) {
                            $productImage = $this->fetchAndSaveImage(
                                'products',
                                $productJson['images'][0]
                            );
                        }
                        if ($productIndex === $categoryImageIndex) {
                            $category->image = $productImage;
                            $category->save();
                        }
                        $product = Product::create([
                            'category_id'    => $category->id,
                            'name'           => ucwords($productJson['title']),
                            'slug'           => Str::slug($productJson['title']) . '-' . rand(1000, 9999),
                            'description'    => $productJson['description'],
                            'price'          => $price,
                            'mrp'            => $mrp,
                            'stock_quantity' => fake()->numberBetween(0, 50),
                            'image'          => $productImage,
                            'is_featured'    => fake()->boolean(),
                            'rating'         => fake()->numberBetween(0, 5),
                        ]);
                        foreach ($productJson['images'] as $i => $imageUrl) {
                            if ($i === 0) {
                                continue;
                            }
                            // 👈 skip the first image

                            $filePath = $this->fetchAndSaveImage("products/{$product->id}", $imageUrl);

                            if ($filePath) {
                                ProductImage::create([
                                    'product_id' => $product->id,
                                    'image'      => $filePath,
                                    'position'   => $i - 1, // optional: adjust position index if needed
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
                        $allReviews = Review::where('product_id', $product->id)->get();
                        $product->rating       = round($allReviews->avg('rating'), 1);
                        $product->rating_count = $allReviews->count();
                        $product->save();
                    }
                } else {
                    $this->command->error('Failed to fetch products data for ' . $categoryJson['name']);
                }
            }

            $this->command->info(count($categories) . ' dummy products created.');
        } else {
            $this->command->error('Failed to fetch category data.');
        }
    }

    /**
     * Fetches a random image from picsum and stores it in storage.
     * Returns the relative path or null on failure.
     */
    private function fetchAndSaveImage(string $folder, string $imageUrl = 'https://picsum.photos/2160/2160'): ?string
    {
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
