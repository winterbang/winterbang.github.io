---
layout: post
title: "写ruby时的一些迷惑行为"
date: 2020-04-15 07:03:02 +0800
comments: true
categories:
---

*|类Class|模型Module
|:--------|:-------:|:-------:|
父类superclass|模型Module|对象Object|
继承inheritance|可继承|不可继承|
包含inclusion|不可被包含|可被包含|
扩展extension|不可扩展|可被扩展|
实例化instantiation|可被实例化(instantiated)|不可被实例化

类变量class variable|类实例变量class instance variable|实例变量instance variable
|:--------|:-------:|:-------:|
@@类变量|@类实例变量|@实例变量
在类开头设定|	可用attr_accessor的方式改写	|可用attr_accessor的方式改写
可用在类方法或实例方法|用在类方法，不可用在实例方法|用在实例方法

关键字|	说明 |举例 |Truthy / Falsey|
|:--------|:-------:|:-------:|:-------:|
true |真	|0, 1, "",[], {}, [1,2,3]|	Truthy
false|假	|1+1==3	|Falsey
nil  |沒有|nil, ()	|Falsey

alias|alias_method
|:--------|:-------:|
Ruby关键字|属于Module的方法
只会作用在关键字所属的scope |可以重新定义方法，较为弹性

比较项|符号symbol|字符串string
|:--------|:-------:|:-------:|
意思|有名字的`符号对象`|指向字符串对象的变量
可不可修改|不可修改immutable|可修改mutable
修改数组|不可使用[]=方法 | 可使用[]=方法修改字串
数组方法|可使用[] 取得数组内的元素|可使用[] 取得数组内的元素
方法	|可使用.length .upcase .downcase	|可使用.length .upcase .downcase
符号与字符串转换|	符号转字符串.to_s	| 字符串转符号.to_sym
使用场景|用于不需改变值的情况，如Hash的key与value|需要使用只有字符串才有的方法(如:修改功能)

|对象    |方法名  |参数                     |返回值                          |执行上下文       |
| ------ |--------|------------------------|-------------------------------|----------------|
|function|有方法名 |参数（可选，调用时严格匹配）|有返回值，return跳出当前方法|任何地方都可以执行|
|lambda  |有块名   |参数（可选，调用时严格匹配）|有返回值，return跳出当前块  |只有在函数体中或调用#call来执行|
|proc    |有块名  |参数（可选，调用时非严格匹配）|无返回值，一个执行的过程，return跳出当前作用域|只有在函数体中或调用#call来执行|
|block   |匿名块  |参数（可选，调用时非严格匹配）|无返回值，一个执行的过程，return跳出当前作用域|只能在函数体中执行|

nil?|empty?|blank?|present?|
|:--------|:-------:|:-------:|:-------:|
Ruby|	Ruby |Rails |Rails|
若对象为nil，则返回true|若集合(String, Array…etc)的长度为0，则返回true|若nil或empty或空格，则返回true|	若此对象存在(非nil且非empty)，则返回true

== |===	|eql?	| equal? |
|:--------|:-------:|:-------:|:-------:|
检查两个对象的值是否相等|	测试case语法中的when子句相等性|	如果接收器和参数的值和类型都相等，则为true|	如果接收器和参数的object id相同，则为true

方法|.present?()|.exists?()
|:--------|:-------:|:-------:|
路径|	active_support/core_ext/object/blank.rb	|activeresource/lib/active_resource/base.rb
用途|如果对象Object不为blank(nil, 空值, 或空格)，返回true	若资源存在，返回true
特点|利用ActiveRecord初始化物件，效能差	|ActiveResource下的方法，效能佳

