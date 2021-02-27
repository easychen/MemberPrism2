<tr>
    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap">
            {{$content['name']}}
        </p>
    </td>

    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap">
            {{$content['url']}}
        </p>
    </td>

    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap">
            @if( $content['match'] == 1 )
                <x-span bg="bg-blue-300">StartWith</x-span>
            @else
                <x-span bg="bg-blue-300">Exact</x-span>
            @endif
        </p>
    </td>

    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap">
            {{$content['redirect_url']}}
        </p>
    </td>

    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap cursor-pointer">
            @if( $content['enabled'] > 0 )
                <x-span bg="bg-yellow-500"><span wire:click="enable(0)">Enabled</span></x-span>
            @else
                <x-span bg="bg-gray-400" color="text-white"><span wire:click="enable(1)">Disabled</span></x-span>
            @endif


        </p>
    </td>


    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap">
            <svg class="w-7 h-7 p-1 cursor-pointer rounded hover:bg-gray-200 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" wire:click="edit()"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </p>
    </td>


</tr>

