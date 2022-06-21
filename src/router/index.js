import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入需要的路由组件
// 登录组件
import Login from '@/views/Login/Login.vue';
// 首页组件
import Main from '@/views/Main/Main.vue';
// 首页 - 主页组件
import Home from '@/views/Home/Home.vue';
// 首页 - 我的组件
import User from '@/views/User/User.vue';
Vue.use(VueRouter)

const routes = [
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/', component: Main,
    // 子路由
    children: [
      // 默认子路由 path 为空字符串  
      { path: '', component: Home, name: 'home'},
      { path: '/user', component: User, name: 'user'}
    ]
  }
  
]

const router = new VueRouter({
  routes
})

export default router
