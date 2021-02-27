package proxy

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

// Most code written by Max(https://github.com/trheyi) , the author of  Yao ( https://github.com/YaoApp/xun )
// You can use it under same license as MemberPrism

// New 创建一个proxy
func New(setting *Settings) *Proxy {
	proxy := &Proxy{}
	proxy.ReverseProxy = httputil.ReverseProxy{
		Director: func(req *http.Request) {
			target, err := url.Parse(setting.Target)
			if err != nil {
				log.Fatal(err)
				return
			}
			path := req.URL.Path
			req.URL = target
			req.URL.Path = path
			req.Host = target.Host
		},
	}
	return proxy
}

func (rules *Rules) clone() map[string]Rule {
	newrules := map[string]Rule{}
	for key, rule := range *rules {
		newrules[key] = rule
	}
	return newrules
}

// Validate 校验用户身份
func Validate(baseRules *Rules, setting *Settings) gin.HandlerFunc {
	return func(c *gin.Context) {
		rules := baseRules.clone()
		log.Println("baseRules", *baseRules)
		log.Println("rules", rules)
		data, err := GetClaims(c, setting.Secret)
		log.Println("jwt data", data)

		if err == nil {
			expire, err := time.Parse("2006-01-02", data.Expire)
			if err != nil {
				log.Println("date parse error", err)
			}

			fmt.Printf("data info %d %d  %s", data.Level, data.UID, expire)

			if data.Level >= 1 && data.UID >= 1 && err == nil && expire.Unix() > time.Now().Unix() {
				// 过滤规则
				for _, id := range data.ContentIDs {
					log.Println("remove rules", id)
					delete(rules, id)
				}
			}
		}

		// 判定转发路径
		for _, rule := range rules {

			log.Println("match rules", rule.ContentID)

			if rule.Match == 1 && strings.Index(c.Request.URL.Path, rule.Path) == 0 {
				log.Println("match startwith ", rule.ContentID)
				c.Redirect(http.StatusFound, rule.Redir)
				c.Abort()
				// c.Request.URL.Path = rule.Redir
				// c.Next()
				return
			}

			if rule.Match == 2 && c.Request.URL.Path == rule.Path {
				log.Println("match exact ", rule.ContentID)
				c.Redirect(http.StatusFound, rule.Redir)
				c.Abort()
				// c.Request.URL.Path = rule.Redir
				// c.Next()
				return
			}
		}
		c.Next()
	}
}

// Forward 转发请求
func (proxy *Proxy) Forward(ctx *gin.Context) {
	proxy.ServeHTTP(ctx.Writer, ctx.Request)
}

// GetClaims get and parse the claims from the gin.context
func GetClaims(c *gin.Context, secret string) (*Claims, error) {

	var tokenString = ""
	// 优先从 cookie 中获取
	cookie, err := c.Cookie("PRISMKIT-JWT")
	if cookie != "" {
		log.Println("has cookie", cookie)
		tokenString = cookie
	} else {
		log.Println("no cookie", err)
		authorization := c.Request.Header.Get("Authorization")
		if authorization == "" {

			return nil, errors.New("the authorization is empty")
		}

		authParsed := strings.SplitN(authorization, " ", 2)
		if !(len(authParsed) == 2 && authParsed[0] == "Bearer") {
			return nil, errors.New("the authorization format is not correct")
		}

		tokenString = authParsed[1]
	}

	//  Parse
	tokenParse, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {

		return nil, errors.New("the authorization token is not correct: " + err.Error())
	}

	if _, ok := tokenParse.Claims.(*Claims); !ok || !tokenParse.Valid {
		return nil, errors.New("the authorization token is not correct")
	}

	return tokenParse.Claims.(*Claims), nil
}

// Setup set up the server
func Setup(routers func(r *gin.Engine, p *Proxy)) (*gin.Engine, *Settings, *Rules) {
	settings := &Settings{}
	rules := &Rules{}
	loadConfig("settings", settings, func() {
		fmt.Printf(
			"Host: %s:%d > TargetHost: %s, httpsEnable: %v \n",
			settings.Host, settings.Port, settings.Target, settings.HTTPSEnable,
		)
	})
	loadConfig("rules", rules, func() {
		for i, rule := range *rules {
			fmt.Printf("[%s] %s %s, %d \n", i, rule.Path, rule.Redir, rule.Match)
		}
	})

	if settings.Debug != nil && *settings.Debug == true {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	p := New(settings)
	r := gin.Default()

	// 挂载验证中间件
	r.Use(Validate(rules, settings))

	// 配置路由
	routers(r, p)

	return r, settings, rules
}

// ServerRouters the routers for server
func ServerRouters(r *gin.Engine, p *Proxy) {
	// 配置路由
	r.Any("/*action", func(ctx *gin.Context) {
		p.Forward(ctx)
	})
}

// TestingRouters the routers for testing
func TestingRouters(r *gin.Engine, p *Proxy) {
	// 配置路由
	r.Any("/*action", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"url":     ctx.Request.URL,
			"headers": ctx.Request.Header,
		})
	})
}

func loadConfig(name string, v interface{}, onChange func()) {
	cVipper := viper.New()
	cVipper.SetConfigName(name)
	cVipper.SetConfigType("json")
	cVipper.AddConfigPath("/etc/mirror")
	cVipper.AddConfigPath("$HOME/.mirror")
	cVipper.AddConfigPath("./assets")
	cVipper.AddConfigPath(".")
	err := cVipper.ReadInConfig()
	if err != nil {
		log.Fatal(err)
		panic(fmt.Errorf("Fatal error %s file: %s", name, err))
	}

	cVipper.Unmarshal(v)
	cVipper.WatchConfig()
	cVipper.OnConfigChange(func(e fsnotify.Event) {
		log.Println(name, "file changed:", e.Name)
		cVipper.Unmarshal(v)
		onChange()
	})
}
