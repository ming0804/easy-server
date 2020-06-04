<template>
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
              <a-button type="primary" @click="$refs.table.refresh(true)"
                        v-if="checkPermission(['hostserver-get'])">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button type="primary" style="margin-left: 8px" @click="toAddPage"
                        v-if="checkPermission(['hostserver-add'])">添加服务器</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.hostServerId"
        :columns="columns"
        :data="loadData"
      >
      <span slot="firewalldStatus" slot-scope="text">
        {{ text | firewalldStatusFilter }}
      </span>

        <span slot="flag" slot-scope="text">
              <a-tag :color="text===1 ?'red' : 'geekblue'">
                 {{ text | statusFilter }}
              </a-tag>

      </span>


        <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-if="checkPermission(['hostserver-update'])">编辑</a>
        <a-divider type="vertical"/>
        <a @click="refesh(record)" v-if="checkPermission(['hostserver-get'])">刷新机器状态</a>
        <a-divider type="vertical"/>
         <a-popconfirm title="确定删除？？" @confirm="deleteRow(record)" okText="Yes"
                       cancelText="No">
              <a href="javascript:;" v-if="checkPermission(['hostserver-delete'])">删除</a>
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
        <hostserverDo :hostServerId="hostServerId" @handleCancel="handleCancel"/>
      </a-modal>
    </a-card>
  </a-spin>
</template>

<script>
  import { STable } from '@/components'
  import { hostServerRefesh, hostServerDel } from '@/api/hostServer'
  import hostserverDo from './hostserverDo'
  import checkPermission from '@/utils/permission'

  export default {
    name: 'index',
    components: {
      STable,
      hostserverDo
    },
    data () {
      return {
        spinning: false,
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        mdl: {},
        // 查询参数
        queryParam: {},
        hostServerId: undefined,
        // 表头
        columns: [{ title: '服务名称', dataIndex: 'name' },
          { title: '服务ip', dataIndex: 'ip' },
          { title: '防火墙状态', dataIndex: 'firewalldStatus', scopedSlots: { customRender: 'firewalldStatus' } },
          { title: '状态', dataIndex: 'flag', scopedSlots: { customRender: 'flag' } },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        // 向后端拉取可以用的操作列表
        permissionList: null,
        tableList: [],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.post('/hostServer/list',
            Object.assign(parameter, this.queryParam)
          ).then(res => {
            return res.result
          })
        },

        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          1: '断开连接',
          0: '连接正常'
        }
        return statusMap[status]
      },
      firewalldStatusFilter (status) {
        const statusMap = {
          0: '未开启',
          1: '已开启'
        }
        return statusMap[status]
      },
      actionStatusFilter (status) {
        const statusMap = {
          0: '禁用',
          1: '启用'
        }
        return statusMap[status]
      }
    },
    created () {
    },
    methods: {
      checkPermission,
      test (o, status) {

      },
      toAddPage () {
        this.visible = true
        this.mdl = {}
      },

      handleEdit (record) {
        this.hostServerId = record.hostServerId
        this.visible = true
      },
      handleCancel () {
        this.visible = false
        this.hostServerId = undefined
        this.$refs.table.refresh(true)

      },
      deleteRow (e) {
        this.spinning = true
        hostServerDel(e).then(rst => {
          this.spinning = false
          this.$refs.table.refresh(true)
        }).catch(e => {
          this.spinning = false
        })
      },
      refesh (row) {
        this.spinning = true
        hostServerRefesh({ hostServerId: row.hostServerId }).then(rst => {
          this.$notification.success({
            message: '刷新成功'
          })
          this.spinning = false
          this.$refs.table.refresh(true)
        })
      }
    },
    watch: {
      /*
        'selectedRows': function (selectedRows) {
          this.needTotalList = this.needTotalList.map(item => {
            return {
              ...item,
              total: selectedRows.reduce( (sum, val) => {
                return sum + val[item.dataIndex]
              }, 0)
            }
          })
        }
        */
    }
  }
</script>
