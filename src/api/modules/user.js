import request from '@/utils/request'


export default {
  login(data) {
    return request.post(`user/login`, data)
  },
  getCVCode() { // 获取验证码
    return request.get(`user/getcode`)
  },
  register(data) { // 注册
    return request.post(`user/register`, data)
  },
  getUserInfo(id) {
    return request.get(`user/userinfo?id=${id}`)
  },
  preFetchUser(data) {
    let { type, q, page, pageSize } = data
    return request.get(`user/prefetchuser?type=${type}&q=${q}&page=${page}&pageSize=${pageSize}`)
  },
  addNewFenzu(data) {
    return request.post(`user/addfenzu`, data)
  },
  modifyuserfenzu(data) {
    return request.post(`user/modifyuserfenzu`, data)
  },
  modifyFriendBeizhu(data) {
    return request.post(`user/modifyfriendbeizhu`, data)
  },
  deleteFenzu(data) {
    return request.post(`user/delfenzu`, data)
  },
  editFeznu(data) { // 编辑某项分组名称
    return request.post(`user/editfenzu`, data)
  }
}