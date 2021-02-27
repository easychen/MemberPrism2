<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Content;
use Livewire\Component;

class ContentCreate extends Component
{
    public $match_types = [
        '1' => 'StartWith',
        '2' => 'ExactMatch',
    ];

    public $state = [
        'name' => null,
        'url' => null,
        'match' => '1',
        'redirect_url' => null,
    ];

    protected $rules = [
        'state.name' => 'required|string',
        'state.url' => 'required|string',
        'state.match' => 'required|integer',
        'state.redirect_url' => 'required|string',
    ];

    public function save()
    {
        $this->validate();
        Content::create( $this->state );
        $this->emit('saved');
        prism_save_rules();
        redirect()->route('content.list');
    }




    public function render()
    {
        return view('livewire.prism.admin.content-create');
    }
}
