<template>
  <div class="custom-search-list-com">
    <div class="wrapper" v-for="item in searchlist" :key="item.user_id">
      <div class="details">
        <el-avatar
          class="avatar"
          shape="square"
          :src="IMG_URL + item.user_profile"
        >
        </el-avatar>
        <div class="info">
          <p class="item">昵称：{{ item.user_nickname }}</p>
          <p class="item">性别：{{ showSex(item.user_sex) }}</p>
          <p class="item">个性签名：{{ item.user_signature }}</p>
        </div>
      </div>
      <div class="operation">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          :disabled="(friends || []).includes(item._id)"
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
              v-model="additionMessage"
            >
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
import { fromatTime } from '@/utils'
export default {
  props: ['searchlist'],
  data() {
    return {
      IMG_URL: process.env.IMG_URL,
      friends: JSON.parse(window.localStorage.getItem('friends')),
      showAdditionMessage: false,
      additionMessage: '',
      seleceItem: {},
      loading: false,
    }
  },
  methods: {
    showSex(sex) {
      if (sex == 0) {
        return '女'
      } else if (sex == 1) {
        return '男'
      }
      return '保密'
    },
    showAdditionDialog(item) {
      this.showAdditionMessage = !this.showAdditionMessage
      this.seleceItem = item
    },
    sendApply() {
      if(this.userInfo.user_id == this.seleceItem.user_id) {
        return this.$message({type: 'warning', message: '不能添加自己为好友！'})
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.showAdditionMessage = false
        this.additionMessage = ''
        this.$alert('验证消息发送成功！', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        })
      }, 500)
      const val = {
        friend_from: this.userInfo.user_id,
        friend_to: this.seleceItem.user_id,
        friend_secConnectionID: this.seleceItem.user_secConnectionID,
        friend_whyme: this.additionMessage
      }
      this.$socket.emit('addFriend', val)
    },
  },
  computed: {
    ...mapState('user', {
      userInfo: 'userInfo',
    })
  },
}
</script>

<style lang="scss">
.custom-search-list-com {
  .wrapper {
    border-top: 1px solid #c0c4cc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    &:last-child {
      border-bottom: 1px solid #c0c4cc;
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
          font-family: 'Helvetica, Arial, sans-serif';
        }
      }
    }
  }
}
</style>
