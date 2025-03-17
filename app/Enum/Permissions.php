<?php

namespace App\Enum;

enum Permissions: string
{
    case VIEW_BILLING       = 'view_billing';
    case VIEW_CLIENTS       = 'view_clients';
    case VIEW_DASHBOARD     = 'view_dashboard';
    case VIEW_REPORTS       = 'view_reports';
    case MANAGE_BILLING     = 'manage_billing';
    case MANAGE_CLIENTS     = 'manage_clients';
    case MANAGE_ROLES       = 'manage_roles';
    case ASSIGN_ROLES       = 'assign_roles';
    case MANAGE_SUPPORT     = 'manage_support';
    case MANAGE_USERS       = 'manage_users';
    case GRANT_PERMISSIONS  = 'grant_permissions';
    case REVOKE_PERMISSIONS = 'revoke_permissions';
    case GENERATE_REPORTS   = 'generate_reports';
    case DELETE_REPORTS     = 'delete_reports';
    case SCHEDULE_REPORTS   = 'schedule_reports';
    case EDIT_SETTINGS      = 'edit_settings';
    case UPDATE_SYSTEM      = 'update_system';
    case EXPORT_DATA        = 'export_data';
    case ACCESS_LOGS        = 'access_logs';
    case CLEAR_CACHE        = 'clear_cache';

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
            self::VIEW_BILLING       => 'Visualizar Faturamento',
            self::VIEW_CLIENTS       => 'Visualizar Clientes',
            self::VIEW_DASHBOARD     => 'Visualizar Painel',
            self::VIEW_REPORTS       => 'Visualizar Relatórios',
            self::MANAGE_BILLING     => 'Gerenciar Faturamento',
            self::MANAGE_CLIENTS     => 'Gerenciar Clientes',
            self::MANAGE_SUPPORT     => 'Gerenciar Suporte',
            self::ASSIGN_ROLES       => 'Atribuir Papéis',
            self::MANAGE_ROLES       => 'Gerenciar Papéis',
            self::MANAGE_USERS       => 'Gerenciar Usuários',
            self::GRANT_PERMISSIONS  => 'Conceder Permissões',
            self::REVOKE_PERMISSIONS => 'Revogar Permissões',
            self::GENERATE_REPORTS   => 'Gerar Relatórios',
            self::DELETE_REPORTS     => 'Excluir Relatórios',
            self::SCHEDULE_REPORTS   => 'Agendar Relatórios',
            self::EDIT_SETTINGS      => 'Editar Configurações',
            self::UPDATE_SYSTEM      => 'Atualizar Sistema',
            self::EXPORT_DATA        => 'Exportar Dados',
            self::ACCESS_LOGS        => 'Acessar Logs',
            self::CLEAR_CACHE        => 'Limpar Cache',
        };
    }
}
