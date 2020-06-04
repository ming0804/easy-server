<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="nginxSslFile.descripe" placeholder="必填"
          />
        </a-form-item>
        <a-form-item label="key" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea v-model="nginxSslFile.key" placeholder="必填" :rows="4"/>
        </a-form-item>
        <a-form-item label="pem" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea v-model="nginxSslFile.pem" placeholder="必填" :rows="4"/>
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
              html-type="submit"
              :style="{ marginLeft: '8px' }"
              @click="submit11"
            >
              提交
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
  import { nginxSslFileAdd } from '@/api/nginxSslFile'

  export default {
    name: 'HostUserDo',
    props: {
      hostServerId: undefined
    },
    data() {
      return {
        spinning: false,
        nameDisabled: false,
        nginxSslFile: {}
      }
    },
    created() {

    },

    methods: {
      submit11() {
        this.spinning = true
        this.nginxSslFile.hostServerId = this.hostServerId
        nginxSslFileAdd(this.nginxSslFile).then(rst => {
          this.spinning = false
          this.$notification.success({
            message: '添加成功'
          })
          this.channel()
        }).catch(e => {
          this.spinning = false
        })
      },
      channel() {
        this.$emit('nginxSslFileAddCancel')
      }
    }
  }
</script>

<style scoped>

</style>