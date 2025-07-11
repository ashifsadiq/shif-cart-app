<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userGenerateCount = fake()->numberBetween(5, 500);
        $gender            = fake()->randomElement(['male', 'female']);
        $picture           = null;
        while ($picture === null) {
            $picture = $this->fetchAndSaveImage('users', 'https://xsgames.co/randomusers/avatar.php?g=' . $gender);
        }
        User::firstOrCreate(['email' => 'test@example.com'], [
            'name'              => fake()->name($gender),
            'password'          => Hash::make('password'),
            'role'              => 'customer',
            'picture'           => $picture,
            'email_verified_at' => now(),
        ]);
        for ($i = 1; $i <= $userGenerateCount; $i++) {
            $gender = fake()->randomElement(['male', 'female']);

            $picture = null;
            while ($picture === null) {
                $picture = $this->fetchAndSaveImage('users', 'https://xsgames.co/randomusers/avatar.php?g=' . $gender);
            }

            $email = fake()->unique()->safeEmail();

            User::firstOrCreate(
                ['email' => $email],
                [
                    'name'              => fake()->name($gender),
                    'password'          => Hash::make('password'),
                    'role'              => 'customer',
                    'picture'           => $picture,
                    'email_verified_at' => now(),
                ]
            );

            $this->command->info("Generated $i / $userGenerateCount");
        }
    }
    private function fetchAndSaveImage(string $folder, string $imageUrl): ?string
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
    }
}
