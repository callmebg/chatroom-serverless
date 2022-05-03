<template>
  <div class="custom-upload-file-com">
    <div class="upload-file-com-wrapper">
      <el-alert
        title="只能发送小于 20M 的文件"
        type="info"
        effect="dark"
        :closable="false"
      />
      <div class="option">
        <label for="up-to-file">
          <i class="option-item ok el-icon-picture"
            >点击上传文件
            <input
              id="up-to-file"
              class="img-inp upload"
              type="file"
              title="选择文件"
              @change="uploadTx"
            />
          </i>
        </label>
      </div>
    </div>
    <el-progress
      :text-inside="true"
      :stroke-width="26"
      :percentage="percentage"
    ></el-progress>
  </div>
</template>

<script>
/**
 * 上传文件组件
 */
import { genGuid } from '@/utils'
export default {
  data() {
    return {
      percentage: 0
    }
  },
  methods: {
    createObjetURL(file, guid) {
      const url = window.URL.createObjectURL(file)
      this.getLocalUrl(url, guid)
    },
    /**上传至腾讯云 */
    uploadTx(e) {
      const guid = genGuid()
      const [file] = e.target.files
      // return
      const fileType = file.type && file.type.split('/')[1]
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 20) {
        this.$message.error('只能上传小于20M的文件！换一个小文件试试吧~~')
        return
      }
      var key =
        '/profile/' +
        this.$store.state.user.userInfo.user_account +
        '/chatFile/' +
        guid +
        file.name
      var that = this
      this.$store.state.user.cos.putObject(
        {
          Bucket: 'chatroom-1257987061' /* 必须 */,
          Region: 'ap-guangzhou' /* 必须 */,
          Key: key /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function(progressData) {
            console.log('progressData', progressData)
            that.percentage = progressData.percent * 100
          }
        },
        function(err, data) {
          console.log(err || data)
          if (data.statusCode == 200) {
            that.$message('文件上传成功')
            that.$eventBus.$emit('sendFile', key)
          } else {
            that.$message.warning('文件上传失败')
          }
        }
      )
    }
  }
}
</script>

<style lang="scss">
.custom-upload-file-com {
  width: 270px;
  background-color: #fff;
  .upload-file-com-wrapper {
    padding: 10px;
    .option {
      margin-top: 10px;
      text-align: right;
      .option-item {
        display: inline-block;
        padding: 5px;
        background-color: #c35673;
        color: #fff;
        height: 40px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        border-radius: 5px;
        &::before {
          margin-right: 5px;
        }
      }
      .img-inp {
        display: none;
      }
    }
  }
}
</style>
