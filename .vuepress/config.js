module.exports = {
  host: 'localhost',
  port: 8000,
  dest: './docs',
  base: './',
  head: [
    ['script', { src: 'https://tajs.qq.com/stats?sId=66403914', charset: 'UTF-8' }]
  ],
  title: '洋子的自留地',
  description: '互联网的搬运工',
  themeConfig: {
    repo: 'purocean/blog',
    lastUpdated: 'Last Updated',
    sidebar: 'auto',
    nav: [
      { text: '首页', link: '/' },
      // { text: '分类', link: '/category/' },
      // { text: '标签', link: '/tag/' },
    ],
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/medium-zoom',
    '@vuepress/pagination',
    '@vuepress/active-header-links',
    // ['@vuepress/plugin-blog', {postsDir: 'blog'}],
    ['@vssue/vuepress-plugin-vssue', {
      // 设置 `platform` 而不是 `api`
      platform: 'github',

      // 其他的 Vssue 配置
      owner: 'purocean',
      repo: 'blog',
      clientId: '2e4274abbb0604471a05',
      clientSecret: 'ede53d6baee3682a98ed79d2887450ad34806ede',
    }],
  ],
}
