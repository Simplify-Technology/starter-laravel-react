<?php

namespace App\Http\Controllers\PermissionRole;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UpdateController extends Controller
{
    public function __invoke(Request $request, $roleName)
    {
        $this->authorize('manage_roles');
        $role = Role::where('name', $roleName)->firstOrFail();

        // region agent log
        try {
            file_put_contents(
                base_path('.cursor/debug-6e3469.log'),
                json_encode([
                    'sessionId'    => '6e3469',
                    'runId'        => 'repro-pre',
                    'hypothesisId' => 'B',
                    'location'     => 'app/Http/Controllers/PermissionRole/UpdateController.php:13-18',
                    'message'      => 'Role permission update invoked',
                    'data'         => [
                        'roleId'                  => (int) $role->id,
                        'roleName'                => (string) $role->name,
                        'permissionsPayloadCount' => is_array($request->permissions ?? null) ? count($request->permissions) : null,
                    ],
                    'timestamp' => (int) round(microtime(true) * 1000),
                ], JSON_UNESCAPED_SLASHES) . PHP_EOL,
                FILE_APPEND
            );
        } catch (\Throwable) {
            // ignore
        }
        // endregion agent log

        $role->permissions()->sync(Permission::getIdsFromNames($request->permissions));

        Cache::forget("role:$role->id:permissions");
        Cache::rememberForever("role:$role->id:permissions", fn() => $role->permissions()->pluck('name')->toArray());

        $invalidatedUserCount = 0;

        User::query()
            ->where('role_id', $role->id)
            ->select('id')
            ->orderBy('id')
            ->chunkById(500, function($users) use (&$invalidatedUserCount): void {
                foreach ($users as $user) {
                    Cache::forget("user:$user->id:permissions");
                    Cache::forget("user:$user->id:roles");
                    $invalidatedUserCount++;
                }
            });

        // region agent log
        try {
            file_put_contents(
                base_path('.cursor/debug-6e3469.log'),
                json_encode([
                    'sessionId'    => '6e3469',
                    'runId'        => 'repro-pre',
                    'hypothesisId' => 'FIX',
                    'location'     => 'app/Http/Controllers/PermissionRole/UpdateController.php:after-sync',
                    'message'      => 'Invalidated per-user permission caches for role',
                    'data'         => [
                        'roleId'               => (int) $role->id,
                        'invalidatedUserCount' => (int) $invalidatedUserCount,
                    ],
                    'timestamp' => (int) round(microtime(true) * 1000),
                ], JSON_UNESCAPED_SLASHES) . PHP_EOL,
                FILE_APPEND
            );
        } catch (\Throwable) {
            // ignore
        }
        // endregion agent log

        // region agent log
        try {
            file_put_contents(
                base_path('.cursor/debug-6e3469.log'),
                json_encode([
                    'sessionId'    => '6e3469',
                    'runId'        => 'repro-pre',
                    'hypothesisId' => 'B',
                    'location'     => 'app/Http/Controllers/PermissionRole/UpdateController.php:18-23',
                    'message'      => 'Role permission update finished (role cache refreshed)',
                    'data'         => [
                        'roleId'       => (int) $role->id,
                        'roleCacheKey' => "role:$role->id:permissions",
                    ],
                    'timestamp' => (int) round(microtime(true) * 1000),
                ], JSON_UNESCAPED_SLASHES) . PHP_EOL,
                FILE_APPEND
            );
        } catch (\Throwable) {
            // ignore
        }
        // endregion agent log

        return redirect()->back()->with('success', "Permissões de {$role->label} atualizadas com sucesso!");
    }
}
