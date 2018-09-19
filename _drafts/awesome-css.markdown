---
layout: post
title: "有趣的css图案"
date: 2018-01-26 16:07:53 +0800
comments: true
categories:
---
<style>
.star-five{
  display: block;
  width: 0;
  height: 0;
  color: red;
  position: relative;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 70px solid red;
  transform:rotate(35deg);
}
.star-five:before{
  display: block;
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 80px solid red;
  position: absolute;
  top: -45px;
  left: -65px;
  color: white;
  content: "";
  transform:rotate(-35deg);
}
.star-five:after{
  width: 0;
  height: 0;
  display: block;
  position: absolute;
  color: red;
  top: 3px;
  left: -105px;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 70px solid red;
  content: "";
  transform:rotate(-70deg);
}

.seal-circle-out {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  font-size: 30px;
  color: #f86270 ;
  border: 4px solid #f86270;
  border-radius:50px;
  transform:rotate(-40deg);
  text-align:center;
  line-height:100px;
}

.seal-circle-in {
  display: inline-block;
  width: 85px;
  height: 85px;
  font-size: 30px;
  color: #f86270 ;
  border: 2px solid #f86270;
  border-radius: 50px;
  text-align: center;
  line-height:80px;
}

.star5-small {
  display: block;
  width: 0;
  height: 0;
  color: red;
  position: relative;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 20px solid red;
  transform:rotate(37deg);
}

.star5-small:before{
  width: 0;
  height: 0;
  display: block;
  position: absolute;
  color: red;
  top: -2px;
  left: -36px;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 20px solid red;
  content: "";
  transform:rotate(-144deg);
}

.star5-small:after{
  width: 0;
  height: 0;
  display: block;
  position: absolute;
  color: red;
  top: -2px;
  left: -36px;
  border-left: 35px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 20px solid red;
  content: "";
  transform:rotate(-70deg);
}
</style>
<!-- <div class="star-five"></div> -->

<!-- <div class="star5-small"></div> -->
<div class="seal-circle-out">
  <div class="seal-circle-in">
    <span>原创</span>
  </div>
</div>
