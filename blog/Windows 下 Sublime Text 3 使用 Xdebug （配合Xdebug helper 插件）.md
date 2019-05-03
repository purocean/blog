# Windows 下 Sublime Text 3 使用 Xdebug （配合Xdebug helper 插件）

> 后记：很久不是用 Sublime Text 编辑器了。现在写前端和 PHP 已经切换到 VSCode，JAVA 和 Kotlin 切换到 IntelliJ IDEA

## 安装 Xdebug
1. 下载对应版本 https://xdebug.org/download.php dll 文件，放到 PHP 的 ext 目录中。
2. 配置 php.ini ，追加内容如下：
 >[XDebug]
zend_extension="php_xdebug-2.4.1-5.6-vc11-nts-x86_64.dll"
xdebug.remote_enable=1
xdebug.remote_host="localhost"
xdebug.remote_port=9000
xdebug.remote_handler="dbgp"
xdebug.remote_mode=req
xdebug.remote_connect_back=1

注意其中dll 路径按照实际情况填写。host 和 port，建议不要修改，这是 Sublime Text Xdebug client 插件的默认配置。如果有端口冲突之类可以自行修改，或者配置其他可以实现远程调试。

## 安装 Sublime Text Xdebug client 插件
1. 本文假设你有使用 Sublime Text 包管理器的经验，所以这步直接安装 Xdebug client 就好了。如果不会使用，先去搜索如何使用包管理器吧。
2. 配置项目（这步不是必须）
在项目文件 ***.sublime-project** 里面添加如下配置。这步仅仅是为了能让编辑器能快速打开项目地址（附加调试key）。我们将要使用 Xdebug helper Chrome 插件，所以这步不是必须，可以不做。
>	"settings":
	{
	    "xdebug":
	    {
	        "url": "项目的访问地址"
	    }
	}


## 安装 Xdebug helper Chrome 插件
1. [安装 Xdebug helper](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc])，梯子自理。
2. 右键插件进入选项页面，做出如下配置：
![配置](./FILES/windows-xia-sublime-text-3-shi-yong-xdebug-pei-hexdebug-helper-cha-jian-.md/f0821002.png)
IDE key 那里填上 **sublime.xdebug** 然后 save。当然这个值也是可以在 Sublime Text Xdebug client 插件里配置的。
这一步的作用是提供一个key （可通过 url 参数也可以通过 cookie）给 PHP 服务器，表示我们要调试这个页面。

## 使用 Xdebug client
1. 浏览器打开要调试的地址，将 Xdebug helper 启用（变绿）。
2. 编辑器里打断点：试试在源码某行右键，看看 Xdebug 的菜单选项即可。
3. **菜单>tool>Xdebug** 开启Debug，还可以顺便看看相关选项，还有快捷键。
4. 刷新页面。
4. 回到编辑器，查看下面两个窗口的变量信息，尝试单步之类调试。

## 参考
1. <http://yansu.org/2014/03/20/php-debug-with-xdebug.html>
2. <https://quericy.me/blog/196/>
