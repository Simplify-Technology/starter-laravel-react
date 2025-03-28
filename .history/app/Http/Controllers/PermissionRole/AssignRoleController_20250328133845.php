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
        $newRole  = Role::where('name', $request->role)->firstOrFail();

        if (!$authUser->hasPermissionTo('assign_roles')) {
            return redirect()->back()->withErrors(['error' => 'Acesso negado!']);
        }

        if ($user->hasRole('super_user') && $authUser->id === $user->id) {
            return redirect()->back()->withErrors(['error' => 'Você não pode alterar o seu próprio cargo!']);
        }

        if ($authUser->role->priority < $newRole->priority) {
            return redirect()->back()->withErrors(['error' => 'Você não pode atribuir um cargo superior ao seu!']);
        }

        $user->update(['role_id' => $newRole->id]);

        Cache::forget("user:$user->id:roles");

        Broadcast::event(new RoleUserUpdatedEvent($user));

        return redirect()->back()->with('success', 'Cargo atualizado com sucesso!');
    }
}
