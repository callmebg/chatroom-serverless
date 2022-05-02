<template>
  <div class="pop-ups">
    <info-model
      v-if="isShowInfoModel"
      :current-conversation="currentConversation"
      @hidden-info="hiddenInfoModel"
    />
    <fenzu-model
      v-if="isShowFenzuModel"
      :current-conversation="currentConversation"
      @hidden-fenzu="hiddenFenzuModel"
    />
    <remark-model
      v-if="isShowRemarkModel"
      :current-conversation="currentConversation"
    />
    <transition name="fade">
      <bearing-model
        v-if="showModel && isShowCreateGroup"
        @close="$eventBus.$emit('toggleCreateGroup', { show: false })"
        title="创建群聊"
        :width="400"
      >
        <template slot="body">
          <create-group />
        </template>
      </bearing-model>
    </transition>
    <message-text-menu
      v-if="isShowMsgTextMenu"
      :message="currentMessage"
      :left="msgTextMenuLeft"
      :top="msgTextMenuTop"
    />
  </div>
</template>

<script>
import './../static/css/animation.scss'
import infoModel from '@/components/infoModel'
import fenzuModel from '@/components/fenzuModel'
import remarkModel from '@/components/remarkModel'
import createGroup from '@/components/createGroup'
import bearingModel from '@/components/bearingModel'
import messageTextMenu from '@/components/messageTypes/messageTextMenu'
import { conversationTypes } from '@/const'
export default {
  data() {
    return {
      showModel: false,
      isShowInfoModel: false,
      isShowFenzuModel: false,
      isShowRemarkModel: false,
      isShowCreateGroup: false,
      isShowMsgTextMenu: false,
      currentConversation: {}, // 当前操作的会话

      currentMessage: {}, // 当前操作的消息
      msgTextMenuLeft: 0,
      msgTextMenuTop: 0
    }
  },
  methods: {
    hiddenInfoModel() {
      this.isShowInfoModel = false
    },
    hiddenFenzuModel() {
      this.isShowFenzuModel = false
    },
    close() {
      this.showModel = false
    },
    async deleteExit(conversation) {
      if (conversation.conversationType === conversationTypes.friend) {
        var data = await this.$http.deleteFriend({
          friendId: conversation._id
        })
        if (data.data.success) {
          this.$store.dispatch('app/SET_ALL_FRIENDS', {
            resource: conversation._id,
            type: 'delete'
          })
          // 删除会话
          this.$store.dispatch('app/SET_ALL_FRIENDS', {
            resource: conversation._id,
            type: 'delete'
          })
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        }
      } else {
        var data = await this.$http.exitGroup({
          groupId: conversation._id
        })
        if (data.data.success) {
          // 待删除会话和群
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        }
      }
    }
  },
  created() {
    // 触发删除好友或者退出群聊
    this.$eventBus.$on('toggleExit', e => {
      var tip = '此操作将永久删除, 是否继续?'
      if (e.conversationType === conversationTypes.friend) {
        tip = "确定是否删除好友'" + e.user_nickname + "'"
      } else {
        tip = "确定是否退出群聊'" + e.group_name + "'"
      }
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteExit(e)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    })
    this.$eventBus.$on('toggleInfoModel', e => {
      const { show, data } = e
      this.isShowInfoModel = show
      this.currentConversation = data.currentConversation || {}
    })
    this.$eventBus.$on('toggleFenzuModel', e => {
      const { show, data } = e
      this.isShowFenzuModel = show
      this.currentConversation = data.currentConversation || {}
    })
    this.$eventBus.$on('toggleRemarkModel', e => {
      const { show, data } = e
      this.isShowRemarkModel = show
      this.currentConversation = data.currentConversation || {}
    })
    this.$eventBus.$on('toggleCreateGroup', e => {
      const { show } = e
      this.showModel = show
      this.isShowCreateGroup = show
    })
    this.$eventBus.$on('toggleMsgTextMenu', e => {
      const { show, data, left, top } = e
      this.isShowMsgTextMenu = show
      this.currentMessage = data
      this.msgTextMenuLeft = left
      this.msgTextMenuTop = top
    })
  },
  components: {
    infoModel,
    fenzuModel,
    remarkModel,
    createGroup,
    messageTextMenu,
    bearingModel
  }
}
</script>
