<template>
  <div class="setting-panel-cmp">
    <div class="operation-list">
      <span class="oper-item operation-text" @click.stop="showInfo"
        >查看资料</span
      >
      <span
        class="oper-item operation-text"
        @click.stop="showFenzu"
        v-if="currentConversation.conversationType === conversationTypes.friend"
        >切换分组</span
      >
      <span
        class="oper-item operation-text"
        slot="reference"
        @click.stop="showBeizhu"
        v-if="currentConversation.conversationType === conversationTypes.friend"
        >修改备注</span
      >
      <span
        class="oper-item operation-text__danger"
        v-if="currentConversation.conversationType === conversationTypes.friend"
        >删除好友</span
      >
      <span
        class="oper-item operation-text__danger"
        v-if="currentConversation.conversationType === conversationTypes.group"
        >退出群聊</span
      >
    </div>
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
import { conversationTypes } from '@/const'
export default {
  props: ['currentConversation'],
  data() {
    return {
      conversationTypes,
      newBeizhu: '',
      IMG_URL: process.env.IMG_URL,
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
    showInfo() {
      var that = this
      this.$http.getUserInfo(this.conversation.user_id).then(res => {
        if (res.data.success) {
          that.friendInfo = res.data.data
          that.dialogVisible = true
        }
      })
    },
    showFenzu() {
      this.$eventBus.$emit('toggleFenzuModal', {
        show: true,
        data: {
          currentConversation: this.currentConversation
        }
      })
    },
    showBeizhu() {
      this.$eventBus.$emit('toggleBeizhuModal', {
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
  height: 100%;
  background-color: #fff;
  .operation-list {
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    .oper-item {
      line-height: 20px;
      margin-top: 10px;
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
