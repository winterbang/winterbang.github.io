---
layout: blog
istop: true
title: "shadowsocks"
date: 2018-04-20 16:13:26 +0800
comments: true
categories: [vpn, shadowsocks]
category: vpn
tags:
- vpn
- shadowsocks

---

# 服务端相关
## 安装

```bash
$ python --version
Python 2.7.12
$ sudo pip install shadowsocks
$ sudo vim /etc/shadowsocks-libev/config.json
```
## 配置

### 单个账户配置

```
{
  "server": "0.0.0.0",
  "server_port": 8388,
  "local_address": "127.0.0.1",
  "local_port":1080,
  "password":"mypassword",
  "timeout":300,
  "method":"aes-256-cfb",
  "fast_open": false
}
```

### 多个账号：

```
{  
  "server":"0.0.0.0",  
  "port_password":{  
     "8381":"xxxxxxx",  
     "8382":"xxxxxxx",  
     "8383":"xxxxxxx",  
     "8384":"xxxxxxx"  
   },  
  "timeout":300,  
  "method":"aes-256-cfb",  
  "fast_open": false  
}
```

参数说明

| 字段 | 说明 |
| server | ss服务监听地址，0.0.0.0允许所有人访问，如果只是自己用，可以改成自己使用端的ip |
| server_port |	ss服务监听端口 |
| local_address |	本地的监听地址 |
| local_port | 本地的监听端口 |
| password | 密码 |
| timeout | 超时时间，单位秒 |
| method | 加密方法，默认是aes-256-cfb |
| fast_open	| 使用TCP_FASTOPEN, true / false |
| workers	| workers数，只支持Unix/Linux系统 |

## 服务管理

启动
```bash
$ ssserver -c /etc/shadowsocks.json -d start  
```
停止
```bash
$ ssserver -c /etc/shadowsocks.json -d stop
```
查看启动日志
```bash
$ tailf /var/log/shadowsocks.log
```
# 客户端相关
## URI和二维码


Shadowsocks的客户端接受BASE64加密格式的URI配置参数:

>ss://BASE64-ENCODED-STRING-WITHOUT-PADDING#TAG

对应的URI原文是

>ss://method:password@hostname:port

相应的URI和二维码的生成地址：[https://shadowsocks.org/en/config/quick-guide.html](https://shadowsocks.org/en/config/quick-guide.html)



## IOS客户端

推荐使用`SsrConnectPro`

## Android客户端

适用安卓的客户端应该很多自己搜索吧

---
参考地址：
[https://shadowsocks.org/en/index.html](https://shadowsocks.org/en/index.html)
