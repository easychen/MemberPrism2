module.exports = {
    locales: {
      '/': {
        lang: 'en-US', // 将会被设置为 <html> 的 lang 属性
        title: 'MemberPrism',
        description: 'Open source alternative to memberstack / memberspace , but with both front and backend member-only content protection'
      },
      '/zh/': {
        lang: 'zh-CN',
        title: 'MemberPrism',
        description: '类似 memberstack 或 memberspace 的开源实现，但对会员内容同时提供了前端和后端的双重保护'
      }
    },
    themeConfig: {
        sidebar:'auto',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'GitHub', link: 'https://github.com/easychen/member-prism' },
          ]
    }
  }