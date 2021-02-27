<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('app_name')->nullable();
            $table->string('app_url')->nullable();
            $table->string('app_logo_url')->nullable();
            $table->string('app_icon_url')->nullable();
            $table->string('app_title')->nullable();
            $table->string('app_detail')->nullable();

            $table->string('mail_host')->nullable();
            $table->string('mail_port')->nullable();
            $table->string('mail_username')->nullable();
            $table->string('mail_password')->nullable();
            $table->string('mail_from_address')->nullable();

            $table->string('stripe_key')->nullable();
            $table->string('stripe_secret')->nullable();

            $table->string('prism_jwt_key')->nullable();
            $table->string('prism_target_url')->nullable();
            $table->string('prism_source_url')->nullable();


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
        Schema::dropIfExists('settings');
    }
}
