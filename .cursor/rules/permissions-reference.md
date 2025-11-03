# Referência de Permissões e Papéis

## Visão Geral

Este documento serve como referência completa para o sistema de permissões e papéis do core. Consulte este documento ao implementar novos módulos (CRM, Financeiro, etc.) para garantir que as permissões sejam aplicadas corretamente.

## Hierarquia de Papéis

```
┌─────────────────────────────────────────┐
│     SUPER_USER (100) - Super Usuário    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       ADMIN (90) - Administrador        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        OWNER (80) - Proprietário        │
└─────────────────────────────────────────┘
                    ↓
    ┌───────────────┴───────────────┐
    ↓                               ↓
┌──────────────┐          ┌──────────────────┐
│  MANAGER (70)│          │  SALES_MANAGER   │
│ Gerente Geral │          │      (65)         │
└──────────────┘          └──────────────────┘
    ↓                               ↓
┌──────────────────┐      ┌──────────────────┐
│ FINANCE_MANAGER  │      │   VENDAS/CRM     │
│      (65)        │      │                  │
└──────────────────┘      ├──────────────────┤
    ↓                      │ ACCOUNT_EXECUTIVE│
┌──────────────────┐      │      (57)         │
│   FINANCEIRO      │      ├──────────────────┤
│                  │      │   SALES_REP (55)  │
│ ACCOUNTANT (58)   │      ├──────────────────┤
│ TREASURER (56)   │      │CUSTOMER_SUPPORT  │
│ FINANCIAL_ANALYST│      │      (50)         │
│ ACCOUNTS_PAYABLE │      └──────────────────┘
│ ACCOUNTS_RECVBL  │
│ BOOKKEEPER (52)  │
│ CASHIER (50)     │
└──────────────────┘
         ↓
┌──────────────────┐
│  CONSULTIVOS     │
│                  │
│ AUDITOR (15)     │
│ VIEWER (10)      │
│ VISITOR (5)      │
└──────────────────┘
```

## Princípios de Segregação de Funções (SoD)

### Regras Fundamentais

1. **Quem cria não aprova**: Usuários que criam transações não podem aprová-las
2. **Quem aprova não executa**: Usuários que aprovam não podem executar pagamentos diretamente
3. **Quem executa não concilia**: Operadores não podem conciliar contas
4. **Vendedor não acessa financeiro crítico**: Sales Rep não pode deletar/editar transações financeiras
5. **Financeiro não cria clientes**: Equipe financeira não pode criar novos clientes (apenas visualizar)

### Aplicação Prática

- **Sales Rep**: Pode criar receitas vinculadas a seus clientes, mas não pode aprovar ou deletar
- **Accountant**: Pode aprovar transações, mas não pode deletar (exceto Finance Manager)
- **Treasurer**: Gerencia contas bancárias, mas não gerencia categorias
- **Accounts Payable**: Só cria despesas, não receitas
- **Accounts Receivable**: Só cria receitas, não despesas

## Matriz de Permissões por Papel

### Nível Administrativo

#### SUPER_USER (100)

- ✅ **Todas as permissões** (incluindo IMPERSONATE_USERS)
- ✅ Permissões futuras automaticamente incluídas

#### ADMIN (90)

- ✅ Todas permissões exceto IMPERSONATE_USERS
- ✅ Gestão completa de usuários, papéis e permissões
- ✅ Acesso completo a CRM e Financeiro

#### OWNER (80)

- ✅ VIEW_CLIENTS, CREATE_CLIENTS, EDIT_CLIENTS, EXPORT_CLIENTS
- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS, VIEW_FINANCIAL_REPORTS, EXPORT_FINANCIAL
- ✅ MANAGE_USERS, ASSIGN_ROLES
- ❌ DELETE_CLIENTS, DELETE_TRANSACTIONS
- ❌ MANAGE_ACCOUNTS, MANAGE_CATEGORIES, MANAGE_ROLES, MANAGE_PERMISSIONS

### Nível Gerencial

#### MANAGER (70)

- ✅ CRM completo (exceto DELETE e IMPORT)
- ✅ Financeiro operacional (exceto DELETE, MANAGE_ACCOUNTS, MANAGE_CATEGORIES)
- ✅ MANAGE_USERS, ASSIGN_ROLES

#### SALES_MANAGER (65)

- ✅ CRM completo + IMPORT_CLIENTS
- ✅ MANAGE_USERS, ASSIGN_ROLES (apenas equipe de vendas)
- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS, VIEW_FINANCIAL_REPORTS, EXPORT_FINANCIAL (análise de equipe)

#### FINANCE_MANAGER (65)

- ✅ Financeiro completo (incluindo DELETE_TRANSACTIONS)
- ✅ MANAGE_USERS, ASSIGN_ROLES (apenas equipe financeira)
- ✅ VIEW_CLIENTS (somente visualização)

### Nível Operacional - Vendas/CRM

#### SALES_REP (55)

- ✅ VIEW_CLIENTS, CREATE_CLIENTS, EDIT_CLIENTS
- ✅ MANAGE_CLIENT_NOTES, MANAGE_CLIENT_ATTACHMENTS
- ✅ EXPORT_CLIENTS
- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS (filtrado)
- ✅ CREATE_TRANSACTIONS (apenas receitas de seus clientes)
- ❌ DELETE_CLIENTS, DELETE_TRANSACTIONS, EDIT_TRANSACTIONS, IMPORT_CLIENTS

#### ACCOUNT_EXECUTIVE (57)

- ✅ Tudo do SALES_REP +
- ✅ VIEW_FINANCIAL_REPORTS
- ✅ APPROVE_TRANSACTIONS (valores baixos)

#### CUSTOMER_SUPPORT (50)

- ✅ VIEW_CLIENTS, EDIT_CLIENTS, MANAGE_CLIENT_NOTES
- ❌ CREATE_CLIENTS, DELETE_CLIENTS, Financeiro

### Nível Operacional - Financeiro

#### ACCOUNTANT (58)

- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS
- ✅ CREATE_TRANSACTIONS, EDIT_TRANSACTIONS
- ✅ MANAGE_PAYABLES, MANAGE_RECEIVABLES
- ✅ MANAGE_CATEGORIES
- ✅ APPROVE_TRANSACTIONS, VIEW_FINANCIAL_REPORTS, EXPORT_FINANCIAL
- ✅ VIEW_CLIENTS
- ❌ DELETE_TRANSACTIONS, MANAGE_ACCOUNTS

#### TREASURER (56)

- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS
- ✅ CREATE_TRANSACTIONS, EDIT_TRANSACTIONS
- ✅ MANAGE_ACCOUNTS (contas bancárias)
- ✅ MANAGE_PAYABLES, MANAGE_RECEIVABLES
- ✅ EXPORT_FINANCIAL
- ❌ DELETE_TRANSACTIONS, MANAGE_CATEGORIES

#### FINANCIAL_ANALYST (54)

- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS
- ✅ VIEW_FINANCIAL_REPORTS, EXPORT_FINANCIAL
- ✅ VIEW_CLIENTS
- ❌ CREATE_TRANSACTIONS, EDIT_TRANSACTIONS, DELETE_TRANSACTIONS

#### ACCOUNTS_PAYABLE (53)

- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS
- ✅ CREATE_TRANSACTIONS (apenas despesas)
- ✅ MANAGE_PAYABLES
- ✅ VIEW_CLIENTS (fornecedores)
- ❌ EDIT_TRANSACTIONS, DELETE_TRANSACTIONS, MANAGE_RECEIVABLES

#### ACCOUNTS_RECEIVABLE (53)

- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS
- ✅ CREATE_TRANSACTIONS (apenas receitas)
- ✅ MANAGE_RECEIVABLES
- ✅ VIEW_CLIENTS (clientes)
- ❌ EDIT_TRANSACTIONS, DELETE_TRANSACTIONS, MANAGE_PAYABLES

#### BOOKKEEPER (52)

- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS
- ✅ CREATE_TRANSACTIONS (sem aprovação)
- ✅ MANAGE_CLIENT_NOTES (contexto financeiro)
- ❌ EDIT_TRANSACTIONS, DELETE_TRANSACTIONS, APPROVE_TRANSACTIONS

#### CASHIER (50)

- ✅ VIEW_FINANCIAL, VIEW_TRANSACTIONS
- ✅ CREATE_TRANSACTIONS (valores baixos, sem aprovação)
- ❌ EDIT_TRANSACTIONS, DELETE_TRANSACTIONS, relatórios avançados

### Nível Consultivo

#### AUDITOR (15)

- ✅ VIEW_CLIENTS, VIEW_FINANCIAL, VIEW_TRANSACTIONS
- ✅ VIEW_FINANCIAL_REPORTS
- ✅ EXPORT_CLIENTS, EXPORT_FINANCIAL
- ❌ Todas as permissões de escrita (CREATE, EDIT, DELETE)

#### VIEWER (10)

- ✅ VIEW_CLIENTS, VIEW_FINANCIAL, VIEW_TRANSACTIONS, VIEW_FINANCIAL_REPORTS
- ❌ Todas as outras permissões

#### VISITOR (5)

- ❌ Nenhuma permissão específica

## Permissões por Módulo

### Módulo CRM (Clientes)

| Funcionalidade    | Permissão                   | Papéis com Acesso                                                                         |
| ----------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| Listar clientes   | `view_clients`              | Todos exceto VISITOR                                                                      |
| Criar cliente     | `create_clients`            | ADMIN, OWNER, MANAGER, SALES_MANAGER, SALES_REP, ACCOUNT_EXECUTIVE                        |
| Editar cliente    | `edit_clients`              | ADMIN, OWNER, MANAGER, SALES_MANAGER, SALES_REP, ACCOUNT_EXECUTIVE, CUSTOMER_SUPPORT      |
| Deletar cliente   | `delete_clients`            | ADMIN, SUPER_USER                                                                         |
| Gerenciar notas   | `manage_client_notes`       | ADMIN, MANAGER, SALES_MANAGER, SALES_REP, ACCOUNT_EXECUTIVE, CUSTOMER_SUPPORT, BOOKKEEPER |
| Gerenciar anexos  | `manage_client_attachments` | ADMIN, MANAGER, SALES_MANAGER, SALES_REP, ACCOUNT_EXECUTIVE                               |
| Exportar clientes | `export_clients`            | ADMIN, OWNER, MANAGER, SALES_MANAGER, SALES_REP, ACCOUNT_EXECUTIVE, AUDITOR               |
| Importar clientes | `import_clients`            | ADMIN, SALES_MANAGER                                                                      |

### Módulo Financeiro

| Funcionalidade             | Permissão                | Papéis com Acesso                                                                                                                                |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Visualizar dashboard       | `view_financial`         | Todos exceto VISITOR                                                                                                                             |
| Visualizar transações      | `view_transactions`      | Todos exceto VISITOR                                                                                                                             |
| Criar transação            | `create_transactions`    | ADMIN, MANAGER, FINANCE_MANAGER, ACCOUNTANT, TREASURER, SALES_REP, ACCOUNT_EXECUTIVE, ACCOUNTS_PAYABLE, ACCOUNTS_RECEIVABLE, BOOKKEEPER, CASHIER |
| Editar transação           | `edit_transactions`      | ADMIN, MANAGER, FINANCE_MANAGER, ACCOUNTANT, TREASURER                                                                                           |
| Deletar transação          | `delete_transactions`    | ADMIN, SUPER_USER, FINANCE_MANAGER                                                                                                               |
| Gerenciar contas bancárias | `manage_accounts`        | ADMIN, TREASURER                                                                                                                                 |
| Gerenciar categorias       | `manage_categories`      | ADMIN, FINANCE_MANAGER, ACCOUNTANT                                                                                                               |
| Gerenciar contas a pagar   | `manage_payables`        | ADMIN, MANAGER, FINANCE_MANAGER, ACCOUNTANT, TREASURER, ACCOUNTS_PAYABLE                                                                         |
| Gerenciar contas a receber | `manage_receivables`     | ADMIN, MANAGER, FINANCE_MANAGER, ACCOUNTANT, TREASURER, ACCOUNTS_RECEIVABLE                                                                      |
| Aprovar transações         | `approve_transactions`   | ADMIN, FINANCE_MANAGER, ACCOUNTANT, ACCOUNT_EXECUTIVE                                                                                            |
| Visualizar relatórios      | `view_financial_reports` | ADMIN, OWNER, MANAGER, SALES_MANAGER, FINANCE_MANAGER, ACCOUNTANT, FINANCIAL_ANALYST, AUDITOR, VIEWER                                            |
| Exportar relatórios        | `export_financial`       | ADMIN, OWNER, MANAGER, FINANCE_MANAGER, ACCOUNTANT, TREASURER, FINANCIAL_ANALYST, AUDITOR                                                        |

## Princípios de Implementação

### 1. Sempre Verificar Permissões

```php
// ✅ CORRETO
public function index(Request $request)
{
    $this->authorize('view_clients');
    // ...
}
```

### 2. Filtrar por Papel Quando Necessário

```php
// Sales Rep vê apenas seus clientes
public function index(Request $request)
{
    $this->authorize('view_clients');

    $query = Client::query();

    if ($request->user()->hasRole('sales_rep')) {
        $query->where('assigned_to', $request->user()->id);
    }

    return $query->get();
}
```

### 3. Usar Policies para Lógica Complexa

```php
// app/Policies/TransactionPolicy.php
public function create(User $user, Transaction $transaction = null): bool
{
    if (!$user->hasPermissionTo('create_transactions')) {
        return false;
    }

    // Accounts Payable só pode criar despesas
    if ($user->hasRole('accounts_payable')) {
        return $transaction?->type === 'expense';
    }

    // Accounts Receivable só pode criar receitas
    if ($user->hasRole('accounts_receivable')) {
        return $transaction?->type === 'income';
    }

    return true;
}
```

### 4. Proteger Rotas com Middleware

```php
// routes/web.php
Route::middleware('can:view_clients')->group(function () {
    Route::get('/clients', [ClientController::class, 'index']);
});

Route::middleware('can:create_transactions')->group(function () {
    Route::post('/transactions', [TransactionController::class, 'store']);
});
```

## Checklist para Implementação de Novos Módulos

Ao implementar um novo módulo, verifique:

- [ ] Permissões definidas no enum `Permissions`
- [ ] Permissões atribuídas aos papéis adequados no seeder
- [ ] Controllers verificam permissões com `$this->authorize()`
- [ ] Policies criadas para lógica complexa
- [ ] Rotas protegidas com middleware quando aplicável
- [ ] Filtros por papel implementados (ex: Sales Rep vê só seus dados)
- [ ] Documentação atualizada neste arquivo

## Referências

- Enum de Permissões: `app/Enum/Permissions.php`
- Enum de Papéis: `app/Enum/Roles.php`
- Seeder de Permissões: `database/seeders/PermissionRoleSeeder.php`
- Guia de Implementação: `.cursor/rules/module-implementation-guide.md`
