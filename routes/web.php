<?php

use App\Http\Controllers\PermissionRole;
use App\Http\Controllers\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function(): void {
    Route::get('dashboard', function() {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // region Users
    Route::get('users', User\IndexController::class)->name('users');

    // Impersonate routes
    Route::post('/users/{user}/impersonate', User\StartImpersonateController::class)
        ->middleware('throttle:10,1')
        ->name('users.impersonate');

    Route::delete('/users/impersonate', User\StopImpersonateController::class)
        ->name('users.impersonate.stop');

    // Permissions management routes
    Route::get('/users/{user}/permissions', User\ShowUserPermissionsController::class)
        ->name('users.permissions.show');

    Route::post('/users/{user}/permissions', User\GrantPermissionController::class)
        ->name('users.permissions.grant');

    Route::delete('/users/{user}/permissions/{permission}', User\RevokePermissionController::class)
        ->name('users.permissions.revoke');

    // endregion
    // region Permissions and Roles
    Route::redirect('/permissions', '/permissions/roles');
    Route::get(
        '/permissions/roles',
        PermissionRole\IndexController::class
    )->name('role-permissions');
    Route::put(
        '/permissions/roles/{role}',
        PermissionRole\UpdateController::class
    )->name('roles-permissions.update');

    Route::post('/users/{user}/assign-role', PermissionRole\AssignRoleController::class)->name('user.assign-role');
    Route::delete('/users/{user}/revoke-role', PermissionRole\RevokeRoleController::class)->name('user.revoke-role');

    // Individual permissions page
    Route::get('/permissions/individual', PermissionRole\IndividualPermissionsController::class)
        ->name('permissions.individual');
    // endregion
});

require __DIR__ . '/settings.php';

require __DIR__ . '/auth.php';
