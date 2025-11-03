<?php

namespace App\Enum;

enum Roles: string
{
    // ===== NÍVEL ADMINISTRATIVO =====
    case SUPER_USER = 'super_user';
    case ADMIN      = 'admin';
    case OWNER      = 'owner';

    // ===== NÍVEL GERENCIAL =====
    case MANAGER         = 'manager';
    case SALES_MANAGER   = 'sales_manager';
    case FINANCE_MANAGER = 'finance_manager';

    // ===== NÍVEL OPERACIONAL - VENDAS/CRM =====
    case ACCOUNT_EXECUTIVE = 'account_executive';
    case SALES_REP         = 'sales_rep';
    case CUSTOMER_SUPPORT  = 'customer_support';

    // ===== NÍVEL OPERACIONAL - FINANCEIRO =====
    case ACCOUNTANT          = 'accountant';
    case TREASURER           = 'treasurer';
    case FINANCIAL_ANALYST   = 'financial_analyst';
    case ACCOUNTS_PAYABLE    = 'accounts_payable';
    case ACCOUNTS_RECEIVABLE = 'accounts_receivable';
    case BOOKKEEPER          = 'bookkeeper';
    case CASHIER             = 'cashier';

    // ===== NÍVEL CONSULTIVO =====
    case AUDITOR = 'auditor';
    case VIEWER  = 'viewer';
    case VISITOR = 'visitor';

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
            // Administrativos
            self::SUPER_USER => 'Super Usuário',
            self::ADMIN      => 'Administrador',
            self::OWNER      => 'Proprietário',

            // Gerenciais
            self::MANAGER         => 'Gerente Geral',
            self::SALES_MANAGER   => 'Gerente de Vendas',
            self::FINANCE_MANAGER => 'Gerente Financeiro',

            // Vendas/CRM
            self::ACCOUNT_EXECUTIVE => 'Executivo de Contas',
            self::SALES_REP         => 'Representante de Vendas',
            self::CUSTOMER_SUPPORT  => 'Suporte ao Cliente',

            // Financeiro
            self::ACCOUNTANT          => 'Contador',
            self::TREASURER           => 'Tesoureiro',
            self::FINANCIAL_ANALYST   => 'Analista Financeiro',
            self::ACCOUNTS_PAYABLE    => 'Analista Contas a Pagar',
            self::ACCOUNTS_RECEIVABLE => 'Analista Contas a Receber',
            self::BOOKKEEPER          => 'Auxiliar Contábil',
            self::CASHIER             => 'Operador de Caixa',

            // Consultivos
            self::AUDITOR => 'Auditor',
            self::VIEWER  => 'Visualizador',
            self::VISITOR => 'Visitante',
        };
    }

    public function priority(): int
    {
        return match ($this) {
            // Administrativos
            self::SUPER_USER => 100,
            self::ADMIN      => 90,
            self::OWNER      => 80,

            // Gerenciais
            self::MANAGER         => 70,
            self::SALES_MANAGER   => 65,
            self::FINANCE_MANAGER => 65,

            // Vendas/CRM
            self::ACCOUNT_EXECUTIVE => 57,
            self::SALES_REP         => 55,
            self::CUSTOMER_SUPPORT  => 50,

            // Financeiro
            self::ACCOUNTANT          => 58,
            self::TREASURER           => 56,
            self::FINANCIAL_ANALYST   => 54,
            self::ACCOUNTS_PAYABLE    => 53,
            self::ACCOUNTS_RECEIVABLE => 53,
            self::BOOKKEEPER          => 52,
            self::CASHIER             => 50,

            // Consultivos
            self::VISITOR => 5,
            self::AUDITOR => 15,
            self::VIEWER  => 10,
        };
    }
}
