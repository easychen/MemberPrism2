<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayinfoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payinfo', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('uid');
            $table->string('stripe_event_id');
            $table->string('stripe_price_id');
            $table->string('stripe_charge_id')->nullable();
            $table->date('old_expire_date')->nullable();
            $table->string('duration');
            $table->text('record');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('payinfo', function (Blueprint $table) {
            Schema::dropIfExists('payinfo');
        });
    }
}
