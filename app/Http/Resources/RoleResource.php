<?php

declare(strict_types = 1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class RoleResource extends JsonResource
{
    public bool $preserveKeys = true;

    /** @return array<string, mixed> */
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

    /**
     * Transform a collection of roles to a numeric array for frontend use.
     * This ensures compatibility with React components that expect arrays.
     *
     * @param Collection $roles Collection of Role models
     * @param Request $request
     * @return array<int, array<string, mixed>>
     */
    public static function toArrayCollection(Collection $roles, Request $request): array
    {
        return static::collection($roles)
            ->values()
            ->toArray($request);
    }
}
