const path = require("path");

// 自定义主题的文件路径
const coverPath = path.join(__dirname, "./src/cover.less");

module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            hack: `true; @import "${coverPath}";`,
          },
        },
      },
    },
  },
  // 增强 vue-cli 的 webpack 配置项
  configureWebpack: {
    // 打包优化
    externals: {
      // import 时的包名称: window 全局的成员名称
      "highlight.js": "hljs",
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      vant: "vant",
      dayjs: "dayjs",
      "socket.io-client": "io",
      popmotion: "popmotion",
    },
  },
};
