<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="任务编码">
                  <a-input placeholder="请输入" v-model="queryParam.name"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="描述">
                  <a-input placeholder="请输入" v-model="queryParam.descripe"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="标签">
                  <a-select mode="tags" style="width: 100%" placeholder="选择标签或者输入标签"  v-model="queryParam.labels">
                    <a-select-option v-for="i in listLabel" :key="i">
                      {{i}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!--              <a-col :md="8" :sm="24">-->
              <!--                <a-form-item label="状态">-->
              <!--                  <a-select placeholder="请选择" v-model="queryParam.status">-->
              <!--                    <a-select-option :value="0">启动</a-select-option>-->
              <!--                    <a-select-option :value="1">禁用</a-select-option>-->
              <!--                  </a-select>-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="fetch()" v-if="checkPermission(['task-get'])">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                            <a-button type="primary" style="margin-left: 8px" @click="toTaskDo({})"
                                      v-if="checkPermission(['task-add'])">新添任务</a-button>
            </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <a-table :columns="columns" :dataSource="data"
                 :pagination="pagination"
                 :rowKey="(record) => record.clientTaskId"
                 :loading="loading"
                 @change="handleTableChange"
                 class="components-table-demo-nested">
    <span slot="type" slot-scope="text">
      <a-tag :color="text===1 ?'blue' : 'geekblue'">
        {{ text | typeFilter }}
      </a-tag>
      </span>
          <span slot="status" slot-scope="text">
            <a-tag :color="text===1 ?'blue' : 'red'">
          {{ text | statusFilter }}
          </a-tag>
          </span>
          <span slot="openFlag" slot-scope="text">
            <a-tag :color="text===1 ?'blue' : 'red'">
          {{ text | openFlagFilter }}
          </a-tag>
      </span>
          <a slot="operation" slot-scope="text">
            <a @click="toTaskDo(text)" v-if="checkPermission(['task-update'])">编辑</a>
            <a-divider type="vertical"/>
            <a @click="toTaskLog(text)" v-if="checkPermission(['task-get'])">执行日志</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除？？" @confirm="delTask(text)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;" v-if="checkPermission(['task-delete'])">删除</a>
            </a-popconfirm>
          </a>

        </a-table>

        <a-modal
          v-model="visible"
          v-if="visible"
          title="操作"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          width="75%"
        >
          <taskDo :task="task" @handleCancel="handleCancel"/>
        </a-modal>
        <a-modal
          v-model="visibleLog"
          v-if="visibleLog"
          title="日志"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          width="75%"
        >
          <taskLog :clientTaskId="task.clientTaskId" @handleCancel="handleCancel"/>
        </a-modal>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
  import taskDo from './taskDo'
  import taskLog from './taskLog'
  import { STable } from '@/components'
  import checkPermission from '@/utils/permission'
  import { taskDel, taskLabel } from '@/api/task'

  const columns = [
    { title: '任务id', dataIndex: 'clientTaskId', key: 'clientTaskId' },
    { title: '任务编码', dataIndex: 'code', key: 'code' },
    { title: '标签', dataIndex: 'label', key: 'label' },
    { title: '描述', dataIndex: 'descripe', key: 'descripe' },
    { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
    { title: '类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
    { title: '时间表达式', dataIndex: 'corn', key: 'corn' },
    { title: '任务开启状态', dataIndex: 'openFlag', key: 'openFlag', scopedSlots: { customRender: 'openFlag' } },
    { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime' },
    { title: '修改时间', dataIndex: 'updatedTime', key: 'updatedTime' },
    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
  ]
  export default {
    name: 'index',
    components: {
      STable,
      taskDo,
      taskLog
    },
    data () {
      return {
        visible: false,
        spinning: false,
        queryParam: {},
        data: [],
        columns,
        pagination: { pageSize: 10 },
        loading: false,
        task: {},
        listLabel:[],
        visibleLog: false
      }
    },
    created () {
      taskLabel().then(rst =>{
        this.listLabel = rst.result
      })
      this.fetch()
    },
    filters: {
      openFlagFilter (status) {
        const statusMap = {
          0: '已关闭',
          1: '已开启'
        }
        return statusMap[status]
      },
      typeFilter (status) {
        const statusMap = {
          0: '相同时间可重复执行',
          1: '相同时间不可重复执行'
        }
        return statusMap[status]
      },
      statusFilter (status) {
        const statusMap = {
          0: '客户端未注册',
          1: '客户端已注册'
        }
        return statusMap[status]
      }
    },
    methods: {
      checkPermission,
      handleTableChange (pagination, filters, sorter) {
        console.log(pagination)
        const pager = { ...this.pagination }
        pager.current = pagination.current
        this.pagination = pager
        this.fetch({
          pageSize: pagination.pageSize,
          pageNo: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters
        })
      },

      fetch (params = {}) {
        this.loading = true
        this.$http.post('/task/page',
          { ...params, ...this.queryParam }
        ).then(data => {
          const pagination = { ...this.pagination }
          pagination.total = data.result.totalCount
          this.loading = false
          this.data = data.result.data
          this.pagination = pagination
        })
      },
      toTaskDo (row) {
        this.task = row
        this.visible = true
      },
      handleCancel () {
        this.visible = false
        this.fetch()
      },
      toTaskLog (row) {
        this.task = row
        this.visibleLog = true
      },
      delTask (row) {
        this.spinning = true
        taskDel(row).then(rst => {
          this.$notification.success({
            message: '删除成功'
          })
          this.spinning = false
          this.fetch()
        }).catch(e => {
          this.spinning = false
        })
      }

    },
    beforeDestroy () {
    }

  }
</script>

<style scoped>

</style>