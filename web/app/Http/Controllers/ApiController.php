<?php

namespace App\Http\Controllers;
use \Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Plan;
use App\Models\Content;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ApiController extends Controller
{
    public function payback(Request $request)
    {
        // 订阅完成
        // 并不进行数据库处理，其他全部通过 webhook 进行处理

        // 检查 jwt 数据 和 client_reference_id 是否一致
        $session_id = $request->input('session_id');
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));

        $ret = $stripe->checkout->sessions->retrieve(
            $session_id,
            []
        );

        $the_uid = prism_jwt_get_uid( $ret['metadata']['jwt'] );
        if( $the_uid != $ret['client_reference_id'] )
        {
            return abort(403,'Bad user info');
        }

        // 更新 plan 对应的用户数
        prism_update_plan_members_count();

        $url = env( 'PRISM_TARGET_URL' , env('PRISM_SOURCE_URL') );

        return response( "<script>window.location='".$url."'</script>" )->header( 'Location' , $url );

    }

    public function stripeport(Request $request)
    {
        $uid = prism_jwt_get_uid( $request->bearerToken() );
        $user = User::find( $uid );
        $user->createOrGetStripeCustomer();
        $url = $user->billingPortalUrl(env('PRISM_TARGET_URL'));
        if( $url )
            return ['url'=>$url];
        else return false;
    }

    public function subscribe(Request $request)
    {
        $plan_id = intval($request->input('id'));
        $plan = Plan::find($plan_id);
        $uid = prism_jwt_get_uid( $request->bearerToken() );
        $user = User::find( $uid );
        $stripeCustomer = $user->createOrGetStripeCustomer();

        // 检查当前用户是否已经订阅
        $subscriptions = $user->subscriptions()->active()->get()->toArray();
        if( count($subscriptions) > 0 )
        {
            prism_show_error( 'Already has a subscription' );
            return false;
        }


        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));

        $session = $stripe->checkout->sessions->create([
            'customer' => $stripeCustomer['id'],
            'client_reference_id'=>$uid,
            'metadata'=>[
                'jwt' => $request->bearerToken()
            ],
            'payment_method_types' => ['card'],
            'line_items' => [[
              'price' => $plan->stripe_price_id,
              'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => route('stripe.payback').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => env('PRISM_TARGET_URL').'/',
          ]);

        return $session;
    }

    public function lock(Request $request)
    {
        // 读取所有的保护区域
        $contents = Content::where(['enabled'=>1])->get()->toArray();
        // 加载所有的 lock
        // $content_ids = $contents->pluck('id');
        // return $content_ids;
        $price_ids = [];

        $uid = prism_jwt_get_uid( $request->bearerToken() );
        if( $uid )
        {
            $user = User::find($uid);

            if( prism_check_plan( $user ) )
            {
                // check user expired
                $price_ids = $user->subscriptions()->active()->pluck('stripe_plan');
                $my_plan_ids = Plan::whereIn( 'stripe_price_id', $price_ids )->pluck('id');
                $my_content_ids = DB::table('content_plans')->whereIn( 'plans_id' , $my_plan_ids )->pluck('content_id');

                // 读取已经订阅的 content
                if( count($my_content_ids) )
                {
                    foreach( $my_content_ids as $my_content_id )
                    {
                        $contents = array_filter( $contents, function( $item ) use( $my_content_id )
                        {
                            return $item['id'] != $my_content_id;
                        });
                    }
                }
            }
        }


        $ret = [];
        foreach( $contents as $thecontent )
        {
            $ret[] = [
                'path'=>$thecontent['url'],
                'match'=>$thecontent['match'],
                'redir'=>$thecontent['redirect_url'],
            ];
        }


        return ['locks'=>$ret,'is_member'=>intval($uid)];
    }

    //
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);


        if (!$user = User::where(['email'=>$validated['email']])->first()) {
            throw ValidationException::withMessages([
            'email' => ['Email not exists.'],
        ]);
        }

        if ($user['level'] < 1) {
            throw ValidationException::withMessages([
            'level' => ['User not available.'],
        ]);
        }

        if (!Hash::check($validated['password'], $user['password'])) {
            throw ValidationException::withMessages([
            'password' => ['Password error.'],
        ]);
        }

        // 这里添加 content_id
        // content_id
        $price_ids = $user->subscriptions()->active()->pluck('stripe_plan');
        $my_plan_ids = Plan::whereIn( 'stripe_price_id', $price_ids )->pluck('id');
        $my_content_ids = DB::table('content_plans')->whereIn( 'plans_id' , $my_plan_ids )->pluck('content_id');

        if( $my_content_ids && count($my_content_ids) >= 1 )
        {
            $new_ids = [];
            foreach( $my_content_ids as $id )
            {
                $new_ids[] = (String)$id;
            }
            $my_content_ids = $new_ids;
        }
        else
        {
            $my_content_ids = [];
        }

        $payload = [
            'content_ids' => $my_content_ids,
            'uid' => $user['id'],
            'level' => $user['level'],
            'expire' => date( "Y-m-d" , strtotime("+".env("PRISM_MEMBER_EXPIRE_DAYS")."days")),
        ];

        $jwt = JWT::encode($payload, env('PRISM_JWT_KEY'));
        return ['jwt'=>$jwt,'payload'=>$payload];

    }
}
