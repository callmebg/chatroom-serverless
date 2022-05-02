<template>
  <div class="custom-search-list-com">
    <div class="wrapper" v-for="item in searchlist" :key="item.group_id">
      <div class="details">
        <el-avatar
          class="avatar"
          shape="square"
          :src="IMG_URL+item.group_profile"
        >
        </el-avatar>
        <div class="info">
          <p class="item primary-font nickname">
            <span>
              {{item.group_name}}
            </span>
          </p>
          <p class="item secondary-font">群号：{{ item.group_id }}</p>
          <p class="item secondary-font">描述：{{ item.group_description }}</p>
          <p class="item secondary-font">创建时间：{{ item.group_create_time }}</p>
        </div>
      </div>
      <div class="operation">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          :disabled="item.group_owner == userInfo.user_id"
          @click="showAdditionDialog(item)"
        >添加
        </el-button>
        <el-dialog
          title="附加消息"
          :visible.sync="showAdditionMessage"
          width="60%"
        >
          <div v-loading="loading">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="additionMessage">
            </el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAdditionMessage = false">取 消</el-button>
            <el-button type="primary" @click="sendApply()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fromatTime } from "@/utils"
export default {
  props: ["searchlist"],
  data() {
    return {
      IMG_URL: process.env.IMG_URL,
      groups: JSON.parse(window.localStorage.getItem('groups')),
      showAdditionMessage: false,
      additionMessage: '',
      seleceItem: {},
      loading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    showAdditionDialog(item) {
      this.showAdditionMessage = !this.showAdditionMessage
      this.seleceItem = item
    },
    sendApply() {
      const val = {
        senderId: this.userInfo.user_id,
        senderNickname: this.userInfo.nickname,
        senderAvatar: this.userInfo.profile,
        reveiverId: this.seleceItem.group_owner,
        groupId: this.seleceItem.group_id,
        additionMessage: this.additionMessage
      }
      this.$socket.emit('sendValidateMessage', val)
      console.log(val)
    }
  },
  computed: {
    ...mapState('app', {
      sysUsers: 'sysUsers'
    }),
    ...mapState('user', {
      userInfo: 'userInfo'
    }),
    noMeSerchList() {
      return this.searchlist.filter(item => item._id !== this.userInfo._id)
    }
  },
}
</script>

<style lang="scss">
.custom-search-list-com {
  
  .wrapper {
    border-top: 1px solid #C0C4CC;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    &:last-child {
      border-bottom: 1px solid #C0C4CC;
    }
    .details {
      display: flex;
      align-items: center;
      .avatar {
        width: 100px;
        height: 100px;
      }
      .info {
        margin-left: 27px;
        .item {
          font-family: "Helvetica, Arial, sans-serif";
          margin: 0;
          &:last-child {
            margin-top: 5px;
          }
        }
        .nickname {
          cursor: pointer;
          color: hsla(230, 84%, 63%, 1);
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
