<template>
  <div class="conversation-top-search-cmp">
    <el-autocomplete
      class="inline-input"
      v-model="searchKey"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      :trigger-on-focus="false"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchKey: '',
    }
  },
  computed: {
    friend() {
      var ans = []
      var friends = this.$store.state.app.allFriends
      for(var i in friends) {
        ans.push({"value": friends[i].user_nickname + "(" + friends[i].user_account + ")"})
      }
      return ans
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var results = this.friend
      if(queryString){
        //在friend 里面搜索
        results = results.filter((result) => {
          return result["value"].indexOf(queryString) != -1
        })
      }
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelect(item) {
      console.log(item)
    }
  },
  components: {}
}
</script>
<style lang="scss">
.conversation-top-search-cmp {
  .inline-input {
    display: block;
  }
}
</style>
