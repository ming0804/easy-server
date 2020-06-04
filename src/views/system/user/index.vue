<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名称">
              <a-input placeholder="请输入" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-model="queryParam.status">
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)" v-if="checkPermission(['user-get'])">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button type="primary" style="margin-left: 8px" @click="showModal" v-if="checkPermission(['user-add'])">新增用户</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.baseUserId"
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
        <a @click="showModal(record)" v-if="checkPermission(['user-update'])">编辑</a>
            <a-divider type="vertical"/>
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
               <a @click="dostatus(record)"  v-if="checkPermission(['user-update'])">{{record.status | doNameFilter}}</a>
            </a-menu-item>
            <a-menu-item>
                <a @click="showPassword(record)"  v-if="checkPermission(['user-update'])">重置密码</a>

            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <!--修改 添加用户-->
    <a-modal
      v-model="visible"
      v-if="visible"
      title="操作"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      width="75%"
    >
      <userDo :baseUserId="baseUserId" @handleCancel="handleCancel"/>
    </a-modal>
    <a-modal
      v-model="visiblepassword"
      v-if="visiblepassword"
      title="修改密码"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <a-input placeholder="请输入密码" v-model="password"/>
      <a-divider/>
      <div style="align-content: center">
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="quitPassword"
        >
          取消
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          :style="{ marginLeft: '8px' }"
          @click="commitPassword"
        >
          提交
        </a-button>
      </div>

    </a-modal>

  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import userDo from './userDo'
  import checkPermission from '@/utils/permission'
  import { userEdit, userEditPassword } from '@/api/user'

  export default {
    name: 'index',
    components: {
      STable,
      userDo
    },
    data () {
      return {
        visible: false,
        visiblepassword: false,
        password: '',
        form: null,
        mdl: {},

        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '用户名',
            dataIndex: 'name'
          },
          {
            title: '手机号',
            dataIndex: 'phone'
          },
          {
            title: '邮箱',
            dataIndex: 'email'
          },
          {
            title: '角色名称',
            dataIndex: 'role.name'
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
          return this.$http.post('/baseUser/list',
            Object.assign(parameter, this.queryParam)
          ).then(res => {
            return res.result
          })
        },

        selectedRowKeys: [],
        selectedRows: [],
        baseUserId: undefined,
        baseUserIdPassword: undefined
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
      doNameFilter (status) {
        const statusMap = {
          0: '禁用',
          1: '启用'
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
          this.baseUserId = row.baseUserId
        }
        this.visible = true
      },
      showPassword (o) {
        this.baseUserIdPassword = o.baseUserId
        this.visiblepassword = true
      },
      handleCancel (e) {
        this.visible = false
        this.baseUserId = undefined
        this.$refs.table.refresh(true)
      },
      //修改状态
      dostatus (o) {
        let status = 1
        if (o.status === 1) {
          status = 0
        }
        userEdit({ baseUserId: o.baseUserId, status: status }).then(rst => {
          this.$notification.success({
            message: '成功',
            description: `操作成功`
          })
          this.$refs.table.refresh(true)
        })
      },
      //修改密码
      commitPassword () {
        userEditPassword({ baseUserId: this.baseUserIdPassword, password: this.password }).then(rst => {
          this.$notification.success({
            message: '成功',
            description: `修改成功`
          })
          this.visiblepassword = false
          this.password = ''
          this.$refs.table.refresh(true)
        })
      },
      //退出修改密码界面
      quitPassword () {
        this.password = ''
        this.visiblepassword = false
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
