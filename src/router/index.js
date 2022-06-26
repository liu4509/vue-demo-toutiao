import Vue from "vue";
import VueRouter from "vue-router";

// vuex 的数据
import store from "@/store.js";

// 导入需要的路由组件
// 登录组件
// import Login from '@/views/Login/Login.vue';
const Login = () => import("@/views/Login/Login.vue");
// 首页组件
// import Main from '@/views/Main/Main.vue';
const Main = () => import("@/views/Main/Main.vue");
// 首页 - 主页组件
// import Home from '@/views/Home/Home.vue';
const Home = () => import("@/views/Home/Home.vue");
// 首页 - 我的组件
// import User from '@/views/User/User.vue';
const User = () => import("@/views/User/User.vue");
// 搜索组件
// import Search from '@/views/Search/Search.vue';
const Search = () => import("@/views/Search/Search.vue");
// 搜索结果项组件
const SearchResult = () => import("@/views/SearchResult/SearchResult.vue");
// 文章详情组件
const ArticleDetail = () => import("@/views/ArticleDetail/ArticleDetail.vue");
// 编辑用户信息组件
const UserEdit = () => import("@/views/UserEdit/UserEdit.vue");
// 小思同学组件
const Chat = () => import("@/views/Chat/Chat.vue");

// 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push;
// 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: "/login", component: Login, name: "login" },
  //加重定向解决 to 指向的问题
  {
    path: "/",
    component: Main,
    redirect: "home",
    // 子路由
    children: [
      // 默认子路由 path 为空字符串
      {
        path: "home",
        component: Home,
        name: "home",
        meta: { isRecord: true, top: 0 },
      },
      { path: "user", component: User, name: "user" },
    ],
  },
  // 编辑用户资料的路由规则
  { path: "/user/edit", component: UserEdit, name: "user-edit" },
  // 搜索模块的路由
  { path: "/search", component: Search, name: "search" },
  // 小思同学模块的路由
  { path: "/chat", component: Chat, name: "chat" },
  // 动态路由 :kw porps: true 可以传值
  {
    path: "/search/:kw",
    component: SearchResult,
    name: "search-result",
    props: true,
    meta: { isRecord: true, top: 0 },
  },
  {
    path: "/article/:id",
    component: ArticleDetail,
    name: "art-detail",
    props: true,
    meta: { isRecord: true, top: 0 },
  },
];

const router = new VueRouter({
  routes,
});

// 所有有权限页面的路径，都在这个数组之中
const pagePathArr = ["/user", "/user/edit"];
// 路由前置守卫
// to 去那 from 来至那 next 放行
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 访问有权限的页面 需确认用户是否登录
    const tokenStr = store.state.tokenInfo.token;
    //  有值
    if (tokenStr) {
      next();
    } else {
      // token 不存在 去登录页
      next("/login?pre=" + to.fullPath);
    }
  } else {
    // 访问没有权限的页面
    next();
  }
});
// 全局后置钩子
router.afterEach((to, from) => {
  // 如果当前的路由的元信息中，isRecord 的值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      // 则把元信息中的 top 值设为滚动条纵向滚动的位置
      window.scrollTo(0, to.meta.top);
    }, 0);
  }
});

export default router;
