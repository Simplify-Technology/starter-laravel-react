<?php

namespace App\Http\Controllers\PermissionRole;

use App\Events\RoleUserUpdatedEvent;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Cache;

class RevokeRoleController extends Controller
{
    public function __invoke(Request $request, User $user)
    {
        $visitorRole = Role::where('name', 'visitor')->first();

        if ($visitorRole) {
            $user->role_id = $visitorRole->id;
            $user->save();
        }

        Cache::forget("user:$user->id:roles");
        Cache::rememberForever("user:$user->id:role", fn() => $user->role?->name);

        Broadcast::event(new RoleUserUpdatedEvent($user));

        return redirect()->back()->with(['success' => 'Cargo removido com sucesso!', 'role' => $user->role?->name]);
    }
}
