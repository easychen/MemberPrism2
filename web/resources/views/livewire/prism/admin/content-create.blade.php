<x-jet-form-section submit="save">
    <x-slot name="title">
        {{ __('Create a member-only content') }}
    </x-slot>

    <x-slot name="description">
        {{ __('Only members can visit it .') }}
    </x-slot>

    <x-slot name="form">
        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="name" value="{{ __('Name') }}" />
            <x-jet-input id="name" type="text" class="mt-1 block w-full" wire:model.defer="state.name" />
            <x-jet-input-error for="state.name" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="url" value="{{ __('Folder or pages URL') }}" />
            <x-jet-input id="url" type="text" class="mt-1 block w-full" wire:model.defer="state.url" />
            <x-jet-input-error for="state.url" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="match" value="{{ __('Match type') }}" />
            <select wire:model="state.match" class="border-gray-300 rounded">
                <option selected="selected" disabled>How to match the url</option>
                @foreach($match_types as $key => $name)
                <option value="{{ $key }}">{{ $name }}</option>
                @endforeach
            </select>
            <x-jet-input-error for="state.match" class="mt-2" />
        </div>

        <div class="col-span-6 sm:col-span-4">
            <x-jet-label for="redirect_url" value="{{ __('Redirect for non-members') }}" />
            <x-jet-input id="redirect_url" type="text" class="mt-1 block w-full" wire:model.defer="state.redirect_url" />
            <x-jet-input-error for="state.redirect_url" class="mt-2" />
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
