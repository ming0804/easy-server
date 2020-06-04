<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
        <a-form-item label="用户组名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="hostGroup.groupName"
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
  import { hostGroupEdit } from '@/api/hostUserGroup'

  export default {
    name: 'HostUserDo',
    props: {
      hostServerId: undefined
    },
    data () {
      return {
        spinning: false,
        hostGroup: {},
      }
    },
    created () {

    },

    methods: {
      submit11 () {

        this.spinning = true
        this.hostGroup.hostServerId = this.hostServerId
        hostGroupEdit(this.hostGroup).then(rst => {
          this.spinning = false
          this.channel()
        })
      },
      channel () {
        this.$emit('handleCancel')
      }
    }
  }
</script>

<style scoped>

</style>