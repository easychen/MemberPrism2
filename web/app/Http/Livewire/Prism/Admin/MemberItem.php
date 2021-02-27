<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\User;
use Livewire\Component;

class MemberItem extends Component
{
    public $member;
    public $admin_action = false;

    public function edit()
    {
        redirect()->route('members.modify',['user'=>$this->member['id']]);
    }

    public function change( $status )
    {
        $new_level = $status == 'user' ? 1 : 6;
        User::where( 'id' , $this->member['id'] )->update( ['level' => $new_level] );
        $this->member['level'] = $new_level;

    }

    public function render()
    {
        return view('livewire.prism.admin.member-item');
    }
}
