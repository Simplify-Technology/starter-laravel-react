<?php

declare(strict_types = 1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

final class GrantPermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::user()?->hasRole(\App\Enum\Roles::SUPER_USER) ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'permission' => [
                'required',
                'string',
                Rule::exists('permissions', 'name'),
            ],
            'can_impersonate_any' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'permission.required'         => 'O campo permissão é obrigatório.',
            'permission.exists'           => 'A permissão selecionada não existe.',
            'can_impersonate_any.boolean' => 'O campo deve ser verdadeiro ou falso.',
        ];
    }
}
