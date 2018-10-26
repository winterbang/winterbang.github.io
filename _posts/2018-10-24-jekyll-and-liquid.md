---
layout: post
title:  "jekyll and liquid"
date:   2018-10-24 17:32:20 +0800
categories: liquid on jekyll
---
## Liquid

### 输出

``` liquid
Hello {{name}}
Hello {{user.name}}
Hello {{ 'leszek' }}
```
### Filters

``` liquid
Word hello has {{ 'hello' | size }} letters!
Todat is {{ 'now' | date: "%Y %h" }}
```
对于从`_data`得到某条特定的数据，`where` 过滤器特别好用:

```
{% assign currentItem = site.data.foo | where:"slug","bar" %}
{{ newArray[0].name }}
```
常用的过滤器:

- `where` -- select elements from array with given property value: `{{ site.posts | where:"category","foo" }}`
- `group_by` -- group elements from array by given property: `{{ site.posts | group_by:"category" }}`
- `markdownify` -- convert markdown to HTML
- `jsonify` -- convert data to JSON: `{{ site.data.dinosaurs | jsonify }}`
- `date` -- 时间格式化 (syntax reference)
- `capitalize` -- 句子的首字母大写
- `downcase` -- convert an input string to lowercase
- `upcase` -- convert an input string to uppercase
- `first` -- 返回数组的第一个元素
- `last` -- 返回数组的最后一个元素
- `join` -- join elements of the array with certain character between them
- `sort` -- 数组排序: `{{ site.posts | sort: 'author' }}`
- `size` -- 返回一个数组的长度
- `strip_newlines` -- strip all newlines (`\n`) from string
- `replace` -- replace each occurrence: `{{ 'foofoo' | replace:'foo','bar' }}`
- `replace_first` -- replace the first occurrence: `{{ 'barbar' | replace_first:'bar','foo' }}`
- `remove` -- remove each occurrence: `{{ 'foobarfoobar' | remove:'foo' }}`
- `remove_first` -- remove the first occurrence: `{{ 'barbar' | remove_first:'bar' }}`
- `truncate` -- truncate a string down to x characters
- `truncatewords` -- truncate a string down to x words
- `prepend` -- 将一个字符串追加到字符串前面: `{{ 'bar' | prepend:'foo' }}`
- `append` -- 将一个字符串追加到字符串后面: `{{ 'foo' | append:'bar' }}`
- `minus`, `plus`, `times`, `divided_by`, `modulo` -- 数字运算（减，加，乘，除，余）: `{{ 4 | plus:2 }}`
- `split` -- 按照匹配的字符串将源字符串分割组成一个数组: `{{ "a~b" | split:'~' }}`
- `ceil` -- 数字向上取整
- `lstrip`, `rstrip`, `strip` -- 去除句子首部、尾部、首尾空白字符
- `slice` -- 截取指定长度的字符串，第二个表示长度，第一个表示索引，从0开始，如果为负数，从后面往前数，从-1开始: `{{ "Liquid" | slice: 0 }}` 或者 `{{ "Liquid" | slice: -3, 2 }}`
### Tags

Tags are used for the logic in your template.


#### Comments

For swallowing content.

```
We made 1 million dollars {% comment %} in losses {% endcomment %} this year
```


#### Raw

Disables tag processing.

```
{% raw %}
    In Handlebars, {{ this }} will be HTML-escaped, but {{{ that }}} will not.
{% endraw %}
```

#### If / Else

Simple expression with if/unless, elsif [sic!] and else.

```
{% if user %}
    Hello {{ user.name }}
{% elsif user.name == "The Dude" %}
    Are you employed, sir?
{% else %}
    Who are you?
{% endif %}
```

```
{% unless user.name == "leszek" and user.race == "human" %}
    Hello non-human non-leszek
{% endunless %}
```

```
# array: [1,2,3]
{% if array contains 2 %}
    array includes 2
{% endif %}
```


#### Case

For more conditions.

```
{% case condition %}
    {% when 1 %}
        hit 1
    {% when 2 or 3 %}
        hit 2 or 3
    {% else %}
        don't hit
{% endcase %}
```


#### For loop

Simple loop over a collection:

```
{% for item in array %}
    {{ item }}
{% endfor %}
```

Simple loop with iteration:

```
{% for i in (1..10) %}
    {{ i }}
{% endfor %}
```

一些在特殊情况下可能有用辅助变量：

- `forloop.length` -- 需要循环的次数
- `forloop.index` -- 当前迭代的索引
- `forloop.index0` -- 当前迭代的索引 (索引从0开始)
- `forloop.rindex` -- 还有多少元素没有遍历
- `forloop.rindex0` -- 还有多少元素没有遍历 (索引从0开始)
- `forloop.first` -- 是否是第一次迭代
- `forloop.last` -- 是否是最后一次迭代

集合循环的长度和偏移：
```
# array: [1,2,3,4,5,6]
{% for item in array limit:2 offset:2 %}
    {{ item }}
{% endfor %}
```

You can also reverse the loop:

```
{% for item in array reversed %}
...
{% endfor s%}
```

#### Storing variables

Storing data in variables:

```
{% assign name = 'leszek' %}
```

Combining multiple strings into one variable:

```
{% capture full-name %}{{ name }} {{ surname }}{% endcapture %}
```
