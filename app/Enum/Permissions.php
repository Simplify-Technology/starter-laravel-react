<?php

declare(strict_types = 1);

namespace App\Enum;

enum Permissions: string
{
    // Permissões de Usuários/Papéis
    case MANAGE_USERS       = 'manage_users';
    case MANAGE_ROLES       = 'manage_roles';
    case MANAGE_PERMISSIONS = 'manage_permissions';
    case ASSIGN_ROLES       = 'assign_roles';
    case IMPERSONATE_USERS  = 'impersonate_users';

    // Permissões de CRM (Módulo de Clientes)
    case VIEW_CLIENTS              = 'view_clients';
    case CREATE_CLIENTS            = 'create_clients';
    case EDIT_CLIENTS              = 'edit_clients';
    case DELETE_CLIENTS            = 'delete_clients';
    case MANAGE_CLIENT_NOTES       = 'manage_client_notes';
    case MANAGE_CLIENT_ATTACHMENTS = 'manage_client_attachments';
    case EXPORT_CLIENTS            = 'export_clients';
    case IMPORT_CLIENTS            = 'import_clients';

    // Permissões de Financeiro
    case VIEW_FINANCIAL         = 'view_financial';
    case VIEW_TRANSACTIONS      = 'view_transactions';
    case CREATE_TRANSACTIONS    = 'create_transactions';
    case EDIT_TRANSACTIONS      = 'edit_transactions';
    case DELETE_TRANSACTIONS    = 'delete_transactions';
    case MANAGE_ACCOUNTS        = 'manage_accounts';
    case MANAGE_CATEGORIES      = 'manage_categories';
    case MANAGE_PAYABLES        = 'manage_payables';
    case MANAGE_RECEIVABLES     = 'manage_receivables';
    case APPROVE_TRANSACTIONS   = 'approve_transactions';
    case EXPORT_FINANCIAL       = 'export_financial';
    case VIEW_FINANCIAL_REPORTS = 'view_financial_reports';

    // Permissões de Notificações
    case MANAGE_NOTIFICATION_PREFERENCES = 'manage_notification_preferences';
    case MANAGE_NOTIFICATIONS            = 'manage_notifications';
    case SEND_NOTIFICATIONS              = 'send_notifications';
    case VIEW_NOTIFICATION_LOGS          = 'view_notification_logs';

    public function label(): string
    {
        return match ($this) {
            // Usuários/Papéis
            self::MANAGE_USERS       => 'Gerenciar Usuários',
            self::MANAGE_ROLES       => 'Gerenciar Papéis',
            self::MANAGE_PERMISSIONS => 'Gerenciar Permissões',
            self::ASSIGN_ROLES       => 'Atribuir Papéis',
            self::IMPERSONATE_USERS  => 'Personificar Usuários',

            // CRM
            self::VIEW_CLIENTS              => 'Visualizar Clientes',
            self::CREATE_CLIENTS            => 'Criar Clientes',
            self::EDIT_CLIENTS              => 'Editar Clientes',
            self::DELETE_CLIENTS            => 'Deletar Clientes',
            self::MANAGE_CLIENT_NOTES       => 'Gerenciar Notas do Cliente',
            self::MANAGE_CLIENT_ATTACHMENTS => 'Gerenciar Anexos do Cliente',
            self::EXPORT_CLIENTS            => 'Exportar Clientes',
            self::IMPORT_CLIENTS            => 'Importar Clientes',

            // Financeiro
            self::VIEW_FINANCIAL         => 'Visualizar Financeiro',
            self::VIEW_TRANSACTIONS      => 'Visualizar Transações',
            self::CREATE_TRANSACTIONS    => 'Criar Transações',
            self::EDIT_TRANSACTIONS      => 'Editar Transações',
            self::DELETE_TRANSACTIONS    => 'Deletar Transações',
            self::MANAGE_ACCOUNTS        => 'Gerenciar Contas Bancárias',
            self::MANAGE_CATEGORIES      => 'Gerenciar Categorias',
            self::MANAGE_PAYABLES        => 'Gerenciar Contas a Pagar',
            self::MANAGE_RECEIVABLES     => 'Gerenciar Contas a Receber',
            self::APPROVE_TRANSACTIONS   => 'Aprovar Transações',
            self::EXPORT_FINANCIAL       => 'Exportar Relatórios Financeiros',
            self::VIEW_FINANCIAL_REPORTS => 'Visualizar Relatórios Financeiros',

            // Notificações
            self::MANAGE_NOTIFICATION_PREFERENCES => 'Gerenciar Preferências de Notificação',
            self::MANAGE_NOTIFICATIONS            => 'Gerenciar Notificações',
            self::SEND_NOTIFICATIONS              => 'Enviar Notificações',
            self::VIEW_NOTIFICATION_LOGS          => 'Visualizar Logs de Notificações',
        };
    }
}
