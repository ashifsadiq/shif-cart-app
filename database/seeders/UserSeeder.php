<?php
namespace Database\Seeders;

use App\Models\Addresses;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
        $this->command->info(string: "Generate default user");
        User::firstOrCreate(['email' => 'test@example.com'], [
            'name'              => fake()->name($gender),
            'password'          => Hash::make('password'),
            'picture'           => $picture,
            'email_verified_at' => now(),
        ]);
        for ($i = 1; $i <= $userGenerateCount; $i++) {
            $this->command->info('GET:USER https://randomuser.me/api/');
            $user = Http::get('https://randomuser.me/api/');
            if ($user->ok()) {
                $user    = $user->json();
                $user    = $user['results'][0];
                $name    = $user['name']['first'] . "" . $user['name']['last'];
                $email   = $user['email'];
                $gender  = $user['gender'];
                $picture = null;
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
                for ($i = 1; $i <= $addressCount; $i++) {
                    $this->command->info('GET:ADDRESS https://randomuser.me/api/');
                    $user = Http::get('https://randomuser.me/api/');
                    $user    = $user->json();
                    $user    = $user['results'][0];
                    Addresses::create([
                        'user_id' => $createdUser->id,
                        'name'    => $createdUser->name,
                        'phone'   => $user['phone'],
                        'address' => 'No. ' . $user['location']['street']['number'] . ' ' . $user['location']['street']['name'],
                        'state'   => $user['location']['state'],
                        'city'    => $user['location']['city'],
                        'pincode' => $user['location']['postcode'],
                    ]);
                }
                $this->command->info("Generated $email - $name | $i / $userGenerateCount");
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
