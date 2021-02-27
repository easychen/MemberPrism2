<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Content;
use Livewire\Component;

class ContentItem extends Component
{
    public $content;

    public function enable( $status )
    {
        $new_status = $status == 1 ? 1 : 0;
        Content::where( 'id' , $this->content['id'] )->update( ['enabled' => $new_status] );
        $this->content['enabled'] = $new_status;

    }

    public function edit()
    {
        redirect()->route('content.modify',['content'=>$this->content['id']]);
    }

    public function render()
    {
        return view('livewire.prism.admin.content-item');
    }
}
