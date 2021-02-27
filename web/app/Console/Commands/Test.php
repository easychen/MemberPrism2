<?php

namespace App\Console\Commands;
use \Firebase\JWT\JWT;
use Illuminate\Console\Command;

class Test extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cmd:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        prism_save_rules();
        return ;

        $out = new \stdClass();
        $out->content_ids = [0=>"1"];
        $out->uid = 4;
        $out->level = 6;
        $out->expire = "2021-03-28";

        echo JWT::encode( $out, env('PRISM_JWT_KEY') );
        echo "\r\n---------------";

    }
}
