<div class="p-6 sm:px-20 bg-white border-b border-gray-200">
    <div>
        <img src="{{ env('APP_ICON_URL') ?? asset('logo.svg') }}" class="block h-12 w-auto" >
    </div>

    <div class="mt-8 text-2xl">
        {{ env('APP_TITLE') }}
    </div>

    <div class="mt-6 text-gray-500">
        {{ env('APP_DETAIL') }}
    </div>
</div>

<x-detail />
