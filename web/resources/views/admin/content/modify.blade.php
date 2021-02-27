<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Modify Content') }}
        </h2>
    </x-slot>

    <div>
        <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
            @livewire('prism.admin.content-modify', ['content'=>$content->toArray()])
            <x-jet-section-border />
            @livewire('prism.admin.content-delete',['content'=>$content->toArray()])
        </div>
    </div>
</x-app-layout>
