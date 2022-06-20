import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入需要的路由组件
// 登录组件
import Login from '@/views/Login/Login.vue';

Vue.use(VueRouter)

const routes = [
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: '/login', component: Login, name: 'login' }
  
]

const router = new VueRouter({
  routes
})

export default router
