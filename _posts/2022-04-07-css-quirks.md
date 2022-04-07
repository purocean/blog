---
headingNumber: ture
title: 一些 CSS 怪癖
date: 2022-04-07
author: 洋子
tags:
  - CSS
---

这里记录一些 CSS 怪癖，也就是在项目中遇到了，违反我的直觉或比较有意思的问题，不定时更新

## Flex 子元素宽度设置无效

```html
<!-- --applet-- DEMO -->

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


> 本文由「[Yank Note - 一款面向程序员的 Markdown 笔记应用](https://github.com/purocean/yn)」撰写
