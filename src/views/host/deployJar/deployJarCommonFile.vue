<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
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
      <a-divider>已上传文件（重新上传会直接删除所有已上传的文件）</a-divider>
      <a-list item-layout="horizontal" :data-source="list">
        <a-list-item slot="renderItem" slot-scope="item, index">

          <a-list-item-meta>
            <a slot="title" href="#">{{ item.filename }}({{item.createdTime}})</a>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-spin>
  </div>
</template>

<script>
  import { commonFileList } from '@/api/deployJar'
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
        uploadJar: {},
        list:[],
      }
    },
    created () {
      commonFileList(this.deployJar).then(rst =>{
        console.log(rst)
        this.list = rst.result
      })
    },

    methods: {

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
        const { fileList } = this
        const formData = new FormData()
        if (fileList.length >10){
          this.$notification.info({
            message: '通用文件最多10个'
          })
          return
        }
        fileList.forEach(file => {
          formData.append('files[]', file)
        })

        formData.append('deployJarId', this.deployJar.deployJarId)
        this.uploading = true
        this.spinning = true
        // You can use any AJAX library you like
        axios({
          url: 'deployJar/uploadCommonFile',
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
        this.$emit('channelCommonFile')
      }
    }
  }
</script>


<style scoped>

</style>