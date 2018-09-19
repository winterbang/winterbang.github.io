### 关于Html中的BFC

####1.什么是BFC？
BFC 即 Block Fromatting Context(块级格式化上下文)的缩写。W3C对BFC的定义如下：

```
浮动元素和绝对定位元素，非块级盒子的块级容器（例如 inline-blocks, table-cells, 和 table-captions），以及overflow值不为“visiable”的块级盒子，都会为他们的内容创建新的BFC（块级格式上下文）。
```
#### 创建BFC
如果想创建一个BFC，只需要给容器添加如下任何一个css样式就可以了。
overflow: scroll
overflow: hidden
display: flex
float: left
display: table

#### BFC的使用：

1.避免外边距折叠

2.包含浮动

3.避免float引起的文字环绕

4.解决在float多列布局时，最后一列下移问题
