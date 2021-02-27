package proxy

import (
	"net/http/httputil"

	"github.com/dgrijalva/jwt-go"
)

// Proxy 代理
type Proxy struct {
	httputil.ReverseProxy
}

// Settings 配置文件
type Settings struct {
	Debug       *bool  `json:"debug,omitempty"` // 调试模式
	Secret      string `json:"secret"`
	Target      string `json:"target"`
	Host        string `json:"host"`          // 服务监听地址
	Port        int    `json:"int"`           // 服务地址
	HTTPSEnable bool   `json:"https_enable"`  // HTTPS 证书KEY文件
	Key         string `json:"key,omitempty"` // HTTPS 证书KEY文件
	Crt         string `json:"crt,omitempty"` // HTTPS 证书文件
}

// Rule 规则配置
type Rule struct {
	ContentID string `json:"content_id"`
	Path      string `json:"path"`
	Match     int    `json:"match"`
	Redir     string `json:"redir"`
}

// Rules 规则配置
type Rules map[string]Rule

// Claims JWTClaims
type Claims struct {
	ContentIDs []string `json:"content_ids"`
	Level      int      `json:"level"`
	UID        int      `json:"uid"`
	Expire     string   `json:"expire"`
	jwt.StandardClaims
}
