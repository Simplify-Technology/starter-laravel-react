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
            $user->roles()->sync([$visitorRole->id]);
        }

        Cache::forget("user:$user->id:roles");
        Cache::rememberForever("user:$user->id:roles", fn() => $user->roles->pluck('name')->toArray());

        Broadcast::event(new RoleUserUpdatedEvent($user));

        return response()->json(['message' => 'Cargo removido com sucesso!', 'role' => 'visitor']);
    }
}
