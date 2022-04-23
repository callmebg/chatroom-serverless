<template>
  <div class="group-desc-com">
    <div class="member">
      <group-user-list :userlist="groupMembers" />
    </div>
  </div>
</template>

<script>
import GroupUserList from '@/components/customGroupUserList'
export default {
  name: "GroupDescComponent",
  props: ["currentConversation"],
  data() {
    return {
      groupMembers: []
    }
  },
  methods: {
    async fetchGroupInfo() {
      if (this.currentConversation.conversationType === 'GROUP') {
        const id = this.currentConversation.group_Id
        const { data } = await this.$http.getGroupInfo({id})
        const { data: groupInfo, status } = data
        if (status === 2000) {
          this.groupMembers = groupInfo.users
        }
      }
    }
  },
  components: {
    GroupUserList
  },
  created() {
    this.fetchGroupInfo()
  },
}
</script>

<style lang="scss">
.group-desc-com {
  height: 100%;
  width: 100%;
  border-left: 1px solid #cccccc;
}
</style>
