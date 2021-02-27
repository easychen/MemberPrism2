<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Content as ContentModel;
use Livewire\Component;

class Content extends Component
{
    public $contents = [];

    public function mount()
    {
        $contents = ContentModel::all();
        $this->contents = $contents ? $contents->toArray():[];
    }

    public function create()
    {
        return redirect()->route('content.create');
    }

    public function render()
    {
        return view('livewire.prism.admin.content');
    }
}
