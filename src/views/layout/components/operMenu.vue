<template>
  <div class="oper-menu">
    <el-dropdown placement="left">
      <span class="el-dropdown-link">
        <el-badge is-dot :value="validateUnReadCount" :hidden="!validateUnReadCount">
          <i class="oper-item el-icon-s-operation"></i>
        </el-badge>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <el-button type="text" @click="logout">退出登录</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { removeCookie } from '@/utils/token'
import img from '../../../components/messageTypes/img.vue'
export default {
  components: { img },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    unreadNews() {
      return this.$store.state.news.unreadNews
    },
    validateUnReadCount() {
      const validateSysUser = (this.$store.state.app.sysUsers || []).find(item => item.code === '111111')
      const key = (validateSysUser || {})._id + '-' + (this.userInfo || {})._id
      return this.unreadNews[key]
    }
  },
  methods: {
    logout() {
      this.$router.replace('/login')
      this.$socket.emit('leave')
      this.$store.dispatch('user/LOGOUT')
      removeCookie()
    },
    setShowTheme(flag) {
      this.$emit('setShowTheme', flag)
    }
  },
}
</script>

<style lang="scss">
.oper-menu {
  .menu-item {
    display: block;
  }
}
</style>
