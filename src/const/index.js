export const conversationTypes = {
  friend: 'FRIEND',
  group: 'GROUP'
}

export const APP_VERSION = '1.0.0'

export const VueAMapKey = '704b3b5e984fa3b6185c3f012da42547'

// 在添加好友或者群聊时对应的搜索条件
export const searchObjectMap = [
  {id: 1, label: '用户', value: 'friend'},
  {id: 2, label: '群聊', value: 'group'}
]


export const validateNewsTips = {
  applyFriendTo: '请求添加您为好友',
  applyGroupTo: '请求加入群聊'
}

export const qiniu_URL = 'http://blog.static.chenr.cn/'

// 上传图片时的状态
export const uploadImgStatusMap = {
  error: 'error',
  next: 'next',
  complete: 'complete'
}

export const MSG_TYPES = {
  sys: 'sys',
  text: 'text',
  img: 'img',
  file: 'file'
}
