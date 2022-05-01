import userApi from '@/api/modules/user'
import { getCookie, setCookie, removeCookie } from "@/utils/token";

const state = {
  isLogin: JSON.parse(window.sessionStorage.getItem('isLogin') || "false"),
  userInfo: JSON.parse(window.localStorage.getItem('userInfo') || '{}'),
  token: '',
  uploadToken: null,
  cos: null,
  fenzu: null
}

const mutations = {
  setFenzu(state, data) {
    state.fenzu = data
  },
  addFenzu(state, data) {
    state.fenzu[data] = []
  },
  setCos(state, data) {
    state.cos = data
  },
  setUploadToken(state, data) {
    state.uploadToken = data
  },
  setUserInfo(state, data) {
    state.userInfo = data
  },
  login(state, data) {
    state.isLogin = true,
    state.userInfo = data.userInfo
    state.token = data.token
    window.localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
    window.sessionStorage.setItem('isLogin', true)
    setCookie(data.token)
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
