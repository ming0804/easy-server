<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="uploadJar.descripe"
          />
        </a-form-item>
        <a-form-item label="上传文件" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload" :multiple="true">
            <a-button>
              <a-icon type="upload"/>
              Select File
            </a-button>
          </a-upload>
        </a-form-item>
        <a-row>
          <a-col
            :span="24"
            :style="{ textAlign: 'right' }"
          >
            <a-button
              @click="channel"
            >
              取消
            </a-button>
            <a-button
              type="primary"
              @click="handleUpload"
              :disabled="fileList.length === 0"
              :loading="uploading"
              style="margin-top: 16px;margin-left: 20px"
            >
              {{uploading ? 'Uploading' : '提交' }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
  import { deployJarEdit } from '@/api/deployJar'
  import { axios } from '@/utils/request'

  export default {
    name: 'uploadJar',
    props: {
      deployJar: {}
    },
    data () {
      return {
        spinning: false,
        fileList: [],
        uploading: false,
        uploadJar: {}
      }
    },
    created () {

    },

    methods: {
      submit11 () {
        this.spinning = true
        deployJarEdit(this.deployJar).then(rst => {
          this.spinning = false
          this.channel()
        })
      },

      handleRemove (file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
      },
      beforeUpload (file) {
        this.fileList = [...this.fileList, file]
        return false
      },
      handleUpload () {
        if (this.uploadJar.descripe == null || this.uploadJar.descripe == '') {
          this.$notification.info({
            message: '描述不能为空'
          })
          return
        }
        const { fileList } = this
        const formData = new FormData()
        let jar = 0
        fileList.forEach(file => {
          if (file.name.endsWith('.jar')) {
            jar = jar + 1
          }
          formData.append('files[]', file)
        })
        if (jar !== 1){
          this.$notification.info({
            message: '有且只能有一个jar包文件'
          })
          return
        }

        formData.append('descripe', this.uploadJar.descripe)
        formData.append('deployJarId', this.deployJar.deployJarId)
        this.uploading = true
        this.spinning = true
        // You can use any AJAX library you like
        axios({
          url: 'deployJar/upload',
          method: 'post',
          processData: false,
          data: formData
        }).then(rst => {
          this.fileList = []
          this.uploading = false
          this.spinning = false
          this.channel()
          this.$notification.info({
            message: rst.message
          })
        }).catch(error => {
          this.uploading = false
          this.spinning = false
          this.$notification.info({
            message: '错误' + error
          })
        })
      },

      channel () {
        this.$emit('handleCanceluploadJar')
      }
    }
  }
</script>

<style scoped>

</style>