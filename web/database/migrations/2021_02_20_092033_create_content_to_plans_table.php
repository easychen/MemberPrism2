<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContentToPlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('content_plans', function (Blueprint $table) {
            $table->foreignId('content_id');
            $table->foreignId('plans_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('content_plans', function (Blueprint $table) {
            Schema::dropIfExists('content_plans');
        });
    }
}
