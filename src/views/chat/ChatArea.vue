<template>
  <div class="chat-area__com">
    <chat-header
      :currentConversation="currentConversation"
      :set-current-conversation="setCurrentConversation"
    />
    <div
      :class="
        currentConversation.conversationType !== 'GROUP'
          ? 'main no-group'
          : 'main'
      "
    >
      <div class="message-list-container">
        <message-list
          ref="messagelist"
          @load-message="loadmessage"
          :messagelist="messagesOutcome"
          :scrollbottom="scrollBottom"
          :hasmore="hasMore"
          :isloading="isLoading"
          :useanimation="useAnimation"
          :currentConversation="currentConversation"
          :last-enter-time="lastEnterTime"
          :set-last-enter-time="setLastEnterTime"
        />
      </div>
      <div
        class="group-desc"
        v-if="
          device !== 'Mobile' &&
            currentConversation.conversationType === 'GROUP'
        "
      >
        <group-desc
          :currentConversation="currentConversation"
          :key="datetamp"
        />
      </div>
    </div>
    <div class="message-edit-container">
      <div class="send-type">
        <i
          class="item iconfont icon-emoji"
          @click.stop="showEmojiCom = !showEmojiCom"
        ></i>
        <i
          class="item el-icon-picture"
          @click.stop="showUpImgCom = !showUpImgCom"
        />
        <i
          class="item el-icon-folder"
          @click.stop="showUpFileCom = !showUpFileCom"
        />
      </div>
      <div class="operation">
        <el-button @click="send" type="success" size="small" round
          >发送</el-button
        >
        <el-button @click="messageText=''" type="danger" size="small" round
          >清空</el-button
        >
      </div>
      <textarea
        ref="chatInp"
        class="textarea"
        v-model="messageText"
        maxlength="200"
        @input="scrollBottom = true"
        @keydown.enter="send($event)"
      >
      </textarea>
      <transition name="fade">
        <up-file v-if="showUpFileCom" class="emoji-component" />
      </transition>
      <transition name="fade">
        <up-img v-if="showUpImgCom" class="emoji-component" />
      </transition>
      <transition name="fade">
        <custom-emoji
          v-if="showEmojiCom"
          class="emoji-component"
          @addemoji="addEmoji"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import chatHeader from './components/Header'
import messageList from './components/MessageList'
import { SET_UNREAD_NEWS_TYPE_MAP } from '@/store/constants'
import { conversationTypes, MSG_TYPES } from '@/const'
import customEmoji from '@/components/customEmoji'
import upImg from '@/components/customUploadImg'
import upFile from '@/components/customUploadFile'
import groupDesc from './components/GroupDesc'
import xss from '@/utils/xss'
import {swapRoomId} from '@/utils'
export default {
  props: {
    currentConversation: Object,
    setLoading: Function,
    setCurrentConversation: Function
  },
  data() {
    return {
      messageText: '',
      messages: [],
      showEmojiCom: false,
      showUpImgCom: false,
      showUpFileCom: false,
      page: 0,
      pageSize: 15,
      hasMore: true,
      showTopOperation: false,
      scrollBottom: true,
      isLoading: false,
      useAnimation: false,
      lastEnterTime: Date.now(), // 对方进入该会话的时间
      datetamp: Date.now() // 切换群聊重新强制加载群聊详情
    }
  },
  computed: {
    ...mapState('user', {
      userInfo: 'userInfo'
    }),
    messagesOutcome() {
      return this.messages.filter(item => {
        return (
          item.roomId == this.currentConversation.roomId ||
          swapRoomId(item.roomId) == this.currentConversation.roomId
        )
      })
    },
    device() {
      return this.$store.state.device.deviceType
    }
  },
  methods: {
    receiveMessage(news) {
      console.log('收到新的消息', news)
      this.messages = [...this.messages, news]
      if (news.roomId === this.currentConversation.roomId) {
        setTimeout(() => {
          this.$store.dispatch('news/SET_UNREAD_NEWS', {
            roomId: news.roomId,
            count: 0,
            type: SET_UNREAD_NEWS_TYPE_MAP.clear
          })
        }, 0)
      }
    },
    conversationList(list) {
      // console.log("当前会话列表", list)
    },
    /**最后进入该会话的时间 */
    setLastEnterTime(time) {
      this.lastEnterTime = time
    },
    generatorMessageCommon() {
      return {
        roomId: this.currentConversation.roomId,
        senderId: this.userInfo.user_id,
        senderAvatar: this.userInfo.user_profile,
        senderNickname: this.userInfo.user_nickname,
        conversationType: this.currentConversation.conversationType,
        currentConversation: this.currentConversation
      }
    },
    /**
     * 发送图片文件
     */
    sendPicFile(url, type) {
      const common = this.generatorMessageCommon()
      const newMessage = {
        ...common,
        message: url,
        messageType: type
      }
      //this.messages = [...this.messages, newMessage]
      this.$socket.emit('sendNewMessage', newMessage)
      this.$store.dispatch('news/SET_LAST_NEWS', {
        type: 'edit',
        res: {
          roomId: this.currentConversation.roomId,
          news: newMessage
        }
      })
    },
    addEmoji(emoji = '') {
      this.messageText += emoji
    },
    send(e) {
      e.preventDefault()
      if (!this.messageText) {
        return
      }
      const common = this.generatorMessageCommon()
      const newMessage = {
        ...common,
        message: xss(this.messageText),
        messageType: 'text'
      }
      console.log('sendNewMessage', newMessage)
      // 我觉得应该在接收消息那设置
      //this.messages = [...this.messages, newMessage]
      this.$socket.emit('sendNewMessage', newMessage)
      this.$store.dispatch('news/SET_LAST_NEWS', {
        type: 'edit',
        res: {
          roomId: this.currentConversation.roomId,
          news: newMessage
        }
      })
      this.messageText = ''
    },
    joinChatRoom() {
      this.$socket.emit('join', this.currentConversation)
    },
    async getRecentNews(init = true) {
      /**
       * getRecentNews分为两种目前分为两种情况：1.获取两两好友之间的；2.获取群聊的
       */
      if (this.isLoading) return // 防止重复发起请求
      this.isLoading = true
      init && this.setLoading(true) // 只有在第一次加载的时候才让ChatArea有loading动画，后面加载时不显示
      const { roomId, conversationType } = this.currentConversation
      const params = {
        roomId,
        page: this.page,
        pageSize: this.pageSize
      }
      if (conversationType === conversationTypes.friend) {
        const { data } = await this.$http.getRecentNews(params)
        this.setLoading(false)
        if (data.success) {
          this.isLoading = false
          data.data.reverse()

          this.messages = [...data.data, ...this.messages]
          if (data.data.length < this.pageSize) {
            this.hasMore = false
            return
          }
          this.page++
        }
      } else if (conversationType === conversationTypes.group) {
        const { data } = await this.$http.getRecentNews(params)
        this.setLoading(false)
        this.isLoading = false
        if (data.success) {
          data.data.reverse()
          this.messages = [...data.data, ...this.messages]
          if (data.data.length < this.pageSize) {
            this.hasMore = false
            return
          }
          this.page++
        }
      }
    },
    handlerShowEmoji() {
      this.showEmojiCom = false
      this.showUpImgCom = false
    },
    loadmessage() {
      this.scrollBottom = false
      this.useAnimation = true
      if (this.hasMore) {
        this.getRecentNews(false)
      }
    },
    /**聊天内容输入框自动聚焦 */
    chatInpAutoFocus() {
      this.$nextTick(() => {
        this.$refs.chatInp.focus()
      })
    }
  },
  components: {
    chatHeader,
    messageList,
    customEmoji,
    groupDesc,
    upImg,
    upFile
  },
  watch: {
    currentConversation(newVal, oldVal) {
      if (newVal && newVal._id) {
        this.chatInpAutoFocus()
        this.page = 0
        this.scrollBottom = true
        this.setLoading(true)
        this.messageText = ''
        this.messages = []
        this.hasMore = true
        this.joinChatRoom()
        this.getRecentNews()
        this.datetamp = Date.now()
      }
    },
    deep: true,
    immediate: true
  },
  created() {
    console.log('chatArea created')
    //点击文档，将表情包和上传弹窗关闭
    //document.addEventListener('click', this.handlerShowEmoji)
    this.getRecentNews()
    this.$eventBus.$on('receiveMessage', data => {
      this.receiveMessage(data)
    })
    this.$eventBus.$on('sendPic', data => {
      this.sendPicFile(data, MSG_TYPES.img)
    })
    this.$eventBus.$on('sendFile', data => {
      this.sendPicFile(data, MSG_TYPES.file)
    })
  },
  mounted() {},
  beforeDestroy() {
    console.log('chatArea BeforeDestroy')
    //document.removeEventListener('click', this.handlerShowEmoji)
  }
}
</script>

<style lang="scss">
@import './../../../static/css/animation.scss';
.chat-area__com {
  position: relative;
  height: 100%;
  .history-msg-container {
    position: absolute;
    z-index: 1004;
    height: calc(100% - 210px);
    width: 100%;
  }
  .main {
    display: flex;
    position: relative;
    height: calc(100% - 210px);
    width: 100%;
    .message-list-container {
      position: relative;
      height: 100%;
      width: 75%;
      flex: 1;
      .top-operation {
        position: absolute;
      }
    }
    .group-desc {
      height: 100%;
      width: 25%;
    }
  }
  .main.no-group {
    .message-list-container {
      height: 100%;
      width: 100%;
    }
    .group-desc {
      width: 0%;
    }
  }
  .message-edit-container {
    box-sizing: border-box;
    position: relative;
    height: 150px;
    border-top: 1px solid #cccccc;
    .send-type {
      position: relative;
      padding: 5px 10px 0;
      height: 25px;
      .item {
        cursor: pointer;
        font-size: 20px;
        margin-right: 10px;
        .upload {
          display: none;
          border: none;
        }
      }
      .history-btn {
        position: absolute;
        right: 5px;
        cursor: pointer;
      }
    }
    .operation {
      position: absolute;
      bottom: 5px;
      right: 2px;
    }
    .textarea {
      overflow-x: hidden;
      box-sizing: border-box;
      height: calc(100% - 30px);
      width: 100%;
      outline: none;
      border: none;
      padding: 0 10px;
      border: 0;
      border-radius: 5px;
      background-color: #eeeeee;
      padding: 10px;
      resize: none;
      img {
        width: 50px;
      }
    }
    .emoji-component {
      position: absolute;
      bottom: 101%;
    }
  }
}
</style>
