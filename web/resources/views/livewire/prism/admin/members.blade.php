<div class="container mx-auto px-4 sm:px-8">
    <div class="py-4">


        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div class="inline-block min-w-full shadow-sm rounded overflow-hidden">
                <table class="min-w-full leading-normal">
                    <thead>
                        <tr class="bg-white">
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Member
                            </th>
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Email
                            </th>
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Level
                            </th>
                            {{-- <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Created at
                            </th> --}}
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Expire Date
                            </th>
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Action
                            </th>


                        </tr>
                    </thead>
                    <tbody>
                        @foreach( ($members ?? []) as $member )
                        @livewire('prism.admin.member-item',['member'=>$member])
                        @endforeach


                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
