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
        $roles = Role::all();

        $superUser = User::factory()->create([
            'name'      => 'Super User',
            'email'     => 'super@user.com',
            'is_active' => true,
            'password'  => bcrypt('password'),
        ]);

        $role = Role::where('name', Roles::SUPER_USER->value)->first();

        if ($role) {
            $superUser->assignRole($role->name);
        }

        foreach ($roles as $role) {
            $user = User::factory()->create([
                'name'      => ' Usuário ' . $role->label,
                'email'     => strtolower($role->name) . '@user.com',
                'is_active' => true,
                'password'  => bcrypt('password'),
            ]);

            $user->assignRole($role->name);
        }

        foreach ($roles as $role) {
            User::factory()->count(3)->create([
                'name'      => ' Usuário ' . $role->label,
                'is_active' => true,
                'password'  => bcrypt('password'),
                'role_id'   => $role->id,
            ]);
        }
    }
}
