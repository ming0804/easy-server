<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="nginxStatic.name"
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
  import { nginxStaticAdd } from '@/api/nginxStatic'

  export default {
    props: {
      hostServerId: null,
      nginxStatic: {}
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
        this.nginxStatic.hostServerId = this.hostServerId
        nginxStaticAdd(this.nginxStatic).then(rst => {
          this.$notification.info({
            message: '添加成功'
          })
          this.spinning = false
          this.channel()
        })

      },
      channel () {
        this.$emit('nginxStaticAddCancel') // 将改变通知父组件(保证父子组件数据一致)
      }
    }

  }
</script>

<style scoped>

</style>