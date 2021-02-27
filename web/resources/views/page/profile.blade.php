<div class="center-box">
    <div class="top">
        <span class="prism-close-btn"
            onclick="document.querySelector('#prism-layout-div').style.display='none';window.history.pushState( null, null, '#');"><svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-x">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg></span>
    </div>
    <div class="body">
        <div class="logo"><img class="w-12 h-auto" src="{{env('APP_URL')}}{{env('APP_ICON_URL') ?? asset('img/logo.svg')}}" /></div>

        <div x-data="{ tab: '{{$type}}' }" class="prismtabs">

            <div class="tab-nav">
                <a :class="{ 'active': tab === 'profile' }" @click="tab = 'profile'">Profile</a>
                {{-- <a :class="{ 'active': tab === 'subscription' }" @click="tab = 'subscription'">Subscription</a>
                <a :class="{ 'active': tab === 'logout' }" @click="tab = 'logout'">Logout</a> --}}
            </div>

            <div x-show="tab === 'profile'">
                <form class="prism-form">
                    <div class="prism-row dot">
                        <div class="left">Name</div>
                        <div class="right">{{$data['user']['name'] ?? 'Guest'}}</div>
                    </div>
                    <div class="prism-row dot">
                        <div class="left">Email</div>
                        <div class="right">{{$data['user']['email'] ?? '-'}}</div>
                    </div>
                    <div class="prism-row dot2">
                        <div class="left">Plan</div>
                        <div class="right">
                            @if( $data['subscriptions'][0]??false )

                            <div>{{ $data['subscriptions'][0]['name'] ?? 'None'}} <span class="xspan ml-2">{{$data['user']['subscription_expire_date']}}</span></div>

                            @else
                            No plan
                            @endif
                        </div>
                    </div>
                    @if( $data['subscriptions'][0]??false )
                    <div class="prism-row dot prism-mt-1">
                        <a href="javascript:prism_kit.stripe_port();void(0)">Manage plan</a>
                    </div>
                    @endif

                    <div class="prism-row prism-mt-2">
                        <a href="javascript:prism_kit.user_logout();void(0)">Logout</a>
                    </div>
                </form>
            </div>
        </div>

    </div>
</div>
