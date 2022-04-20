export default class SocketService {
  /**
   * 单例
   */
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务端连接的socket对象
  ws = null

  // 记录重试的次数
  sendRetryCount = 0

  // 重新连接尝试的次数
  connectRetryCount = 0

  //  定义连接服务器的方法
  connect() {
    console.log("尝试连接Websocket 服务器")
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    this.ws = new WebSocket(process.env.SOCKET_URL)
    console.log("CONNECTING:", this.ws.CONNECTING)
    console.log("OPEN:", this.ws.OPEN)
    console.log("CLOSING:", this.ws.CLOSING)
    console.log("CLOSED:", this.ws.CLOSED)
    // 连接成功的事件
    this.ws.onopen = () => {
      console.log('连接服务端成功')
      // 重置重新连接的次数
      this.connectRetryCount = 0
    }
    // 1.连接服务端失败
    // 2.当连接成功之后, 服务器关闭的情况(连接失败重连)
    this.ws.onclose = () => {
      console.log('服务端断开连接')
      /*
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
      */
    }
    // 得到服务端发送过来的数据
    this.ws.onmessage = msg => {
      console.log('从服务端获取到了数据' + msg.data)

    }
    this.ws.onerror = evt => {
      console.log('连接失败' + evt)
    }
  }

  // 发送数据的方法
  send(data) {
    console.log("websocket 状态：", this.ws.readyState)
    data = JSON.stringify(data)
    // 判断此时此刻有没有连接成功
    if (this.ws.readyState === this.ws.OPEN) {
      this.sendRetryCount = 0
      this.ws.send(data)
    } else if (this.ws.readyState === this.ws.CONNECTING) {
      // 若是 正在开启状态，则等待后重新调用
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500)
    } else {
      // 若未开启
      console.log("发送失败")
    }
  }

  emit(action) {
    this.emit(action, null)
  }

  emit(action, data) {
    this.send({ action: action, data: data })
  }
}
