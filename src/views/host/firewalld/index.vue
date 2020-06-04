<template>
  <a-spin :spinning="spinning" tip="执行中...">
    <a-card :bordered="false" :style="{ height: '100%' }">

      防火墙状态：{{hostServer.firewalldStatus | statusFilter}}
      <a-button type="primary" @click="stopFirewalld()" style="margin-left: 20px">{{hostServer.firewalldStatus |
        startFilter}}
      </a-button>
      <a-button type="primary" @click="getHostServer()" style="margin-left: 20px"  v-if="checkPermission(['firewalld-get'])">刷新</a-button>

      <div style="margin-top: 20px" v-show="hostServer.firewalldStatus===1">

        <a-button type="primary" @click="toFirewalldAdd()" style="margin-bottom: 20px"  v-if="checkPermission(['firewalld-add'])">添加白名单</a-button>
        <s-table
          ref="firewalldTable"
          size="default"
          :rowKey="(record) => record.firewalldPortId"
          :columns="firewalldColumns"
          :data="nginxServerData"
        >
          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确定删除？？" @confirm="del(record)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;"  v-if="checkPermission(['firewalld-delete'])">移除</a>
            </a-popconfirm>
          </span>
        </s-table>

      </div>
      <!--添加-->
      <a-modal
        v-model="firewalldAddvisible"
        v-if="firewalldAddvisible"
        title="操作"
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        width="700px"
      >

        <firewalldAddvue :hostServerId="hostServerId" @firewalldAddChannl="firewalldAddChannl"></firewalldAddvue>

      </a-modal>

      <!--添加-->
      <!--    <a-modal-->
      <!--      v-model="toNginxStaticUploadvisible"-->
      <!--      v-if="toNginxStaticUploadvisible"-->
      <!--      title="操作"-->
      <!--      :footer="null"-->
      <!--      :keyboard="false"-->
      <!--      :maskClosable="false"-->
      <!--      width="75%"-->
      <!--    >-->
      <!--      <nginxStaticUpload :hostServerId="hostServerId" :nginxStatic="nginxStatic" @nginxStaticUploadCancel="nginxStaticUploadCancel"/>-->
      <!--    </a-modal>-->

    </a-card>
  </a-spin>
</template>

<script>
  import { STable } from '@/components'
  import { hostServerGet } from '@/api/hostServer'
  import { stopandstartFirewalld, firewalldDel } from '@/api/firewalld'
  import firewalldAddvue from './firewalldAdd'
  import checkPermission from '@/utils/permission'
  export default {
    name: 'index',
    components: {
      STable,
      firewalldAddvue
    },
    data () {
      return {
        spinning: false,
        hostServerId: undefined,
        hostServerList: [],
        firewalldColumns: [
          { title: '描述', dataIndex: 'desc' },
          { title: '端口号', dataIndex: 'port' },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        nginxServerData: parameter => {
          if (this.hostServerId === undefined) {
            return {}
          }
          return this.$http.post('/firewalldPort/list',
            Object.assign(parameter, { hostServerId: this.hostServerId })
          ).then(res => {
            return res.result
          })
        },
        hostServer: {},
        firewalldAddvisible: false

      }
    },
    created () {
      window.addEventListener('setItem', this.getHostServerId)
      this.getHostServerId()
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '未开启',
          1: '已开启'
        }
        return statusMap[status]
      },
      startFilter (status) {
        const statusMap = {
          0: '开启',
          1: '关闭'
        }
        return statusMap[status]
      }
    },
    methods: {
      checkPermission,
      getHostServerId () {
        let hostServerId = sessionStorage.getItem('watchStorage')
        if (hostServerId === null || hostServerId === undefined) {

        } else {
          this.hostServerId = parseInt(hostServerId)
          this.getHostServer()
        }
      },
      // first () {
      //   hostServerAll().then(rst => {
      //     this.hostServerList = rst.result
      //     if (this.hostServerList.length > 0) {
      //       this.hostServerId = this.hostServerList[0].value
      //       this.getHostServer()
      //     }
      //   })
      // },
      // selectChange (value) {
      //   this.hostServerId = value
      //   this.getHostServer()
      // },
      getHostServer () {
        hostServerGet({ hostServerId: this.hostServerId }).then(res => {
          this.hostServer = res.result
          this.$refs.firewalldTable.refresh(true)
        })
      },
      del (o) {
        this.spinning = true
        firewalldDel(o).then(rst => {
          this.getHostServer()
          this.spinning = false
        })
      },
      stopFirewalld () {
        this.spinning = true
        stopandstartFirewalld({ hostServerId: this.hostServerId }).then(rst => {
          this.getHostServer()
          this.spinning = false
        })
      },
      toFirewalldAdd () {
        this.firewalldAddvisible = true
      },
      firewalldAddChannl () {
        this.firewalldAddvisible = false
        this.getHostServer()
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