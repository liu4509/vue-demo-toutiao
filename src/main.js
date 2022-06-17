import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'

//导入 amfe-flexible：配置 postcss-pxtorem 和 amfe-flexible 
import 'amfe-flexible'

// 引入 vant 组件库
import Vant from 'vant';
import 'vant/lib/index.css';

// 挂载在 vue 实例上
Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
