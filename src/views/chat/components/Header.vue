<template>
  <div class="chat-area__header">
    <transition name="roll">
      <div class="header-wrapper">
        <div class="header-title">
          <i @click="setCurrentUI" v-if="device === 'Mobile'" style="margin-left: -15px;" class="el-icon-arrow-left"></i>
          <span>{{haderTitle}}</span>
        </div>
        <div class="header-operation">
          <i class="operation-item el-icon-menu" title="设置" @click.stop="toggleShowSettingPanel"></i>
        </div>
      </div>
    </transition>
    <transition name="roll">
      <div class="setting-panel" v-if="showSettingPanel">
        <setting-panel :current-conversation="currentConversation" @setCurrentConversation="setCurrentConversation" />  
      </div>      
    </transition>
  </div>
</template>

<script>
import './../../../../static/iconfont/iconfont.css'
import settingPanel from './settingPanel'
import { mapState } from 'vuex'
export default {
  props: {
    currentConversation: Object,
    setCurrentConversation: Function
  },
  data() {
    return {
      showSettingPanel: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    beizhu() { // 备注map
      return this.userInfo.friendBeizhu || {}
    },
    haderTitle() {
      const currentConversation = this.currentConversation
      let res = ''
      if (currentConversation.isGroup) {
        res = currentConversation.group_name + `（${currentConversation.userNum}）`
      } else {
        res = this.beizhu[currentConversation._id] ? this.beizhu[currentConversation._id] + `（${currentConversation.nickname}）` : currentConversation.nickname
      }
      return res
    },
    device() {
      return this.$store.state.device.deviceType
    }
  },
  methods: {
    toggleShowSettingPanel() {
      this.showSettingPanel = !this.showSettingPanel
    },
    watchDocumentClick() {
      if (!this.showSettingPanel) return
      this.toggleShowSettingPanel()
    },
    setCurrentUI() {
      this.$store.dispatch('device/SET_CURRENT_UI', 'conversation')
    }
  },
  watch: {
    currentConversation: {
      handler() {
        this.showSettingPanel = false
      }, immediate: true, deep: true
    }
  },
  components: {
    settingPanel
  },
  mounted() {
    document.addEventListener('click', this.watchDocumentClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.watchDocumentClick)
  },
}
</script>

<style lang="scss">
.chat-area__header {
  position: relative;
  box-sizing: border-box;
  height: 60px;
  padding: 0 20px;
  line-height: 60px;
  border-bottom: 1px solid #cccccc;
  .header-wrapper {
    display: flex;
    justify-content: space-between;
    .header-operation {
      .operation-item {
        font-size: 20px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  .setting-panel {
    position: absolute;
    top: 100%;
    right: 0px;
    width: 20%;
    height: 461px;
    z-index: 1005;
  }
  .iconic-group::before {
    font-size: 20px;
  }
  .roll-enter {
    opacity: 0;
    transform: translateY(30px);
  }

  .roll-leave-to {
    opacity: 0;
    transform: translateY(-30px)
  }

  .roll-enter-active,
  .roll-leave-active {
    transition: all 0.6s ease;
  }
}
</style>

