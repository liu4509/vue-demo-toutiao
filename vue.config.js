const path = require('path')

// 自定义主题的文件路径
const coverPath = path.join(__dirname, './src/cover.less')

module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            hack: `true; @import "${coverPath}";`
          }
        }
      }
    }
  }
}