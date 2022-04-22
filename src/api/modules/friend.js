import request from '@/utils/request'


export default {
  getMyFriends(id) {
    return request.get(`friend/getFriends`)
  },
  getRecentConversationList(data) {
    return request.post(`friend/recentConversation`, data)
  },
  deleteFriend(data) {
    return request.post(`friend/deleteFriend`, data)
  }
}
