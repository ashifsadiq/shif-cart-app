<?php
namespace Database\Seeders;

use App\Models\Addresses;
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
        User::query()->truncate();
        Addresses::query()->truncate();
        Storage::disk('public')->deleteDirectory('users');

        $userGenerateCount = fake()->numberBetween(5, 50);
        $gender            = fake()->randomElement(['male', 'female']);
        $picture           = null;

        while ($picture === null) {
            $picture = $this->fetchAndSaveImage('users', 'https://xsgames.co/randomusers/avatar.php?g=' . $gender);
        }

        $this->command->info("Generate default user");
        User::firstOrCreate(['email' => 'test@example.com'], [
            'name'              => fake()->name($gender),
            'password'          => Hash::make('password'),
            'picture'           => $picture,
            'email_verified_at' => now(),
        ]);

        for ($userIndex = 1; $userIndex <= $userGenerateCount; $userIndex++) {
            $this->command->info('GET:USER https://randomuser.me/api/');
            $response = Http::get('https://randomuser.me/api/');

            if ($response->ok()) {
                $userData = $response->json()['results'][0];
                $name     = $userData['name']['first'] . ' ' . $userData['name']['last'];
                $email    = $userData['email'];
                $gender   = $userData['gender'];
                $picture  = null;

                while ($picture === null) {
                    $picture = $this->fetchAndSaveImage('users', 'https://xsgames.co/randomusers/avatar.php?g=' . $gender);
                }

                $createdUser = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'name'              => $name,
                        'password'          => Hash::make('password'),
                        'role'              => 'customer',
                        'picture'           => $picture,
                        'email_verified_at' => now(),
                    ]
                );

                $addressCount = fake()->numberBetween(1, 5);

                for ($addrIndex = 1; $addrIndex <= $addressCount; $addrIndex++) {
                    $this->command->info('GET:ADDRESS https://randomuser.me/api/');
                    $addressResponse = Http::get('https://randomuser.me/api/');
                    $addressData     = $addressResponse->json()['results'][0];

                    Addresses::create([
                        'user_id' => $createdUser->id,
                        'name'    => $createdUser->name,
                        'phone'   => $addressData['phone'],
                        'address' => 'No. ' . $addressData['location']['street']['number'] . ' ' . $addressData['location']['street']['name'],
                        'state'   => $addressData['location']['state'],
                        'city'    => $addressData['location']['city'],
                        'pincode' => $addressData['location']['postcode'],
                    ]);
                }

                $this->command->info("Generated $email - $name | $userIndex / $userGenerateCount");
            }
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
