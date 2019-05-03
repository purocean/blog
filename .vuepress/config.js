module.exports = {
  host: 'localhost',
  port: 8000,
  dest: './docs',
  head: [
    ['script', { src: 'http://tajs.qq.com/stats?sId=66403914', charset: 'UTF-8' }]
  ],
  title: '洋子的自留地',
  description: '互联网的搬运工',
  themeConfig: {
    repo: 'purocean/blog',
    lastUpdated: 'Last Updated',
    sidebar: 'auto',
  },
  markdown: {
    lineNumbers: true
  }
}
