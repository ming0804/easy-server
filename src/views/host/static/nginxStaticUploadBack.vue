<template>
  <a-spin :spinning="spinning" tip="执行中...">
    <div class="align-center">

      <div>
        <a href="javascript:;" class="input-file input-fileup">
          <input ref="file" class="fileUploaderClass" type='file' name="file"
                 webkitdirectory
          />
        </a>
      </div>
      <div style="margin-top: 30px">
        <a-row>
          <a-col
            :span="24"
          >
            <a-button
              @click="channel"
            >
              返回
            </a-button>
            <a-button
              type="primary"
              html-type="submit"
              :style="{ marginLeft: '8px' }"
              @click="onSubmit"
            >
              提交
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-spin>
</template>

<script>
  import { nginxServerAdd, nginxUpstreamAll, nginxServerLocationAdd } from '@/api/nginx'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { axios } from '@/utils/request'
  import Vue from 'vue'

  export default {
    props: {
      hostServerId: null,
      nginxStatic: {}
    },
    data () {
      return {
        spinning: false,
        url: process.env.VUE_APP_API_BASE_URL + 'nginxStatic/upload',
        header: { token: Vue.ls.get(ACCESS_TOKEN) },
        param: { nginxStaticId: this.nginxStatic.nginxStaticId, hostServerId: this.hostServerId }
      }
    },
    created () {
      this.first()

    },
    methods: {
      first () {

      },
      onSubmit () {
        if (this.$refs.file.files.length === 0) {
          this.$notification.info({
            message: '请选择文件夹'
          })
          return
        }
        // let size = 0
        // for (let i = 0; i < this.$refs.file.files.length; i++) {
        //   size += this.$refs.file.files[i].size
        //   console.log('文件大小', size)
        // }
        // if (size > 1024 * 1024 * 4) {
        //   this.$notification.info({
        //     message: '文件总体大小不能大于40M',
        //   })
        //   this.$refs.file.files = null
        //   return
        // }
        this.spinning = true
        let resNum = 0
        let total = this.$refs.file.files.length
        axios({
          url: 'nginxStatic/start',
          method: 'post',
          data: {
            hostServerId: this.hostServerId,
            nginxStaticId: this.nginxStatic.nginxStaticId
          },
          headers: { 'Content-Type': 'application/json' }
        }).then(res => {
          if (res.result === 1) {
            for (let i = 0; i < total; i++) {
              let param = new FormData()
              param.append('nginxStaticId', this.nginxStatic.nginxStaticId)
              param.append('hostServerId', this.hostServerId)
              param.append('filename', this.$refs.file.files[i].name)
              param.append('relativePath', this.$refs.file.files[i].webkitRelativePath)
              param.append('file', this.$refs.file.files[i])

              axios({
                url: 'nginxStatic/upload',
                method: 'post',
                data: param,
                headers: { 'Content-Type': 'multipart/form-data' }
              }).then(res => {
                if (res.result === 1) {
                  resNum++
                  if (total === resNum) {
                    axios({
                      url: 'nginxStatic/deploy',
                      method: 'post',
                      data: {
                        hostServerId: this.hostServerId,
                        nginxStaticId: this.nginxStatic.nginxStaticId
                      },
                      headers: { 'Content-Type': 'application/json' }
                    }).then(res => {
                      this.$notification.info({
                        message: '部署成功'
                      })
                      this.spinning = false
                      this.channel()
                    }).catch(err => {
                      this.$notification.info({
                        message: '部署失败'
                      })
                    })
                  }
                } else {
                  this.$notification.info({
                    message: '部署失败'
                  })
                  this.spinning = false
                  this.channel()
                }
              }).catch(err => {
                this.spinning = false
                this.$notification.info({
                  message: '部署失败'
                })
                this.channel()
              })

            }
          } else {
            this.$notification.info({
              message: '部署失败'
            })
            this.spinning = false
            this.channel()
          }
        }).catch(err => {
          this.$notification.info({
            message: '部署失败'
          })
        })
      },
      channel () {
        this.$emit('nginxStaticUploadCancel') // 将改变通知父组件(保证父子组件数据一致)
      }
    }

  }
</script>

<style scoped>
  .align-center {
    margin: 0 auto; /* 居中 这个是必须的，，其它的属性非必须 */
    width: 500px; /* 给个宽度 顶到浏览器的两边就看不出居中效果了 */
    text-align: center; /* 文字等内容居中 */
  }
</style>