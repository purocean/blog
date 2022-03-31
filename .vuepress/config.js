module.exports = {
  host: 'localhost',
  port: 8000,
  dest: './dist',
  base: '/',
  head: [
    // ['script', { src: 'https://tajs.qq.com/stats?sId=66403914', charset: 'UTF-8' }]
  ],
  title: '洋子的自留地',
  description: '互联网的搬运工',
  theme: '@vuepress/blog',
  themeConfig: {
    dateFormat: 'YYYY-MM-DD',
    nav: [
      { text: '首页', link: '/' },
      // { text: '分类', link: '/category/' },
      { text: '标签', link: '/tag/' },
    ],
    footer: {
      copyright: [
        {
          text: 'Powered by VuePress | Copyright © 2019-present',
          link: '',
        },
      ],
      contact: [
        {
          type: 'github',
          link: 'https://github.com/purocean/blog',
        },
      ],
    },
    directories: [
      {
        id: 'post',
        dirname: '_posts',
        path: '/',
        itemPermalink: '/:slug'
      },
    ],
    globalPagination: {
      sorter: (prev, next) => {
        const dayjs = require('dayjs')
        const prevTime = dayjs(prev.frontmatter.date)
        const nextTime = dayjs(next.frontmatter.date)
        const prevTop = (prev.frontmatter.top || 0) * 10000000000000
        const nextTop = (next.frontmatter.top || 0) * 10000000000000
        return (prevTop || prevTime) - (nextTop || nextTime) > 0 ? -1 : 1
      },
      prevText: '上一页', // Text for previous links.
      nextText: '下一页', // Text for next links.
      lengthPerPage: 20, // Maximum number of posts per page.
    },
    comment: {
      service: 'vssue',
      owner: 'purocean',
      repo: 'blog',
      clientId: '2e4274abbb0604471a05',
      clientSecret: 'ede53d6baee3682a98ed79d2887450ad34806ede',
      proxy: 'https://leoy233.website/proxy/login/oauth/access_token'
    },
    feed: {
      canonical_base: 'https://purocean.github.io',
    }
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/medium-zoom',
    '@vuepress/active-header-links',
    '@markspec/vuepress-plugin-footnote',
    'img-lazy'
  ],
}
