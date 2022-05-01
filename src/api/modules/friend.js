import request from '@/utils/request'

export default {
  getMyFriends() {
    return request.get(`friend/getFriends`)
  },
  getRecentConversationList(data) {
    return request.post(`friend/recentConversation`, data)
  },
  deleteFriend(data) {
    return request.post(`friend/deleteFriend`, data)
  },
  /**修改好友所在的分组 */
  modifyFenzu(data) {
    return request.post(`friend/modifyFenzu`, data)
  }
}
