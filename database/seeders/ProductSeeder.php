<?php
namespace Database\Seeders; // Or App\Http\Controllers for a controller

use App\Models\Category;
use App\Models\Product; // Make sure to import Category and Product models
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;    // Laravel's HTTP client (built on Guzzle)
use Illuminate\Support\Facades\Storage; // For saving to disk
use Illuminate\Support\Str;
// For generating slugs and unique filenames

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $catCount           = fake()->numberBetween(5, 20);
        $productPerCategory = fake()->numberBetween(10, 20);
        for ($i = 1; $i <= $catCount; $i++) {
            $category = Category::create([
                'name'        => fake()->name(),
                'slug'        => fake()->slug(),
                'description' => fake()->words()[0],
            ]);
            for ($j = 1; $j <= $productPerCategory; $j++) {
                // $request->validate([
                //     'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                // ]);

                // if ($product->image) {
                //     Storage::delete('public/' . $product->image);
                // }

                                                               // $path           = $request->file('image')->store('products', 'public');
                                                               // $product->image = $path;
                                                               // $product->save();
                                                               // https://picsum.photos/1080/1080 i need to fetch this image ad save
                $imageUrl = 'https://picsum.photos/1080/1080'; // Random image for testing

                // 1. Fetch the image content
                try {
                    $response = Http::get($imageUrl);

                    if ($response->successful()) {
                        $imageContent = $response->body();

                                            // 2. Generate a unique filename and path
                                            // You can extract the extension from the content type, or just assume .jpg
                        $extension = 'jpg'; // Common for picsum, or parse from Content-Type header if reliable
                        if ($response->hasHeader('Content-Type')) {
                            $contentType = $response->header('Content-Type');
                            if (Str::contains($contentType, 'image/jpeg')) {
                                $extension = 'jpg';
                            } elseif (Str::contains($contentType, 'image/png')) {
                                $extension = 'png';
                            }
                            // Add more types as needed
                        }

                        $filename = 'products/' . Str::uuid() . '.' . $extension; // e.g., products/a1b2c3d4-e5f6-...jpg

                        // 3. Save the image to storage/app/public
                        Storage::disk('public')->put($filename, $imageContent);

                        // Now create the product with the saved image path
                        Product::create([
                            'category_id'    => $category->id,
                            'name'           => fake()->words(rand(2, 4), true),                                     // More realistic product name
                            'slug'           => Str::slug(fake()->words(rand(2, 4), true)) . '-' . rand(1000, 9999), // Ensure unique slug
                            'description'    => fake()->paragraph(2),                                                // More realistic description
                            'price'          => fake()->randomFloat(2, 10, 1000),                                    // Price with 2 decimal places
                            'stock_quantity' => fake()->numberBetween(0, 50),
                            'image'          => $filename, // Save the path to the database
                            'is_featured'    => fake()->boolean(),
                        ]);

                        $this->command->info('Product created with fetched image: ' . $filename);

                    } else {
                        $this->command->error('Failed to fetch image from URL: ' . $imageUrl . ' Status: ' . $response->status());
                    }
                } catch (\Exception $e) {
                    $this->command->error('Error fetching or saving image: ' . $e->getMessage());
                }
            }
        }
    }
}
