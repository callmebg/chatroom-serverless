<template>
  <div class="validatenews-com">
    <div class="wrapper">
      <div class="title">验证消息</div>
      <div class="filter">
        <el-tag type="info">选择过滤条件：</el-tag>
        <el-select v-model="filterType" placeholder="请选择">
          <el-option
            label="群聊"
            :value="1" />
          <el-option
            label="用户"
            :value="0" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="请选择">
          <el-option
            label="全部"
            :value="-1" />
          <el-option
            label="未处理"
            :value="0" />
          <el-option
            label="已同意"
            :value="1" />
          <el-option
            label="已拒绝"
            :value="2" />
        </el-select>
      </div>
      <div class="counter">
        <span>
          一共{{outcomteList.length}}条记录
        </span>
      </div>
      <!-- <div class="validatenews-item"> -->
      <div class="validatenews-item" v-for="item in outcomteList" :key="item.time">
        <div class="apply-info">
          <span class="title">
            <!-- {{item.validateType === 0 ? validateNewsTips.applyFriend}} -->
            <span v-if="item.validateType === 0">
              <span v-if="item.recipientId === userInfo.user_id">
                <span class="nickname">
                  {{item.senderNickname.slice(0,10)}}
                </span>
                {{validateNewsTips.applyFriendTo}}
              </span>
              <span v-else>
                您添加
                <span class="nickname">
                  {{item.recipientNickname.slice(0,10)}}
                </span>为好友的请求
              </span>
            </span>
            <span v-else-if="item.validateType === 1">
              <span class="nickname">
                  {{item.senderNickname.slice(0,10)}}
                </span>
              {{validateNewsTips.applyGroupTo}}：{{item.groupId}}
            </span>
            <el-tag size="mini" type="info">创建时间：</el-tag>
            <span class="time">
              {{item.time}}
            </span>
          </span>
        </div>
        <div class="go-operation">
          <el-popover
            placement="left"
            width="300"
            trigger="click">
            <div class="validate-popover-body" v-loading="isAdding">
              <div class="sender-info">
                <span v-if="item.recipientId === userInfo.user_id">
                  <el-avatar :size="60" :src="IMG_URL + item.senderAvatar" @error="()=>true">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                  </el-avatar>
                </span>
                <span v-else>
                  <el-avatar :size="60" :src="IMG_URL + item.recipientAvatar" @error="()=>true">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                  </el-avatar>
                </span>
                <div class="info">
                  <span v-if="item.recipientId === userInfo.user_id">
                    <span class="nickname">{{item.senderNickname}}</span>
                    <span>{{item.senderAccount}}</span>
                  </span>
                  <span v-else>
                    <span class="nickname">{{item.recipientNickname}}</span>
                    <span>{{item.recipientAccount}}</span>
                  </span>
                </div>
              </div>
              <div class="addition">
                <el-tag size="mini" type="info">附加消息：</el-tag>
                <div class="content">
                  <span>{{item.additionMessage}}</span>
                </div>
              </div>
              <!-- <div class="operation"> -->
              <span v-if="item.recipientId === userInfo.user_id">
                <div class="operation" v-if="item.status === 0">
                  <el-button type="success" plain size="small" @click="agreeValidate(item)">同意</el-button>
                  <el-button type="danger" plain size="small" @click="disagreeValidate(item)">拒绝</el-button>
                </div>
                <div class="operation" v-else-if="item.status === 1">
                  <el-tag type="success">已同意</el-tag>
                </div>
                <div class="operation" v-else-if="item.status === 2">
                  <el-tag type="danger">已拒绝</el-tag>
                </div>
              </span>
              <span v-else>
                <div class="operation" v-if="item.status === 0">
                  <el-tag type="success">待处理</el-tag>
                </div>
                <div class="operation" v-else-if="item.status === 1">
                  <el-tag type="success">已同意</el-tag>
                </div>
                <div class="operation" v-else-if="item.status === 2">
                  <el-tag type="danger">已拒绝</el-tag>
                </div>
              </span>
            </div>
            <el-button slot="reference" type="success">查看</el-button>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SET_UNREAD_NEWS_TYPE_MAP } from '@/store/constants'
import { validateNewsTips } from '@/const'
export default {
  props: ['validateNewsList'],
  data() {
    return {
      validateNewsTips,
      IMG_URL: process.env.IMG_URL,
      filterType: 0, // 0人，1群
      filterStatus: 0, // -1全部，0未处理，1已同意，2已拒绝
      isAdding: false
    }
  },
  computed: {
    outcomteList() {
      return this.validateNewsList.filter(item => {
        if (this.filterStatus === -1) {
          return item.validateType === this.filterType
        } else {
          return item.status === this.filterStatus && item.validateType === this.filterType
        }
      })
    },
    systemValidateUsers() {
      return this.$store.state.app.sysUsers.filter(item => item.code === "111111")[0]
    },
    userInfo() {
      return this.$store.state.user.userInfo
    },
    device() {
      return this.$store.state.device.deviceType
    }
  },
  methods: {
    agreeValidate(item) {
      console.log("item",item)
      this.isAdding = true
      if (item.validateType === 0) {
        this.$socket.emit('dealValidate', {decision_id: item._id, decision_from: item.senderId, decision_to: item.recipientId, decision_type:0, decision_status: 1})
        this.$eventBus.$emit('changeFriend')
      } else if (item.validateType === 1) {
        this.$socket.emit('dealValidate', {decision_id: item._id, decision_from: item.senderId, decision_to: item.recipientId, decision_type:1, decision_status: 1, decision_group: item.groupId})
        this.$eventBus.$emit('changeGroup')        
      }
      this.isAdding = false
      this.$eventBus.$emit('changeSystemNews')
    },
    disagreeValidate(item) {
      this.isAdding = false
      if (item.validateType === 0) {
        this.$socket.emit('dealValidate', {decision_id: item._id, decision_from: item.senderId, decision_to: item.recipientId, decision_type:0, decision_status: 2})
      } else if (item.validateType === 1) {
        this.$socket.emit('dealValidate', {decision_id: item._id, decision_from: item.senderId, decision_to: item.recipientId, decision_type:1, decision_status: 2})        
      }
      this.isAdding = false
      this.$eventBus.$emit('changeSystemNews')
    }
  }
}
</script>

<style lang="scss">
.validate-popover-body {
  .sender-info {
    display: flex;
    align-items: center;
    .info {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      .nickname {
        font-size: 20px;
        color: #3578E5;
        display:block;
      }
    }
  }
  .addition {
    margin: 17px 0;
    .content {
      margin-top: 5px;
      font-size: 14px;
    }
  }
  .operation {
    text-align: right;
  }
}
.validatenews-com {
  background-color: #fff;
  width: 100%;
  height: 95%;
  overflow-x: hidden;
  .wrapper {
    padding: 10px;
    box-sizing: border-box;
    .filter {
      display: flex;
      align-items: center;
      padding: 10px 0;
      * {
        padding: 0 5px;
      }
    }
    .counter {
      padding: 10px 0;
    }
    .validatenews-item {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #C0C4CC;
      &:last-child {
        border-bottom: 1px solid #C0C4CC;
      }
      .apply-info {
        .title {
          line-height: 20px;
          .nickname {
            font-weight:bold
          }
        }
      }
    }
  }
}
</style>
