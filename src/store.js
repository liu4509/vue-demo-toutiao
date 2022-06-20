import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

// 初始化 state 对象
let initstate = {
  tokenInfo: {}
} 
// 从本地存储中获取 state 
const stateStr = localStorage.getItem('state')

if (stateStr) {
  initstate = JSON.parse(stateStr)
}

export default new Vuex.Store({
  
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
      this.commit('saveStateToStorage')
    },
    // 将 state 持久化存储到本地
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  // 异步修改数据
  actions: {},
  // 包装数据
  getters: {}
})
