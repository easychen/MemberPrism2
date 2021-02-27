<?php

namespace App\Http\Livewire\Prism\Admin;
use App\Models\Settings as SettingsModel;
use Livewire\Component;
use Carbon\Carbon;

class Settings extends Component
{
    public $settings;
    public $state ;

    public function mount()
    {
        $settings = SettingsModel::find(1);
        if( $settings ) $settings = $settings->toArray();
        $this->settings = $settings;
        $this->state = $this->settings;
    }

    protected $rules = [
        'state.app_name' => 'string|nullable',
        'state.app_url' => 'string|nullable',
        'state.app_logo_url' => 'string|nullable',
        'state.app_icon_url' => 'string|nullable',
        'state.app_title' => 'string|nullable',
        'state.app_detail' => 'string|nullable',
        'state.mail_host' => 'string|nullable',
        'state.mail_port' => 'string|nullable',
        'state.mail_username' => 'string|nullable',
        'state.mail_password' => 'string|nullable',
        'state.mail_from_address' => 'string|nullable',
        'state.stripe_key' => 'string|nullable',
        'state.stripe_secret' => 'string|nullable',
        'state.prism_jwt_key' => 'string|nullable',
        'state.prism_target_url' => 'string|nullable',
        'state.prism_source_url' => 'string|nullable',
    ];

    public function save()
    {
        $vdata = $this->validate();
        $vdata['state']['updated_at'] = Carbon::now()->format('Y-m-d H:i:s');

        foreach( ['prism_target_url','prism_source_url','app_url'] as $field )
        {
            $vdata['state'][$field] = rtrim( $vdata['state'][$field], '/' );
        }


        // SettingsModel::find(1)->update( $vdata['state'] );
        SettingsModel::updateOrCreate( ['id'=>1] , $vdata['state'] );
        file_put_contents( storage_path() . '/settings.json' , json_encode(( $vdata['state'] )) );

        prism_save_rules();

        $this->emit('saved');
        redirect()->route('settings');
    }

    public function gen()
    {
        $this->emit('gened');
        prism_save_rules();
    }


    public function render()
    {
        return view('livewire.prism.admin.settings');
    }
}
