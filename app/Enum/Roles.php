<?php

namespace App\Enum;

enum Roles: string
{
    case SUPER_USER = 'super_user';
    case ADMIN      = 'admin';
    case MANAGER    = 'manager';
    case OWNER      = 'owner';
    case VISITOR    = 'visitor';
    case EDITOR     = 'editor';
    case VIEWER     = 'viewer';

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
            self::EDITOR     => 'Editor',
            self::VIEWER     => 'Visualizador',
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
