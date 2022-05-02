<template>
  <div class="info-model-cmp all0" v-loading="confirmLoading">
    <div v-if="currentConversation.isGroup">
      <el-card class="hor-ver-center">
      <div slot="header">
        <span>群聊信息</span>
        <span class="p-r-t el-icon-close" @click="close"></span>
      </div>
      <div class="header">
        <el-container>
          <el-aside width="120px">
            <el-avatar
              :size="120"
              :src="IMG_URL + groupInfo.group_profile"
            ></el-avatar>
          </el-aside>
          <el-main>
            <div class="info-list">
              <div class="info-item">群号：{{ groupInfo.group_id }}</div>
              <div class="info-item">名称：{{ groupInfo.group_name }}</div>
              <div class="info-item">群主账号：{{ groupInfo.user_account }}</div>
              <div class="info-item">群主名称：{{ groupInfo.user_nickname }}</div>
            </div>
          </el-main>
        </el-container>

        <div class="info-list">
          <div class="info-item">描述：{{ groupInfo.group_description }}</div>
          <div class="info-item">
            创建时间：{{ groupInfo.group_create_time }}
          </div>
        </div>
      </div>
    </el-card>
    </div>
    <div v-else>
      <el-card class="hor-ver-center">
        <div slot="header">
          <span>好友信息</span>
          <span class="p-r-t el-icon-close" @click="close"></span>
        </div>
        <div class="header">
          <el-container>
            <el-aside width="120px">
              <el-avatar
                :size="120"
                :src="IMG_URL + this.friendInfo.user_profile"
              ></el-avatar>
            </el-aside>
            <el-main>
              <div class="info-list">
                <div class="info-item">Id：{{ friendInfo.user_id }}</div>
                <div class="info-item">账号：{{ friendInfo.user_account }}</div>
                <div class="info-item">
                  昵称：{{ friendInfo.user_nickname }}
                </div>
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
            </el-main>
          </el-container>

          <div class="info-list">
            <div class="info-item">生日：{{ friendInfo.user_birthday }}</div>
            <div class="info-item">签名：{{ friendInfo.user_signature }}</div>
            <div class="info-item">邮箱：{{ friendInfo.user_mail }}</div>
            <div class="info-item">
              注册时间：{{ friendInfo.user_create_time }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ['currentConversation'],
  data() {
    return {
      IMG_URL: process.env.IMG_URL,
      friendInfo: null,
      groupInfo: null,
      confirmLoading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    close() {
      this.$emit('hidden-info')
    }
  },
  mounted() {
    this.confirmLoading = true
    var that = this
    if (!this.currentConversation.isGroup) {
      this.$http.getUserInfo(this.currentConversation.user_id).then(res => {
        if (res.data.success) {
          that.friendInfo = res.data.data
        }
      })
    } else {
      this.$http.getGroupInfo(this.currentConversation.group_id).then(res => {
        if (res.data.success) {
          that.groupInfo = res.data.data
        }
      })
    }
    this.confirmLoading = false
  }
}
</script>

<style lang="scss">
.info-model-cmp {
  position: fixed;
  z-index: 2003;
  background-color: rgba(0, 0, 0, 0.2);
  .header {
    .info-list {
      margin-top: 10px;
      font-size: medium;
      font-weight: bold;
    }
  }
}
</style>
