import userApi from '@/api/modules/user'

const state = {
  isLogin: JSON.parse(window.sessionStorage.getItem('isLogin') || "false"),
  userInfo: JSON.parse(window.localStorage.getItem('userInfo') || '{}'),
  token: ''
}

const mutations = {
  login(state, data) {
    state.isLogin = true,
    state.userInfo = data.userInfo
    state.token = data.token
    window.localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
    window.sessionStorage.setItem('isLogin', true)
  },
  logout(state) {
    state.isLogin = false,
    state.userInfo = null,
    state.token = ''
    window.localStorage.setItem('userInfo', '{}')
    window.sessionStorage.setItem('isLogin', false)
  }
}

const actions = {
  LOGIN({commit}, data) {
    commit('login', data)
  },
  LOGOUT({commit}, data) {
    commit('logout', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
