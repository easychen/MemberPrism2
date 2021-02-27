<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Plan;
use Livewire\Component;

class PlanModify extends Component
{
    public $plan;
    public $state ;

    public function mount()
    {
        $this->state = $this->plan;
    }

    protected $rules = [
        'state.name' => 'required|string',
        'state.stripe_price_id' => 'required|string'
    ];

    public function save()
    {
        $vdata = $this->validate();
        Plan::where('id',$this->plan['id'])->update( $vdata['state'] );
        $this->emit('saved');
        prism_save_rules();
        redirect()->route('plans.list');
    }

    public function render()
    {
        return view('livewire.prism.admin.plan-modify');
    }
}
