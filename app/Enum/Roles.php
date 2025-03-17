<?php

namespace App\Enum;

enum Roles: string
{
    case SUPER_USER = 'super_user';
    case ADMIN      = 'admin';
    case OWNER      = 'owner';
    case MANAGER    = 'manager';
    case EDITOR     = 'editor';
    case VIEWER     = 'viewer';
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
            self::OWNER      => 'Proprietário',
            self::MANAGER    => 'Gerente',
            self::EDITOR     => 'Editor',
            self::VIEWER     => 'Visualizador',
            self::VISITOR    => 'Visitante',
        };
    }

    public function priority(): int
    {
        return match ($this) {
            self::SUPER_USER => 100,
            self::ADMIN      => 90,
            self::MANAGER    => 80,
            self::OWNER      => 70,
            self::VISITOR    => 60,
            self::EDITOR     => 50,
            self::VIEWER     => 10,
        };
    }
}
