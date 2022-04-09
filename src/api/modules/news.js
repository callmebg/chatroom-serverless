import request from '@/utils/request'


export default {
  getRecentNews(data) {
    const { roomid, page, pageSize } = data
    return request.get(`news/recent?roomid=${roomid}&page=${page}&pageSize=${pageSize}`)
  },
  getLastNews(data) {
    return request.post(`news/last`, data)
  },
  userIsReadMsg(data) { // 当用户在切换会话阅读消息后
    return request.post(`news/isread`, data)
  },
  getHistoryMsg(data) {
    return request.post(`news/historymsg`, data)
  }
}
