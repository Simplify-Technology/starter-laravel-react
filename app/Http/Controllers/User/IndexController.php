<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function __invoke(Request $request)
    {
        $users = UserResource::collection(User::whereIsActive(true)->get());

        return inertia('users/index', [
            'users' => $users->toArray($request),
        ]);
    }
}
