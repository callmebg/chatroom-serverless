<template>
  <div class="message-type__file">
    <i class="el-icon-document"
      ><a :href="IMG_URL + message.message" :download="fileName"
        >文件点击下载</a
      ></i
    >
    <p>
      {{ fileName }}
    </p>
  </div>
</template>

<script>
import './../../../static/iconfont/iconfont.css'
export default {
  props: ['message'],
  data() {
    return {
      IMG_URL: process.env.IMG_URL
    }
  },
  computed: {
    fileName() {
      return this.message.message
        .split('/')
        .pop()
        .slice(36)
    }
  }
}
</script>
