<template>
  <div class="login-page" :style="'background-image: url(' + bgUrl + ')'">
    <div
      class="wrapper hor-ver-center"
      :style="device === 'Mobile' ? { width: '90%' } : {}"
    >
      <el-form class="login-form" v-if="isLoginState">
        <el-form-item>
          <el-input
            autocomplete="new-password"
            v-model="loginInfo.account"
            prefix-icon="el-icon-user"
            @keydown.enter="login"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            autocomplete="new-password"
            type="password"
            v-model="loginInfo.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="login"
            >登录</el-button
          >
          <span
            >没有账号？<span
              class="operation-text"
              style="display: inline"
              @click="changeState(false)"
              >注册</span
            ></span
          >
        </el-form-item>
      </el-form>
      <el-form class="register-form" v-if="!isLoginState">
        <!--
        <div class="avatar" @click="setShowChooseAvatar(true)">
            <img :src="avatar" alt="" srcset="" width="100" height="100" style="border-radius: 50%">
          <el-avatar :size="100" :src="avatar">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </el-avatar>
          <span class="secondary-font" style="display: inline-block; margin-bottom: 5px">
            点击头像更换头像
          </span>
        </div>
        -->
        <el-form-item>
          <el-input
            type="text"
            autocomplete="new-password"
            v-model="registerInfo.account"
            prefix-icon="el-icon-magic-stick"
            placeholder="请输入账号"
          ></el-input>
          <!-- <span class="account-errinfo">{{ registerErrInfo.account }}</span> -->
        </el-form-item>
        <el-form-item>
          <el-input
            type="text"
            autocomplete="new-password"
            v-model="registerInfo.nickname"
            prefix-icon="el-icon-user"
            placeholder="请输入昵称"
          ></el-input>
          <!-- <span class="account-errinfo">{{ registerErrInfo.account }}</span> -->
        </el-form-item>
        <el-form-item>
          <el-input
            type="text"
            autocomplete="new-password"
            onfocus="this.type = 'password'"
            v-model="registerInfo.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
          ></el-input>
          <!-- <span class="password-errinfo">{{ registerErrInfo.password }}</span> -->
        </el-form-item>
        <el-form-item>
          <el-input
            type="text"
            autocomplete="new-password"
            onfocus="this.type = 'password'"
            v-model="registerInfo.rePassword"
            prefix-icon="el-icon-lock"
            placeholder="请确认密码"
          ></el-input>
          <!-- <span class="password-errinfo">{{ errInfo.password }}</span> -->
        </el-form-item>
        <el-form-item class="oper">
          <el-button class="login-btn" type="primary" @click="register"
            >注册</el-button
          >
          <span
            >已有账号？<span
              class="operation-text"
              style="display: inline"
              @click="changeState(true)"
              >登录</span
            ></span
          >
        </el-form-item>
      </el-form>
    </div>
    <copy-right />
  </div>
</template>

<script>
import ocean1 from './../../static/image/ocean1.jpg'
import { createCanvas } from '@/utils/cvcode'
import canvasImg from './../../static/image/canvas2.jpg'
import { accountReg, passwordReg } from '@/utils/index'
import copyRight from '@/components/copyright'
import COS from 'cos-js-sdk-v5'
const faceRandom = Math.ceil(Math.random() * 10)
export default {
  name: 'Login',
  data() {
    return {
      loginInfo: {
        account: '',
        password: '',
        cvCode: '',
        cvCodeTimestamp: '',
      },
      registerInfo: {
        account: '',
        nickname: '',
        password: '',
        rePassword: '',
        cvCode: '',
        avatar: `face/face${faceRandom}.jpg`,
      },
      cvCode: '', // 验证码
      cvCodeing: true, // 正在获取验证码？
      isLoginState: true,
      bgUrl: ocean1,
      showChooseAvatar: false,
      IMG_URL: process.env.IMG_URL,
    }
  },
  computed: {
    device() {
      return this.$store.state.device.deviceType
    },
    avatar() {
      return this.IMG_URL + this.registerInfo.avatar
    },
  },
  methods: {
    login() {
      if (!accountReg.test(this.loginInfo.account)) {
        return this.$message.error('请输入3-10位由数字字母下划线组成的账号')
      }
      if (!passwordReg.test(this.loginInfo.password)) {
        return this.$message.error('请输入3-20位由数字字母组成的密码')
      }
      const params = {
        ...this.loginInfo,
        setting: {
          ua: navigator.userAgent,
          location: window.userLocation,
        },
      }
      this.$http.login(params).then((res) => {
        var data = res.data
        if (data.success) {
          // 连接Websocket
          this.$socket.setVue(this)
          this.$socket.connect()
          // 登录后就可以上传文件
          /* 固定凭证
          this.$http.getToken().then((res) => {
            this.$store.commit('user/setUploadToken', res.data.data)
            var cos = new COS({
              SecretId:
                this.$store.state.user.uploadToken.credentials.tmpSecretId,
              SecretKey:
                this.$store.state.user.uploadToken.credentials.tmpSecretKey,
            })
            this.$store.commit('user/setCos', cos)
          })
          */
          var that = this
          var cos = new COS({
            getAuthorization: function (options, callback) {
              // 异步获取临时密钥
              that.$http.getToken().then((res) => {
                var token = res.data.data
                that.$store.commit('user/setUploadToken', token)
                try {
                  var credentials = token.credentials
                } catch (e) {}
                if (!data || !credentials)
                  return console.error('credentials invalid')
                callback({
                  TmpSecretId: credentials.tmpSecretId, // 临时密钥的 tmpSecretId
                  TmpSecretKey: credentials.tmpSecretKey, // 临时密钥的 tmpSecretKey
                  SecurityToken: credentials.sessionToken, // 临时密钥的 sessionToken
                  ExpiredTime: token.expiredTime, // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
                })
              })
            },
          })
          this.$store.commit('user/setCos', cos)

          this.$message.success('登录成功！')
          this.$store.dispatch('user/LOGIN', data.data)
          const redirect = this.$router.currentRoute.query.redirect
          const next = redirect ? redirect : '/chat/home'
          this.$router.replace(next)
        }
      })
    },
    register() {
      if (!accountReg.test(this.registerInfo.account)) {
        return this.$message.error('请输入3-10位由数字字母下划线组成的账号')
      }
      if (!passwordReg.test(this.registerInfo.password)) {
        return this.$message.error('请输入3-20位由数字字母组成的密码')
      }
      if (this.registerInfo.password !== this.registerInfo.rePassword) {
        return this.$message.error('两次输入的密码不一致')
      }
      var that = this
      this.$http.register(this.registerInfo).then((res) => {
        let { success, code, message } = res.data
        if (success) {
          this.$alert(
            `这是你的账号:${that.registerInfo.account}，你可以以此账号登录系统`,
            '注册成功'
          )
          this.changeState(true)
        } else {
          this.$message.error(message)
        }
      })
    },
    getCVCode() {
      // 获取验证码
      this.cvCodeing = true
      this.$http.getCVCode().then((res) => {
        let { data, status, timestamp } = res.data
        this.cvCode = data
        this.loginInfo.cvCodeTimestamp = timestamp
        this.$nextTick(() => {
          const currCanvas = this.isLoginState
            ? this.$refs.loginCanvas
            : this.$refs.registerCanvas
          createCanvas(this.cvCode, currCanvas, canvasImg, () => {
            this.cvCodeing = false
          })
        })
      })
    },
    changeState(flag) {
      this.isLoginState = flag
      //this.getCVCode()
    },
    setShowChooseAvatar(flag) {
      this.showChooseAvatar = flag
    },
    chooseAvatar(item) {
      this.registerInfo.avatar = item
    },
  },
  components: {
    copyRight,
  },
}
</script>

<style lang="scss">
.login-page {
  @import './../../static/css/animation.scss';
  @import './../../static/css/var.scss';
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  transition: all 0.8s ease;
  .ceshi {
    display: none;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    margin: 0 auto;
    width: 60%;
  }
  .wrapper {
    background-color: #fff;
    width: 400px;
    opacity: 0.9;
    padding: 35px 20px 0;
    border-radius: 5px;
    .login-form,
    .register-form {
      position: relative;
      .avatar {
        position: absolute;
        z-index: 1001;
        top: -110px;
        text-align: center;
        margin-bottom: 10px;
        .el-avatar {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
      }
    }
    .cv-code {
      .el-form-item__content {
        display: flex;
        justify-content: space-between;
        .cv-code-inp {
          margin-right: 20px;
        }
      }
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
