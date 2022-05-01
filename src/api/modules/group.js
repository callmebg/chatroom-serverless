import request from '@/utils/request'


export default {
  /**
   * 根据用户名获取其对应的群聊，用户名在user实体中对应name字段
   * @param {Object} data 
   */
  getMyGroup() {
    return request.get(`group/getMyGroup`)
  },
  /**
   * 根据id获取群聊详情
   * @param {*} data 
   */
  getGroupInfo(data) {
    let { id } = data
    return request.get(`group/groupInfo?id=${id}`)
  },
  preFetchGroup(data) {
    const { q, page, pageSize } = data // q可以是id 或者名字
    return request.get(`group/prefetchGroup?q=${q}&page=${page}&pageSize=${pageSize}`)
  },
  /**
   * 创建群聊
   * @param {*} data 
   */
  createGroup(data) {
    return request.post(`group/create`, data)
  },
  getRecentGroupConversation(data) {
    return request.post(`group/recent`, data)
  }
}
