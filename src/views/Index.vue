<template>
  <div class="index-page">
    <transition name="fade-left">
      <div
        v-show="device === 'Desktop' || (device === 'Mobile' && currentUI === 'conversation')"
        :class="device === 'Mobile' ? 'conversation-list mobile' : 'conversation-list'"
      >
        <conversation-list
          :currentConversation="currentConversation"
          :set-current-conversation="setCurrentConversation"
          @setCurrentConversation="setCurrentConversation"
        />
      </div>
    </transition>
    <transition name="fade-right">
      <div
        v-show="device === 'Desktop' || (device === 'Mobile' && currentUI === 'chatArea')"
        v-loading="loading"
        :class="device === 'Mobile' ? 'conversation-chat-area mobile' : 'conversation-chat-area'"
      >
        <chat-area
          v-if="currentConversation && currentConversation._id"
          :currentConversation="currentConversation"
          :setLoading="setLoading"
          :set-current-conversation="setCurrentConversation"
        />
        <div class="no-conversation hor-ver-center" v-else>
          <chat-svg width="400" height="300" />
          <p>聊天~打开心灵的窗户</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ConversationList from '@/views/conversation/ConversationList'
import ChatArea from '@/views/chat/ChatArea'
import { SET_UNREAD_NEWS_TYPE_MAP } from '@/store/constants'
import chatSvg from '@/SVGComponents/chat'
// import AMap from '@/components/customMap'
import {swapRoomId} from '@/utils'
export default {
  name: 'Home',
  data() {
    return {
      currentConversation: {},
      loading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    device() {
      return this.$store.state.device.deviceType
    },
    currentUI() {
      return this.$store.state.device.currentUI
    }
  },
  watch: {
    currentConversation: {
      handler(newVal, oldVal) {
        if (!newVal || !newVal.roomId) return
        try {
          if(newVal.roomId !== oldVal.roomId) {
            this.$store.dispatch('news/SET_UNREAD_NEWS', {
              roomId: this.currentConversation && swapRoomId(this.currentConversation.roomId),
              count: 0,
              type: SET_UNREAD_NEWS_TYPE_MAP.clear
            })
            this.$store.dispatch('news/SET_LAST_NEWS', {type: 'default', roomId: newVal.roomId})
            this.$store.dispatch('app/SET_CURRENT_CONVERSATION', newVal)
            this.$store.dispatch('app/SET_RECENT_CONVERSATION', {type: 'add', data: newVal})
            // 将该会话下的消息设置为已读begin
            newVal.conversationType === "FRIEND" && this.$http.userIsReadMsg({
              roomId: newVal.roomId
            }).then(res => {
              // 用户切换会话来阅读消息
              if (!res.data.success) return
              this.$socket.emit('isReadMsg', {
                roomId: newVal.roomId,
                status: true
              }) // 1. 提示对方用户进入该会话
              if (oldVal.conversationType === "FRIEND") {
                this.$socket.emit('isReadMsg', {
                  roomId: oldVal.roomId || '',
                  status: false
                })
              } // 2. 提示对方用户退出该会话
              // end
            })
          }
        } catch (error) {
          console.log('errrrr', error)
        }
      }, deep: true, immediate: true
    }
  },
  methods: {
    setCurrentConversation(data) {
      this.currentConversation = data
    },
    setLoading(flag) {
      this.loading = flag
    }
  },
  components: {
    ConversationList,
    ChatArea,
    chatSvg
    // AMap
  }
}
</script>

<style lang="scss">
@import './../../static/css/animation.scss';
.index-page {
  display: flex;
  width: 100%;
  // height: calc(100vh - 60px);
  height: 100%;
  .conversation-list {
    width: 30%;
    border-right: 1px solid #cccccc;
    background-color: var(--primary-bgcolor-4);
    &.mobile {
      position: absolute;
      width: 100%;
    }
  }
  .conversation-chat-area {
    position: relative;
    width: 70%;
    &.mobile {
      // position: absolute;
      width: 100%;
    }
    .no-conversation {
      text-align: center;
    }
  }
}
</style>
