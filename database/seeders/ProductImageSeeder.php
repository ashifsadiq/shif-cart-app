<?php
namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductImageSeeder extends Seeder
{
    private function fetchAndSaveImage(string $folder): ?string
    {
        $imageUrl = 'https://picsum.photos/2160/2160';

        try {
            $response = Http::get($imageUrl);

            if ($response->successful()) {
                $imageContent = $response->body();

                // Determine extension
                $extension   = 'jpg';
                $contentType = $response->header('Content-Type');
                if (Str::contains($contentType, 'png')) {
                    $extension = 'png';
                }

                // Ensure directory exists
                Storage::disk('public')->makeDirectory($folder);

                // Generate filename
                $filename = Str::uuid() . '.' . $extension;
                $filePath = $folder . '/' . $filename;

                // Store image
                Storage::disk('public')->put($filePath, $imageContent);

                return $filePath;
            } else {
                $this->command->error("Failed to fetch image from $imageUrl");
            }
        } catch (\Exception $e) {
            $this->command->error("Image fetch error: " . $e->getMessage());
        }

        return null;
    }
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        // Make sure storage directory exists

        $products = Product::all();

        foreach ($products as $product) {
            // Generate a random number of images (0–5)
            $imageCount = rand(0, 5);

            for ($i = 0; $i < $imageCount; $i++) {
                $this->command->info("Crating image for ID: " . $product->id ." of ". count($products). " - (" . $i + 1 . "/$imageCount)");
                // Generate fake image content
                $filePath = $this->fetchAndSaveImage("products/{$product->id}");
                if ($filePath) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $filePath,
                        'position'   => $i,
                    ]);
                }
            }
        }
    }
}
