<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        if( !$user = DB::table('users')->where(['name'=>'admin'])->first() )
        DB::table('users')->insert([
            'name' => 'admin',
            'email' => 'admin@memberprism.com',
            'password' => Hash::make('admin'),
            'level' => 9,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);

        if( !$settings = DB::table('settings')->where(['id'=>1])->first() )
        DB::table('settings')->insert([
            'id'=>1,
            'prism_jwt_key' => Str::random(16),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);
    }
}
