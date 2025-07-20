<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TryAuthenticate
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::guard('sanctum')->check() || Auth::guard('web')->check()) {
            return $next($request);
        }
    }
}
