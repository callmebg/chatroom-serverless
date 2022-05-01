<template>
  <div class="system-page" :style="device === 'Mobile' ? {width: '100%'} : {}">
    <p class="title">我的系统消息</p>
    <validate-news :validateNewsList="validateNewsList" @changeValidateNewsStatus="changeValidateNewsStatus" />
  </div>
</template>

<script>
import validateNews from '@/components/validateNews'
export default {
  name: "System",
  data() {
    return {
      validateNewsList: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    device() {
      return this.$store.state.device.deviceType
    }
  },
  methods: {
    async fetchMyValidateNews() {
      const { data } = await this.$http.getMyValidateNews()
      if(data.success) {
        var ans = []
        for(var index in data.data) {
          console.log("index", index)
          ans.push({
            "_id": data.data[index]["decision_id"],
            "senderId": data.data[index]["decision_from"],
            "recipientId": data.data[index]["decision_to"],
            "senderAccount": data.data[index]["user_account"],
            "recipientAccount": data.data[index]["tb_to.user_account"],
            "additionMessage": data.data[index]["decision_message"],
            "validateType": data.data[index]["decision_type"],
            "status": data.data[index]["decision_status"],
            "time": data.data[index]["decision_create_time"],
            "senderNickname": data.data[index]["user_nickname"],
            "senderAvatar": data.data[index]["user_profile"],
            "recipientNickname": data.data[index]["tb_to.user_nickname"],
            "recipientAvatar": data.data[index]["tb_to.user_profile"],
            "groupId": data.data[index]["decision_group"],
          })
        }
        this.validateNewsList = ans
      }
    },
    changeValidateNewsStatus(item, status) {
      console.log(item, status)
      const { roomId, senderId, reveiverId } = item
      this.validateNewsList.forEach(item => {
        if (item.roomId === roomId && item.senderId === senderId && item.reveiverId === reveiverId ) {
          item.status = status
        }
      })
      // this.fetchMyValidateNews()
    }
  },
  components: {
    validateNews
  },
  sockets: {
    receiveValidateMessage(data) {
      console.log('在system页面接收新的验证消息：', data)
      this.validateNewsList = [...this.validateNewsList, data]
    }
  },
  created() {
    // this.$http.getMyValidateNews()
    this.$eventBus.$on('changeSystemNews', () => {
      this.fetchMyValidateNews()
    })
    this.fetchMyValidateNews()
  },
}
</script>

<style lang="scss">
.system-page {
  .title {
    margin-top: 0;
  }
  width: 70%;
  height: 100%;
  margin: 0 auto;
  padding: 20px 10px;
}
</style>
