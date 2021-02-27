<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Plan;
use Livewire\Component;

class Links extends Component
{
    public $links = [];
    public $codes = [];


    public function mount()
    {
        // 添加用到的 links
        $this->links[] = [
            'name' => 'Register',
            'usage' => 'user register',
            'link' => '#prism-ajax-register',
        ];

        $this->links[] = [
            'name' => 'Login',
            'usage' => 'User login',
            'link' => '#prism-ajax-login',
        ];

        $this->links[] = [
            'name' => 'Reset password',
            'usage' => 'Reset password via email',
            'link' => '#prism-ajax-forget',
        ];

        $this->links[] = [
            'name' => 'Profile',
            'usage' => 'Member info, subscription and logout',
            'link' => '#prism-ajax-member-profile',
        ];

        $plans = Plan::where(['enabled'=>1])->get();
        // ddd ( $plans );
        foreach( $plans as $plan )
        {
            $this->links[] = [
                'name' => 'Subscribe '.$plan->name,
                'usage' => 'Subscribe the plan',
                'link' => '#prism-sub-'.$plan->id,
            ];
        }

        $head_code = str_replace( '{APP_URL}' , env('APP_URL') , file_get_contents( resource_path().'/site/headcode.html' ) );

        $this->codes[] = [
            'name' => 'Head scripts',
            'usage' => 'add to <head>...</head> ',
            'code' => $head_code,
            'textarea' => 1
        ];

        $this->codes[] = [
            'name' => 'Member Show Class',
            'usage' => 'add to <...class=""></...> ',
            'code' => 'prism-member-show',
        ];

        $this->codes[] = [
            'name' => 'Member Hide Class',
            'usage' => 'add to <...class=""></...> ',
            'code' => 'prism-member-hide',
        ];

        // <a href="#prism-ajax-register" class="prism-member-hide">Register</a>
        $this->codes[] = [
            'name' => 'Register Code',
            'usage' => 'add to HTML <body>...</body> ',
            'code' => '<a href="#prism-ajax-register" class="prism-member-hide">Register</a>',
        ];

        $this->codes[] = [
            'name' => 'Login Code',
            'usage' => 'add to HTML <body>...</body> ',
            'code' => '<a href="#prism-ajax-login" class="prism-member-hide">Login</a>',
        ];

        $this->codes[] = [
            'name' => 'Profile Code',
            'usage' => 'add to HTML <body>...</body> ',
            'code' => '<a href="#prism-ajax-member-profile" class="prism-member-show">Profile</a>',
        ];


        $this->codes[] = [
            'name' => 'Logout Code',
            'usage' => 'add to HTML <body>...</body> ',
            'code' => '<a href="javascript:prism_kit.user_logout();void(0)" class="prism-member-show">Logout</a>',
        ];
    }

    public function render()
    {
        return view('livewire.prism.admin.links');
    }
}
