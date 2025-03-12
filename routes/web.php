<?php

use App\Http\Controllers\PermissionRole;
use App\Http\Controllers\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function() {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function(): void {
    Route::get('dashboard', function() {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // region Users
    Route::get('users', User\IndexController::class)->name('users');
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
    // endregion
});

require __DIR__ . '/settings.php';

require __DIR__ . '/auth.php';
