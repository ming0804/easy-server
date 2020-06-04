<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
              <a-input placeholder="请输入"  v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择"   v-model="queryParam.status">
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)" v-if="checkPermission(['role-get'])">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button style="margin-left: 8px" @click="showModal"  v-if="checkPermission(['role-add'])">新增角色</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.baseRoleId"
      :columns="columns"
      :data="loadData"
    >

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :span="4">
              <span>{{ role.name }}：</span>
            </a-col>
            <a-col :span="20" v-if="role.actionEntitySet.length > 0">
              <a-tag color="cyan" v-for="(action, k) in role.actionEntitySet" :key="k">{{ action.describe }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)"  v-if="checkPermission(['role-update'])">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm title="确定删除？？" @confirm="del(record)" okText="Yes"
                      cancelText="No">
               <a href="javascript:;"  v-if="checkPermission(['role-delete'])">删除</a>
        </a-popconfirm>

      </span>
    </s-table>


    <a-modal
      v-model="visible"
      v-if="visible"
      title="操作"
      onOk="handleOk"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      width="75%"
    >
      <roleDo :baseRoleId="baseRoleId" @handleCancel="handleCancel"/>
    </a-modal>
  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import roleDo from './roleDo'
  import checkPermission from '@/utils/permission'
  import { roleDel } from '@/api/role'

  export default {
    name: 'index',
    components: {
      STable,
      roleDo
    },
    data () {
      return {
        visible: false,

        form: null,
        mdl: {},

        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '角色名称',
            dataIndex: 'name'
          },
          {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '创建时间',
            dataIndex: 'createdTime',
            sorter: true
          }, {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.post('/role/list',
            Object.assign(parameter, this.queryParam)
          ).then(res => {
            return res.result
          })
        },

        selectedRowKeys: [],
        selectedRows: [],
        baseRoleId: undefined
      }
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '正常',
          1: '禁用'
        }
        return statusMap[status]
      }
    },
    methods: {
      checkPermission,
      onChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },

      showModal (row) {
        if (row !== undefined) {
          this.baseRoleId = row.baseRoleId
        }
        this.visible = true
      },
      handleCancel (e) {
        this.visible = false
        this.$refs.table.refresh(true)
      },
      del (o) {
        roleDel({ baseRoleId: o.baseRoleId }).then(rst => {
          this.$notification.success({
            message: '成功',
            description: `删除成功`
          })
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
