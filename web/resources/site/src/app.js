import axios from 'axios';
import cookies from 'js-cookie';
// 注册链接
// prism-ajax-pagename


class prismKit
{
    constructor()
    {
        this.api_base_url = '{app_url}/api/';
        this.stripe_key = '{stripe_key}';
        // this.lock_path = [
        //     {"path":"/vip","match":1,"redir":"/forbidden.html"}
        // ];
        this.lock_path = false;
    }

    async post( path , data )
    {
        return await this.request( 'post' , this.api_base_url+path, data );
    }

    async get( path )
    {
        return await this.request( 'get' , this.api_base_url+path );
    }

    async request( method, url, data )
    {
        var params = new URLSearchParams();
        if( data )
        {
            Object.keys( data ).forEach( item => params.append(item, data[item]) );
        }

        let headers = {
            Accept:'application/json'
        };

        const jwt = this.load_jwt();
        if( jwt )
        {
            params.append('jwt', jwt) ;
            headers['Authorization'] = 'Bearer '+jwt;
        }

        try
        {
            if( method == 'get' )
                return this.return_data(await axios.get( url,  {headers} ));
            else
                return this.return_data(await axios.post( url  , params, {headers} ));

        }catch (error)
        {
            const message = error.response &&  error.response.data || error.message;

            console.log("message" ,message );

            if( message.message == 'Signature verification failed')
            {
                this.user_logout();
                return true;
            }

            if( message.message == 'Login first')
            {
                this.load_page('login');
                return true;
            }

            if( message.errors.error == 'Already has a subscription' )
            {
                if(window.confirm( message.errors.error + ', manage it?' ))
                    this.stripe_port();

                return true;
            }

            if( message.errors )
            {
                const errors = Object.values(message.errors);
                alert( errors.join(" ") );
                return false;
            }

            if( message.message )
            {
                alert( message.message );
                return false;
            }

            // const ff = document.querySelector('#saas-kit-float-div');
            // if( ff ) ff.style.display='none';

            return false;
        }


    }

    return_data( ret )
    {
        return ret;
        if( ret.status != 200 )
        {
            return ret;
        }

        const { data } = ret;
        return data;
    }


    async load_page( page )
    {
        // alert( page );
        const {data} = await this.get( 'page/'+page );
        if( !data ) return false;
        this.make_layout();
        this.show_layout();
        document.querySelector( "#prism-layout-div" ).innerHTML = data;
    }

    show_layout()
    {
        document.querySelector( "#prism-layout-div" ).style.display='block';
    }

    hide_layout()
    {
        document.querySelector( "#prism-layout-div" ).style.display='none';
        document.querySelector( "#prism-layout-div" ).innerHTML='';
    }

    make_layout()
    {
        let  layout_id  = 'prism-layout-div';
        if( !document.querySelector( "#"+layout_id ) )
        {
            let thediv = document.createElement("div");
            thediv.id = layout_id;
            thediv.className = 'prism-layout';
            document.body.appendChild( thediv );
        }
    }

    async check_lock( force_request = false )
    {
        // return true;
        if( !this.lock_path || force_request )
        {
            const { data } = await this.get( 'lock' );
            if( !data ) return this.user_logout();


            this.lock_path = data.locks || [];
            this.is_member = data.is_member > 0;
        }

        for( const lock of this.lock_path )
        {
            let do_lock = false;
            if( lock.match == 1 )
            {
                if(window.location.pathname.indexOf(lock.path) >= 0)
                {
                    do_lock = true;
                }
            }

            if( lock.match == 2 )
            {
                if(window.location.pathname == lock.path)
                {
                    do_lock = true;
                }
            }

            if( do_lock )
            {
                window.document.body.style.display='none';
                window.document.body.innerHTML='';
                window.location = lock.redir;
            }


        }

        // 对会员显示
        var member_show_items = document.querySelectorAll(".prism-member-show");
        if( member_show_items )
        {
            for( const node of member_show_items )
            {
                if( !this.is_member ) node.style.display = 'none';
                else node.style.display = 'inherit';
            }
        }

        var member_hide_items = document.querySelectorAll(".prism-member-hide");
        if( member_hide_items )
        {
            for( const node of member_hide_items )
            {
                if( this.is_member ) node.style.display = 'none';
                else node.style.display = 'inherit';
            }
        }
    }

    async user_login( email_value=false, password_value=false )
    {
        const email = email_value || document.querySelector(".prism-form [name='prism-login-email']")?.value;
        const password = password_value || document.querySelector(".prism-form [name='prism-login-password']")?.value;

        // 向服务器端请求数据
        var params = {
            email, password
        };

        const { data } = await this.post( 'login'  , params );

        // console.log( data );
        if( data && data.jwt )
        {
            this.save_jwt( data.jwt );
            this.check_lock(true);
            if( email_value )
                return data;
            else
                this.hide_layout();
        }

    }

    async user_forget( email_value=false )
    {
        const email = email_value || document.querySelector(".prism-form [name='prism-forget-email']")?.value;

        // 向服务器端请求数据
        var params = {
            email
        };

        const { data } = await this.post( 'forgot-password'  , params );

        console.log( "forget" , data );
        if( data && data.message  )
        {
            if( email_value )
            {
                return data;
            }
            else
            {
                alert( data.message );
                this.load_page('login');
            }
        }

    }

    save_jwt( jwt )
    {
        cookies.set( "PRISMKIT-JWT" , jwt );
    }

    load_jwt()
    {
        return cookies.get( "PRISMKIT-JWT" );
    }

    async stripe_port( forward = true )
    {
        const { data, status  } = await this.post( 'stripe_port'  , {} );
        if( data && data.url )
        {
            if( forward )
                window.location = data.url;
            else
                return data;
        }
    }

    async user_logout( reload = true )
    {
        const ret = cookies.remove( "PRISMKIT-JWT" );

        if( reload )
        {
            // close
            if( document.querySelector("#prism-layout-div")?.length > 0 )
            {
                document.querySelector("#prism-layout-div").innerHTML = '';
                document.querySelector("#prism-layout-div").style.display = 'none';
            }

            window.history.pushState( null, null, '#');
            window.location.reload();
        }
        else
        {
            return ret;
        }
    }


    async user_register( name_value=false, email_value=false, password_value=false, password_confirmation_value=false )
    {
        const name = name_value || document.querySelector(".prism-form [name='prism-reg-name']")?.value;
        const email = email_value || document.querySelector(".prism-form [name='prism-reg-email']")?.value;
        const password = password_value || document.querySelector(".prism-form [name='prism-reg-password']")?.value;
        const password_confirmation = password_confirmation_value || document.querySelector(".prism-form [name='prism-reg-password-confirm']")?.value;

        if( password != password_confirmation )
        {
            alert("Password not the same");
            return false;
        }

        var params = {
            name, email, password, password_confirmation
        };

        const { data, status  } = await this.post( 'register'  , params );
        if( status == 201 )
        {
            if( email_value )
            {
                return status;
            }
            else
            {
                // 创建成功
                this.load_page('login');
            }

        }
        // console.log( "data" , data );

        // if( data?.member )
        // {
        //     this.load_form('user-sign-in');
        // }

    }

    async do_sub( subid, forward = true )
    {
        const { data, status  } = await this.post( 'subscribe'  , {"id":subid} );

        if( data && data.id )
        {
            if( forward )
            {
                // stripe_key
                let stripe = Stripe(this.stripe_key);
                stripe.redirectToCheckout({sessionId:data?.id});
            }
            else
            {
                return data;
            }
        }
        // alert( subid );
    }




}


var prism_kit = new prismKit();
window.prism_kit = prism_kit;

document.addEventListener("DOMContentLoaded", async function(event)
{
    await prism_kit.check_lock();
    window.setInterval( async()=>{await prism_kit.check_lock()}, 1000*10 );


    // ajax 加载页面
    var pages = document.querySelectorAll("[href^='#prism-ajax-']");
    if( pages )
    {
        for( const node of pages )
        {
            node.onclick = function (e) {
                e.preventDefault();
                const push = new URL(node.href).hash.substr( 1 );
                prism_kit.load_page( new URL(node.href).hash.substr( '#prism-ajax-'.length ) );
                window.history.pushState( null, null, '#'+push);
            };

        }
    }
    // sub 转向订阅支付页面
    var subs = document.querySelectorAll("[href^='#prism-sub-']");
    if( subs )
    {
        for( const node of subs )
        {
            node.onclick = function (e) {
                e.preventDefault();
                const push = new URL(node.href).hash.substr( 1 );
                prism_kit.do_sub( new URL(node.href).hash.substr( '#prism-sub-'.length ) );
                window.history.pushState( null, null, '#'+push);
            };

        }
    }

    document.querySelector("body").style.visibility="visible";
});


