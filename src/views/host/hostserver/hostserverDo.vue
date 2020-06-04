<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
    <a-col>
      <div style="max-width: 800px">

        <a-form :form="form" layout="horizontal">

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="服务器名称">
            <a-input v-decorator="[ 'name', {rules: [{ required: true, message: '请填写服务器名称' }]} ]"
                     placeholder="请填写服务器名称"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="ip">
            <a-input v-decorator="[ 'ip', {rules: [{ required: true, message: '请填写服务器ip' }]} ]"
                     placeholder="请填写ip"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="password">
            <a-input v-decorator="[ 'password', {rules: []} ]"
                     placeholder="请填写密码"/>
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
      </div>
    </a-col>
    </a-spin>
  </div>
</template>

<script>
  import { hostServerGet, hostServerEdit, hostServerAdd } from '@/api/hostServer'
  import pick from 'lodash.pick'

  export default {
    name: 'do',
    comments: {},
    props: {
      hostServerId: null
    },
    data () {
      return {
        spinning:false,
        labelCol: {
          xs: { span: 250 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 450 },
          sm: { span: 16 }
        },
        form: this.$form.createForm(this),
        permissions: [],
        mdl: {}
      }
    },
    created () {
      this.first()
    },
    methods: {
      submit11 () {
        let param = this.form.getFieldsValue()
        // let validateFields = this.form.validateFields
        // validateFields(function (errors, values) {
        //   debugger;
        // })
        this.spinning = true
        if (this.hostServerId === undefined || this.hostServerId === null) {
          hostServerAdd(param).then(rst => {
            this.$notification.success({
              message: '成功',
              description: `添加成功`
            })
            this.channel()
          })
        } else {
          param.hostServerId = this.hostServerId
          hostServerEdit(param).then(rst => {
            this.$notification.success({
              message: '成功',
              description: `修改成功`
            })
            this.channel()
          })
        }
      },
      channel () {
        this.$emit('handleCancel') // 将改变通知父组件(保证父子组件数据一致)
      },
      first () {
        if (this.hostServerId !== undefined) {
          hostServerGet({ hostServerId: this.hostServerId }).then(res => {
            this.form.setFieldsValue(pick(res.result, 'name', 'ip'))
          })
        }

      },
      isMobile () {
        return false
      }

    }
  }
</script>

<style scoped>

</style>