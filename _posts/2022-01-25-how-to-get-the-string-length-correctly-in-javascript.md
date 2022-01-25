---
title: 在 JavaScript 中怎样正确获取字符串长度
date: 2022-01-25
author: 洋子
tags:
  - 前端
  - JavaScript
---

说起获取字符串长度，有人说那还不简单？直接 `string.length` 不就好了。可实际上要正确获取字符串长度还是没那么容易的，不信往下看。

## 例子

看下面的例子

```js
// --run--

console.log('abc'.length) // 打印结果: 3
console.log('ab𝄞'.length) // 打印结果: 4
console.log('ab🇨🇳'.length) // 打印结果: 6
```

可以看到，同样是三个字符，可最后打印的结果却不一样！

再看看其他语言情况怎样，比如 Python

```python
# --run--

print(len('abc')) # 打印结果: 3
print(len('ab𝄞')) # 打印结果: 3
print(len('ab🇨🇳')) # 打印结果: 4
```

好吧，也不能完美处理

## 问题原因

其实这个问题在 MDN 文档中 [String.length - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/length) 早已描述过。

> JavaScript 使用 UTF-16 编码，该编码使用一个 16 比特的编码单元来表示大部分常见的字符，使用两个代码单元表示不常用的字符。因此 length 返回值可能与字符串中实际的字符数量不相同。

也就是说对于一个字符，在 JS 内部是以 2 个字节来保存。但是有些字符串是 4 字节的，比如 `𝄞`，那么就会占用两个单元，甚至一些 Emoji 会占用更多！而 `String.length` 是返回的字符单元数而不是字符数量，就产生了这个问题。

为什么 `String.length` 要返回字符单元数而不是字符数量呢？同样的 Java 语言也是这样做的。我的想法是为了程序执行效率。针对变长的字符串，要返回正确的字符数量，需要扫描整个字符串。而返回单元长度，只需要将分配的内存数量除以每个单元长度就好了，不需要扫描整个字符串。

## 字符串拆成数组

执行下面代码

```js
// --run--

console.log('ab𝄞'.split('')) // 打印结果: ["a","b","\ud834","\udd1e"]
console.log(['ab𝄞'[2]]) // 打印结果: ["\ud834"]
console.log([...'ab𝄞']) // 打印结果: ["a","b","𝄞"]
console.log(Array.from('ab𝄞')) // 打印结果: ["a","b","𝄞"]
console.log([...'ab🇨🇳']) // 打印结果: ["a","b","🇨","🇳"]
console.log(Array.from('ab🇨🇳')) // 打印结果: ["a","b","🇨","🇳"]
```

可以看到，普通的 `split` 方法和直接下标的方法，不能正确将字符串拆分成数组。而 ES6 的解构写法和 `Array.from` 则能正确处理一部分的字符，但也不能完美处理某些 Emoji 的情况。

看 MDN 上提供的 [Polyfill](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from#polyfill) 和 相关的 [ES 规范](https://tc39.es/ecma262/#sec-array.from)，貌似也没处理这个问题。运行 Polyfill 的 `Array.from` 方法也不能正确分割字符串，所以只能猜测是 Chrome 内部实现处理了一部分这种多字节字符问题。

## 结论

1. 在 JavaScript 中，某些情况下 `String.length` 返回的不是字符数量。同样的问题可能也存在其他语言中，如 Python 和 Java。
2. 多字节字符的处理比较麻烦，看到的和内部保存的不一致或许算是正常行为。比如某些 Emoji 配合字体把两个字符分开或结合展示也是很正常。这里面有更深的学问，编辑器/浏览器难做呀，致敬 VSCode、Chrome。
3. `[...'ab𝄞']` 或 `Array.from('ab𝄞')` 可以在一定程度上解决一些实际问题。
3. 需要注意**安全问题**。比如程序不正确处理了多字节字符串的拆分拼接，导致字符逃逸；或者字符数量计算不正确，绕过一些限制，这方面可以再挖掘一下。

> 本文由「[Yank Note - 一款面向程序员的 Markdown 笔记应用](https://github.com/purocean/yn)」撰写
