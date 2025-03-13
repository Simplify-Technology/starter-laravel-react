<?php

namespace Database\Seeders;

use App\Enum\Roles;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $superUser = User::factory()->create([
            'name'      => 'Super User',
            'email'     => 'super@user.com',
            'is_active' => true,
            'password'  => bcrypt('password'),
        ]);

        $role = Role::where('name', Roles::SUPER_USER->value)->first();

        if ($role) {
            $superUser->roles()->attach($role->id);
        }
    }
}
