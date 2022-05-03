<template>
  <div
    class="layout-page"
    v-css="{ 'background-image': 'url(' + bgImgUrl + ')' }"
  >
    <div
      v-if="!device === 'Mobile'"
      class="toggle"
      @click.stop="setShowMain"
      title="切换聊天区域是否显示"
    >
      <i class="icon el-icon-thumb"></i>
    </div>
    <transition name="fade">
      <main v-show="showMain" class="co-messager-layout">
        <!-- filter-bgc是用于设置背景虚化的，因为使用了filter以及transform后fixed会改变 -->
        <div
          v-if="!device === 'Mobile'"
          class="filter-bgc"
          v-css="{
            filter: 'blur(' + blur + 'px)',
            'background-image': 'url(' + bgImgUrl + ')'
          }"
        />
        <el-main
          :class="
            device === 'Mobile' ? 'co-messager-main mobile' : 'co-messager-main'
          "
          v-css="opacity !== 1 ? { opacity: opacity } : {}"
        >
          <audio :src="NotifyAudio" ref="audio" muted></audio>
          <transition name="slide-left">
            <div
              :class="
                device === 'Mobile'
                  ? 'co-messager-aside mobile'
                  : 'co-messager-aside'
              "
              v-css="
                device === 'Mobile'
                  ? { transform: 'translateX(' + asideTranslateX + 'px)' }
                  : ''
              "
            >
              <my-aside :set-show-theme="setShowTheme" />
            </div>
          </transition>
          <div
            :class="
              device === 'Mobile'
                ? 'co-messager-content mobile'
                : 'co-messager-content'
            "
          >
            <keep-alive :include="include">
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </div>
        </el-main>
      </main>
    </transition>
    <transition name="fade">
      <theme v-if="showTheme" @setShowTheme="setShowTheme" />
    </transition>
    <!-- 在移动端下点击展示左边菜单 -->
    <div
      v-show="
        device === 'Mobile' &&
          asideTranslateX === -70 &&
          $route.path === '/index' &&
          currentUI === 'conversation'
      "
      class="mobile-menu"
      @click.stop="toggleAside"
    >
      <img :src="IMG_URL + userInfo.user_profile" alt="" srcset="" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import myAside from './components/Aside'
import { saveRecentConversationToLocal } from '@/utils'
import { SET_UNREAD_NEWS_TYPE_MAP } from '@/store/constants'
import NotifyAudio from './../../../static/audio/notify.mp3'
import { MSG_TYPES } from '@/const'

const systemPictureMap = {
  abstract: require('./../../../static/image/theme/abstract.jpg'),
  city: require('./../../../static/image/theme/city.jpg'),
  ocean: require('./../../../static/image/theme/ocean.jpg')
}
export default {
  name: 'Layout',
  data() {
    return {
      include: ['Home'], // keepAlive缓存相关
      bgImgUrl: '/static/image/theme/ocean.jpg',
      NotifyAudio: NotifyAudio,
      showTheme: false,
      showMain: true, // 聊天区域是否展示
      asideTranslateX: -70,
      IMG_URL: process.env.IMG_URL
    }
  },
  computed: {
    ...mapState('user', {
      userInfo: 'userInfo'
    }),
    ...mapState('theme', {
      opacity: 'opacity',
      blur: 'blur',
      bgImg: 'bgImg'
    }),
    allConversation() {
      return this.$store.state.app.allConversation
    },
    device() {
      return this.$store.state.device.deviceType
    },
    currentUI() {
      return this.$store.state.device.currentUI
    }
  },
  watch: {
    $route(to, from) {
      const include = this.include
      //如果 要 to(进入) 的页面是需要 keepAlive 缓存的，把 name push 进 include数组
      if (to.meta.keepAlive) {
        !include.includes(to.name) && include.push(to.name)
      }
      //如果 要 form(离开) 的页面是 keepAlive缓存的，
      //再根据 deepth 来判断是前进还是后退
      //如果是后退
      if (from.meta.keepAlive && to.meta.deepth < from.meta.deepth) {
        const index = include.indexOf(from.name)
        index !== -1 && include.splice(index, 1)
      }
    }
  },
  components: {
    myAside
  },
  methods: {
    /**
     * 获取系统用户（比如发送验证消息的系统用户）,然后加入会话列表
     */
    async sysUserJoinSocket() {
      const { data } = await this.$http.getSysUsers()
      const { data: sysUserList, status } = data
      if (status === 2000) {
        sysUserList.forEach(item => {
          this.$store.dispatch('app/SET_SYS_USERS', sysUserList)
          const val = {
            roomId: item._id + '-' + this.userInfo._id
          }
          this.$socket.emit('join', val)
        })
      }
    },
    setShowTheme(flag) {
      this.showTheme = flag
    },
    setShowMain() {
      this.showMain = !this.showMain
    },
    toggleAside() {
      this.asideTranslateX === 0
        ? (this.asideTranslateX = -70)
        : (this.asideTranslateX = 0)
    },
    allOnlineUser(data) {
      console.log('当前在线用户列表', data)
      const onlineUserIdArr = Object.values(data).map(item => item.user_id)
      this.$store.dispatch('app/SET_ONLINE_USER', onlineUserIdArr)
    },
    receiveMessage(news) {
      this.$refs['audio'].play()
      console.log('收到新消息', news)
      var message = news.messageType
      if(news.messageType == MSG_TYPES.text) {
        message = news.message ? news.message.slice(0, 10) : ''
      }
      // 自己发的信息回显就不用提示辣
      if(news.senderId != this.userInfo.user_id) {
        this.$notify({
          title: '收到新消息',
          message,
          type: 'success'
        })
        this.$store.dispatch('news/SET_UNREAD_NEWS', {
          roomId: news.roomId,
          count: 1,
          type: 'ADD'
        })
      }
      const senderConversation = this.allConversation.find(
        item => item.roomId === news.roomId
      )
      this.$store.dispatch('app/SET_RECENT_CONVERSATION', {
        type: 'add',
        data: senderConversation
      })

      this.$store.dispatch('news/SET_LAST_NEWS', {
        type: 'edit',
        res: {
          roomId: news.roomId,
          news: news
        }
      })
      saveRecentConversationToLocal(news.senderId)
    },
    receiveValidateMessage(news) {
      this.$refs['audio'].play()
      console.log('收到新的验证消息', news)
      this.$store.dispatch('news/SET_UNREAD_NEWS', {
        roomId: news.roomId,
        count: 1,
        type: SET_UNREAD_NEWS_TYPE_MAP.add
      })
    },
    receiveAgreeFriendValidate(data) {
      console.log('receiveAgreeFriendValidate', data)
    },
    conversationList(list) {
      // console.log("当前会话列表", list)
    },

    //发送的消息被对方读取了

    isReadMsg(val) {
      console.log('isReadMsg', val)
      const { roomId, status } = val
      this.$store.dispatch('news/SET_USER_IS_READ_MSG', {
        roomId,
        status
      })
    }
  },
  mounted() {
    this.$socket.emit('connect', {
      userId: this.$store.state.user.userInfo.user_id,
      userName: this.$store.state.user.userInfo.user_nickname
    })
    if (this.device === 'Mobile') {
      document.addEventListener('click', () => {
        this.asideTranslateX = -70
      })
    }
    this.sysUserJoinSocket()
  },
  created() {
    this.$eventBus.$on('receiveMessage', data => {
      this.receiveMessage(data)
    })
    this.$eventBus.$on('allOnlineUser', data => {
      this.allOnlineUser(data)
    })
  }
}
</script>

<style lang="scss">
.layout-page {
  @import './../../../static/css/var.scss';
  @import './../../../static/css/animation.scss';
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-color: #e9ebee;
  position: relative;
  transition: all 0.4s ease-out;
  .toggle {
    position: fixed;
    .icon {
      padding: 5px;
      font-size: 20px;
      color: #ffffff;
      border: 1px solid #ffffff;
      border-radius: 50%;
    }
  }
  .co-messager-layout {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    .filter-bgc {
      position: absolute;
      left: 50%;
      top: 50%;
      margin: -336px 0 0 -510px;
      width: 1020px;
      height: 672px;
      filter: blur(10px);
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
    }
    .co-messager-main {
      display: flex;
      position: absolute;
      left: 50%;
      top: 50%;
      margin: -336px 0 0 -510px;
      width: 1020px;
      height: 672px;
      background-color: #e9ebee;
      color: #333;
      border-radius: 5px;
      padding: 0;
      opacity: 0.8;
      /*针对移动端做特殊处理*/
      &.mobile {
        left: 0;
        top: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        border-radius: 0px;
      }
      .co-messager-aside {
        width: 7%;
        height: 100%;
        border-right: 1px solid #cccccc;
        &.mobile {
          position: absolute;
          z-index: 1001;
          width: 70px;
        }
      }
      .co-messager-content {
        width: 93%;
        &.mobile {
          width: 100%;
        }
      }
    }
  }
  .mobile-menu {
    position: fixed;
    z-index: 1003;
    left: 5px;
    top: 10px;
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 10px;
    background-color: #f2f2f2;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
