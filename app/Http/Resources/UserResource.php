<?php

declare(strict_types = 1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class UserResource extends JsonResource
{
    public bool $preserveKeys = true;

    public function toArray(Request $request): array
    {
        $currentUser = $request->user();

        return [
            'id'                       => $this->id,
            'name'                     => $this->name,
            'email'                    => $this->email,
            'cpf_cnpj'                 => $this->cpf_cnpj,
            'phone'                    => $this->phone,
            'mobile'                   => $this->mobile,
            'is_active'                => $this->is_active,
            'role'                     => $this->role,
            'permissions'              => $this->permissions,
            'custom_permissions_count' => $this->getCustomPermissionsCount(),
            'custom_permissions_list'  => $this->getCustomPermissionsList(),
            'created_at'               => $this->created_at,
            'updated_at'               => $this->updated_at,
            'can_impersonate'          => $currentUser?->canImpersonate($this->resource) ?? false,
        ];
    }
}
