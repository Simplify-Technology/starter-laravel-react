<?php

namespace App\Enum;

enum Permissions: string
{
    case VIEW_DASHBOARD = 'view_dashboard';
    case EDIT_USERS     = 'edit_users';
    case DELETE_USERS   = 'delete_users';
    case MANAGE_ROLES   = 'manage_roles';

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
            self::VIEW_DASHBOARD => 'Ver Dashboard',
            self::EDIT_USERS     => 'Editar Usuários',
            self::DELETE_USERS   => 'Deletar Usuários',
            self::MANAGE_ROLES   => 'Gerenciar Papéis',
        };
    }
}
