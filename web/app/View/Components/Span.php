<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Span extends Component
{
    // public $content;
    public $color;
    public $bg;
    public $class;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct( $bg='bg-blue-200' , $color='text-gray-600', $class='' )
    {
        // $this->content = $content;
        $this->color = $color;
        $this->bg = $bg;
        $this->class = $class;
        // dd( $color );
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('components.span');
    }
}
