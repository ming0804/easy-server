<template>
  <a-card :bordered="false" :style="{ height: '100%' }">

    <div style="margin-top: 20px">

      <a-button type="primary" @click="toNginxStaticAdd()" style="margin-bottom: 20px"  v-if="checkPermission(['static-add'])">添加</a-button>
      <s-table
        ref="staticTable"
        size="default"
        :rowKey="(record) => record.nginxStaticId"
        :columns="nginxStaticColumns"
        :data="nginxServerData"
      >
          <span slot="action" slot-scope="text, record">
<!--            <a @click="toNginxStaticAdd(record)">编辑</a>-->
<!--            <a-divider type="vertical"/>-->
            <a @click="toNginxStaticUpload(record)"  v-if="checkPermission(['static-update'])">部署文件</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除？？" @confirm="deleteDeployFiles(record)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;"  v-if="checkPermission(['static-delete'])">清空已部署文件</a>
            </a-popconfirm>
          </span>
      </s-table>

    </div>
    <!--添加-->
    <a-modal
      v-model="toNginxStaticAddvisible"
      v-if="toNginxStaticAddvisible"
      title="操作"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      width="75%"
    >
      <nginxStaticAdd :hostServerId="hostServerId" :nginxStatic="nginxStatic" @nginxStaticAddCancel="nginxStaticAddCancel"/>
    </a-modal>

    <!--添加-->
    <a-modal
      v-model="toNginxStaticUploadvisible"
      v-if="toNginxStaticUploadvisible"
      title="操作"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      width="75%"
    >
      <nginxStaticUpload :hostServerId="hostServerId" :nginxStatic="nginxStatic" @nginxStaticUploadCancel="nginxStaticUploadCancel"/>
    </a-modal>

  </a-card>
</template>

<script>
  import { hostServerAll } from '@/api/hostServer'
  import nginxStaticAdd from './nginxStaticAdd'
  import nginxStaticUpload from './nginxStaticUpload'
  import pick from 'lodash.pick'
  import { STable } from '@/components'
  import { axios } from '@/utils/request'
  import checkPermission from '@/utils/permission'
  export default {
    name: 'index',
    components: {
      STable,
      nginxStaticAdd,
      nginxStaticUpload
    },
    data () {
      return {
        hostServerId: undefined,
        hostServerList: [],
        nginxStaticColumns: [
          { title: '描述', dataIndex: 'name' },
          { title: '创建日期', dataIndex: 'createdTime' },
          { title: '更新时间', dataIndex: 'updatedTime' },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        nginxServerData: parameter => {
          if (this.hostServerId === undefined) {
            return {}
          }
          return this.$http.post('/nginxStatic/list',
            { hostServerId: this.hostServerId }
          ).then(res => {
            return res.result
          })
        },
        toNginxStaticAddvisible: false,
        toNginxStaticUploadvisible: false,
        nginxStatic: {}
      }
    },
    mounted () {
      window.addEventListener('setItem', this.getHostServerId)
      this.getHostServerId()
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '未安装',
          1: '未启动',
          2: '已启动'
        }
        return statusMap[status]
      }
    },
    methods: {
      checkPermission,
      getHostServerId () {
        let hostServerId = sessionStorage.getItem('watchStorage')
        if (hostServerId === null || hostServerId === undefined){

        }else {
          this.hostServerId = parseInt(hostServerId)
          this.$refs.staticTable.refresh(true)
        }
      },
      // first () {
      //   hostServerAll().then(rst => {
      //     this.hostServerList = rst.result
      //     if (this.hostServerList.length > 0) {
      //       this.hostServerId = this.hostServerList[0].value
      //       this.$refs.staticTable.refresh(true)
      //     }
      //   })
      // },
      // selectChange (value) {
      //   this.hostServerId = value
      //   this.$refs.staticTable.refresh(true)
      // },
      toNginxStaticAdd (o) {
        if (o !== undefined) {
          this.nginxStatic = o
        } else {
          this.nginxStatic = {}
        }
        this.toNginxStaticAddvisible = true
      },
      nginxStaticAddCancel(){
        this.nginxStatic = undefined
        this.toNginxStaticAddvisible = false
        this.$refs.staticTable.refresh(true)
      },
      toNginxStaticUpload (o) {
        if (o !== undefined) {
          this.nginxStatic = o
        } else {
          this.nginxStatic = {}
        }
        this.toNginxStaticUploadvisible = true
      },
      nginxStaticUploadCancel(){
        this.nginxStatic = undefined
        this.toNginxStaticUploadvisible = false
        this.$refs.staticTable.refresh(true)
      },
      deleteDeployFiles(o) {
        axios({
          url: 'nginxStatic/deleteDeployFiles',
          method: 'post',
          data: {
            hostServerId: this.hostServerId,
            nginxStaticId: o.nginxStaticId
          },
          headers: { 'Content-Type': 'application/json' }
        }).then(res => {
          this.$notification.info({
            message:"清空成功"
          })
        }).catch(err => {

        })
      },
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