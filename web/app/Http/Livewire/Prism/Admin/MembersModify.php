<?php

namespace App\Http\Livewire\Prism\Admin;
use Illuminate\Support\Facades\Hash;
use Livewire\Component;
use App\Models\User;

class MembersModify extends Component
{

    public $user;
    public $state ;

    public function mount()
    {
        $this->state = $this->user;
    }

    protected $rules = [
        'state.name' => 'required|string',
        'state.email' => 'required|email',
        'state.subscription_expire_date' => 'required|date',
    ];

    public function save()
    {
        $vdata = $this->validate();
        if( isset($this->state['password']) && strlen($this->state['password']) > 0 )
        {
            $vdata['state']['password'] = Hash::make( $this->state['password'] );
        }

        User::where('id',$this->user['id'])->update( $vdata['state'] );
        $this->emit('saved');
        redirect()->route('members');
    }

    public function render()
    {
        return view('livewire.prism.admin.members-modify');
    }
}
