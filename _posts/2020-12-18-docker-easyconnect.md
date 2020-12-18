---
title: 在 WSL2 的 Docker 中使用 EasyConnect
date: 2020-12-19
author: 洋子
tags:
  - WSL
  - VPN
---

## 背景
公司的 VPN 使用的是深信服的 EasyConnect，装了一次后就被恶心着了：自动安装根证书，常驻服务，卸载了还在运行。本来想着以后只用虚拟机使用了。但是发现一个 docker 版的，感觉不错，分享一下。

## 使用
项目地址：https://github.com/Hagb/docker-easyconnect

我这里直接用 docker-compose 来运行，配置如下：

```yaml
version: '3.3'
services:
  app:
    image: "hagb/docker-easyconnect:vncless"
    cap_add:
      - NET_ADMIN
    volumes:
      - ./root/:/root/
    devices:
      - "/dev/net/tun:/dev/net/tun"
    environment:
      DISPLAY: "${DISPLAY}"
      URLWIN: "true"
    ports:
      - "10909:1080"
```

外部使用 `10909` 端口 socket5 代理即可。

## WSL 2 的处理
虽然 docker 在wsl 下可以完美运行，但是涉及到网络问题还是要处理一下。

### WSL 2 中访问 vcXsrv
1. Windows 下安装 vcXsrv 做图形服务器，要注意防火墙要给 vcXsrv 全部放开。
1. vcXsrv 配置时候注意访问认证选项，否则有可能出现 `Authorization required, but no authorization protocol specified`
1. 设置 `DISPLAY` 环境变量，对于 WSL 2 来说，宿主 ip 可能会变化，所以需要设置一下。把这段命令放入 `.bashrc` 就好了
`export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0`

### Windows 中访问 WSL 的代理
对于 Windows 来说，WSL 2 的 ip 也有可能变化，所以这里用一段脚本更新 Windows 的 hosts，直接用域名访问代理就好了。可以将脚本放入 WSL 下登录运行，就能自动更新了。

```bash
#! /bin/bash

set -ex

IP=`ip a show eth0 | grep "inet " | awk '{print $2}' | awk -F "/" '{print $1}'`
EXP="s/[0-9.]* ubuntu-wsl2/${IP} ubuntu-wsl2/g"
cat /mnt/c/Windows/System32/drivers/etc/hosts | sed "$EXP" > /mnt/c/Windows/System32/drivers/etc/hosts
```

## 参考
1. https://github.com/Hagb/docker-easyconnect
1. https://qiita.com/ryoi084/items/0dff11134592d0bb895c
1. https://blog.csdn.net/qq402335257/article/details/108967848
