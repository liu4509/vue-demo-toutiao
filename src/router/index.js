import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入需要的路由组件
// 登录组件
// import Login from '@/views/Login/Login.vue';
const Login = () => import('@/views/Login/Login.vue')
// 首页组件
// import Main from '@/views/Main/Main.vue';
const Main = () => import('@/views/Main/Main.vue')
// 首页 - 主页组件
// import Home from '@/views/Home/Home.vue';
const Home = () => import('@/views/Home/Home.vue')
// 首页 - 我的组件
// import User from '@/views/User/User.vue';
const User = () => import('@/views/User/User.vue')
// 搜索组件
// import Search from '@/views/Search/Search.vue';
const Search = () => import('@/views/Search/Search.vue')
// 搜索结果项组件
const SearchResult = () => import('@/views/SearchResult/SearchResult.vue')
// 文章详情组件
const ArticleDetail  = () => import('@/views/ArticleDetail/ArticleDetail.vue')

Vue.use(VueRouter)

const routes = [
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: '/login', component: Login, name: 'login' },
  //加重定向解决 to 指向的问题
  {
    path: '/', component: Main, redirect: 'home',
    // 子路由
    children: [
      // 默认子路由 path 为空字符串  
      { path: 'home', component: Home, name: 'home'},
      { path: 'user', component: User, name: 'user'}
    ]
  },
  { path: '/search', component: Search, name: 'search'},
  // 动态路由 :kw porps: true 可以传值
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true },
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail',props: true}
]

const router = new VueRouter({
  routes
})

export default router
