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

> 本文由「[Yank Note - 一款面向程序员的 Markdown 笔记应用](https://github.com/purocean/yn)」撰写
