<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
        <a-form-item label="访问ip" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="redisConf.ip"
          />
        </a-form-item>
        <a-form-item label="端口号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="redisConf.port"
          />
        </a-form-item>
        <a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="redisConf.password"
          />
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
  import { redisEdit } from '@/api/redis'

  export default {
    props: {
      hostServerId: null,
      redisConf: {}
    },
    data () {
      return {
        spinning: false
      }
    },
    created () {
      this.first()
    },
    methods: {
      first () {

      },
      submit11 () {
        this.spinning = true
        this.redisConf.hostServerId = this.hostServerId
        redisEdit(this.redisConf).then(rst => {
          this.$notification.info({
            message: '修改成功 请手动重启'
          })
          this.spinning = false
          this.channel()
        })

      },
      channel () {
        this.$emit('redisEditChannel') // 将改变通知父组件(保证父子组件数据一致)
      }
    }

  }
</script>

<style scoped>

</style>