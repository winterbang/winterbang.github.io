---
layout: post
title: css-tips
---

1.滚动穿透问题
移动端当有 fixed 遮罩背景和弹出层时，在屏幕上滑动能够滑动背景下面的内容，这就是臭名昭著的滚动穿透问题
解决方案 position: fixed
```css
body.modal-open {
  position: fixed;
  width: 100%;
}
```
如果只是上面的 css，滚动条的位置同样会丢失
所以如果需要保持滚动条的位置需要用 js 保存滚动条位置关闭的时候还原滚动位置
```javascript
/**
  * ModalHelper helpers resolve the modal scrolling issue on mobile devices
  * https://github.com/twbs/bootstrap/issues/15852
  * requires document.scrollingElement polyfill https://github.com/yangg/scrolling-element
  */
var ModalHelper = (function(bodyCls) {
  var scrollTop;
  return {
    afterOpen: function() {
      scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add(bodyCls);
      document.body.style.top = -scrollTop + 'px';
    },
    beforeClose: function() {
      document.body.classList.remove(bodyCls);
      // scrollTop lost after set position:fixed, restore it back.
      document.scrollingElement.scrollTop = scrollTop;
    }
  };
})('modal-open');
```
## 2. 去除inline-block元素间间距
父元素上添加样式 `font-size: 0`
注意：如果在inline-block元素中添加子元素，则同级的inline-block元素将不并列展示，这时需要给inline-block元素添加`vertical-align: top;`

## 3. body如果添加height:100% 滚动会变得生硬，


## 4. 当div的宽度为百分比时，如何设置高与宽相等

```html
div {
  width: 20%;
  height: 0; // 设置高为0，让padding撑起高
  padding-bottom: 20%; /* 让div的高等于宽 */
  border-radius: 50%;
}
```
此时将padding-top/padding-bottom设置为百分比时，是基于父元素宽度，正好和width相等；在使用border-radius=50%，就实现了自适应的圆形。

## 5 10个隐藏元素的方法
https://www.sitepoint.com/hide-elements-in-css/