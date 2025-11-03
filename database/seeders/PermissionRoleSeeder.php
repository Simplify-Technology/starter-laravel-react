<?php

namespace Database\Seeders;

use App\Enum\Permissions;
use App\Enum\Roles;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [];

        // Cria/atualiza roles
        foreach (Roles::cases() as $role) {
            $roles[$role->value] = Role::updateOrCreate(
                ['name' => $role->value],
                ['label' => $role->label(), 'priority' => $role->priority()]
            );
        }

        $permissions = [];

        // Cria/atualiza permissions
        foreach (Permissions::cases() as $permission) {
            $permissions[$permission->value] = Permission::updateOrCreate(
                ['name' => $permission->value],
                ['label' => $permission->label()]
            );
        }

        $allPermissions = array_keys($permissions);

        $rolePermissions = [
            // ===== NÍVEL ADMINISTRATIVO =====

            // SUPER_USER - Todas as permissões
            Roles::SUPER_USER->value => $allPermissions,

            // ADMIN - Todas exceto IMPERSONATE_USERS
            Roles::ADMIN->value => array_filter($allPermissions, fn($perm) => $perm !== Permissions::IMPERSONATE_USERS->value),

            // OWNER - Visão estratégica sem delete
            Roles::OWNER->value => [
                // Usuários/Papéis
                Permissions::MANAGE_USERS->value,
                Permissions::ASSIGN_ROLES->value,
                // CRM (sem delete)
                Permissions::VIEW_CLIENTS->value,
                Permissions::CREATE_CLIENTS->value,
                Permissions::EDIT_CLIENTS->value,
                Permissions::EXPORT_CLIENTS->value,
                // Financeiro (somente visualização e export)
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::VIEW_FINANCIAL_REPORTS->value,
                Permissions::EXPORT_FINANCIAL->value,
            ],

            // ===== NÍVEL GERENCIAL =====

            // MANAGER - Gerente Geral (múltiplos módulos)
            Roles::MANAGER->value => [
                // Usuários/Papéis
                Permissions::MANAGE_USERS->value,
                Permissions::ASSIGN_ROLES->value,
                // CRM completo (sem delete e import)
                Permissions::VIEW_CLIENTS->value,
                Permissions::CREATE_CLIENTS->value,
                Permissions::EDIT_CLIENTS->value,
                Permissions::MANAGE_CLIENT_NOTES->value,
                Permissions::MANAGE_CLIENT_ATTACHMENTS->value,
                Permissions::EXPORT_CLIENTS->value,
                // Financeiro (sem delete, sem gerenciar contas/categorias)
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
                Permissions::EDIT_TRANSACTIONS->value,
                Permissions::MANAGE_PAYABLES->value,
                Permissions::MANAGE_RECEIVABLES->value,
                Permissions::VIEW_FINANCIAL_REPORTS->value,
            ],

            // SALES_MANAGER - Gerente de Vendas
            Roles::SALES_MANAGER->value => [
                // CRM completo + gestão de equipe
                Permissions::VIEW_CLIENTS->value,
                Permissions::CREATE_CLIENTS->value,
                Permissions::EDIT_CLIENTS->value,
                Permissions::MANAGE_CLIENT_NOTES->value,
                Permissions::MANAGE_CLIENT_ATTACHMENTS->value,
                Permissions::EXPORT_CLIENTS->value,
                Permissions::IMPORT_CLIENTS->value,
                // Usuários/Papéis (apenas equipe de vendas)
                Permissions::MANAGE_USERS->value,
                Permissions::ASSIGN_ROLES->value,
                // Financeiro (análise de vendas da equipe)
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::VIEW_FINANCIAL_REPORTS->value,
                Permissions::EXPORT_FINANCIAL->value,
            ],

            // FINANCE_MANAGER - Gerente Financeiro
            Roles::FINANCE_MANAGER->value => [
                // Financeiro completo
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
                Permissions::EDIT_TRANSACTIONS->value,
                Permissions::DELETE_TRANSACTIONS->value,
                Permissions::MANAGE_PAYABLES->value,
                Permissions::MANAGE_RECEIVABLES->value,
                Permissions::MANAGE_CATEGORIES->value,
                Permissions::APPROVE_TRANSACTIONS->value,
                Permissions::VIEW_FINANCIAL_REPORTS->value,
                Permissions::EXPORT_FINANCIAL->value,
                // CRM (somente visualização)
                Permissions::VIEW_CLIENTS->value,
                // Usuários/Papéis (apenas equipe financeira)
                Permissions::MANAGE_USERS->value,
                Permissions::ASSIGN_ROLES->value,
            ],

            // ===== NÍVEL OPERACIONAL - VENDAS/CRM =====

            // SALES_REP - Representante de Vendas
            Roles::SALES_REP->value => [
                // CRM completo operacional
                Permissions::VIEW_CLIENTS->value,
                Permissions::CREATE_CLIENTS->value,
                Permissions::EDIT_CLIENTS->value,
                Permissions::MANAGE_CLIENT_NOTES->value,
                Permissions::MANAGE_CLIENT_ATTACHMENTS->value,
                Permissions::EXPORT_CLIENTS->value,
                // Financeiro limitado (somente suas vendas)
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
            ],

            // ACCOUNT_EXECUTIVE - Executivo de Contas
            Roles::ACCOUNT_EXECUTIVE->value => [
                // Tudo do SALES_REP +
                Permissions::VIEW_CLIENTS->value,
                Permissions::CREATE_CLIENTS->value,
                Permissions::EDIT_CLIENTS->value,
                Permissions::MANAGE_CLIENT_NOTES->value,
                Permissions::MANAGE_CLIENT_ATTACHMENTS->value,
                Permissions::EXPORT_CLIENTS->value,
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
                Permissions::VIEW_FINANCIAL_REPORTS->value,
                Permissions::APPROVE_TRANSACTIONS->value,
            ],

            // CUSTOMER_SUPPORT - Suporte ao Cliente
            Roles::CUSTOMER_SUPPORT->value => [
                // CRM limitado - somente visualização e notas
                Permissions::VIEW_CLIENTS->value,
                Permissions::EDIT_CLIENTS->value,
                Permissions::MANAGE_CLIENT_NOTES->value,
            ],

            // ===== NÍVEL OPERACIONAL - FINANCEIRO =====

            // ACCOUNTANT - Contador
            Roles::ACCOUNTANT->value => [
                // Financeiro completo (exceto delete crítico)
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
                Permissions::EDIT_TRANSACTIONS->value,
                Permissions::MANAGE_PAYABLES->value,
                Permissions::MANAGE_RECEIVABLES->value,
                Permissions::MANAGE_CATEGORIES->value,
                Permissions::APPROVE_TRANSACTIONS->value,
                Permissions::VIEW_FINANCIAL_REPORTS->value,
                Permissions::EXPORT_FINANCIAL->value,
                // CRM (somente visualização)
                Permissions::VIEW_CLIENTS->value,
            ],

            // TREASURER - Tesoureiro
            Roles::TREASURER->value => [
                // Gestão de caixa e bancos
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
                Permissions::EDIT_TRANSACTIONS->value,
                Permissions::MANAGE_ACCOUNTS->value,
                Permissions::MANAGE_PAYABLES->value,
                Permissions::MANAGE_RECEIVABLES->value,
                Permissions::EXPORT_FINANCIAL->value,
            ],

            // FINANCIAL_ANALYST - Analista Financeiro
            Roles::FINANCIAL_ANALYST->value => [
                // Análise e relatórios
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::VIEW_FINANCIAL_REPORTS->value,
                Permissions::EXPORT_FINANCIAL->value,
                Permissions::VIEW_CLIENTS->value,
            ],

            // ACCOUNTS_PAYABLE - Analista Contas a Pagar
            Roles::ACCOUNTS_PAYABLE->value => [
                // Foco em pagamentos
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
                Permissions::MANAGE_PAYABLES->value,
                Permissions::VIEW_CLIENTS->value,
            ],

            // ACCOUNTS_RECEIVABLE - Analista Contas a Receber
            Roles::ACCOUNTS_RECEIVABLE->value => [
                // Foco em recebimentos
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
                Permissions::MANAGE_RECEIVABLES->value,
                Permissions::VIEW_CLIENTS->value,
            ],

            // BOOKKEEPER - Auxiliar Contábil
            Roles::BOOKKEEPER->value => [
                // Operacional básico
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
                Permissions::MANAGE_CLIENT_NOTES->value,
            ],

            // CASHIER - Operador de Caixa
            Roles::CASHIER->value => [
                // Transações de caixa diárias
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::CREATE_TRANSACTIONS->value,
            ],

            // ===== NÍVEL CONSULTIVO =====

            // AUDITOR - Auditor
            Roles::AUDITOR->value => [
                // Acesso somente leitura completo
                Permissions::VIEW_CLIENTS->value,
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::VIEW_FINANCIAL_REPORTS->value,
                Permissions::EXPORT_CLIENTS->value,
                Permissions::EXPORT_FINANCIAL->value,
            ],

            // VIEWER - Visualizador
            Roles::VIEWER->value => [
                Permissions::VIEW_CLIENTS->value,
                Permissions::VIEW_FINANCIAL->value,
                Permissions::VIEW_TRANSACTIONS->value,
                Permissions::VIEW_FINANCIAL_REPORTS->value,
            ],

            // VISITOR - Visitante
            Roles::VISITOR->value => [],
        ];

        // Vincula permissões às roles
        foreach ($rolePermissions as $role => $perms) {
            $roles[$role]
                ->permissions()
                ->sync(array_map(fn($perm) => $permissions[$perm]->id, $perms));
        }
    }
}
