<x-jet-form-section submit="save">
    <x-slot name="title">
        {{ __('Modify the plan') }}
    </x-slot>

    <x-slot name="description">

    </x-slot>

    <x-slot name="form">
        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="name" value="{{ __('Name') }}" />
            <x-jet-input id="name" type="text" class="mt-1 block w-full" wire:model.defer="state.name" />
            <x-jet-input-error for="state.name" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="stripe_price_id" value="{{ __('Stripe price id') }}" />
            <x-jet-input id="stripe_price_id" type="text" class="mt-1 block w-full" wire:model.defer="state.stripe_price_id" />
            <x-jet-input-error for="state.stripe_price_id" class="mt-2" />
        </div>

    </x-slot>

    <x-slot name="actions">
        <x-jet-action-message class="mr-3" on="saved">
            {{ __('Saved.') }}
        </x-jet-action-message>

        <x-jet-button>
            {{ __('Save') }}
        </x-jet-button>
    </x-slot>
</x-jet-form-section>
