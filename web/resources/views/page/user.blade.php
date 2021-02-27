<div class="center-box">
    <div class="top">
        <span class="prism-close-btn cursor-pointer"
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
                <a :class="{ 'active': tab === 'sign-in' }" @click="tab = 'sign-in'">Login</a>
                <a :class="{ 'active': tab === 'sign-up' }" @click="tab = 'sign-up'">Sign up</a>

                <a x-show="tab==='forget'" :class="{ 'active': tab === 'forget' }" @click="tab = 'forget'">Password</a>
            </div>

            <div x-show="tab === 'sign-up'">
                <form action="javascript:prism_kit.user_register()" class="prism-form">
                    <div class="prism-row">
                        <div class="title">Name</div>
                        <div class="line"><input class="border-gray-300" type="text" placeholder="name" name="prism-reg-name" required /></div>
                    </div>
                    <div class="prism-row">
                        <div class="title">Email</div>
                        <div class="line"><input type="email" placeholder="email" name="prism-reg-email" required /></div>
                    </div>
                    <div class="prism-row">
                        <div class="title">Password</div>
                        <div class="line"><input type="password" name="prism-reg-password" placeholder="password"
                                required /></div>
                    </div>
                    <div class="prism-row">
                        <div class="title">Password confirm</div>
                        <div class="line"><input type="password" name="prism-reg-password-confirm"
                                placeholder="password again" required /></div>
                    </div>
                    <div class="prism-mt-2">
                        <button type="submit">Sign up</button>
                    </div>
                </form>
            </div>

            <div x-show="tab === 'sign-in'">
                <form action="javascript:prism_kit.user_login()" class="prism-form">
                    <div class="prism-row">
                        <div class="title">Email Address</div>
                        <div class="line"><input type="email" placeholder="email" name="prism-login-email" required />
                        </div>
                    </div>
                    <div class="prism-row">
                        <div class="title">Password</div>
                        <div class="line"><input type="password" name="prism-login-password" placeholder="password"
                                required /></div>
                    </div>
                    <div class="prism-mt-2">
                        <button type="submit">Login</button>
                    </div>
                    <div class="prism-mt-2">
                        <a :class="{ 'active': tab === 'forget' }" @click="tab = 'forget'"><span class="cursor-pointer">Forget password?</span></a>
                    </div>
                </form>
            </div>

            <div x-show="tab === 'forget'">
                <form action="javascript:prism_kit.user_forget()" class="prism-form">
                    <div class="prism-row">
                        <div class="title">Email Address</div>
                        <div class="line"><input type="email" placeholder="email" name="prism-forget-email" required />
                        </div>
                    </div>
                    <div class="prism-mt-2">
                        <button type="submit">Send reset link</button>
                    </div>
                </form>
            </div>


        </div>

    </div>
</div>
