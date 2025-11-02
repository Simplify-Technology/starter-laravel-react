<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('manage_users');
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasPermissionTo('manage_users');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage_users');
    }

    public function update(User $user, User $model): bool
    {
        if (!$user->hasPermissionTo('manage_users')) {
            return false;
        }

        // Impede que o usuário altere seu próprio status ativo/inativo
        // Isso deve ser feito através do perfil ou por outro administrador
        if ($user->id === $model->id && request()->has('is_active')) {
            return false;
        }

        // Impede alteração de super_user (proteção adicional de segurança)
        if ($model->hasRole('super_user')) {
            // Permite apenas que o próprio super_user se atualize, mas não pode alterar is_active
            if ($user->id !== $model->id) {
                return false;
            }

            // Se for o próprio super_user, pode atualizar mas não pode alterar is_active
            if ($user->id === $model->id && request()->has('is_active')) {
                return false;
            }
        }

        return true;
    }

    public function delete(User $user, User $model): bool
    {
        if (!$user->hasPermissionTo('manage_users')) {
            return false;
        }

        // Impede auto-exclusão
        if ($user->id === $model->id) {
            return false;
        }

        // Impede exclusão de super_user (proteção adicional de segurança)
        if ($model->hasRole('super_user')) {
            return false;
        }

        return true;
    }

    public function toggleActive(User $user, User $model): bool
    {
        if (!$user->hasPermissionTo('manage_users')) {
            return false;
        }

        // Impede que o usuário desative a si mesmo
        if ($user->id === $model->id) {
            return false;
        }

        // Impede desativação de super_user (proteção adicional de segurança)
        if ($model->hasRole('super_user')) {
            return false;
        }

        return true;
    }
}
