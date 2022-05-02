<template>
  <div class="setting-panel-cmp">
    <div class="operation-list">
      <span class="oper-item operation-text" @click.stop="showInfo"
        >查看资料</span
      >
      <span
        class="oper-item operation-text"
        slot="reference"
        @click.stop="showRemark"
        v-if="currentConversation.conversationType === conversationTypes.friend"
        >修改备注</span
      >
      <span
        class="oper-item operation-text"
        @click.stop="showFenzu"
        v-if="currentConversation.conversationType === conversationTypes.friend"
        >切换分组</span
      >
      <span
        class="oper-item operation-text__danger"
        v-if="currentConversation.conversationType === conversationTypes.friend"
        @click.stop="deleteExit"
        >删除好友</span
      >
      <span
        class="oper-item operation-text__danger"
        v-if="currentConversation.conversationType === conversationTypes.group"
        @click.stop="deleteExit"
        >退出群聊</span
      >
    </div>
  </div>
</template>

<script>
import { conversationTypes } from '@/const'
export default {
  props: ['currentConversation'],
  data() {
    return {
      conversationTypes,
      newRemark: '',
      IMG_URL: process.env.IMG_URL
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    deleteExit() {
      this.$eventBus.$emit('toggleExit', this.currentConversation)
    },
    showInfo() {
      this.$eventBus.$emit('toggleInfoModel', {
        show: true,
        data: {
          currentConversation: this.currentConversation
        }
      })
    },
    showFenzu() {
      this.$eventBus.$emit('toggleFenzuModel', {
        show: true,
        data: {
          currentConversation: this.currentConversation
        }
      })
    },
    showRemark() {
      this.$eventBus.$emit('toggleRemarkModel', {
        show: true,
        data: {
          currentConversation: this.currentConversation
        }
      })
    }
  }
}
</script>

<style lang="scss">
.setting-panel-cmp {
  background-color: #fff;
  .operation-list {
    text-align: center;
    display: flex;
    flex-direction: column;
    .oper-item {
      line-height: 20px;
      margin-top: 10px;
      &:last-child {
	      margin-bottom: 10px;
	    }
    }
  }
}
</style>
