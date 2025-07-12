<?php
namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // Clean product and category image folders
        $this->call([
            UserSeeder::class,
            RoleSeeder::class,
            AdminUserSeeder::class,
            ProductSeeder::class,
            RecentlyViewedProductSeeder::class,
        ]);
    }
}
