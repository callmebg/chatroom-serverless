const state = {
  sysUsers: '' || JSON.parse(window.localStorage.getItem('sysusers')),
  currentConversation: {}, // 当前的会话，在白板协作、音视频通话会使用
  recentConversation: [], // 最近的会话列表
  onlineUser: [], // 在线用户
  allConversation: [], // 所有会话
  allFriends: [], // 所有的好友 
}

const mutations = {
  setSysUsers(state, data) {
    state.sysUsers = data
    const dataStr = JSON.stringify(data)
    window.localStorage.setItem('sysusers', dataStr)
  },
  setCurrentConversation(state, data) {
    state.currentConversation = data
  },
  setRecentConversation(state, data) {
    const res = data.data
    if (data.type === 'init') {
      state.recentConversation = res
    } else if (data.type === 'add') {
      const ids = state.recentConversation.map(item => item._id)
      const newData = !ids.includes(res._id) ? [...state.recentConversation, res] : [...state.recentConversation]
      state.recentConversation = newData
    } else if (data.type === 'delete') {
      const index = state.recentConversation.findIndex(item => item._id === res._id)
      const newData = JSON.parse(JSON.stringify(state.recentConversation))
      index !== -1 && newData.splice(index, 1)
      state.recentConversation = newData
    }
  },
  setOnlineUser(state, data) {
    state.onlineUser = data
  },
  setAllConversation(state, data) {
    state.allConversation = [...state.allConversation, ...data]
  },
  setAllFriends(state, data) {
    const { resource, type } = data
    console.log('setFriend', data)
    if (type === 'init') {
      // resourece === [{...}, {...}, ...]
      state.allFriends = resource
    } else if (type === 'delete') {
      // resource === 删除被好友ID
      state.allFriends = (state.allFriends || []).filter(item => item.user_id !== resource)
    }
  },
  setFriendRemark(state, data) {
    for(var key in state.allFriends) {
      if(state.allFriends[key]["user_id"] == data["id"]) {
        state.allFriends[key]["friend_remark"] = data["remark"]
      }
    }
  }
}

const actions = {
  SET_SYS_USERS({commit}, data) {
    commit('setSysUsers', data)
  },
  SET_CURRENT_CONVERSATION({commit}, data) {
    commit('setCurrentConversation', data)
  },
  SET_RECENT_CONVERSATION({commit}, data) {
    commit('setRecentConversation', data)
  },
  SET_ONLINE_USER({commit}, data) {
    commit('setOnlineUser', data)
  },
  SET_ALL_CONVERSATION({commit}, data) {
    commit('setAllConversation', data)
  },
  SET_ALL_FRIENDS({commit}, data) {
    commit('setAllFriends', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
