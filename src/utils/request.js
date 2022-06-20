import axios from 'axios'
import store from '@/store';

// 使用vant 的 Toast 轻提示组件
import { Toast } from 'vant';

// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
  baseURL: 'http://www.liulongbin.top:8000'
})

//请求拦截器
instance.interceptors.request.use(
  // 在发送请求之前执行
  config => {
    // 获取 token 的值
    const tokenStr = store.state.tokenInfo.token
    // 如果 tokenStr 的值不为空， 则为这次请求的请求头添加 Authorization 身份认证字段
    if (tokenStr) {
     config.headers.Authorization = `Bearer ${tokenStr}`
    }
    // 展示 loading 效果
    Toast.loading({
      message: '加载中...',
      duration: 0  // 值为 0 时不会消失
    })
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  response => {
    Toast.clear()
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default instance