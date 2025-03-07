<?php

namespace App\Enum;

enum Permissions: string
{
    case VIEW_DASHBOARD     = 'view_dashboard';
    case MANAGE_USERS       = 'manage_users';
    case ASSIGN_ROLES       = 'assign_roles';
    case MANAGE_ROLES       = 'manage_roles';
    case GRANT_PERMISSIONS  = 'grant_permissions';
    case REVOKE_PERMISSIONS = 'revoke_permissions';
    case EDIT_SETTINGS      = 'edit_settings';
    case UPDATE_SYSTEM      = 'update_system';
    case VIEW_REPORTS       = 'view_reports';
    case GENERATE_REPORTS   = 'generate_reports';
    case EXPORT_DATA        = 'export_data';
    case DELETE_REPORTS     = 'delete_reports';
    case SCHEDULE_REPORTS   = 'schedule_reports';
    case MANAGE_BILLING     = 'manage_billing';
    case VIEW_BILLING       = 'view_billing';
    case MANAGE_SUPPORT     = 'manage_support';
    case MANAGE_CLIENTS     = 'manage_clients';
    case VIEW_CLIENTS       = 'view_clients';
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
            self::VIEW_DASHBOARD     => 'Visualizar Painel',
            self::MANAGE_USERS       => 'Gerenciar Usuários',
            self::ASSIGN_ROLES       => 'Atribuir Papéis',
            self::MANAGE_ROLES       => 'Gerenciar Papéis',
            self::GRANT_PERMISSIONS  => 'Conceder Permissões',
            self::REVOKE_PERMISSIONS => 'Revogar Permissões',
            self::EDIT_SETTINGS      => 'Editar Configurações',
            self::UPDATE_SYSTEM      => 'Atualizar Sistema',
            self::VIEW_REPORTS       => 'Visualizar Relatórios',
            self::GENERATE_REPORTS   => 'Gerar Relatórios',
            self::EXPORT_DATA        => 'Exportar Dados',
            self::DELETE_REPORTS     => 'Excluir Relatórios',
            self::SCHEDULE_REPORTS   => 'Agendar Relatórios',
            self::MANAGE_BILLING     => 'Gerenciar Faturamento',
            self::VIEW_BILLING       => 'Visualizar Faturamento',
            self::MANAGE_SUPPORT     => 'Gerenciar Suporte',
            self::MANAGE_CLIENTS     => 'Gerenciar Clientes',
            self::VIEW_CLIENTS       => 'Visualizar Clientes',
            self::ACCESS_LOGS        => 'Acessar Logs',
            self::CLEAR_CACHE        => 'Limpar Cache',
        };
    }
}
