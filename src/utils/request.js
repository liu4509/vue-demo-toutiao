import axios from "axios";
import store from "@/store";

// 路由模块
import router from "@/router/index.js";

// 使用vant 的 Toast 轻提示组件
import { Toast } from "vant";

const root = "http://www.liulongbin.top:8000";
// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
  baseURL: root,
});

//请求拦截器
instance.interceptors.request.use(
  // 在发送请求之前执行
  (config) => {
    // 获取 token 的值
    const tokenStr = store.state.tokenInfo.token;
    // 如果 tokenStr 的值不为空， 则为这次请求的请求头添加 Authorization 身份认证字段
    if (tokenStr) {
      config.headers.Authorization = `Bearer ${tokenStr}`;
    }
    // 展示 loading 效果
    Toast.loading({
      message: "加载中...",
      duration: 0, // 值为 0 时不会消失
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    Toast.clear();
    return response;
  },
  async (error) => {
    // 请求失败 关闭 loading 效果
    Toast.clear();
    // 1. 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
    const refreshToken = store.state.tokenInfo.refresh_token;
    // 如果有响应的结果 并返回的响应状态码是 401 那 token 过期
    if (error.response.status === 401 && refreshToken) {
      try {
        // 请求新的 token
        // 换取 Token 的 API（形参中的 refreshToken 用来换取新 token）
        const { data: res } = await axios({
          method: "PUT",
          // 这里必须填写完整的请求 URL 地址
          url: root + "/v1_0/authorizations",
          headers: {
            // 在请求头中携带 Authorization 身份认证字段
            Authorization: "Bearer " + refreshToken,
          },
        });
        // 更新 vuex 里面的 Token
        store.commit("updateTokenInfo", {
          token: res.data.token,
          refresh_token: refreshToken,
        });
        return instance(error.config);
      } catch {
        //  token 和 refresh_token 都失效了
        // 清空 vuex 和 localStorage 的用户信息
        store.commit("cleanState");
        // 跳转到登录页，并通过路由的 query 查询参数，把当前用户“访问未遂的路由地址”带给登录页
        router.replace("/login?pre=" + router.currentRoute.fullPath);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
