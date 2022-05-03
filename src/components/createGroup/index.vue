<template>
  <div class="create-group-cmp">
    <div class="create-content">
      <el-form
        label-position="top"
        :model="groupForm"
        :rules="rules"
        ref="groupForm"
      >
        <el-form-item label="群头像（点击可上传）" required class="avatar-form">
          <el-upload
            class="my-avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change="changeFile"
          >
            <img
              v-if="groupForm.avatar"
              :src="IMG_URL + groupForm.avatar"
              class="my-avatar"
            />
            <i v-else class="el-icon-plus my-avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="群名称" prop="title" required>
          <el-input v-model="groupForm.title" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="群描述" prop="desc">
          <el-input
            v-model="groupForm.desc"
            autocomplete="on"
            type="textarea"
            :rows="2"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="submitForm('groupForm')"
            >提交</el-button
          >
          <el-button size="mini" @click="resetForm('groupForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      IMG_URL: process.env.IMG_URL,
      groupForm: {
        title: '',
        desc: '',
        avatar: ''
      },
      rules: {
        title: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        desc: [
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async create() {
      const params = {
        group_name: this.groupForm.title,
        group_description: this.groupForm.desc,
        group_profile: this.groupForm.avatar
      }
      const { data } = await this.$http.createGroup(params)
      console.log(data)
      this.$eventBus.$emit('toggleCreateGroup', { show: false })
      if (data.success) {
        this.$eventBus.$emit('changeGroup')
        this.$alert(`创建成功！`, '提示')
      } else {
        this.$message({ type: 'error', message: '创建群失败！' })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.create()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    changeFile(file, fileList) {
      console.log('file')
      var picture = fileList[0].raw
      console.log(picture)
      var key =
        '/profile/' +
        this.$store.state.user.userInfo.user_account +
        '/group/' +
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
          onProgress: function(progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        function(err, data) {
          console.log(err || data)
          if (data.statusCode == 200) {
            that.groupForm.avatar = key
          }
        }
      )
    }
  }
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
.create-group-cmp {
  .create-content {
    .avatar-form {
      margin: 0;
    }
  }
}
</style>
