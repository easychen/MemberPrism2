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
                <a :class="{ 'active': tab === 'sign-in' }" @click="tab = 'sign-in'">Login</a>
                <a :class="{ 'active': tab === 'sign-up' }" @click="tab = 'sign-up'">Sign up</a>

                <a x-show="tab==='forget'" :class="{ 'active': tab === 'forget' }" @click="tab = 'forget'">Forget password</a>
            </div>

            <div id="saas-kit-notice-div"></div>

            <div x-show="tab === 'sign-in'">
                <form action="javascript:prism_kit.user_login()" class="prism-form">
                    <div class="row">
                        <div class="title">Email Address</div>
                        <div class="line"><input type="email" placeholder="email" name="prism-login-email" required />
                        </div>
                    </div>
                    <div class="row">
                        <div class="title">Password</div>
                        <div class="line"><input type="password" name="prism-login-password" placeholder="password"
                                required /></div>
                    </div>
                    <div class="row top">
                        <button type="submit">Login</button>
                    </div>
                    <div class="row top">
                        <a :class="{ 'active': tab === 'forget' }" @click="tab = 'forget'">Forget password?</a>

                        <!-- <a :class="{ 'active': tab === 'forget' }" @click="tab = 'confirm'">Confirm</a> -->
                    </div>
                </form>
            </div>
            <div x-show="tab === 'forget'">
                <form action="javascript:prism_kit.user_forget()" class="prism-form">
                    <div class="row">
                        <div class="title">Email Address</div>
                        <div class="line"><input type="email" placeholder="email" name="prism-forget-email" required />
                        </div>
                    </div>
                    <div class="row top">
                        <button type="submit">Send reset link</button>
                    </div>
                </form>
            </div>
            <div x-show="tab === 'confirm'">
                <form action="javascript:prism_kit.user_confirm()" class="prism-form">
                    <div class="row">
                        <div class="title">Email</div>
                        <div class="line"><input type="email" placeholder="email" name="prism-confirm-email" required />
                        </div>
                    </div>
                    <div class="row">
                        <div class="title">Reset code</div>
                        <div class="line"><input type="text" placeholder="code sent to your email"
                                name="prism-confirm-code" autocomplete="off" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="title">New password</div>
                        <div class="line"><input type="password" name="prism-confirm-password" placeholder="password"
                                required /></div>
                    </div>
                    <div class="row">
                        <div class="title">Password confirm</div>
                        <div class="line"><input type="password" name="prism-confirm-password-confirm"
                                placeholder="password again" required /></div>
                    </div>
                    <div class="row top">
                        <button type="submit">Confirm</button>
                    </div>
                </form>
            </div>
            <div x-show="tab === 'sign-up'">
                <form action="javascript:prism_kit.user_register()" class="prism-form">
                    <div class="row">
                        <div class="title">Name</div>
                        <div class="line"><input type="name" placeholder="name" name="prism-reg-name" required /></div>
                    </div>
                    <div class="row">
                        <div class="title">Email</div>
                        <div class="line"><input type="email" placeholder="email" name="prism-reg-email" required /></div>
                    </div>
                    <div class="row">
                        <div class="title">Password</div>
                        <div class="line"><input type="password" name="prism-reg-password" placeholder="password"
                                required /></div>
                    </div>
                    <div class="row">
                        <div class="title">Password confirm</div>
                        <div class="line"><input type="password" name="prism-reg-password-confirm"
                                placeholder="password again" required /></div>
                    </div>
                    <div class="row top">
                        <button type="submit">Sign up</button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</div>
