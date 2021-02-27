<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Plan;
use Livewire\Component;

class PlanCreate extends Component
{
    public $state = [
        'name' => null,
        'stripe_price_id' => null
    ];

    protected $rules = [
        'state.name' => 'required|string',
        'state.stripe_price_id' => 'required|string',
    ];

    public function save()
    {
        $this->validate();
        Plan::create( $this->state );
        $this->emit('saved');
        redirect()->route('plans.list');
    }

    public function render()
    {
        return view('livewire.prism.admin.plan-create');
    }
}
