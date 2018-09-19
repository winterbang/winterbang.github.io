css 绘制不规则图形

原理：
#box{
     width:0;height:0;
     border-style: solid;
     border-width: 18px;
     border-color: #f65314 #00a1f1 #7cbb00 #ffbb00;
}
1.如果再将 width 和 height 设为0

2.上下左右四个三角形。 每个三角形代表一个边框，设置三个边框颜色为透明，只留上边框

#box{
     width:0;height:0;
     border-style: solid;
     border-width: 18px;
     border-color: #f65314 transparent transparent transparent;
}
控制形状和颜色：通过设置边框颜色和宽度可以控制三角形的形状和方向。
1.将三个边框颜色设置透明，则箭头方向和有颜色边框位置相反。如上面示例，只留上边框颜色，箭头指向下。 根据框模型原理，箭头所指方向的边框可有可无，不影响三角形绘制。

#box {
    width:0;
    height:0;
    width:0;
    height:0;
    border-style:solid solid none solid;
    border-width:18px;
    border-color:#f65314 blue transparent blue;
}
箭头所指方向不设置边框，图形的尺寸会变小。
2.四个边框宽度相同时只能得到等腰三角形，要得到正三角形。有色的边框宽度应为透明边框宽度的（根号3）倍。CSS 画三角形使用最多是网站导航栏的小箭头，一般都是正三角形。

#box{width:0;height:0;
     border-style: solid;
     border-width: 31px 18px 18px 18px;
     border-color: #f65314 transparent transparent transparent;
}

配合使用 :after :before 伪元素

可以用 border 的三角形来制作气泡框。涉及到元素定位布局基础知识。

#box {
    width:200px;
    height:100px;
    background:#CCCCCC;
    border-radius:5px;
    position:relative;
}
#box:after {
    content:"";
    position:absolute;
    border-style:solid;
    border-color:#CCCCCC transparent transparent;
    border-width:10px;
    bottom:-20px;
    right:40px;
}

再来一发：

#box {
    width:200px;
    height:100px;
    border:1px blue solid;
    border-radius:5px;
    position:relative;
}
#box:after {
    content:"";
    position:absolute;
    border-style:solid;
    border-color:blue transparent transparent;
    border-width:10px;
    bottom:-20px;
    right:40px;
}
#box:before {
    content:"";
    position:absolute;
    border-style:solid;
    border-color:white transparent transparent;
    border-width:10px;
    bottom:-19px;
    right:40px;
    z-index:9;
}
这里生成蓝色、白色两个三角形，让白色三角绝对定位覆盖蓝色仅留 1px 产生如图效果。

太极

CSS 画图做这种简单的图标挺有效率，更复杂的图标用 CSS 也可以绘制，娱乐一下可以，实际生产中没什么意义。

CSS画太极

#taiji {
    width:192px;
    height:96px;
    background:#eee;
    border-color:gray;
    border-style:solid;
    border-width:4px 4px 100px 4px;
    border-radius:100%;
    position:relative;
}
#taiji:before {
    content:"";
    position:absolute;
    top:50%;
    left:0;
    background:#eee;
    border:38px solid gray;
    border-radius:100%;
    width:20px;
    height:20px;
}
#taiji:after {
    content:"";
    position:absolute;
    top:50%;
    left:50%;
    background:gray;
    border:38px solid #eee;
    border-radius:100%;
    width:20px;
    height:20px;
}

蛋形时椭圆形的一个变体，它的高度要比宽度稍大，并且设置正确的border-radius属性即可以制作出一个蛋形。
#egg {
    width: 136px;
    height: 190px;
    background: #ffc000;
    display: block;
    -webkit-border-radius: 63px 63px 63px 63px / 108px 108px 72px 72px;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}  

http://www.htmleaf.com/ziliaoku/qianduanjiaocheng/201504051631.html                            
