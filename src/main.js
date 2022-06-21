import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store';

//导入 amfe-flexible：配置 postcss-pxtorem 和 amfe-flexible 
import 'amfe-flexible'

// 引入 vant 组件库
import Vant, { Lazyload } from 'vant';
import 'vant/lib/index.less';

// 导入 dayjs 的核心模块
import dayjs from 'dayjs';
// 导入计算相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文语言包
import zh from 'dayjs/locale/zh-cn'
// 配置 计算相对时间 的插件
dayjs.extend(relativeTime)
// 插件的语言包
dayjs.locale(zh)

// 定义格式化时间的全局过滤器
Vue.filter('dateFormat', dt => {
  return dayjs().to(dt)
})

// 挂载在 vue 实例上
Vue.use(Vant);
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
