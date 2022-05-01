<template>
  <div class="remark-modal-cmp all0">
    <div class="remark hor-ver-center" v-loading="confirmLoading">
      <span class="p-r-t el-icon-close" @click="close"></span>
      <div class="header">
        <span class="title">修改备注姓名</span>
      </div>
      <div class="body">
        <el-input v-model="remark" />
      </div>
      <div class="footer">
        <el-button @click="ok" size="mini" type="success">确认</el-button>
        <el-button @click="close" size="mini" type="danger">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['currentConversation'],
  data() {
    return {
      confirmLoading: false,
      remark: this.currentConversation.friend_remark
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    async ok() {
      this.confirmLoading = true
      const params = {
        friendId: this.currentConversation._id,
        friendRemark: this.remark
      }
      await this.$http.modifyFriendRemark(params)
      this.currentConversation.friend_remark = this.remark
      this.$eventBus.$emit('toggleRemarkModal', {
        show: false,
        data: {}
      })
      this.$store.commit('app/setFriendRemark', {
        id: this.currentConversation._id,
        remark: this.remark
      })
      this.confirmLoading = false
    },
    close() {
      this.$eventBus.$emit('toggleRemarkModal', {
        show: false,
        data: {
          currentConversation: {}
        }
      })
    }
  },
}
</script>

<style lang="scss">
.remark-modal-cmp {
  position: fixed;
  z-index: 1006;
  background-color: rgba(0, 0, 0, .2);
  .remark {
    width: 300px;
    padding: 10px 20px;
    background-color: #fff;
    border-radius: 10px;
    .body {
      margin: 10px 0;
    }
  }
}
</style>
