<?php
use \Firebase\JWT\JWT;
use Illuminate\Validation\ValidationException;
use App\Models\Plan;
use App\Models\Settings;
use App\Models\Content;
use Illuminate\Support\Facades\DB;

function prism_version()
{
    return '0.8.001';
}

function prism_load_settings()
{
    $settings_file = storage_path().'/settings.json';
    if( file_exists( $settings_file ) )
    {
        $fields = [
            'app_name',
            'app_url',
            'app_logo_url',
            'app_icon_url',
            'app_title',
            'app_detail',
            'mail_host',
            'mail_port',
            'mail_username',
            'mail_password',
            'mail_from_address',
            'stripe_key',
            'stripe_secret',
            'prism_jwt_key',
            'prism_target_url',
            'prism_source_url',
        ];

        $settings = json_decode( file_get_contents( $settings_file ) , true );

        foreach( $fields as $field )
        {
            if( isset( $settings[$field] ) && strlen( $settings[$field] ) > 0 )
            {
                $_ENV[strtoupper($field)] = $settings[$field];
            }

        }
    }
}

function prism_check_jwt( $jwt )
{
    $ret = true;
    $payload = JWT::decode($jwt, env('PRISM_JWT_KEY'), array('HS256'));
    if( $payload->level < 1 ) $ret = false;
    if( time() > strtotime($payload->expire.' 23:59:59') ) $ret = false;
    return $ret;
}

function prism_jwt_get_uid( $jwt )
{
    if( strlen(trim($jwt)) < 1 ) return false;
    $payload = JWT::decode($jwt, env('PRISM_JWT_KEY'), array('HS256'));
    return $payload->uid ?? false;
}

function prism_show_error( $info, $name='error' )
{
    throw ValidationException::withMessages([
        $name => [$info],
    ]);

}

function prism_update_plan_members_count()
{
    $active_price_ids = Plan::where( ['enabled' => 1] )->pluck('stripe_price_id');

    if( $active_price_ids && count($active_price_ids) > 0 )
    foreach( $active_price_ids as $price_id )
    {
        $member_count = DB::table('subscriptions')->where(['stripe_status'=>'active','stripe_plan'=>$price_id])->get()->unique('user_id')->count();

        Plan::where(['stripe_price_id'=>$price_id])->update(['member_count'=>$member_count]);
    }
}

function prism_check_plan( $user )
{
    if( $user && isset( $user['subscription_expire_date'] ) )
    {
        return time() < strtotime($user['subscription_expire_date'] . ' 23:59:59' );
    }
    return false;

}

function prism_save_rules()
{
    $dir = app_path() . '/../../proxy';
    if( !file_exists($dir) ) return false;

    $settings = new \stdClass();
    $settings->debug = false;
    $settings->secret = env('PRISM_JWT_KEY');
    $settings->target = env('PRISM_SOURCE_URL');
    $settings->host = "0.0.0.0";
    $settings->port = env('PRISM_PROXY_PORT');
    $settings->https = env('PRISM_HTTPS');
    $settings->key = "/app/ssl/server.key";
    $settings->crt = "/app/ssl/server.crt";
    file_put_contents( $dir .'/settings.json' , json_encode($settings) );

    /*
    {
        "debug": false,
        "secret": "hello-im-secret",
        "target": "http://127.0.0.1:9000",
        "host": "127.0.0.1",
        "port": 10086,
        "https": false,
        "key": "server.key",
        "crt": "server.crt"
        }
        */

    $rules = new \stdClass();

    if($contents = Content::where(['enabled'=>1])->get()->toArray())
    foreach( $contents as $thecontent )
    {
        $rules->{$thecontent['id']} = [
            'content_id'=>(String)$thecontent['id'],
            'path'=>$thecontent['url'],
            'match'=>intval($thecontent['match']),
            'redir'=>$thecontent['redirect_url'],
        ];
    }
    //
    file_put_contents( $dir .'/rules.json' , json_encode($rules) );
}
