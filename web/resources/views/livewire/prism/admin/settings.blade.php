<x-jet-form-section submit="save">
    <x-slot name="title">
        {{ __('Settings') }}
    </x-slot>

    <x-slot name="description">

    </x-slot>

    <x-slot name="form">
        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="app_name" value="{{ __('Site Name') }}" />
            <x-jet-input id="app_name" type="text" class="mt-1 block w-full" wire:model.defer="state.app_name" />
            <x-jet-input-error for="state.app_name" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="app_url" value="{{ __('Site URL') }}" />
            <x-jet-input id="app_url" type="text" class="mt-1 block w-full" wire:model.defer="state.app_url" />
            <x-jet-input-error for="state.app_url" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="app_logo_url" value="{{ __('Site Logo URL, in welcome page') }}" />
            <x-jet-input id="app_logo_url" type="text" class="mt-1 block w-full" wire:model.defer="state.app_logo_url" />
            <x-jet-input-error for="state.app_logo_url" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="app_icon_url" value="{{ __('Site Icon URL') }}" />
            <x-jet-input id="app_icon_url" type="text" class="mt-1 block w-full" wire:model.defer="state.app_icon_url" />
            <x-jet-input-error for="state.app_icon_url" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="mail_host" value="{{ __('Mail Host(SMTP)') }}" />
            <x-jet-input id="mail_host" type="text" class="mt-1 block w-full" wire:model.defer="state.mail_host" />
            <x-jet-input-error for="state.mail_host" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="mail_port" value="{{ __('Mail Port(SMTP)') }}" />
            <x-jet-input id="mail_port" type="text" class="mt-1 block w-full" wire:model.defer="state.mail_port" />
            <x-jet-input-error for="state.mail_port" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="mail_username" value="{{ __('Mail Username(SMTP)') }}" />
            <x-jet-input id="mail_username" type="text" class="mt-1 block w-full" wire:model.defer="state.mail_username" />
            <x-jet-input-error for="state.mail_username" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="mail_password" value="{{ __('Mail password(SMTP)') }}" />
            <x-jet-input id="mail_password" type="password" class="mt-1 block w-full" wire:model.defer="state.mail_password" />
            <x-jet-input-error for="state.mail_password" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="mail_from_address" value="{{ __('Mail from address') }}" />
            <x-jet-input id="mail_from_address" type="text" class="mt-1 block w-full" wire:model.defer="state.mail_from_address" />
            <x-jet-input-error for="state.mail_from_address" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="stripe_key" value="{{ __('Stripe publishable key') }}" />
            <x-jet-input id="stripe_key" type="text" class="mt-1 block w-full" wire:model.defer="state.stripe_key" />
            <x-jet-input-error for="state.stripe_key" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="stripe_secret" value="{{ __('Stripe secret key') }}" />
            <x-jet-input id="stripe_secret" type="text" class="mt-1 block w-full" wire:model.defer="state.stripe_secret" />
            <x-jet-input-error for="state.stripe_secret" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="prism_jwt_key" value="{{ __('JWT secret, make it unique') }}" />
            <x-jet-input id="prism_jwt_key" type="text" class="mt-1 block w-full" wire:model.defer="state.prism_jwt_key" />
            <x-jet-input-error for="state.prism_jwt_key" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="prism_target_url" value="{{ __('Proxy site URL') }}" />
            <x-jet-input id="prism_target_url" type="text" class="mt-1 block w-full" wire:model.defer="state.prism_target_url" />
            <x-jet-input-error for="state.prism_target_url" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="prism_source_url" value="{{ __('Source site URL') }}" />
            <x-jet-input id="prism_source_url" type="text" class="mt-1 block w-full" wire:model.defer="state.prism_source_url" />
            <x-jet-input-error for="state.prism_source_url" class="mt-2" />
        </div>





    </x-slot>

    <x-slot name="actions">
        <x-jet-action-message class="mr-3" on="gened">
            {{ __('Generated.') }}
        </x-jet-action-message>

        <x-jet-secondary-button wire:click="gen" class="mr-3">
            {{ __('Update proxy settings') }}
        </x-jet-secondary-button>

        <x-jet-action-message class="mr-3" on="saved">
            {{ __('Saved.') }}
        </x-jet-action-message>

        <x-jet-button >
            {{ __('Save') }}
        </x-jet-button>


    </x-slot>
</x-jet-form-section>
