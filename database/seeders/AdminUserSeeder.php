<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'], // Find by email
            [
                'name'     => 'Admin User',
                'password' => Hash::make('password'), // Choose a strong password in production!
                'role'     => 'admin',
            ]
        );

        // $this->command->info('Admin user created/updated.' . $adminRole);
    }
}
