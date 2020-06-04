<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">


      <a-form :form="nginxServerLocationForm">
        <a-form-item label="url" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="nginxServerLocation.url"
          />
        </a-form-item>
        <a-form-item label="代理类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-model="nginxServerLocation.type"
          >
            <a-select-option :value="0">静态文件代理</a-select-option>
            <a-select-option :value="1">直接地址转发</a-select-option>
            <a-select-option :value="3">负载配置转发代理</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="静态文件列表" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" v-if="nginxServerLocation.type===0">
          <a-select
            v-model="nginxServerLocation.nginxStaticId"
          >
            <a-select-option v-for="i in nginxStaticList" :value="i.nginxStaticId">
              {{i.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="负载列表" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" v-if="nginxServerLocation.type===3">
          <a-select
            v-model="nginxServerLocation.nginxUpstreamId"
          >
            <a-select-option v-for="i in nginxUpstreamList" :value="i.nginxUpstreamId">
              {{i.name}}
            </a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item label="直接代理地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"  v-if="nginxServerLocation.type===1">
          <a-input
            v-model="nginxServerLocation.proxyPass"
          />
        </a-form-item>

        <a-form-item label="通讯协议" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" v-if="nginxServerLocation.type!=0">
          <a-select
            v-model="nginxServerLocation.proxyPassPrefix"
          >
            <a-select-option :value="0">http</a-select-option>
            <a-select-option :value="1">https</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          v-for="(k, index) in nginxServerLocation.extendList"
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
            v-if="nginxServerLocation.extendList.length > 0"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="nginxServerLocation.extendList.length === 0"
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
  import { nginxServerAdd,nginxUpstreamAll,nginxServerLocationAdd } from '@/api/nginx'
  import { nginxStaticList } from '@/api/nginxStatic'
  let id = 0
  export default {
    name: 'nginxServerLocationAdd',
    props: {
      hostServerId: null,
      nginxServerId: null,
      nginxConfId: null,
      nginxServerLocationP: {},
    },
    data () {
      return {
        spinning: false,
        nginxServerLocationForm: this.$form.createForm(this),
        nginxServerLocation: {type:0,extendList:[]},
        nginxStaticList: [],
        nginxUpstreamList:[]
      }
    },
    created () {
      id = 0
      if (this.nginxServerLocationP.nginxServerLocationId !== undefined){
        this.nginxServerLocation = this.nginxServerLocationP
      }
      this.first()
    },
    methods: {
      first () {

        nginxStaticList({ hostServerId: this.hostServerId }).then(rst => {
          this.nginxStaticList = rst.result
        })
        nginxUpstreamAll({ hostServerId: this.hostServerId }).then(rst => {
          this.nginxUpstreamList = rst.result.data
        })

        id += this.nginxServerLocation.extendList.length
        let extendList = []
        for (let i = 0; i < this.nginxServerLocation.extendList.length; i++) {
          extendList.push(i)
          this.nginxServerLocationForm.getFieldDecorator('name[' + i + ']', {
            initialValue: this.nginxServerLocation.extendList[i],
            preserve: true
          })

        }
        this.nginxServerLocation.extendList = extendList

      },
      submit11 () {
        if (this.nginxServerLocation.nginxServerId === undefined) {
          this.nginxServerLocation.hostServerId = this.hostServerId
          this.nginxServerLocation.nginxConfId = this.nginxConfId
          this.nginxServerLocation.nginxServerId = this.nginxServerId
        }
        let param = this.nginxServerLocationForm.getFieldsValue()
        let extendList = []
        this.nginxServerLocation.extendList.forEach(it => {
          extendList.push(param.name[it])
        })
        this.nginxServerLocation.extendList = extendList
        this.spinning = true
        nginxServerLocationAdd(this.nginxServerLocation).then(rst => {
          this.$notification.success({
            message: '操作成功'
          })
          this.channel()
        })

      },
      remove(k) {
        const keys = this.nginxServerLocation.extendList
        this.nginxServerLocation.extendList = keys.filter(key => key !== k)
      },

      add() {
        console.log(this.nginxServerLocation)
        const keys = this.nginxServerLocation.extendList
        const nextKeys = keys.concat(id++)
        this.nginxServerLocation.extendList = nextKeys
      },
      channel () {
        this.$emit('nginxServerLocationAddCancel') // 将改变通知父组件(保证父子组件数据一致)
      }
    }

  }
</script>

<style scoped>

</style>