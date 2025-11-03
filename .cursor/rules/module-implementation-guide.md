# Guia de Implementação de Módulos - CRM e Financeiro

Este guia fornece templates, padrões e checklists para implementar os módulos CRM e Financeiro respeitando o sistema de permissões estabelecido.

## 📋 Checklist de Permissões por Funcionalidade

### Módulo CRM

| Funcionalidade    | Permissão Necessária        | Exemplo de Uso                                  |
| ----------------- | --------------------------- | ----------------------------------------------- |
| Listar clientes   | `view_clients`              | `$this->authorize('view_clients')`              |
| Criar cliente     | `create_clients`            | `$this->authorize('create_clients')`            |
| Editar cliente    | `edit_clients`              | `$this->authorize('edit_clients')`              |
| Deletar cliente   | `delete_clients`            | `$this->authorize('delete_clients')`            |
| Adicionar nota    | `manage_client_notes`       | `$this->authorize('manage_client_notes')`       |
| Anexar arquivo    | `manage_client_attachments` | `$this->authorize('manage_client_attachments')` |
| Exportar clientes | `export_clients`            | `$this->authorize('export_clients')`            |
| Importar clientes | `import_clients`            | `$this->authorize('import_clients')`            |

### Módulo Financeiro

| Funcionalidade        | Permissão Necessária     | Exemplo de Uso                               |
| --------------------- | ------------------------ | -------------------------------------------- |
| Visualizar dashboard  | `view_financial`         | `$this->authorize('view_financial')`         |
| Listar transações     | `view_transactions`      | `$this->authorize('view_transactions')`      |
| Criar transação       | `create_transactions`    | `$this->authorize('create_transactions')`    |
| Editar transação      | `edit_transactions`      | `$this->authorize('edit_transactions')`      |
| Deletar transação     | `delete_transactions`    | `$this->authorize('delete_transactions')`    |
| Gerenciar contas      | `manage_accounts`        | `$this->authorize('manage_accounts')`        |
| Gerenciar categorias  | `manage_categories`      | `$this->authorize('manage_categories')`      |
| Contas a pagar        | `manage_payables`        | `$this->authorize('manage_payables')`        |
| Contas a receber      | `manage_receivables`     | `$this->authorize('manage_receivables')`     |
| Aprovar transação     | `approve_transactions`   | `$this->authorize('approve_transactions')`   |
| Visualizar relatórios | `view_financial_reports` | `$this->authorize('view_financial_reports')` |
| Exportar relatórios   | `export_financial`       | `$this->authorize('export_financial')`       |

## 🎯 Template de Controller com Autorização

### Exemplo: ClientController

```php
<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexController extends Controller
{
    public function __invoke(Request $request): Response
    {
        // ✅ Sempre verificar permissão primeiro
        $this->authorize('view_clients');

        $query = Client::query();

        // 🔒 Filtrar por papel quando necessário
        if ($request->user()->hasRole('sales_rep')) {
            // Sales Rep vê apenas seus clientes
            $query->where('assigned_to', $request->user()->id);
        } elseif ($request->user()->hasRole('sales_manager')) {
            // Sales Manager vê clientes da equipe
            $query->whereIn('assigned_to', $request->user()->managedUsers()->pluck('id'));
        }

        $clients = $query->paginate(15);

        return Inertia::render('clients/index', [
            'clients' => $clients,
        ]);
    }
}

class CreateController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('create_clients');

        return Inertia::render('clients/create');
    }
}

class StoreController extends Controller
{
    public function __invoke(Request $request)
    {
        $this->authorize('create_clients');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            // ... outros campos
        ]);

        // Auto-atribuir para Sales Rep
        if ($request->user()->hasRole('sales_rep')) {
            $validated['assigned_to'] = $request->user()->id;
        }

        $client = Client::create($validated);

        return redirect()
            ->route('clients.show', $client)
            ->with('success', 'Cliente criado com sucesso!');
    }
}

class DestroyController extends Controller
{
    public function __invoke(Request $request, Client $client)
    {
        // ✅ Verificar permissão específica
        $this->authorize('delete_clients');

        // 🔒 Verificar se Sales Rep pode deletar apenas seus clientes
        if ($request->user()->hasRole('sales_rep')) {
            abort_if($client->assigned_to !== $request->user()->id, 403);
        }

        $client->delete();

        return redirect()
            ->route('clients.index')
            ->with('success', 'Cliente deletado com sucesso!');
    }
}
```

### Exemplo: TransactionController

```php
<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function __invoke(Request $request)
    {
        $this->authorize('create_transactions');

        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'required|exists:categories,id',
            'client_id' => 'nullable|exists:clients,id',
        ]);

        $user = $request->user();

        // 🔒 Restrições por papel
        if ($user->hasRole('accounts_payable')) {
            // Só pode criar despesas
            abort_if($validated['type'] !== 'expense', 403, 'Você só pode criar despesas.');
        } elseif ($user->hasRole('accounts_receivable')) {
            // Só pode criar receitas
            abort_if($validated['type'] !== 'income', 403, 'Você só pode criar receitas.');
        } elseif ($user->hasRole('sales_rep')) {
            // Só pode criar receitas vinculadas a seus clientes
            abort_if($validated['type'] !== 'income', 403, 'Você só pode criar receitas.');
            if (isset($validated['client_id'])) {
                $client = Client::findOrFail($validated['client_id']);
                abort_if($client->assigned_to !== $user->id, 403, 'Cliente não pertence a você.');
            }
        }

        // Auto-aprovar se tiver permissão
        if ($user->hasPermissionTo('approve_transactions')) {
            $validated['status'] = 'approved';
        } else {
            $validated['status'] = 'pending';
        }

        $transaction = Transaction::create($validated);

        return redirect()
            ->route('transactions.show', $transaction)
            ->with('success', 'Transação criada com sucesso!');
    }
}

class UpdateController extends Controller
{
    public function __invoke(Request $request, Transaction $transaction)
    {
        $this->authorize('edit_transactions');

        // 🔒 Verificar se pode editar esta transação específica
        $user = $request->user();

        if ($user->hasRole('sales_rep')) {
            abort(403, 'Você não tem permissão para editar transações.');
        }

        // Accounts Payable só pode editar despesas
        if ($user->hasRole('accounts_payable')) {
            abort_if($transaction->type !== 'expense', 403);
        }

        // Accounts Receivable só pode editar receitas
        if ($user->hasRole('accounts_receivable')) {
            abort_if($transaction->type !== 'income', 403);
        }

        $validated = $request->validate([
            'amount' => 'sometimes|numeric|min:0',
            'description' => 'sometimes|string',
            // ... outros campos
        ]);

        $transaction->update($validated);

        return redirect()
            ->route('transactions.show', $transaction)
            ->with('success', 'Transação atualizada com sucesso!');
    }
}
```

## 🛡️ Padrões de Filtro por Papel

### Sales Rep - Vê apenas seus clientes/vendas

```php
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

### Sales Manager - Vê clientes da equipe

```php
public function index(Request $request)
{
    $this->authorize('view_clients');

    $query = Client::query();

    if ($request->user()->hasRole('sales_manager')) {
        $teamIds = $request->user()->managedUsers()->pluck('id');
        $query->whereIn('assigned_to', $teamIds);
    }

    return $query->get();
}
```

### Accounts Payable - Vê apenas despesas

```php
public function index(Request $request)
{
    $this->authorize('view_transactions');

    $query = Transaction::query();

    if ($request->user()->hasRole('accounts_payable')) {
        $query->where('type', 'expense');
    }

    return $query->get();
}
```

### Accounts Receivable - Vê apenas receitas

```php
public function index(Request $request)
{
    $this->authorize('view_transactions');

    $query = Transaction::query();

    if ($request->user()->hasRole('accounts_receivable')) {
        $query->where('type', 'income');
    }

    return $query->get();
}
```

## 📝 Exemplos de Policies

### ClientPolicy

```php
<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_clients');
    }

    public function view(User $user, Client $client): bool
    {
        if (!$user->hasPermissionTo('view_clients')) {
            return false;
        }

        // Sales Rep só pode ver seus clientes
        if ($user->hasRole('sales_rep')) {
            return $client->assigned_to === $user->id;
        }

        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_clients');
    }

    public function update(User $user, Client $client): bool
    {
        if (!$user->hasPermissionTo('edit_clients')) {
            return false;
        }

        // Sales Rep só pode editar seus clientes
        if ($user->hasRole('sales_rep')) {
            return $client->assigned_to === $user->id;
        }

        return true;
    }

    public function delete(User $user, Client $client): bool
    {
        // Apenas ADMIN e SUPER_USER podem deletar
        return $user->hasPermissionTo('delete_clients');
    }
}
```

### TransactionPolicy

```php
<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_transactions');
    }

    public function view(User $user, Transaction $transaction): bool
    {
        if (!$user->hasPermissionTo('view_transactions')) {
            return false;
        }

        // Accounts Payable só vê despesas
        if ($user->hasRole('accounts_payable')) {
            return $transaction->type === 'expense';
        }

        // Accounts Receivable só vê receitas
        if ($user->hasRole('accounts_receivable')) {
            return $transaction->type === 'income';
        }

        // Sales Rep só vê receitas de seus clientes
        if ($user->hasRole('sales_rep')) {
            if ($transaction->type !== 'income') {
                return false;
            }
            if ($transaction->client_id) {
                $client = $transaction->client;
                return $client->assigned_to === $user->id;
            }
        }

        return true;
    }

    public function create(User $user, Transaction $transaction = null): bool
    {
        if (!$user->hasPermissionTo('create_transactions')) {
            return false;
        }

        // Se já temos a transação, validar tipo
        if ($transaction) {
            // Accounts Payable só pode criar despesas
            if ($user->hasRole('accounts_payable')) {
                return $transaction->type === 'expense';
            }

            // Accounts Receivable só pode criar receitas
            if ($user->hasRole('accounts_receivable')) {
                return $transaction->type === 'income';
            }

            // Sales Rep só pode criar receitas
            if ($user->hasRole('sales_rep')) {
                return $transaction->type === 'income';
            }
        }

        return true;
    }

    public function update(User $user, Transaction $transaction): bool
    {
        if (!$user->hasPermissionTo('edit_transactions')) {
            return false;
        }

        // Sales Rep não pode editar transações
        if ($user->hasRole('sales_rep')) {
            return false;
        }

        // Accounts Payable só pode editar despesas
        if ($user->hasRole('accounts_payable')) {
            return $transaction->type === 'expense';
        }

        // Accounts Receivable só pode editar receitas
        if ($user->hasRole('accounts_receivable')) {
            return $transaction->type === 'income';
        }

        return true;
    }

    public function delete(User $user, Transaction $transaction): bool
    {
        // Apenas ADMIN, SUPER_USER e FINANCE_MANAGER podem deletar
        return $user->hasPermissionTo('delete_transactions');
    }

    public function approve(User $user, Transaction $transaction): bool
    {
        return $user->hasPermissionTo('approve_transactions');
    }
}
```

## 🛣️ Middleware de Autorização

### Proteger Rotas por Permissões

```php
// routes/web.php

// Módulo CRM
Route::middleware(['auth', 'can:view_clients'])->prefix('clients')->group(function () {
    Route::get('/', [Client\IndexController::class, '__invoke'])->name('clients.index');

    Route::middleware('can:create_clients')->group(function () {
        Route::get('/create', [Client\CreateController::class, '__invoke'])->name('clients.create');
        Route::post('/', [Client\StoreController::class, '__invoke'])->name('clients.store');
    });

    Route::middleware('can:edit_clients')->group(function () {
        Route::get('/{client}/edit', [Client\EditController::class, '__invoke'])->name('clients.edit');
        Route::put('/{client}', [Client\UpdateController::class, '__invoke'])->name('clients.update');
    });

    Route::middleware('can:delete_clients')->group(function () {
        Route::delete('/{client}', [Client\DestroyController::class, '__invoke'])->name('clients.destroy');
    });

    Route::middleware('can:manage_client_notes')->group(function () {
        Route::post('/{client}/notes', [Client\NoteController::class, 'store'])->name('clients.notes.store');
    });
});

// Módulo Financeiro
Route::middleware(['auth', 'can:view_financial'])->prefix('financial')->group(function () {
    Route::get('/dashboard', [Financial\DashboardController::class, '__invoke'])->name('financial.dashboard');

    Route::middleware('can:view_transactions')->prefix('transactions')->group(function () {
        Route::get('/', [Transaction\IndexController::class, '__invoke'])->name('transactions.index');

        Route::middleware('can:create_transactions')->group(function () {
            Route::get('/create', [Transaction\CreateController::class, '__invoke'])->name('transactions.create');
            Route::post('/', [Transaction\StoreController::class, '__invoke'])->name('transactions.store');
        });

        Route::middleware('can:edit_transactions')->group(function () {
            Route::get('/{transaction}/edit', [Transaction\EditController::class, '__invoke'])->name('transactions.edit');
            Route::put('/{transaction}', [Transaction\UpdateController::class, '__invoke'])->name('transactions.update');
        });

        Route::middleware('can:delete_transactions')->group(function () {
            Route::delete('/{transaction}', [Transaction\DestroyController::class, '__invoke'])->name('transactions.destroy');
        });

        Route::middleware('can:approve_transactions')->group(function () {
            Route::post('/{transaction}/approve', [Transaction\ApproveController::class, '__invoke'])->name('transactions.approve');
        });
    });

    Route::middleware('can:manage_accounts')->prefix('accounts')->group(function () {
        Route::get('/', [Account\IndexController::class, '__invoke'])->name('accounts.index');
        // ...
    });
});
```

## ✅ Checklist de Implementação

Ao implementar um novo módulo ou funcionalidade:

### Preparação

- [ ] Consultar `permissions-reference.md` para verificar permissões necessárias
- [ ] Verificar se permissões já existem no enum `Permissions`
- [ ] Verificar se permissões estão atribuídas aos papéis corretos no seeder

### Implementação

- [ ] Controller verifica permissão com `$this->authorize()`
- [ ] Policy criada (se necessário para lógica complexa)
- [ ] Rotas protegidas com middleware `can:permission_name`
- [ ] Filtros por papel implementados (ex: Sales Rep vê só seus dados)
- [ ] Validações específicas por papel (ex: Accounts Payable só cria despesas)
- [ ] Frontend verifica permissões antes de mostrar botões/links

### Testes

- [ ] Testar cada papel pode acessar apenas o que deve
- [ ] Testar restrições por papel (ex: Sales Rep não pode deletar)
- [ ] Testar filtros (ex: Sales Rep vê apenas seus clientes)
- [ ] Testar permissões individuais (via `permission_user`)

## 📚 Referências

- **Documentação de Permissões**: `.cursor/rules/permissions-reference.md`
- **Enum de Permissões**: `app/Enum/Permissions.php`
- **Enum de Papéis**: `app/Enum/Roles.php`
- **Seeder**: `database/seeders/PermissionRoleSeeder.php`

## 💡 Dicas Importantes

1. **Sempre verifique permissão primeiro**: `$this->authorize()` deve ser a primeira linha do método
2. **Use Policies para lógica complexa**: Se a validação for mais que uma verificação simples, crie uma Policy
3. **Filtre dados por papel**: Sales Rep não deve ver dados de outros vendedores
4. **Valide no backend**: Nunca confie apenas em validações do frontend
5. **Teste todos os papéis**: Cada papel deve ter acesso apenas ao que precisa
6. **Documente exceções**: Se um papel tem acesso especial, documente o motivo
