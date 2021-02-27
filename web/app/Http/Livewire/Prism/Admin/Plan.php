<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Plan as PlanModel;
use Livewire\Component;

class Plan extends Component
{
    public $plans = [];

    public function mount()
    {
        prism_update_plan_members_count();
        $plans = PlanModel::all();
        // $this->plans = $plans ? $plans->toArray():[];
        $this->plans = $plans;
    }

    public function create()
    {
        return redirect()->route('plans.create');
    }

    public function render()
    {
        return view('livewire.prism.admin.plan');
    }
}
