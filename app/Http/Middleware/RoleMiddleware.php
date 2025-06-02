<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (! Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user = Auth::user();

        // Assuming your User model has a 'role' relationship and a 'name' attribute on the role.
        // Also assuming you have a hasRole method on your User model as per the guide.
        if (($user->role != $role)) {
            return response()->json(['message' => [
                $user->role,
                $role,
            ]], 403); // 403 Forbidden
        }

        return $next($request);
    }
}
