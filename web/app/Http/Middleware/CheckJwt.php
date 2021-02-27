<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckJwt
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $jwt = $request->bearerToken();
        if( $jwt && prism_check_jwt( $jwt ) )
        {

        }
        else
        {
            return abort(403,'Login first');
        }
        return $next($request);
    }
}
