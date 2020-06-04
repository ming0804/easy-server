<template>
  <div>
    <a-button type="primary" @click="toNginxServerLocationAdd()" style="margin-bottom: 20px">添加</a-button>
    <s-table
      ref="nginxServerLocationListTable"
      size="default"
      :rowKey="(record) => record.nginxServerLocationId"
      :columns="nginxServerLocationColumns"
      :data="nginxServerLocationData"
    >
      <span slot="type" slot-scope="text">
        {{ text | typeFilter }}
      </span>
      <span slot="static" slot-scope="text">
        {{ text | staticFilter }}
      </span>
      <span slot="upstream" slot-scope="text">
        {{ text | staticFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
            <a @click="toNginxServerLocationAdd(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除？？" @confirm="deleteRow(record)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
    </s-table>
    <a-divider/>
    <a-row>
      <a-col
        :span="24"
        :style="{ textAlign: 'right' }"
      >
        <a-button
          @click="channel"
        >
          返回
        </a-button>
      </a-col>
    </a-row>

    <!--    nginx端口路由配置添加-->
    <a-modal
      v-model="nginxServerLocationAddVisible"
      v-if="nginxServerLocationAddVisible"
      title="操作"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      width="75%"
    >
      <nginxServerLocationAdd :hostServerId="hostServerId"
                              :nginxServerId="nginxServerId" :nginxConfId="nginxConfId" :nginxServerLocationP="nginxServerLocation"
                              @nginxServerLocationAddCancel="nginxServerLocationAddCancel"/>
    </a-modal>

  </div>
</template>

<script>
  import { nginxServerAdd } from '@/api/nginx'
  import { STable } from '@/components'
  import nginxServerLocationAdd from './nginxServerLocationAdd'

  export default {
    name: 'nginxServerLocationList',
    props: {
      hostServerId: null,
      nginxConfId: null,
      nginxServerId: undefined
    },
    components: {
      STable,
      nginxServerLocationAdd
    },
    data () {
      return {
        nginxServerLocationColumns: [
          { title: 'url', dataIndex: 'url' },
          { title: '代理类型', dataIndex: 'type', scopedSlots: { customRender: 'type' } },
          { title: '静态文件包', dataIndex: 'static', scopedSlots: { customRender: 'static' } },
          { title: '直接代理地址', dataIndex: 'proxyPass' },
          { title: '负载代理名称', dataIndex: 'upstream', scopedSlots: { customRender: 'upstream' } },
          { title: '创建日期', dataIndex: 'createdTime' },
          { title: '更新日期', dataIndex: 'updatedTime' },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        nginxServerLocationData: parameter => {
          return this.$http.post('/nginxServerLocation/list',
            { hostServerId: this.hostServerId, nginxServerId: this.nginxServerId }
          ).then(res => {
            return res.result
          })
        },
        nginxServerLocationAddVisible: false,
        nginxServerLocation: {}
      }
    },
    filters: {
      staticFilter (o) {
        if (o === undefined || o === null) {
          return ''
        } else {
          return o.name
        }
      },
      typeFilter (type) {
        const statusMap = {
          0: '静态文件代理',
          1: '直接地址转发',
          3: '负载代理'
        }
        return statusMap[type]
      }
    },
    created () {

      this.first()
    },

    methods: {
      first () {
        return '22'
      },
      submit11 () {
        if (this.nginxServer.nginxServerId === undefined) {
          this.nginxServer.hostServerId = this.hostServerId
          this.nginxServer.nginxConfId = this.nginxConfId
        }

        this.spinning = true
        nginxServerAdd(this.nginxServer).then(rst => {
          this.$notification.success({
            message: '操作成功'
          })
          this.channel()
        })

      },
      channel () {
        this.$emit('nginxServerLocationListCancel') // 将改变通知父组件(保证父子组件数据一致)
      },
      toNginxServerLocationAdd (o) {
        if (o !== undefined) {
          this.nginxServerLocation = o
        } else {
          this.nginxServerLocation = {type:0}
        }
        this.nginxServerLocationAddVisible = true
      },
      nginxServerLocationAddCancel () {
        this.nginxServerLocation = {}
        this.nginxServerLocationAddVisible = false
        this.$refs.nginxServerLocationListTable.refresh(true)
      }
    }

  }
</script>

<style scoped>

</style>