<x-jet-form-section submit="delete" class="mt-8">
    <x-slot name="title">
        {{ __('Delete the plan') }}
    </x-slot>

    <x-slot name="description">
        {{ __('Cannot be revocerd .') }}
    </x-slot>

    <x-slot name="form">
        <div class="text-xl">Delete?</div>
    </x-slot>

    <x-slot name="actions">
        <x-jet-input-error for="info" class="mt-2" />
        <x-jet-action-message class="mr-3" on="save">
            {{ __('Deleted.') }}
        </x-jet-action-message>

        @if( $confirm )
            <x-jet-secondary-button wire:click="cancel()">{{ __('Cancel') }}</x-jet-secondary-button>
            <x-jet-button class="bg-red-800 ml-2">
                {{ __('Confirm') }}
            </x-jet-button>
        @else
            <x-jet-danger-button wire:click="confirm()">{{ __('Delete') }}</x-jet-danger-button>
        @endif


    </x-slot>
</x-jet-form-section>
