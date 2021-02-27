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
        <div x-data="{ tab: '{{$type}}' }" class="sptabs">

            <div class="tab-nav">
                <a :class="{ 'active': tab === 'profile' }" @click="tab = 'profile'">Profile</a>
                <a :class="{ 'active': tab === 'subscription' }" @click="tab = 'subscription'">Subscription</a>
                <a :class="{ 'active': tab === 'logout' }" @click="tab = 'logout'">Logout</a>
            </div>

            <div id="saas-kit-notice-div"></div>

            <div x-show="tab === 'profile'">
                <form class="prism-form">
                    <div class="row">
                        <div class="left">Name</div>
                        <div class="right">{{$data['user']['name'] ?? 'Guest'}}</div>
                    </div>
                    <div class="row">
                        <div class="left">Email</div>
                        <div class="right">{{$data['user']['email'] ?? '-'}}</div>
                    </div>
                </form>
            </div>
            <div x-show="tab === 'subscription'">
                <form class="prism-form">
                    <div class="row">
                        <div class="left">
                            @if( $data['subscriptions'][0]??false )
                            {{ $data['subscriptions'][0]['name'] ?? 'None'}} <span class="xspan">{{$data['user']['subscription_expire_date']}}</span>
                            @else
                            No plan
                            @endif
                        </div>
                        <div class="right">
                            @if( isset($data['url']) )
                            <a class="abtn top" href="{{$data['url']}}">Manage </a>
                            @endif
                        </div>
                    </div>

                </form>
            </div>
            <div x-show="tab === 'logout'">
                <form action="javascript:prism_kit.user_logout()" class="prism-form">
                    <div class="row whole">
                        <button type="submit" class="half">Logout</button>
                    </div>
                </form>


            </div>
        </div>

    </div>
</div>
