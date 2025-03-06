<?php

namespace App\Enum;

enum Roles: string
{
    case SUPER_USER = 'super_user';
    case ADMIN      = 'admin';
    case MANAGER    = 'manager';
    case OWNER      = 'owner';
    case VISITOR    = 'visitor';

    public static function options(): array
    {
        return array_map(
            fn($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }

    public function label(): string
    {
        return match ($this) {
            self::SUPER_USER => 'Super Usuário',
            self::ADMIN      => 'Administrador',
            self::MANAGER    => 'Gerente',
            self::OWNER      => 'Proprietário',
            self::VISITOR    => 'Visitante',
        };
    }
}
