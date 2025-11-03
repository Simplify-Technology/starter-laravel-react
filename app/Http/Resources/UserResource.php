<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public bool $preserveKeys = true;

    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'cpf_cnpj'   => $this->cpf_cnpj,
            'phone'      => $this->phone,
            'mobile'     => $this->mobile,
            'is_active'  => $this->is_active,
            'user_notes' => $this->user_notes,
            'role'       => $this->whenLoaded('role', function() {
                if ($this->role === null) {
                    return null;
                }

                return [
                    'id'    => $this->role->id,
                    'name'  => $this->role->name,
                    'label' => $this->role->label,
                ];
            }),
            'permissions' => $this->whenLoaded('permissions', fn() => $this->permissions?->map(fn($perm) => [
                'name'  => $perm->name,
                'label' => $perm->label,
            ]) ?? []),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
