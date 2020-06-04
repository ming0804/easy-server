<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">


      <a-form :form="nginxConfForm">
        <a-form-item label="进程数" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['workerProcesses', { rules: [{ required: true, message: 'Please input your note!' }] }]"
          />
        </a-form-item>

        <a-form-item label="最大连接数" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['workerConnections', { rules: [{ required: true, message: 'Please input your note!' }] }]"

          />
        </a-form-item>
        <a-form-item label="默认返回类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-decorator="[ 'defaultType',{ rules: [{ required: true, message: 'Please select your gender!' }] },]"
            placeholder="Select a option and change input text above"
          >
            <a-select-option value="application/octet-stream">
              application/octet-stream
            </a-select-option>
            <a-select-option value="application/json">
              application/json
            </a-select-option>
            <a-select-option value="text/html">
              text/html
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="单个文件最大值/M" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['clientMaxBodySize', { rules: [{ required: true, message: 'Please input your note!' }] }]"

          />
        </a-form-item>
        <a-form-item label="连接保持活动的超时时间" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['keepaliveTimeout', { rules: [{ required: true, message: 'Please input your note!' }] }]"

          />
        </a-form-item>
        <a-form-item label="响应客户端的超时时间" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['sendTimeout', { rules: [{ required: true, message: 'Please input your note!' }] }]"

          />
        </a-form-item>
        <a-form-item
          v-for="(k, index) in nginxConf.extendList"
          :key="index"
          :label="'扩展参数'"
          :required="false"
          :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
          `name[${k}]`,
          {
            validateTrigger: ['change', 'blur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input passenger\'s name or delete this field.',
              },
            ],
          },
        ]"
            placeholder="passenger name"
            style="width: 60%; margin-right: 8px"
          />
          <a-icon
            v-if="nginxConf.extendList.length > 0"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="nginxConf.extendList.length === 0"
            @click="() => remove(k)"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="dashed" style="width: 60%" @click="add">
            <a-icon type="plus"/>
            Add field
          </a-button>
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
  import { nginxConfGet, nginxConfEdit } from '@/api/nginx'
  import pick from 'lodash.pick'

  let id = 0
  export default {
    name: 'nginxConfEdit',
    props: {
      hostServerId: null
    },
    data () {
      return {
        spinning: false,
        nginxConfForm: this.$form.createForm(this),
        nginxConf: {}
      }
    }, created () {
      id = 0
      this.first()

    },
    methods: {
      first () {
        nginxConfGet({ hostServerId: this.hostServerId }).then(rst => {
          this.nginxConf = rst.result
          // this.nginxConfForm.getFieldDecorator('name[qwew]', { initialValue: 1, preserve: true })

          this.nginxConfForm.setFieldsValue(pick(rst.result, 'workerProcesses', 'workerConnections', 'defaultType', 'clientMaxBodySize', 'keepaliveTimeout', 'sendTimeout'))
          // this.nginxConfForm.setFieldsValue({
          //   names: [0,1,3],
          // });
          id += rst.result.extendList.length
          let extendList = []
          for (let i = 0; i < rst.result.extendList.length; i++) {
            extendList.push(i)
            this.nginxConfForm.getFieldDecorator('name[' + i + ']', {
              initialValue: rst.result.extendList[i],
              preserve: true
            })

          }
          this.nginxConf.extendList = extendList
          // this.nginxConfForm.getFieldDecorator('extendList[1]', { initialValue: 1, preserve: true })
          // this.nginxConfForm.getFieldDecorator('extendList[2]', { initialValue: 1, preserve: true })
        })
      },
      submit11 () {
        let param = this.nginxConfForm.getFieldsValue()

        this.spinning = true
        param.hostServerId = this.hostServerId
        param.nginxConfId = this.nginxConf.nginxConfId
        let extendList = []
        this.nginxConf.extendList.forEach(it => {
          extendList.push(param.name[it])
        })
        param.extendList = extendList
        nginxConfEdit(param).then(rst => {
          this.$notification.success({
            message: '修改成功',
            description: `添加成功`
          })
          this.channel()
        })

      },
      remove (k) {
        const keys = this.nginxConf.extendList
        this.nginxConf.extendList = keys.filter(key => key !== k)
      },

      add () {
        const keys = this.nginxConf.extendList
        const nextKeys = keys.concat(id++)
        this.nginxConf.extendList = nextKeys
      },
      channel () {
        this.$emit('nginxConfEditCancel') // 将改变通知父组件(保证父子组件数据一致)
      }
    }

  }
</script>

<style scoped>

</style>