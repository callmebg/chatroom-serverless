import request from '@/utils/request'


export default {
  getMyFriends(id) {
    return request.get(`/v1/friendly/myfriends?id=${id}`)
  },
  getRecentConversationList(data) {
    return request.post(`friendly/recentconversation`, data)
  },
  deleteFriend(data) {
    return request.post(`friendly/deltefriend`, data)
  }
}
