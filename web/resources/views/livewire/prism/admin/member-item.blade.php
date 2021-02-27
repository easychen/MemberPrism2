<tr>
    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div class="flex items-center">
            <div class="flex-shrink-0 w-6 h-6">
                <img class="w-full h-full rounded-full"
                    src="<?=Gravatar::get($member['email']);?>"
                    alt="" />

            </div>
            <div class="ml-3">
                <p class="text-gray-900 whitespace-no-wrap">
                    {{ $member['name'] }}
                </p>
            </div>
        </div>
    </td>
    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap"><a
                href="mailto:{{ $member['email'] }}">{{ $member['email'] }}</a></p>
    </td>
    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm cursor-pointer">
        @if( $member['level'] > 1 )
            <x-span bg="bg-green-200"><span wire:click="change('user')">Admin</span></x-span>
        @else
            <x-span bg="bg-gray-200"><span wire:click="change('admin')">User</span></x-span>
        @endif

    </td>
    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap ">
            <?=date("m/d/Y", strtotime($member['subscription_expire_date'])) ?>
        </p>
    </td>

    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p class="text-gray-900 whitespace-no-wrap">
            <svg class="w-7 h-7 p-1 cursor-pointer rounded hover:bg-gray-200 text-gray-400" wire:click="edit()" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </p>
    </td>


</tr>

