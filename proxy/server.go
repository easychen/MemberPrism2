package main

import (
	"fmt"
	"log"

	"github.com/easychen/mirror/proxy"
)

func main() {

	r, settings, rules := proxy.Setup(proxy.ServerRouters)
	fmt.Println("Rules:")
	for i, rule := range *rules {
		fmt.Printf("[%s] %s %s, %d \n", i, rule.Path, rule.Redir, rule.Match)
	}

	fmt.Println("Settings:")
	fmt.Printf(
		"Host: %s:%d > TargetHost: %s, httpsEnable: %v \n",
		settings.Host, settings.Port, settings.Target, settings.HTTPSEnable,
	)

	// 启动服务
	var err error
	if settings.HTTPSEnable {
		err = r.RunTLS(fmt.Sprintf("%s:%d", settings.Host, settings.Port), settings.Crt, settings.Key)
	} else {
		err = r.Run(fmt.Sprintf("%s:%d", settings.Host, settings.Port))
	}

	if err != nil {
		log.Fatal(err)
	}
}
