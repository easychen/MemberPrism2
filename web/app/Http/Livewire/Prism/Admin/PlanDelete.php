<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Plan;
use Livewire\Component;

class PlanDelete extends Component
{
    public $plan ;
    public $confirm = false;

    public function confirm()
    {
        $this->confirm = true;
    }

    public function cancel()
    {
        $this->confirm = false;
    }

    public function delete()
    {
        if( $this->plan['member_count'] > 0 ) $this->addError('info', 'cannot remove plan which not empty.');
        Plan::where('id',$this->plan['id'])->delete();
        $this->emit('saved');
        redirect()->route('plans.list');
    }


    public function render()
    {
        return view('livewire.prism.admin.plan-delete');
    }
}
