---
layout: post
title: "mac practical command line"
date: 2020-03-19 17:08:02 +0800
comments: true
categories: Node
---

创建固定长度的数组
Array.from(new Array(100))
Array.from({length: 100})

创建长度为16元素为0的数组
Array.from('0' * 16, x => 0 * x)

创建元素是0-100的数组
Array.from({length:100},(v,i) => i)
Object.keys(Array.from({length: 100}))
Array.from(new Array(100).keys())
[...Array(100).keys()]