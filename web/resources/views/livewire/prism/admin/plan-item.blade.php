<tr>
    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap">
            {{$plan['name']}}
        </p>
    </td>

    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap">
            {{$plan['stripe_price_id']}}
        </p>
    </td>

    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap">
            {{$plan['member_count']}}
        </p>
    </td>

    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 flex flex-row">
            @if( $add )
                <select class="border-gray-300 rounded mb-2" multiple="true" wire:model="selected_contents">
                @foreach( $contents as $content )
                <option value={{$content['id']}}>{{$content['name']}}</option>
                @endforeach
                </select>

                <div>
                    <x-jet-secondary-button class="mr-2" wire:click="toggle_add('false')">{{ __('Cancel') }}</x-jet-secondary-button>
                    <x-jet-button wire:click="save_content()">{{ __('Save') }}</x-jet-button>
                </div>



            @else
                @if( $plan['contents'] )
                    @foreach( $plan['contents'] as $content )
                        <x-span class="mr-2">{{$content['name']}}</x-span>
                    @endforeach
                @endif

            <span wire:click="toggle_add('true')"><svg class="w-7 h-7 p-1 cursor-pointer rounded hover:bg-gray-200 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></span>
            @endif



        </p>
    </td>


    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap cursor-pointer">
            @if( $plan['enabled'] > 0 )
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

