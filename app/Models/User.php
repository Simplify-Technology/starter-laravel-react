<?php

namespace App\Models;

use App\Traits\Models\HasRolesAndPermissions;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use OwenIt\Auditing\Contracts\Auditable;

class User extends Authenticatable implements MustVerifyEmail, Auditable
{
    use HasFactory;
    use Notifiable;
    use \OwenIt\Auditing\Auditable;
    use HasRolesAndPermissions;

    protected $with = ['role', 'permissions'];

    protected $fillable = [
        'is_active',
        'role_id',
        'name',
        'email',
        'cpf_cnpj',
        'phone',
        'mobile',
        'user_notes',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }
}
