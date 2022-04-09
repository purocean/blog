---
headingNumber: ture
title: 一些 CSS 怪癖
date: 2022-04-07
author: 洋子
tags:
  - CSS
---

这里记录一些遇到的违反直觉，或者比较有意思的 CSS 问题，不定时更新

## Flex 子元素宽度设置无效

```html
<!-- --applet-- -->

<style>
.a {
    display: flex;
}

.b {
    outline: 1px solid green;
    outline-offset: -1px;
    height: 50px;
    flex: 1 1 50%;
    /* overflow: hidden; */
    min-width: 0;
}

.c {
    outline: 1px solid red;
    outline-offset: -1px;
    height: 50px;
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

## 我能想到的一些 CSS 隐藏元素方法

追求视觉和交互上的隐藏

1. display: none;
1. visibility: hidden;
1. content-visibility: hidden;
2. 元素增加 hidden 属性
1. position 离屏
1. overflow: hidden; 裁切
1. clip-path: circle(2px); 裁切
1. transform: scale(0, 0)
1. filter: opacity(0);
1. optical: 0;
1. 设置宽高为0
1. 元素颜色和背景设置一样，禁用事件

参考：[您可能不知道的CSS元素隐藏“失效”以其妙用](https://www.zhangxinxu.com/wordpress/2012/02/css-overflow-hidden-visibility-hidden-disabled-use/)

## 使用粘性定位来固定表头或者首列

```html
<!-- --applet-- -->

<style>
    .table-wrapper {
        height: 200px;
        overflow: auto;
    }

    table {
        border-collapse: separate;
        border-spacing: 0;
    }

    td {
        height: 80px;
    }

    thead > tr {
        position: sticky;
        top: 0;
        background: green;
        z-index: 1;
    }

    thead > tr > th:first-child {
        background: green;
    }

    th:first-child,
    td:first-child {
        position: sticky;
        left: 0;
        background: #eee;
    }
</style>

<div class="table-wrapper">
<table border="1">
    <colgroup>
        <col style="width: 30vw;min-width: 30vw">
        <col style="width: 30vw;min-width: 30vw">
        <col style="width: 30vw;min-width: 30vw">
        <col style="width: 30vw;min-width: 30vw">
    </colgroup>
    <thead>
        <tr> <th>TH1</th> <th>TH2</th> <th>TH3</th> <th>TH4</th> </tr>
    </thead>
    <body>
        <tr>
            <td>TD1</td> <td>TD2</td> <td>TD3</td> <td>TD4</td>
        </tr>
        <tr>
            <td>TD1</td> <td>TD2</td> <td>TD3</td> <td>TD4</td>
        </tr>
        <tr>
            <td>TD1</td> <td>TD2</td> <td>TD3</td> <td>TD4</td>
        </tr>
        <tr>
            <td>TD1</td> <td>TD2</td> <td>TD3</td> <td>TD4</td>
        </tr>
    </thead>
</table>
</div>
```

Antd 以前是分别用两个表格来模拟表头固定的，现在的版本也改成了 CSS 的办法。

这里需要注意边框仍然需要仔细调整。分离式边框 `border-collapse: separate;` 可以随着单元格固定，而 `border-collapse: collapse` 就不行了。如果要做 1 像素边框，只能用一侧的边框线来模拟了。


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
.btn {
    width: 50px;
    margin: 0 25px;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    outline: 1px solid green;
    outline-offset: -1px;
    cursor: pointer;
    margin-bottom: 10px;
}

.detail {
    position: absolute;
    padding-top: 20px;
    left: 0;
    right: 0;
    height: 50px;
    text-align: center;
    background-color: red;
    visibility: hidden;
    transition: visibility 99999s linear;
}

.btn:hover + .detail {
    transition: visibility .1s linear;
    visibility: visible;
}

.btn:hover + .detail ~ .detail {
    display: none; /* 这句的作用是让动画过渡立马停止 */
}
</style>

<div class="btn">按钮1</div>
<div class="detail">详情1</div>

<div class="btn">按钮2</div>
<div class="detail" style="background: green">详情2</div>

<div class="btn">按钮3</div>
<div class="detail" style="background: #666">详情3</div>

<div class="btn">按钮4</div>
<div class="detail" style="background: #aaa">详情4</div>
```

利用了 `visibility` 可以做动画的特性，参考：[小tip: transition与visibility](https://www.zhangxinxu.com/wordpress/2013/05/transition-visibility-show-hide/)

来自之前的一个知乎回答：[怎样用纯CSS写出如下效果？ - 知乎](https://www.zhihu.com/question/41679942/answer/107752907)

## 鼠标移动到 div2 上时候 div1 变颜色

```html
<!-- --applet-- -->
<style>
div {
    height: 50px;
    width: 100px;
    display: inline-block;
}

.wrapper {
    width: 100%;
}

.div1 {
    background: red;
}

.div2 {
    background: green;
}

.wrapper:hover>.div1 {
    background: #000;
}

.wrapper:hover>.div1:hover {
    background: red;
}
</style>
<div class="wrapper">
    <div class="div1">div1</div>
    <div class="div2">div2</div>
</div>
```

不能用兄弟选择器，其实就是用父元素取了一个巧而已

来自之前的一个知乎回答：[关于css中hover的用法，如何编写代码才能完成下面的功能？还是说不能完成？ - 知乎](https://www.zhihu.com/question/26040983/answer/32583065)

> 本文由「[Yank Note - 一款面向程序员的 Markdown 笔记应用](https://github.com/purocean/yn)」撰写
