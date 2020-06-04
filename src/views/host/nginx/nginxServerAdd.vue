<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">


      <a-form :form="nginxConfForm">
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="nginxServer.name"
          />
        </a-form-item>

        <a-form-item label="server" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-model="nginxServer.serverName"
          />
        </a-form-item>

        <a-form-item label="端口号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-model="nginxServer.listen"
          />
        </a-form-item>
        <a-form-item label="是否添加ssl证书" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-model="nginxServer.sslFlag"
          >
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="ssl证书列表" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"  v-if="nginxServer.sslFlag==1">
          <a-select
            v-model="nginxServer.nginxSslFileId"
          >
            <a-select-option v-for="i in nginxSslFileList" :key="i.nginxSslFileId">
              {{i.descripe}}
            </a-select-option>
          </a-select>
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
  let id = 0
  import { nginxServerAdd } from '@/api/nginx'
  import { nginxSslFileAllList } from '@/api/nginxSslFile'

  export default {
    name: 'nginxServerAdd',
    props: {
      hostServerId: null,
      nginxConfId: null,
      nginxServer: {}
    },
    data() {
      return {
        spinning: false,
        nginxConfForm: this.$form.createForm(this),
        nginxConf: { extendList: [] },
        nginxSslFileList: []
      }
    },
    created() {
      id = 0
      this.nginxConf.extendList = this.nginxServer.extendList
      this.first()
      nginxSslFileAllList({ hostServerId: this.hostServerId }).then(rst => {
        this.nginxSslFileList = rst.result
      })
    },
    methods: {
      first() {
        id += this.nginxConf.extendList.length
        let extendList = []
        for (let i = 0; i < this.nginxConf.extendList.length; i++) {
          extendList.push(i)
          this.nginxConfForm.getFieldDecorator('name[' + i + ']', {
            initialValue: this.nginxConf.extendList[i],
            preserve: true
          })

        }
        this.nginxConf.extendList = extendList
      },
      submit11() {
        let param = this.nginxConfForm.getFieldsValue()
        if (this.nginxServer.nginxServerId === undefined) {
          this.nginxServer.hostServerId = this.hostServerId
          this.nginxServer.nginxConfId = this.nginxConfId
        }
        let extendList = []
        this.nginxConf.extendList.forEach(it => {
          extendList.push(param.name[it])
        })
        this.nginxServer.extendList = extendList
        this.spinning = true
        nginxServerAdd(this.nginxServer).then(rst => {
          this.$notification.success({
            message: '操作成功'
          })
          this.channel()
        })

      },
      remove(k) {
        const keys = this.nginxConf.extendList
        this.nginxConf.extendList = keys.filter(key => key !== k)
      },

      add() {
        const keys = this.nginxConf.extendList
        const nextKeys = keys.concat(id++)
        this.nginxConf.extendList = nextKeys
      },
      channel() {
        this.$emit('nginxServerAddCancel') // 将改变通知父组件(保证父子组件数据一致)
      }
    }

  }
</script>

<style scoped>

</style>