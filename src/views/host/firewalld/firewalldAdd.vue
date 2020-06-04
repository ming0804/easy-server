<template>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="firewalld.desc"
          />
        </a-form-item>

        <a-form-item label="端口号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-model="firewalld.port"
          />
        </a-form-item>
        <a-row>
          <a-col
            :span="24"
            :style="{ textAlign: 'right' }"
          >
            <a-button
              @click="()=>{this.$emit('firewalldAddChannl')}"
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
</template>

<script>
  import { firewalldAdd } from '@/api/firewalld'
  export default {
    name: 'firewalldAdd',
    props: {
      hostServerId: null
    },
    data () {
      return {
        spinning: false,
        firewalld: {}

      }
    },
    methods:{
      submit11 () {
        this.spinning = true
        this.firewalld.hostServerId = this.hostServerId
        firewalldAdd(this.firewalld).then(rst => {
          this.firewalld = {}
          this.spinning = false
          this.$emit('firewalldAddChannl')
        })
      }
    }
  }
</script>

<style scoped>

</style>