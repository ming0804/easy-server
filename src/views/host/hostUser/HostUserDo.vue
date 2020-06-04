<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <span>先添加用户组</span>
      <a-form>
        <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="hostUserParam.username" :disabled="nameDisabled"
          />
        </a-form-item>
        <a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="hostUserParam.password"     placeholder="新加必填 修改的时候不必填"
          />
        </a-form-item>
        <a-form-item label="主组" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">

          <a-select
            :defaultValue="hostUserParam.mainGroup"
            @change="mainGroupChange"
          >
            <a-select-option v-for="i in hostGroupList" :key="i.groupName">
              {{i.groupName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="副组" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            mode="multiple"
            :defaultValue="hostUserParam.otherGroupList"
            @change="handleChange"
            placeholder="Please select"
          >
            <a-select-option v-for="i in hostGroupList" :key="i.groupName">
              {{i.groupName}}
            </a-select-option>
          </a-select>
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
  import { hostGroupList, hostUserEdit } from '@/api/hostUserGroup'

  export default {
    name: 'HostUserDo',
    props: {
      hostUser: {},
      hostServerId: undefined
    },
    data () {
      return {
        spinning: false,
        hostUserParam: {},
        hostGroupList: [],
        nameDisabled: false
      }
    },
    created () {
      this.hostUserParam = this.hostUser
      if (this.hostUserParam.hostUserId != null && this.hostUserParam.hostUserId != undefined) {
        this.nameDisabled = true
      }
      hostGroupList({ hostServerId: this.hostServerId }).then(rst => {
        this.hostGroupList = rst.result
      })
    },

    methods: {
      submit11 () {

        this.spinning = true
        this.hostUserParam.hostServerId = this.hostServerId
        hostUserEdit(this.hostUserParam).then(rst => {
          this.spinning = false
          this.channel()
        })
      },
      handleChange (selectedItems) {

        this.hostUserParam.otherGroup = selectedItems.join(',')
        // this.selectedItems = selectedItems;
      },
      mainGroupChange (o) {
        this.hostUserParam.mainGroup = o
      },
      channel () {
        this.$emit('handleCancel')
      }
    }
  }
</script>

<style scoped>

</style>