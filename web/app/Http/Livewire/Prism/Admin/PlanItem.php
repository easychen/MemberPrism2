<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Plan;
use App\Models\Content;
use Livewire\Component;

class PlanItem extends Component
{
    public $plan;
    public $add = false;
    public $contents = [];
    public $selected_contents = [];

    public function mount()
    {
        $all = Content::all();
        if( $all ) $this->contents = $all->toArray();
        $this->selected_contents = $this->plan->contents()->pluck('id');
    }

    public function toggle_add( $status )
    {
        $this->add = $status == 'true';
    }

    public function save_content()
    {
        $plan = Plan::find($this->plan['id']);
        $plan->contents()->sync( $this->selected_contents );
        $new_plan = Plan::find($this->plan['id']);
        $this->selected_contents = $new_plan->contents()->pluck('id');
        $this->plan = $new_plan;
        prism_save_rules();
        $this->add = false;
        //dd( $this->selected_contents );
    }


    public function enable( $status )
    {
        $new_status = $status == 1 ? 1 : 0;
        Plan::where( 'id' , $this->plan['id'] )->update( ['enabled' => $new_status] );
        $this->plan['enabled'] = $new_status;

    }

    public function edit()
    {
        redirect()->route('plans.modify',['plan'=>$this->plan['id']]);
    }

    public function render()
    {
        return view('livewire.prism.admin.plan-item');
    }
}
