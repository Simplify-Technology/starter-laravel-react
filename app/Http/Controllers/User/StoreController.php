<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;

class StoreController extends Controller
{
    public function __invoke(StoreUserRequest $request): RedirectResponse
    {
        $this->authorize('create', \App\Models\User::class);

        $data = $request->validated();

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return redirect()
            ->route('users.show', $user)
            ->with('success', 'Usuário criado com sucesso!');
    }
}
