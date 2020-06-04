<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="名称">
                  <a-input placeholder="请输入" v-model="queryParam.name"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select placeholder="请选择" v-model="queryParam.status">
                    <a-select-option :value="0">启动</a-select-option>
                    <a-select-option :value="1">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)"  v-if="checkPermission(['hostUser-get'])">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                            <a-button type="primary" style="margin-left: 8px" @click="toHostUserDo({})"  v-if="checkPermission(['hostUser-add'])">添加用户</a-button>
            </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <s-table
          ref="table"
          size="default"
          :rowKey="(record) => record.hostUserId"
          :columns="columns"
          :data="loadData"
        >


          <span slot="action" slot-scope="text, record">
        <a @click="toHostUserDo(record)"  v-if="checkPermission(['hostUser-update'])">编辑</a>
        <a-divider type="vertical"/>
         <a-popconfirm title="确定删除？？" @confirm="toHostUserDel(record)" okText="Yes"
                       cancelText="No">
              <a href="javascript:;"  v-if="checkPermission(['hostUser-delete'])">删除</a>
               </a-popconfirm>

      </span>
        </s-table>

        <a-modal
          v-model="visible"
          v-if="visible"
          title="操作"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          width="75%"
        >
          <HostUserDo :hostServerId="hostServerId" :hostUser="hostUser" @handleCancel="handleCancel"/>
        </a-modal>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
  import { STable } from '@/components'
  import HostUserDo from './HostUserDo'
  import {hostUserDel} from '@/api/hostUserGroup'
  import checkPermission from '@/utils/permission'

  export default {
    name: 'index',
    components: {
      STable,
      HostUserDo
    },
    data () {
      return {
        visible: false,
        spinning: false,
        hostServerId: undefined,
        columns: [
          { title: '用户名', dataIndex: 'username' },
          { title: '主组名称', dataIndex: 'mainGroup' },
          { title: '其他组名称', dataIndex: 'otherGroup' },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        data: [],
        queryParam: {},
        loadData: parameter => {
          if (this.hostServerId === undefined) {
            return {}
          } else {
            this.queryParam.hostServerId = this.hostServerId
            return this.$http.post('/hostUser/page',
              Object.assign(parameter, this.queryParam)
            ).then(res => {
              return res.result
            })
          }
        },
        hostUser:{}
      }
    },
    mounted () {
      window.addEventListener('setItem', this.getHostServerId)
      this.getHostServerId()
    },
    methods: {
      checkPermission,
      getHostServerId () {
        let hostServerId = sessionStorage.getItem('watchStorage')
        if (hostServerId === null || hostServerId === undefined) {
          this.hostServerId = 0
        } else {
          this.hostServerId = parseInt(hostServerId)

        }
        this.$refs.table.refresh(true)
      },
      toHostUserDo(row){
        this.hostUser = row
        this.visible = true
      },
      handleCancel () {
        this.visible = false
        this.getHostServerId()
      },
      toHostUserDel(o){
        this.spinning = true
        hostUserDel(o).then(rst =>{
          this.spinning = false
          this.$notification.success({
            message: '成功',
          })
          this.getHostServerId()
        })
      }
    },
    beforeDestroy () {
      window.removeEventListener('setItem', this.getHostServerId)
    }

  }
</script>

<style scoped>

</style>