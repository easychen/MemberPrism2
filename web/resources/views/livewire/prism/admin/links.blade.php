<div class="container mx-auto px-4 sm:px-8">
    <div class="py-4">


        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div class="inline-block min-w-full shadow-sm rounded overflow-hidden">
                <table class="min-w-full leading-normal">
                    <thead>
                        <tr class="bg-white">
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Name
                            </th>
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Usage
                            </th>
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Code
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach( ($codes ?? []) as $key => $code )
                        <tr>

                            <td class="w-32 px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">{{$code['name']}}</p>
                            </td>

                            <td class="w-64 px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">{{$code['usage']}}</p>
                            </td>

                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">
                                    @if( isset($code['textarea']) && $code['textarea'] == 1  )

                                    <textarea class="w-full h-32  bg-blue-100 border-blue-100 rounded p-1 px-2 cursor-pointer copy-code-{{$key}} font-mono text-xs" onclick="copy_it('code-{{$key}}')" >{{$code['code']}}</textarea>

                                    @else

                                    <input class="w-full truncate bg-blue-100 rounded p-1 px-2 inline-block cursor-pointer copy-code-{{$key}}" onclick="copy_it('code-{{$key}}')" value="{{$code['code']}}" />
                                    </p>

                                    @endif
                            </td>

                        </tr>
                        @endforeach


                    </tbody>
                </table>
            </div>
        </div>

        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div class="inline-block min-w-full shadow-sm rounded overflow-hidden">
                <table class="min-w-full leading-normal">
                    <thead>
                        <tr class="bg-white">
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Name
                            </th>
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Usage
                            </th>
                            <th
                                class="px-5 py-3 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Link
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach( ($links ?? []) as $key => $link )
                        <tr>

                            <td class="w-32 px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">{{$link['name']}}</p>
                            </td>

                            <td class="w-64 px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">{{$link['usage']}}</p>
                            </td>

                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">
                                    <input class="w-full truncate bg-blue-100 rounded p-1 px-2 inline-block cursor-pointer copy-{{$key}}" onclick="copy_it('{{$key}}')" value="{{$link['link']}}" />
                                    </p>
                            </td>

                        </tr>
                        @endforeach


                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<script>
function copy_it(id)
{
    console.log(id,".copy-"+id);
    window.document.querySelector(".copy-"+id).select();
    document.execCommand('copy');
}
</script>
