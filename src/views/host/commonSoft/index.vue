<template>
  <a-spin :spinning="spinning" tip="执行中...">
    <div id="column1" style="background-color: blue;float:left;width:50%">
      <a-card :bordered="false" :style="{ height: '100%' }">

        <a-button type="primary" @click="getHostServer()" style="margin-left: 20px"   v-if="checkPermission(['commonSoft-get'])">刷新</a-button>
        <div style="margin-top: 20px">

          <a-table
            :columns="columns"
            :rowKey="record => record.name"
            :dataSource="data"
            :pagination="false"
          >
            <template slot="flag" slot-scope="text">
              {{text | statusFilter}}
            </template>

            <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确定安装？？" @confirm="install(record)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;" v-if="record.flag ===0 && checkPermission(['commonSoft-add'])">安装</a>
            </a-popconfirm>
          </span>
          </a-table>

        </div>

      </a-card>
    </div>
    <div id="column2" style="background-color :cyan;float:left;width:50%;height:500px">
      <msg></msg>
    </div>

  </a-spin>
</template>

<script>
  import { hostServerAll } from '@/api/hostServer'
  import { STable } from '@/components'
  import { commonSoftGet, commonSoftInstall } from '@/api/commonSoft'
  import msg from './msg'
  import checkPermission from '@/utils/permission'

  export default {
    name: 'index',
    components: {
      STable,
      msg
    },
    data () {
      return {
        spinning: false,
        hostServerId: undefined,
        hostServerList: [],
        columns: [
          { title: '名称', dataIndex: 'name' },
          { title: '状态', dataIndex: 'flag', scopedSlots: { customRender: 'flag' } },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        data: []

      }
    },
    created () {
      window.addEventListener('setItem', this.getHostServerId)
      this.getHostServerId()
    },
    filters: {
      statusFilter (status) {
        if (status === 0) {
          return '未安装'
        } else if (status === 1) {
          return '已安装'
        } else if (status === 2) {
          return '已启动'
        } else if (status === -1) {
          return '安装中'
        }
      }
    },
    methods: {
      checkPermission,
      getHostServerId () {
        let hostServerId = sessionStorage.getItem('watchStorage')
        if (hostServerId === null || hostServerId === undefined){

        }else {
          this.hostServerId = parseInt(hostServerId)
          this.getHostServer()
        }
      },
      first () {
        hostServerAll().then(rst => {
          this.hostServerList = rst.result
          if (this.hostServerList.length > 0) {
            this.hostServerId = this.hostServerList[0].value
            this.getHostServer()
          }
        })
      },
      selectChange (value) {
        this.hostServerId = value
        this.getHostServer()
      },
      getHostServer () {
        commonSoftGet({ hostServerId: this.hostServerId }).then(res => {
          this.data = res.result
        })
      },
      install (o) {
        this.spinning = true
        commonSoftInstall({ hostServerId: this.hostServerId, name: o.name }).then(rst => {
          this.spinning = false
          this.$notification.success({
            message: '安装中'
          })
          this.getHostServer()
        })
      }

    },

    beforeDestroy () {
      window.removeEventListener('setItem', this.getHostServerId)
    }
  }
</script>

<style scoped>
  .ant-list-item {
    height: 50px;
  }

</style>