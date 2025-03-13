<?php

namespace App\Http\Controllers\PermissionRole;

use App\Events\RoleUserUpdatedEvent;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Opcodes\LogViewer\Facades\Cache;

class AssignRoleController extends Controller
{
    public function __invoke(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', 'exists:roles,name'],
        ]);

        $authUser = auth()->user();
        $newRole = Role::where('name', $request->role)->firstOrFail();

        // 🔹 1. Verifica se o usuário tem permissão "assign_roles"
        if (!$authUser->hasPermissionTo('assign_roles')) {
            return redirect()->back()->withErrors('error', 'Acesso negado!');
        }

        // 🔹 2. Impede que um Super Usuário altere seu próprio cargo
        if ($user->hasRole('super_user') && $authUser->id === $user->id) {
            return redirect()->back()->withErrors(['error' => 'Você não pode alterar o seu próprio cargo!']);
        }

        // 🔹 3. Impede que um usuário se promova para um cargo superior
        if ($authUser->role->priority < $newRole->priority) {
            return redirect()->back()->withErrors(['error' => 'Você não pode atribuir um cargo superior ao seu!']);
        }

        // 🔹 4. Remove o cargo anterior e atribui o novo
        $user->roles()->sync([$newRole->id]);

        // 🔹 5. Atualiza o cache
        Cache::forget("user:$user->id:roles");
        Cache::rememberForever("user:$user->id:roles", fn() => $user->roles->pluck('name')->toArray());

        // 🔹 6. Dispara evento WebSocket para atualização em tempo real
        Broadcast::event(new RoleUserUpdatedEvent($user));

        return redirect()->back()->with('success', 'Cargo atualizado com sucesso!');

    }
}
