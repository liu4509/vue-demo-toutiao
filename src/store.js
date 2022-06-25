import Vue from 'vue';
import Vuex from 'vuex';

// 用户信息 API
// 请求用户简介信息的 API
import { getUserInfoAPI , getUserProfileAPI} from "@/api/userAPI.js";

Vue.use(Vuex)

// 初始化 state 对象
let initstate = {
  // token 的信息对象
  tokenInfo: {},
  // 用户的基本信息
  userInfo: {},
  // 用户的简介信息
  userProfile: {}
} 
// 从本地存储中获取 state 
const stateStr = localStorage.getItem('state')

if (stateStr) {
  initstate = JSON.parse(stateStr)
}

const store = new Vuex.Store({
  // 全局数据储存
  // state: {
  //   // 用来储存 token 信息的对象，将来这个对象中会包含两个属性 { token, refresh_token }
  //   initstate
  // },
  // 直接全部替换 initstate
  state: initstate,
  // 修改数据
  mutations: {
    // 更新 tokenInfo 的值
    updateTokenInfo(state, payload) {
      state.tokenInfo = payload
      // 如果希望在 Mutation A 中调用 Mutation B，需要通过 this.commit() 方法来实现
      // this 表示当前的 new 出来的 store 实例对象
      store.commit('saveStateToStorage')
    },
    // 将 state 持久化存储到本地
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 更新 userinfo 的方法
    updateUserInfo(state, payload) {
      // 用户的数据
      state.userInfo = payload
      // 将数据持久化存储
      store.commit('saveStateToStorage')
    },
    // 清空 vuex 和本地的数据
    cleanState(state) {
      // 清空 vuex 的数据
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      // 清空后的 state 存储在本地
      store.commit('saveStateToStorage')
    },
    // 更新 userProfile 信息
    updateUserProfile(state, payload) {
      state.userProfile = payload
      store.commit('saveStateToStorage')
    }
  },
  // 异步修改数据
  actions: {
    // 初始化用户的基本信息
    async initUserInfo() {
      const { data: res } = await getUserInfoAPI();
      if (res.message === "OK") {
        store.commit('updateUserInfo',res.data)
      }
    },
    // 初始化用户的简介信息
    async initUserProfile(store) {
      const {data: res} = await getUserProfileAPI()
      if (res.message === 'OK') {
        // 成功后 传入 state
        store.commit('updateUserProfile', res.data)
      }
    }
  },
  // 包装数据
  getters: {
  // 用户头像的计算属性
  userAvatar(state) {
    // 默认的头像地址
    let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'

    // 如果用户信息对象中包含 photo 属性的值，则为 imgSrc 重新赋值
    if (state.userInfo.photo) {
      imgSrc = state.userInfo.photo
    }
    return imgSrc
  }}

})

export default store
