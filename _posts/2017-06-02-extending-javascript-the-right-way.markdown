---
layout: post
title: "扩展js方法的最佳方式"
date: 2017-06-02 13:48:25 +0800
comments: true
categories:
---
  JavaScript已经内置了很多强大的方法，但有时你需要的某个功能在内置的方法中没有，我们怎么来优雅地扩展JavaScript功能呢。

  例如我们想增加一个capitalize()方法来实现首字母大写，通常我们这样写：
```js
if(!String.prototype.capitalize)
{
    String.prototype.capitalize = function()
    {
        return this.slice(0,1).toUpperCase() + this.slice(1).toLowerCase();
    }
}
```

  上面的代码可以正常使用，但如果在某个地方有下面的代码：
```js
var strings = "yay";
for(i in strings) console.log(i + ":" + strings[i]);
```
  我们得到的结果是这样的：
```js
0: y
1: a
2: y
capitalize: function () { return this.slice(0, 1).toUpperCase() + this.slice(1).toLowerCase(); }
```
  这显然不是我们想要的结果，输出了我们增加的方法的原因是我们增加的方法的enumerable属性默认为true。

  我们可以通过简单地把枚举属性(enumerable)设置为false避免这个问题，使用defineProperty方法进行功能的扩展：
```js
if(!String.prototype.capitalize)
{
    Object.defineProperty(String.prototype, 'capitalize',
    {
       value: function()
       {
           return this.slice(0,1).toUpperCase() + this.slice(1).toLowerCase();
       },
       enumerable: false
    });
}
```
  现在我们再运行这段代码：
```js
var strings = "yay";
for(i in strings) console.log(i + ":" + strings[i]);
```
  我们得到的结果是：
```js
0: y
1: a
2: y
```
  要注意的是，用循环没有输出的并不代表不存在，我们可以通过下面的代码查看到定义：
```js
var strings = "yay";
console.log(strings.capitalize)
```
  会输出：
```js
function () { return this.slice(0, 1).toUpperCase() + this.slice(1).toLowerCase(); }
```

  用这种方式扩展JavaScript功能比较灵活，我们可以用这种方式来定义我们自己的对象，并设置一些默认值。
  以下是另外几个扩展方法，你可以在自己的项目中使用：
  String.pxToInt()
  把"200px"这样的字符串转换为数字 200 :
```js
if(!String.prototype.pxToInt)
{
    Object.defineProperty(String.prototype, 'pxToInt',
    {
        value: function()
        {
            return parseInt(this.split('px')[0]);
        },
        enumerable: false
    });
}
```
  `String.isHex()` 判断一个字符串是否是16进制表示的，如"#CCC" 或 "#CACACA"
```js
if(!String.prototype.isHex)
{
    Object.defineProperty(String.prototype, 'isHex',
    {
        value: function()
        {
            return this.substring(0,1) == '#' &&
                   (this.length == 4 || this.length == 7) &&
                   /^[0-9a-fA-F]+$/.test(this.slice(1));
        },
        enumerable: false
    });
}
```
  `String.reverse()` 字符串反转：
```js
if(!String.prototype.reverse)
{
    Object.defineProperty(String.prototype, 'reverse',
    {
        value: function()
        {
            return this.split( '' ).reverse().join( '' );
        },
        enumerable: false
    });
}
```
  `String.wordCount()` 统计单词数量，用空格分开
```js
if(!String.prototype.wordCount)
{
    Object.defineProperty(String.prototype, 'wordCount',
    {
        value: function()
        {
            return this.split(' ').length;
        },
        enumerable: false
    });
}
```
  `String.htmlEntities()` html标签如<和>编码为特殊字符
```js
if(!String.prototype.htmlEntities)
{
    Object.defineProperty(String.prototype, 'htmlEntities',
    {
        value: function()
        {
            return String(this).replace(/&/g, '&').replace(//g, '>').replace(/"/g, '"');
        },
        enumerable: false
    });
}
```
  `String.stripTags()` 去掉HTML标签：
```js
if(!String.prototype.stripTags)
{
    Object.defineProperty(String.prototype, 'stripTags',
    {
        value: function()
        {
            return this.replace(/<\/?[^>]+>/gi, '');
        },
        enumerable: false
    });
}
```
`String.trim()` 去掉首尾空格：
```js
if(!String.prototype.trim)
{
    Object.defineProperty(String.prototype, 'trim',
    {
        value: function()
        {
            return this.replace(/^\s*/, "").replace(/\s*$/, "");
        },
        enumerable: false
    });
}
```
`String.stripNonAlpha()` 去掉非字母字符：
```JS
if(!String.prototype.stripNonAlpha)
{
    Object.defineProperty(String.prototype, 'stripNonAlpha',
    {
        value: function()
        {
            return this.replace(/[^A-Za-z ]+/g, "");
        },
        enumerable: false
    });
}
```
`Object.sizeof()` 统计对象的大小，如{one: “and”, two: “and”}为2
```JS
if(!Object.prototype.sizeof)
{
    Object.defineProperty(Object.prototype, 'sizeof',
    {
        value: function()
        {
            var counter = 0;
            for(index in this) counter++;

            return counter;
        },
        enumerable: false
    });
}
```
---
总结：

这种方式扩展JS原生对象的功能还是挺不错的，但除非必要(项目中用的很多)，不建议直接在原生对象上扩展功能，会造成全局变量污染。

　　另外，文中的pxToInt()方法是没什么必要的，JS中的parseInt()可以直接完成这样的功能：parsetInt("200px")===200

　　htmlEntities方法貌似有问题，下面另提供一个：
```js
if(!String.prototype.htmlEntities)
{
    Object.defineProperty(String.prototype, 'htmlEntities',
    {
        value: function()
        {
            var div = document.createElement("div");
            if(div.textContent){
                div.textContent=this;
            }
            else{
                div.innerText=this;
            }
            return div.innerHTML;
        },
        enumerable: false
    });
}
```
