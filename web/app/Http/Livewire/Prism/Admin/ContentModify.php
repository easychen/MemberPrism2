<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Content;
use Livewire\Component;

class ContentModify extends Component
{
    public $content ;
    public $state ;
    public $match_types = [
        '1' => 'StartWith',
        '2' => 'ExactMatch',
    ];

    public function mount()
    {
        $this->state = $this->content;
    }

    protected $rules = [
        'state.name' => 'required|string',
        'state.url' => 'required|string',
        'state.match' => 'required|integer',
        'state.redirect_url' => 'required|string',
    ];

    public function save()
    {
        $vdata = $this->validate();
        Content::where('id',$this->content['id'])->update( $vdata['state'] );
        $this->emit('saved');
        prism_save_rules();
        redirect()->route('content.list');
    }

    public function render()
    {
        return view('livewire.prism.admin.content-modify');
    }
}
