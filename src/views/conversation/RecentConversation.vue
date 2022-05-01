<template>
  <div class="recent-conversation-list" v-loading="isLoading">
    <transition-group name="slide-up" appear>
      <conversation-item
        v-for="item in outcomeConversationList"
        :key="item._id"
        :conversationInfo="item"
        :currentConversation="currentConversation"
        :recent-conversation="conversationList"
        @setCurrentConversation="setCurrentConversation"
        @click.native="changeCurrentConversation(item)"
        type="recent"
      />
    </transition-group>
    <div class="empty hor-ver-center" v-if="!outcomeConversationList.length">
      <span class="secondary-font">最近没有聊天记录</span>
    </div>
  </div>
</template>

<script>
import conversationItem from './ConversationItem'
export default {
  props: ['currentConversation', 'setCurrentConversation'],
  data() {
    return {
      conversationList: [],
      lastNewsMap: {},
      isLoading: false
    }
  },
  computed: {
    userInfo() {
      // 用户信息
      return this.$store.state.user.userInfo
    },
    friendRemark() {
      // 好友备注Map {id2: '备注1', id1: '备注2'}
      return this.userInfo.friendRemark || {}
    },
    recentConversation() {
      return this.$store.state.app.recentConversation
    },
    outcomeConversationList() {
      // 带有备注，最后消息信息的会话列表
      const conversationList = JSON.parse(JSON.stringify(this.conversationList))
      return (
        conversationList.length &&
        conversationList
          .map(item => {
            item.remark = this.friendRemark[item._id]
              ? this.friendRemark[item._id]
              : ''
            item.lastNews = this.lastNewsMap[item.roomId]
              ? this.lastNewsMap[item.roomId]
              : ''
            item.lastNewsTime = this.lastNewsMap[item.roomId]
              ? this.lastNewsMap[item.roomId].time
                ? new Date(this.lastNewsMap[item.roomId].time)
                : new Date(Date.now() - 2000)
              : new Date(Date.now() - 2000) // -2000ms为了解决没有最近消息的会话的lastNews一直为当前时间（这样会和新发送的消息的会话冲突）
            return item
          })
          .sort((a, b) => {
            return b.lastNewsTime - a.lastNewsTime
          })
      )
    }
  },
  methods: {
    changeCurrentConversation(item) {
      this.$emit('setCurrentConversation', item)
    }
  },
  watch: {
    '$store.state.app.recentConversation': {
      handler(newVal, oldVal) {
        console.log(newVal)
        this.conversationList = newVal.filter(
          item => Object.keys(item).length > 0
        )
      },
      deep: true,
      immediate: true
    },
    '$store.state.news.lastNews': {
      handler(newVal, oldVal) {
        this.lastNewsMap = newVal
      }
    }
  },
  components: {
    conversationItem,
  }
}
</script>

<style lang="scss">
.recent-conversation-list {
  @import './../../../static/css/animation.scss';
  position: relative;
  height: 510px;
  overflow-x: hidden;
  .empty {
    text-align: center;
  }
}
</style>
