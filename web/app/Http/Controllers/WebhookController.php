<?php

namespace App\Http\Controllers;

// use App\Models\Plan;
use App\Models\Payinfo;
use App\Models\User;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use Illuminate\Http\Request;

class WebhookController extends CashierController
{
    public function __construct()
    {
        parent::__construct();
    }
    //
    // protected function handleCustomerSubscriptionDeleted(array $payload)
    // {
    //     $data = $payload['data']['object'];

    //     $sub_id = $data["id"];
    //     $customer_id = $data["customer"];

    //     if ($user = User::where(['stripe_id'=>$customer_id,'stripe_scription_id'=>$sub_id])->first()) {

    //         // remove do instance
    //         // do this in cronjob
    //         // if (strlen($user->do_instance_id) > 0) {
    //         //     remove_do_instance($user->do_instance_id);
    //         // }
    //         // $user->do_instance_id = null;
    //         // $user->do_ip = null;
    //         //$user->do_status = null;

    //         // update subscription and instance info in user table
    //         $user->stripe_scription_id = null;
    //         $user->stripe_price_id = null;


    //         $user->save();
    //     }

    //     return $this->successMethod();
    // }

    // protected function handleCustomerSubscriptionCreated(array $payload)
    // {
    //     return $this->successMethod();
    // }

    protected function handleChargeRefunded(array $payload)
    {
        // file_put_contents(app_path().'/log.refund.json', json_encode($payload));
        // 退款逻辑
        $data = $payload['data']['object'];
        $refund = $data['refunds']['data'][0];
        // 确认退款状态
        if( $refund && $refund["status"] == 'succeeded' )
        {
            // 使用余额支付，则没有charge
            if( strlen($refund['charge']) > 0 )
            {
                // 提取支付记录
                $pay = Payinfo::where(['stripe_charge_id'=>$refund['charge']])->first();

                // 修改用户过期时间
                if ($user = User::where(['stripe_id'=>$data['customer']])->first()) {

                    // 修改会员期
                    if( strlen( $pay["duration"] ) > 0 )
                    {
                        $new_time = strtotime($user->subscription_expire_date . " " . str_replace( "+" , "-" , $pay["duration"] ));

                        if( $new_time < time() ) $new_time = time();

                        $new_date = date("Y-m-d", $new_time);
                        $user->subscription_expire_date = $new_date;
                        $user->save();
                    }
                }
            }
        }
        return $this->successMethod();
    }

    protected function handleInvoicePaid(array $payload)
    {
        $event_id = $payload['id'];

        if( Payinfo::where(['stripe_event_id'=>$event_id])->first() )
        {
            // 已经处理过了
            return $this->successMethod();
        }
        $data = $payload['data']['object'];

        // 确认支付信息
        if ($data['paid'] == true) {
            $price = $data['lines']['data'][0]['price'];

            $recurring_info = $price['recurring'];

            $date_to_append = " +".$recurring_info['interval_count'] . $recurring_info['interval'];

            // 获得支付用户
            if ($user = User::where(['stripe_id'=>$data['customer']])->first()) {

                // 修改会员期
                $start_date = strtotime($user->subscription_expire_date) > time() ? $user->subscription_expire_date : date("Y-m-d");

                $new_time = strtotime($start_date .$date_to_append);

                $new_date = date("Y-m-d", $new_time);
                $user->subscription_expire_date = $new_date;

                // 保存支付记录
                Payinfo::create( [
                    'uid' => $user->id,
                    'stripe_event_id' => $payload['id'],
                    'stripe_price_id' => $price['id'],
                    'stripe_charge_id' => $data['charge'],
                    'old_expire_date' => $start_date,
                    'duration' =>  $date_to_append,
                    'record' => json_encode( $payload ),
                ] );

                // payinfo 保存成功以后再支付
                $user->save();
            }
        }


        return $this->successMethod();
    }

    // protected function handleInvoiceCreated(array $payload)
    // {
    //     /*
    //      * https://stripe.com/docs/billing/subscriptions/webhooks#understand
    //      * To summarize: If Stripe fails to receive a successful response to invoice.created, then finalizing all invoices with automatic collection will be delayed for up to 72 hours. Responding properly to invoice.created includes handling all webhook endpoints configured for your account, along with the webhook endpoints of any platforms to which you’ve connected. Updating a subscription in a way that synchronously attempts payment (on the initial invoice, and on some kinds of updates) does not cause this webhook wait.
    //     */
    //     return $this->successMethod();
    // }
}
