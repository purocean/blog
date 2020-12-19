---
title: 使用 generator 模拟 async await 异步编程
date: 2020-12-19
author: 洋子
tags:
  - JavaScript
---

## 背景
最近接触了一个 umi 的项目，里面使用 dva 做状态管理。然后发现里面有设计 js 的 generator 语法。虽然之前在其他语言里面（Python，PHP）接触过生成器，知道他是做什么的。但是针对 JS 中的异步编程同步写法还是不太清楚背后的原理，于是研究了一下。

## 过程
先定义一个获取数据的异步方法，调用返回一个 Promise 对象，然后我们不使用 async/await，用 generator，模仿 dva 的写法，用写同步代码的方式来获取数据。
```js
const fetchData = () => new Promise(resolve => {
    setTimeout(() => {
        resolve('test data')
    }, 3000)
})

function *test(call) {
    const res = yield call(fetchData)
    console.log(res)
}
```

我们知道调用一次 generator 的 next 方法，程序就往下走一步。那么我们这个 call 参数怎样写，才能做到在合适的时候调用 next 呢？

我这里自己想的一个办法

```js
const call = p => {
    p.then(res => {
        g.next(res)
    })
}

g = test(call)
g.next()
```

最终代码，加上日志打印，观察一下执行顺序：
```js
const fetchData = () => new Promise(resolve => {
    setTimeout(() => {
        resolve('test data')
    }, 3000)
})

function *test(call) {
    console.log(2)
    const res = yield call(fetchData())
    console.log(res)
}

const call = p => {
    console.log(3)
    p.then(res => {
        console.log(4)
        g.next(res);
        console.log(5)
    });
    console.log(6)
}

console.log(-1)
g = test(call)
console.log(0)
g.next()
console.log(1)
```

执行结果
```
-1
0
2
3
6
1
4
test data
5
```

这样我们就实现了使用 generator 来模拟 async/await。

## 进一步
这里我们还是传入了一个 call，比较丑陋，而且只能执行只有一个 yield 的 generator。所以稍微改造一下，引入一个 run 方法，使用递归来实现自动往下走，代码如下：

```js
const fetchData = (arg) => new Promise(resolve => {
    setTimeout(() => {
        resolve('test data ' + arg)
    }, 3000)
})

function *test() {
    console.log('0')
    let res = yield fetchData('1')
    console.log('1', res)
    res = yield fetchData(res)
    console.log('2', res)
    res = yield fetchData(res)
    console.log('3', res)
    res = yield fetchData(res)
    console.log('4', res)
}

const run = g => {
    const next = val => {
        const res = g.next(val)
        if(res.done) return res.value
        res.value.then(next)
    }

    next()
}

run(test())
```

执行结果
```
0
1 test data 1
2 test data test data 1
3 test data test data test data 1
4 test data test data test data test data 1
```

## 参考
1. https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator
