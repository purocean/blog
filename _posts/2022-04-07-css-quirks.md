---
headingNumber: ture
title: 一些 CSS 怪癖
date: 2022-04-07
author: 洋子
tags:
  - CSS
---

这里记录一些在实际项目中遇到了，违反我的直觉或比较有意思的 CSS 问题，不定时更新

## Flex 子元素宽度设置无效

```html
<!-- --applet-- -->

<style>
.a {
    display: flex;
    padding: 10px;
}

.b {
    outline: 1px solid green;
    height: 100px;
    flex: 1 1 50%;
    /* overflow: hidden; */
    min-width: 0;
}

.c {
    outline: 1px solid red;
    height: 100px;
    flex: 1 1 50%;
}

.d {
    width: 80vw;
}

</style>

<div class="a">
    <div class="b">
        <div class="d"></div>
    </div>
    <div class="c"></div>
</div>
```

b 元素会被其子元素撑开，不遵守 `flex-basis` 或者 `width` 的配置

这时候给 b 配置 `overflow: hidden` 或者 `min-width: 0` 即可。

## 让 Fixed 定位相对于父级

```html
<!-- --applet-- -->

<style>
.b {
    outline: 1px solid green;
    outline-offset: -1px;
    width: 100px;
    height: 100px;
    transform: translate(0, 0);
}

.d {
    width: 20px;
    position: fixed;
    right: 0;
    height: 20px;
    background: red;
}

</style>

<div class="b">
    <div class="d"></div>
</div>
```

父级元素应用样式 `transform` 即可

参考：[CSS3 transform对普通元素的N多渲染影响](https://www.zhangxinxu.com/wordpress/2015/05/css3-transform-affect/)

## 鼠标移出元素后，仍然保留 Hover 样式

```html
<!-- --applet-- -->
<style>
.xx {
    width: 50px;
    margin: 0 25px;
    text-align: center;
    display: inline-block;
    vertical-align: top;
}

.detail {
    position: absolute;
    padding-top: 100px;
    width: 400px;
    height: 300px;
    text-align: center;
    background-color: red;
    visibility: hidden;
    transition: visibility 99999s linear;
}

.xx:hover + .detail {
    transition: visibility .1s linear;
    visibility: visible;
}

.xx:hover + .detail ~ .detail {
    display: none; /* 这句的作用是让动画过渡立马停止 */
}
</style>

<div class="xx">按钮1</div>
<div class="detail">详情1</div>

<div class="xx">按钮2</div>
<div class="detail" style="background: green">详情2</div>

<div class="xx">按钮3</div>
<div class="detail" style="background: #666">详情3</div>

<div class="xx">按钮4</div>
<div class="detail" style="background: #aaa">详情4</div>
```

来自之前的一个知乎回答：[怎样用纯CSS写出如下效果？ - 知乎](https://www.zhihu.com/question/41679942/answer/107752907)

> 本文由「[Yank Note - 一款面向程序员的 Markdown 笔记应用](https://github.com/purocean/yn)」撰写
