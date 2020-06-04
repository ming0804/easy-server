<template>
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
              <a-button type="primary" @click="$refs.table.refresh(true)" v-if="checkPermission(['permission-get'])">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button type="primary" style="margin-left: 8px" @click="toAddPage"  v-if="checkPermission(['permission-add'])">添加权限</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.baseModuleId"
      :columns="columns"
      :data="loadData"
    >

      <span slot="actions" slot-scope="text, record">
        <a-tag v-for="(action, index) in record.actionData" :key="index">{{ action.describe }}</a-tag>
      </span>

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-if="checkPermission(['permission-update'])">编辑</a>
        <a-divider type="vertical"/>
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">

            <a-menu-item>
              <a-popconfirm title="确认操作？？" @confirm="statusUpdate(record)" okText="Yes"
                            cancelText="No">
              <a href="javascript:;" v-if="checkPermission(['permission-update'])">{{record.status  | actionStatusFilter}}</a>
                </a-popconfirm>
            </a-menu-item>
             <a-menu-item>
                  <a-popconfirm title="确定删除？？" @confirm="deleteRow(record)" okText="Yes"
                                cancelText="No">
              <a href="javascript:;" v-if="checkPermission(['permission-update'])">删除</a>
                     </a-popconfirm>
            </a-menu-item>



          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <a-modal
      title="操作"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="唯一识别码"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="唯一识别码" v-model="mdl.code" id="no" :disabled="disabled"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限名称"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="起一个名字" v-model="mdl.name" id="permission_name"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          hasFeedback
          validateStatus="warning"
        >
          <a-select v-model="mdl.status">
            <a-select-option :value="0">正常</a-select-option>
            <a-select-option :value="1">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          hasFeedback
        >
          <a-textarea :rows="5" v-model="mdl.describe" placeholder="..." id="describe"/>
        </a-form-item>

        <a-divider/>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="赋予权限"
          hasFeedback
        >
          <a-select
            style="width: 100%"
            mode="multiple"
            v-model="mdl.actions"
            :allowClear="true"
          >
            <a-select-option v-for="(action, index) in permissionList" :key="index" :value="action.value">{{
              action.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import checkPermission from '@/utils/permission'
  import { edit, add } from '@/api/permission'

  export default {
    name: 'permissionIdex',
    components: {
      STable
    },
    data () {
      return {

        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        form: null,
        mdl: {},
        //添加和编辑的可用不可用
        disabled: true,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '唯一识别码',
            dataIndex: 'code'
          },
          {
            title: '权限名称',
            dataIndex: 'name'
          },
          {
            title: '可操作权限',
            dataIndex: 'actionData',
            scopedSlots: { customRender: 'actions' }
          },
          {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // 向后端拉取可以用的操作列表
        permissionList: null,
        tableList: [],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.post('/baseModule/list',
            Object.assign(parameter, this.queryParam)
          ).then(res => {
            const result = res.result
            // result.data.map(permission => {
            //   permission.actionList = JSON.parse(permission.actionData)
            //   return permission
            // })
            return result
          })
        },

        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '正常',
          1: '禁用'
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
      this.loadPermissionList()
    },
    methods: {
      checkPermission,
      test (o, status) {

      },
      toAddPage () {
        this.visible = true
        this.disabled = false
        this.mdl = {}
      },
      loadPermissionList () {
        // permissionList
        new Promise(resolve => {
          const data = [
            { label: '新增', value: 'add', defaultChecked: false },
            { label: '查询', value: 'get', defaultChecked: false },
            { label: '修改', value: 'update', defaultChecked: false },
            { label: '删除', value: 'delete', defaultChecked: false },
            { label: '导入', value: 'import', defaultChecked: false },
            { label: '导出', value: 'export', defaultChecked: false }
          ]
          setTimeout(resolve(data), 1500)
        }).then(res => {
          this.permissionList = res
        })
      },
      handleEdit (record) {
        this.disabled = true
        this.mdl = Object.assign({}, record)

        this.visible = true
      },
      handleOk () {

        if (this.mdl.baseModuleId !== undefined) {
          edit(this.mdl).then(res => {
            if (res.status === 1000) {
              this.visible = false
              this.$notification.success({
                message: '成功',
                description: `权限数据修改成功`
              })
              this.$refs.table.refresh(true)
            } else {
              this.$notification.success({
                message: '失败',
                description: res.message
              })
            }
          })
        } else {
          add(this.mdl).then(res => {
            if (res.status === 1000) {
              this.visible = false
              this.$notification.success({
                message: '成功',
                description: `权限数据添加成功`
              })
              this.$refs.table.refresh(true)
            } else {
              this.$notification.success({
                message: '失败',
                description: res.message
              })
            }
          })
        }

      },
      onChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      statusUpdate (e) {
        let status = 1
        if (e.status === 1) {
          status = 0
        }
        edit({ baseModuleId: e.baseModuleId, status: status }).then(res => {
          if (res.status === 1000) {
            this.visible = false
            this.$notification.success({
              message: '成功',
              description: `权限数据修改成功`
            })
            this.$refs.table.refresh(true)
          } else {
            this.$notification.success({
              message: '失败',
              description: res.message
            })
          }
        })
      },
      deleteRow(e) {
        edit({ baseModuleId: e.baseModuleId, delete: 1 }).then(res => {
          if (res.status === 1000) {
            this.visible = false
            this.$notification.success({
              message: '成功',
              description: `权限数据修改成功`
            })
            this.$refs.table.refresh(true)
          } else {
            this.$notification.success({
              message: '失败',
              description: res.message
            })
          }
        })
      },
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
