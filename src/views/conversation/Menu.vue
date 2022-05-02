<template>
  <div class="conversation-item-menu box-shadow1">
    <span
      class="menu-item operation-text"
      v-if="type === 'recent'"
      @click.stop="remove"
      >关闭会话</span
    >
    <span class="menu-item operation-text" @click.stop="viewProfile"
      >查看资料</span
    >
    <span class="menu-item operation-text" @click.stop="modifyRemark"
      >修改备注</span
    >
    <span class="menu-item operation-text" @click.stop="switchFenzu"
      >切换分组</span
    >
    <span
      slot="reference"
      class="menu-item operation-text operation-text__danger"
      @click.stop="deleteFriend"
      >删除好友</span
    >
  </div>
</template>

<script>
export default {
  props: ['conversation', 'type'],
  data() {
    return {
      IMG_URL: process.env.IMG_URL,
      showDelPop: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    remove() {
      this.$emit('hiddenMenu')
      this.$emit('remove')
    },
    viewProfile() {
      this.$eventBus.$emit('toggleInfoModel', {
        show: true,
        data: {
          currentConversation: this.conversation
        }
      })
      this.$emit('hiddenMenu')
    },
    switchFenzu() {
      this.$eventBus.$emit('toggleFenzuModel', {
        show: true,
        data: {
          currentConversation: this.conversation
        }
      })
      this.$emit('hiddenMenu')
    },
    modifyRemark() {
      this.$eventBus.$emit('toggleRemarkModel', {
        show: true,
        data: {
          currentConversation: this.conversation
        }
      })
      this.$emit('hiddenMenu')
    },
    async deleteFriend() {
      this.$eventBus.$emit('toggleExit', this.conversation)
      return 
      const { data } = await this.$http.deleteFriend({
        friendId: this.conversation._id
      })
      if (data.success) {
        this.$store.dispatch('app/SET_ALL_FRIENDS', {
          resource: this.conversation._id,
          type: 'delete'
        })
        // 删除会话
        this.$store.dispatch('app/SET_ALL_FRIENDS', {
          resource: this.conversation._id,
          type: 'delete'
        })
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      }
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
.conversation-item-menu {
  padding: 5px;
  .menu-item {
    display: block;
    margin-top: 10px;
  }
  > .menu-item {
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
