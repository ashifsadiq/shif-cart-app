<?php
namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        return UserResource::collection(User::paginate());
    }
    public function show(User $user)
    {
        return new UserResource($user);
    }
    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'name'  => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'unique:users,email,' . $user->id],
            'role'  => ['sometimes', 'required', 'string', 'exists:roles,name'],
        ]);
        $user->update($validatedData);
        $user->save();
        return new UserResource($user);
    }
}
