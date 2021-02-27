<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\User;
use Livewire\Component;

class Members extends Component
{
    public $members;

    public function mount()
    {
        $this->members = User::all()->toArray();
    }

    public function render()
    {
        return view('livewire.prism.admin.members');
    }
}
