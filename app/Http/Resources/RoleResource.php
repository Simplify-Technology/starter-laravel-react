<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    public bool $preserveKeys = true;

    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'label'       => $this->label,
            'permissions' => $this->whenLoaded('permissions', fn() => $this->permissions?->map(fn($perm) => [
                'name'  => $perm->name,
                'label' => $perm->label,
            ]) ?? []),
            'users'      => $this->whenLoaded('users'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
