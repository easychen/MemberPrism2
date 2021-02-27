<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Http\Request;

class AssertController extends Controller
{
    //
    public function js()
    {
        $js = file_get_contents( resource_path() . '/site/dist/app.js' );
        $js = str_replace( '{stripe_key}' , env('STRIPE_KEY') , $js );
        $js = str_replace( '{app_url}' , env('APP_URL') , $js );
        return response( $js )->header( 'Content-Type' , 'application/javascript' );
    }

    public function css()
    {
        $css = file_get_contents( resource_path() . '/site/dist/app.css' );
        return response( $css )->header( 'Content-Type' , 'text/css' );
    }

    public function page( $page_name )
    {
        $page_name = basename(strtolower($page_name));
        $member_prefix = 'member-';

        if( substr( $page_name , 0 , strlen($member_prefix) ) == $member_prefix )
        {
            $jwt = request()->bearerToken() ;

            // 检查用户权限
            if( $jwt && prism_check_jwt( $jwt ) )
            {
                // 去掉前缀
                $page_name = substr($page_name, strlen($member_prefix) , strlen($page_name) );
            }
            else
            {
                // 强制登入
                $page_name = 'login';
            }
        }
        $data = null;
        $url = null;
        switch( $page_name )
        {
            case 'forget':
                $page_name = 'user';
                $type = 'forget';
                break;
            case 'register':
                $page_name = 'user';
                $type = 'sign-up';
                break;
            case 'login':
                $page_name = 'user';
                $type = 'sign-in';
                break;
            case 'profile':
                if( !isset($jwt) )
                {
                    $page_name = 'user';
                    $type = 'sign-in';
                    break;
                }

                $page_name = 'profile';
                $type = 'profile';
                // 取得当前用户的基本信息
                $uid = prism_jwt_get_uid($jwt);
                $user = User::where(['id'=>$uid])->first();
                $subscriptions = $user->subscriptions()->active()->get()->toArray();
                Plan::where(['enabled'=>1])->each( function( $item ) use ( &$subscriptions )
                {
                    foreach( $subscriptions as $key => $subscription )
                    {
                        if( $subscription['stripe_plan'] == $item['stripe_price_id'] )
                        {
                            $subscriptions[$key]['name'] = $item['name'];
                        }
                    }
                });
                //$user->createOrGetStripeCustomer();
                //$url = $user->billingPortalUrl(env('PRISM_TARGET_URL'));
                $url = '';
                $data = [
                    'url'=>$url,
                    'user'=>$user->toArray(),'subscriptions'=>$subscriptions];
                break;

        }

        $view_name = 'page.'.$page_name;
        if (view()->exists($view_name))
        {


            return view($view_name,['type'=>$type,'data'=>$data]);
        }
        else abort(500,'view not exists');

    }
}
