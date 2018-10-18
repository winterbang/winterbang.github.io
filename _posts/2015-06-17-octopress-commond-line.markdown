---
layout: blog
istop: true
title: "octopress commond line"
date: 2015-06-17 12:03:26 +0800
background-image: https://o243f9mnq.qnssl.com/2017/06/116099051.jpg
comments: true
categories: octopress
category: octopress
tags:
  - github
  - git-crypt
  - encfs
  - gpg
  - git-remote-gcryp
  - sshfs
---

## octopress常用命令

### 部署到Github Pages

#### *生成博文并且部署*

```bash
rake generate
rake deploy
```
**注**： 指令执行后将会生成博文并复制文件到 `_deploy/` 目录，然后添加到git， commit、push到master分支。

#### *提交source分支*

```bash
git add .
git commit -m 'message'
git push origin source
```

### 博文相关
####*新建帖子*

```bash
rake new_post["title"]
```
例如：
```bash
rake new_post["Zombie Ninjas Attack: A survivor's retrospective"]
#Creates source/_posts/2011-07-03-zombie-ninjas-attack-a-survivors-retrospective.markdown
```
####*新建页面*

```bash
rake new_page[super-awesome]
#creates /source/super-awesome/index.markdown

rake new_page[super-awesome/page.html]
#creates /source/super-awesome/page.html
```
###*生成和预览*

```bash
rake generate # 在 `public/` 目录中生成帖子和页面
rake watch # 查看 `source/` 目录和 `sass/` 中的改变并且重新生成
rake preview # 将页面挂载在webserver的`http://localhost：4000`
```
