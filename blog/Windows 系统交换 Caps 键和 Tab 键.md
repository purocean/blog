# Windows 系统交换 Caps 键 和 Tab 键

## 缘起
最近入手了一个小电脑，对于一个程序员来说tab键不方便按可要老命。
网上搜索一番交换按键要么安装软件要么更改注册表。
我不愿意为了这样一个功能额外安装一个软件，但是网上提供的注册表修改方法大多是交换 `Caps` 和 `Esc` 键的，因此参考一篇教程写了一个。

## 注册表代码
将下面的代码复制到一个文本文件改后缀 `reg` 双击运行即可
```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
 
"Scancode Map"=hex:00,00,00,00,00,00,00,00,03,00,00,00,3a,00,0F,00,0F,00,3a,00,00,00,00,00
```

想要恢复也很简单
```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
 
"Scancode Map"=-

```

## 参考
<http://mingxinglai.com/cn/2013/05/change-capslock-to-esc/>

--------------------------

最后附上小电脑靓照 ^_^
![](./FILES/windows-xi-tong-jiao-huan-caps-jian-he-tab-jian.md/2ebe9f75.png)
![](./FILES/windows-xi-tong-jiao-huan-caps-jian-he-tab-jian.md/95d7dde8.png)
![](./FILES/windows-xi-tong-jiao-huan-caps-jian-he-tab-jian.md/c0779b7d.png)
