---
layout: post
title: "快速获取/更新 Let's encrypt 证书"
date: 2017-06-09 16:07:53 +0800
comments: true
categories:
---
一个快速获取/更新 Let's encrypt 证书的 shell script
------------

调用 acme_tiny.py 认证、获取、更新证书，不需要额外的依赖。

**下载到本地**

```
wget https://raw.githubusercontent.com/xdtianyu/scripts/master/lets-encrypt/letsencrypt.conf
wget https://raw.githubusercontent.com/xdtianyu/scripts/master/lets-encrypt/letsencrypt.sh
chmod +x letsencrypt.sh
```

**配置文件**

只需要修改 DOMAIN_KEY DOMAIN_DIR DOMAINS 为你自己的信息

```
ACCOUNT_KEY="letsencrypt-account.key"
DOMAIN_KEY="example.com.key"
DOMAIN_DIR="/var/www/example.com"
DOMAINS="DNS:example.com,DNS:whatever.example.com"
#ECC=TRUE
#LIGHTTPD=TRUE
```

执行过程中会自动生成需要的 key 文件。其中 `ACCOUNT_KEY` 为账户密钥， `DOMAIN_KEY` 为域名私钥， `DOMAIN_DIR` 为域名指向的目录，`DOMAINS` 为要签的域名列表， 需要 `ECC` 证书时取消 `#ECC=TRUE` 的注释，需要为 `lighttpd` 生成 `pem` 文件时，取消 `#LIGHTTPD=TRUE` 的注释。

**运行**

```
./letsencrypt.sh letsencrypt.conf
```

**注意**

需要已经绑定域名到 `/var/www/example.com` 目录，即通过 `http://example.com` `http://whatever.example.com` 可以访问到 `/var/www/example.com` 目录，用于域名的验证

**将会生成如下几个文件**

    lets-encrypt-x1-cross-signed.pem
    example.chained.crt          # 即网上搜索教程里常见的 fullchain.pem
    example.com.key              # 即网上搜索教程里常见的 privkey.pem
    example.crt
    example.csr

**在 nginx 里添加 ssl 相关的配置**

    ssl_certificate     /path/to/cert/example.chained.crt;
    ssl_certificate_key /path/to/cert/example.key;

**cron 定时任务**

每个月自动更新一次证书，可以在脚本最后加入 service nginx reload等重新加载服务。


```bash
#!/bin/bash

# Usage: /etc/nginx/certs/letsencrypt.sh /etc/nginx/certs/letsencrypt.conf

CONFIG=$1
ACME_TINY="/tmp/acme_tiny.py"
DOMAIN_KEY=""

if [ -f "$CONFIG" ];then
    . "$CONFIG"
    DIRNAME=$(dirname "$CONFIG")
    cd "$DIRNAME" || exit 1
else
    echo "ERROR CONFIG."
    exit 1
fi

KEY_PREFIX="${DOMAIN_KEY%%.*}"
DOMAIN_CRT="$KEY_PREFIX.crt"
DOMAIN_PEM="$KEY_PREFIX.pem"
DOMAIN_CSR="$KEY_PREFIX.csr"
DOMAIN_CHAINED_CRT="$KEY_PREFIX.chained.crt"

if [ ! -f "$ACCOUNT_KEY" ];then
    echo "Generate account key..."
    openssl genrsa 4096 > "$ACCOUNT_KEY"
fi

if [ ! -f "$DOMAIN_KEY" ];then
    echo "Generate domain key..."
    if [ "$ECC" = "TRUE" ];then
        openssl ecparam -genkey -name secp256r1 | openssl ec -out "$DOMAIN_KEY"
    else
        openssl genrsa 2048 > "$DOMAIN_KEY"
    fi
fi

echo "Generate CSR...$DOMAIN_CSR"

OPENSSL_CONF="/etc/ssl/openssl.cnf"

if [ ! -f "$OPENSSL_CONF" ];then
    OPENSSL_CONF="/etc/pki/tls/openssl.cnf"
    if [ ! -f "$OPENSSL_CONF" ];then
        echo "Error, file openssl.cnf not found."
        exit 1
    fi
fi

openssl req -new -sha256 -key "$DOMAIN_KEY" -subj "/" -reqexts SAN -config <(cat $OPENSSL_CONF <(printf "[SAN]\nsubjectAltName=%s" "$DOMAINS")) > "$DOMAIN_CSR"

wget https://raw.githubusercontent.com/diafygi/acme-tiny/master/acme_tiny.py --no-check-certificate -O $ACME_TINY -o /dev/null

if [ -f "$DOMAIN_CRT" ];then
    mv "$DOMAIN_CRT" "$DOMAIN_CRT-OLD-$(date +%y%m%d-%H%M%S)"
fi

DOMAIN_DIR="$DOMAIN_DIR/.well-known/acme-challenge/"
mkdir -p "$DOMAIN_DIR"

python $ACME_TINY --account-key "$ACCOUNT_KEY" --csr "$DOMAIN_CSR" --acme-dir "$DOMAIN_DIR" > "$DOMAIN_CRT"

if [ "$?" != 0 ];then
    exit 1
fi

if [ ! -f "lets-encrypt-x3-cross-signed.pem" ];then
    wget https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem --no-check-certificate -o /dev/null
fi

cat "$DOMAIN_CRT" lets-encrypt-x3-cross-signed.pem > "$DOMAIN_CHAINED_CRT"

if [ "$LIGHTTPD" = "TRUE" ];then
    cat "$DOMAIN_KEY" "$DOMAIN_CRT" > "$DOMAIN_PEM"
    echo -e "\e[01;32mNew pem: $DOMAIN_PEM has been generated\e[0m"
fi

echo -e "\e[01;32mNew cert: $DOMAIN_CHAINED_CRT has been generated\e[0m"

#service nginx reload

```
```
0 0 1 * * /etc/nginx/certs/letsencrypt.sh /etc/nginx/certs/letsencrypt.conf >> /var/log/lets-encrypt.log 2>&1
```
