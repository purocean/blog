const integrateGitment = router => {
  const linkGitment = document.createElement('link')
  linkGitment.href = '/gitment.css'
  linkGitment.rel = 'stylesheet'
  const scriptGitment = document.createElement('script')
  document.body.appendChild(linkGitment)
  scriptGitment.src = '/gitment.browser.js'
  document.body.appendChild(scriptGitment)

  const renderGitment = () => {
    const gitment = new Gitment({
      // ！！！ID最好不要使用默认值（location.href），因为href会携带hash，可能导致一个页面对应像个评论issue！！！
      // https://github.com/imsun/gitment/issues/55
      id: location.pathname,
      owner: 'purocean', // 必须是你自己的github账号
      repo: 'blog', // 上一个准备的github仓库
      link: location.origin + location.pathname,
      oauth: {
        client_id: '2e4274abbb0604471a05', // 第一步注册 OAuth application 后获取到的 Client ID
        client_secret: '5c528d11ce398e109eb54cf0b98cd165efd1387d', // 第一步注册 OAuth application 后获取到的 Clien Secret
      },
    })
    gitment.render('comments-container')
  }

  router.afterEach(to => {
    // 已被初始化则根据页面重新渲染 评论区
    if (scriptGitment.onload) {
      renderGitment()
    } else {
      scriptGitment.onload = () => {
        const commentsContainer = document.createElement('div')
        commentsContainer.id = 'comments-container'
        commentsContainer.classList.add('content')
        const $page = document.querySelector('.page')
        if ($page) {
          $page.appendChild(commentsContainer)
          renderGitment()
        }
      }
    }
  })
}

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  try {
    // 生成静态页时在node中执行，没有document对象
    document && integrateGitment(router)
  } catch (error) {
    console.warn(' node 环境不集成评论')
  }
}
