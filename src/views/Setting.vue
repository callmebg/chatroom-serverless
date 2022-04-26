<template>
  <div
    class="setting-page"
    :style="device === 'Mobile' ? { width: '95%' } : {}"
  >
    <div class="header">
      <div class="avatar">
        <img :src="IMG_URL + userInfo.user_profile" @click="dialogVisible = true" />
      </div>
      <el-dialog title="我的头像" :visible.sync="dialogVisible" width="30%">
        <img :src="IMG_URL + userInfo.user_profile" class="my-avatar-uploader" />
        <h5>点击下方加号选择图片,点击确定按钮更换头像</h5>
        <el-upload
          class="my-avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-change="changeFile"
        >
          <img v-if="imageUrl" :src="IMG_URL + imageUrl" class="my-avatar" />
          <i v-else class="el-icon-plus my-avatar-uploader-icon"></i>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAvatarSuccessPlus"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <div class="info-list">
        <div class="info-item">Id：{{ userInfo.user_id }}</div>
        <div class="info-item">账号：{{ userInfo.user_account }}</div>
        <div class="info-item">
          注册时间：{{ userInfo.user_create_time | formatDate }}
        </div>
      </div>
    </div>
    <div class="body">
      <div class="nav-list">
        <span
          :class="
            currentTab === 'setting'
              ? 'operation-text isactive'
              : 'operation-text'
          "
          @click="setCurrentTab('setting')"
          >个人资料</span
        >
        <span
          :class="
            currentTab === 'password'
              ? 'operation-text isactive'
              : 'operation-text'
          "
          @click="setCurrentTab('password')"
        >
          密码设置
        </span>
      </div>
      <div class="content" v-loading="fetching">
        <ul v-show="currentTab === 'setting'" class="user-setting-list">
          <li class="setting-item" v-for="item in settingList" :key="item">
            <span class="title">{{ listZHMap[item] }}</span>
            <div class="inp-box">
              <template v-if="item === 'user_sex'">
                <el-radio-group
                  v-model="userSetting[item]"
                  :disabled="!isModifying[item]"
                  size="mini"
                >
                  <el-radio-button label="0">女</el-radio-button>
                  <el-radio-button label="1">男</el-radio-button>
                  <el-radio-button label="2">保密</el-radio-button>
                </el-radio-group>
              </template>
              <template v-else-if="item === 'user_birthday'">
                <el-date-picker
                  v-model="userBirthday"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </template>
              <template v-else>
                <input
                  type="text"
                  :ref="item"
                  :disabled="!isModifying[item]"
                  v-model="userSetting[item]"
                />
              </template>
            </div>
            <div class="action">
              <span
                v-show="!isModifying[item]"
                class="operation-text"
                @click="setModily(item, true)"
              >
                修改
              </span>
              <div class="oper" v-show="isModifying[item]">
                <span class="operation-text__danger" @click="saveModify(item)"
                  >保存</span
                >
                <span
                  class="operation-text__danger"
                  @click="setModily(item, false)"
                  >取消</span
                >
              </div>
            </div>
          </li>
        </ul>
        <ul v-show="currentTab === 'password'" class="user-password">
          <li class="pwd-item" v-for="(value, key) in pwdMap" :key="key">
            <span class="title">{{ value }}</span>
            <div class="inp-box">
              <input
                :placeholder="pwdPlaceholder[key]"
                type="text"
                autocomplete="new-password"
                onfocus="this.type = 'password'"
                v-model="pwdSetting[key]"
              />
            </div>
          </li>
          <div class="action">
            <el-button type="primary" @click="updateUserPwd">确认</el-button>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils'
import { accountReg, passwordReg } from '@/utils/index'

const list = [
  'user_nickname',
  'user_sex',
  'user_birthday',
  'user_email',
  'user_signature',
]
const listZHMap = {
  user_nickname: '昵称',
  user_sex: '性别',
  user_birthday: '生日',
  user_email: '邮箱',
  user_signature: '个性签名',
}
const tabMap = {
  setting: 'setting',
  password: 'password',
}
const pwdMap = {
  oldPwd: '旧密码',
  newPwd: '新密码',
  reNewPwd: '确认新密码',
}
const pwdPlaceholder = {
  oldPwd: '请输入原始密码',
  newPwd: '请输入新密码',
  reNewPwd: '请确认新密码',
}
export default {
  name: 'Setting',
  data() {
    return {
      userBirthday: "", //这个组件单独写
      imageUrl: '',
      dialogVisible: false, //头像更换页面可见性
      IMG_URL: process.env.IMG_URL,
      currentTab: tabMap.setting,
      settingList: list,
      listZHMap: listZHMap,
      userSetting: {}, // 用户修改的信息
      isModifying: {}, // 标识哪一项正在修改
      pwdMap,
      pwdPlaceholder,
      pwdSetting: {
        oldPwd: '',
        newPwd: '',
        reNewPwd: '',
      },
      fetching: false, // 正在网络请求中
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    device() {
      return this.$store.state.device.deviceType
    },
  },
  methods: {
    setCurrentTab(tab) {
      this.currentTab = tab
    },
    setUserSetting(userInfo) {
      for (const item of list) {
        this.$set(this.userSetting, item, userInfo[item])
        this.$set(this.isModifying, item, false)
      }
    },
    setModily(key, flag) {
      for (const key in this.isModifying) {
        if (this.isModifying.hasOwnProperty(key)) {
          this.isModifying[key] = false
        }
      }
      if (!key) return
      this.isModifying[key] = flag
      if (flag) {
        this.$nextTick(() => {
          this.$refs[key] && this.$refs[key][0].focus()
          this.$refs[key] && this.$refs[key][0].select()
        })
      } else {
        const userInfo = this.userInfo
        this.setUserSetting(userInfo)
      }
    },
    /**更新用户信息 */
    async saveModify(key) {
      const params = {
        field: key,
        value: key == "user_birthday" ? this.userBirthday : this.userSetting[key],
        userId: this.userInfo._id,
      }
      this.fetching = true
      const { data } = await this.$http.updateUserInfo(params)
      if (data.success) {
        this.userInfo[params.field] = params.value
        this.$store.commit('user/setUserInfo', this.userInfo)
        this.fetching = false
        this.$message({ type: 'success', message: data.message })
      } else {
        this.fetching = false
        this.setUserSetting(this.userInfo)
        this.$message({ type: 'error', message: data.message })
      }
      this.setModily(undefined, false)
    },
    async updateUserPwd() {
      if (this.pwdSetting.newPwd != this.pwdSetting.reNewPwd) {
        return this.$message({
          type: 'warning',
          message: '两次输入的新密码不一致',
        })
      }
      if (!passwordReg.test(this.pwdSetting.newPwd)) {
        return this.$message.error('请输入3-20位由数字字母组成的密码')
      }
      const params = this.pwdSetting
      const { data } = await this.$http.updateUserPwd(params)
      if (data.success) {
        this.$message({ type: 'success', message: data.message })
      } else {
        this.$message({ type: 'error', message: data.message })
      }
    },
    async handleAvatarSuccessPlus() {
      this.userInfo.user_profile = this.imageUrl
      const params = {
        field: 'user_profile',
        value: this.imageUrl,
        userId: this.userInfo._id,
      }
      this.fetching = true
      const { data } = await this.$http.updateUserInfo(params)
      if (data.success) {
        this.$store.commit('user/setUserInfo', this.userInfo)
        this.fetching = false
        this.$message({ type: 'success', message: data.message })
        this.dialogVisible = false
      } else {
        this.fetching = false
        this.$message({ type: 'error', message: data.message })
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    changeFile(file, fileList) {
      console.log('file')
      var picture = fileList[0].raw
      console.log(picture)
      if(!this.beforeAvatarUpload(fileList[0])) {
        return
      }
      var key =
        '/profile/' +
        this.$store.state.user.userInfo.user_account +
        '/' +
        picture.uid +
        picture.name
      var that = this
      this.$store.state.user.cos.putObject(
        {
          Bucket: 'chatroom-1257987061' /* 必须 */,
          Region: 'ap-guangzhou' /* 必须 */,
          Key: key /* 必须 */,
          StorageClass: 'STANDARD',
          Body: picture, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          },
        },
        function (err, data) {
          console.log(err || data)
          if (data.statusCode == 200) {
            that.imageUrl = key
          }
        }
      )
    },
  },
  filters: {
    formatDate(val) {
      return formatDate(new Date(val))
    },
  },
  created() {
    const userInfo = this.$store.state.user.userInfo
    this.setUserSetting(userInfo)
    this.userBirthday = userInfo.user_birthday
  },
}
</script>

<style lang="scss">
.my-avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.my-avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.my-avatar {
  width: 178px;
  height: 178px;
  display: block;
}
@import './../../static/css/var.scss';
.setting-page {
  height: 95%;
  width: 70%;
  padding: 20px;
  margin: 10px auto;
  box-shadow: 0 1px 2px 0 #ffffff;
  background-color: $primarybg;
  .header {
    display: flex;
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 10px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info-list {
      margin-left: 20px;
      .info-item {
        margin-top: 10px;
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
  .body {
    .nav-list {
      margin: 10px 0;
      .isactive {
        background-color: #cccccc;
      }
    }
    .content {
      .user-setting-list {
        .setting-item {
          display: flex;
          align-items: center;
          padding: 1.5rem 0;
          border-top: 1px solid #cccccc;
          &:last-child {
            border-bottom: 1px solid #cccccc;
          }
          .title {
            width: 80px;
          }
          .inp-box {
            // width: 60%;
            flex: 1;
            input {
              width: 100%;
              border: none;
              outline: none;
              background-color: transparent;
              color: $secondaryfont;
            }
          }
          .action {
            width: auto;
            margin-left: 5px;
            text-align: right;
          }
        }
      }
      .user-password {
        .pwd-item {
          display: flex;
          align-items: center;
          padding: 1.5rem 0;
          border-bottom: 1px solid #cccccc;
          &:first-child {
            border-top: 1px solid #cccccc;
          }
          .title {
            width: 100px;
          }
          .inp-box {
            // width: 60%;
            flex: 1;
            input {
              width: 100%;
              border: none;
              outline: none;
              background-color: transparent;
              color: $secondaryfont;
            }
          }
        }
        .action {
          margin-top: 20px;
          text-align: right;
        }
      }
    }
  }
}
</style>
