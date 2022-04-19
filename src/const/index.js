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
  applyFriend: '请求添加你为好友',
  applyGroup: '请求加入群聊'
}

export const qiniu_URL = 'http://blog.static.chenr.cn/'

// 七牛云上传图片时的状态
export const uploadImgStatusMap = {
  error: 'error',
  next: 'next',
  complete: 'complete'
}


export const weatherMap = {
  "阴": 'icon-tianqi',
  "多云": 'icon-tianqi1',
  "晴": 'icon-ziyuan',
  "小雨下雨": 'icon-n1'
}

export const weekNumZHMap = {
  "0": '星期天',
  "1": '星期一',
  "2": '星期二',
  "3": '星期三',
  "4": '星期四',
  "5": '星期五',
  "6": '星期六',
}

export const commentTips = "黑猫警长提示您文明发言"

export const defaultPyqItem = {
  pictures: [
    'http://blog.static.chenr.cn/cc-messger-1702f38162c-92.jpeg'
  ],
  readCount: 0,
  _id: "5e3ea3518160c54408d9ba13",
  userId: {
    photo: "/uploads/2019-11-10/f-1573390856438-f1573390856092.png",
    signature: "signature",
    nickname: "nickname",
    _id: "5d9d903f49db3825a8e76a03"
  },
  createDate: new Date(),
  content: "content",
  __v: 0,
}

export const WEB_RTC_MSG_TYPE = {
  artBoard: 'artBoard',
  video: 'video',
  audio: 'audio'
}

export const MSG_TYPES = {
  ...WEB_RTC_MSG_TYPE,
  sys: 'sys',
  text: 'text',
  img: 'img',
  file: 'file'
}
