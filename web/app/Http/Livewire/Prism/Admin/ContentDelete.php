<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Content;
use Livewire\Component;

class ContentDelete extends Component
{
    public $content ;
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
        Content::where('id',$this->content['id'])->delete();
        $this->emit('saved');
        redirect()->route('content.list');
    }

    public function render()
    {
        return view('livewire.prism.admin.content-delete');
    }
}
