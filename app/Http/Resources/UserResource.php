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
            'id'          => $this->id,
            'name'        => $this->name,
            'email'       => $this->email,
            'cpf_cnpj'    => $this->cpf_cnpj,
            'phone'       => $this->phone,
            'mobile'      => $this->mobile,
            'is_active'   => $this->is_active,
            'role'        => $this->role,
            'permissions' => $this->permissions,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}
