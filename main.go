package main

import (
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)
var rep=NewReport(100,20,1,"running")

// Start 启动web服务
func main() {
	port := flag.String("p", "9999", "默认监听端口9999,自定义端口加 -p 端口号\r\n\t设置端口示例：./monitor -p 9999\r\n")
	flag.Parse()
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.LoadHTMLGlob("static/index.html")
	r.Static("static/js", "static/js")
	r.Static("static/css", "static/css")
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})
	r.GET("/stats/requests", report)
	r.Run(":" + *port) // listen and serve on 0.0.0.0:9999
}


func report(c *gin.Context) {
	msg := fmt.Sprintf("Get successfully")
	c.JSON(http.StatusOK, gin.H{
		"data": rep,
		"msg":  msg,
	})
}

// Report 运行报告
type Report struct {
	Tps       uint64 `json:"tps,omitempty"`
	State     string `json:"state,omitempty"`
	UserCount uint64 `json:"user_count,omitempty"`
	SendSpeed uint64 `json:"send_speed,omitempty"`
	txs []int64
}

type tx struct {
}
// NewReport 新建报告
func NewReport(tps, userCount, sendSpeed uint64, state string) *Report {
	return &Report{
		Tps:       tps,
		State:     state,
		UserCount: userCount,
		SendSpeed: sendSpeed,
	}
}

func loop()  {

}


