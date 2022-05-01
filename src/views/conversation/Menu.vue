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
    <el-popover placement="top" width="160" v-model="showDelPop">
      <p>确定删除好友'{{this.conversation.user_nickname}}'？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="showDelPop = false"
          >取消</el-button
        >
        <el-button type="primary" size="mini" @click.stop="deleteFriend"
          >确定</el-button
        >
      </div>
      <span
        slot="reference"
        class="menu-item operation-text"
        @click.stop="() => {}"
        >删除好友</span
      >
    </el-popover>
    <el-dialog
      title="好友信息"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="header">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-avatar
              :size="120"
              :src="IMG_URL + this.friendInfo.user_profile"
            ></el-avatar
          ></el-col>
          <el-col :span="16">
            <div class="info-list">
              <div class="info-item">Id：{{ friendInfo.user_id }}</div>
              <div class="info-item">账号：{{ friendInfo.user_account }}</div>
              <div class="info-item">昵称：{{ friendInfo.user_nickname }}</div>
              <div class="info-item">
                性别：{{
                  friendInfo.user_sex == 2
                    ? '保密'
                    : friendInfo.user_sex == 0
                    ? '女'
                    : '男'
                }}
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="info-list">
          <div class="info-item">生日：{{ friendInfo.user_birthday }}</div>
          <div class="info-item">签名：{{ friendInfo.user_signature }}</div>
          <div class="info-item">邮箱：{{ friendInfo.user_mail }}</div>
          <div class="info-item">
            注册时间：{{ friendInfo.user_create_time }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['conversation', 'type'],
  data() {
    return {
      IMG_URL: process.env.IMG_URL,
      showDelPop: false,
      dialogVisible: false,
      friendInfo: null
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
      var that = this
      this.$http.getUserInfo(this.conversation.user_id).then(res => {
        if (res.data.success) {
          that.friendInfo = res.data.data
          that.dialogVisible = true
        }
      })
    },
    switchFenzu() {
      this.$eventBus.$emit('toggleFenzuModal', {
        show: true,
        data: {
          currentConversation: this.conversation
        }
      })
      this.$emit('hiddenMenu')
    },
    modifyRemark() {
      this.$eventBus.$emit('toggleRemarkModal', {
        show: true,
        data: {
          currentConversation: this.conversation
        }
      })
      this.$emit('hiddenMenu')
    },
    async deleteFriend() {
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
  .header {
    .info-list {
      margin-top: 10px;
      font-size: medium;
      font-weight: bold;
    }
  }
}
</style>
