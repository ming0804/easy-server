<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
        <a-form-item label="项目名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="deployJar.projectName" :disabled="nameDisabled"
          />
        </a-form-item>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="deployJar.descripe" placeholder="新加必填 修改的时候不必填"
          />
        </a-form-item>
        <a-form-item label="包类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-model="deployJar.type"
          >
            <a-select-option :value="0">ktor项目</a-select-option>
            <a-select-option :value="1">springboot项目</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标签" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select v-model="deployJar.tag" style="width: 120px" >
            <a-select-option :value="0">
              测试
            </a-select-option>
            <a-select-option :value="1">
              正式
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
  import { deployJarEdit } from '@/api/deployJar'

  export default {
    name: 'HostUserDo',
    props: {
      deployJar: {}
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

    },

    methods: {
      submit11 () {

        this.spinning = true
        deployJarEdit(this.deployJar).then(rst => {
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