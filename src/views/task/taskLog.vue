<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">

            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="请选择" v-model="queryParam.status">
                  <a-select-option :value="0">执行中</a-select-option>
                  <a-select-option :value="1">正常结束</a-select-option>
                  <a-select-option :value="2">异常结束</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="fetch()" >查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :columns="columns" :dataSource="data"
               :pagination="pagination"
               :rowKey="(record) => record.clientTaskHistoryId"
               :loading="loading"
               @change="handleTableChange"
               class="components-table-demo-nested">
    <span slot="status" slot-scope="text">

      <a-tag :color="text===0 ?'geekblue' : (text ===1?'blue':'red')">
          {{ text | statusFilter }}
          </a-tag>
      </span>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
  import { STable } from '@/components'
  export default {
    name: 'taskDo',
    components: {
      STable,
    },
    props: {
      clientTaskId: undefined
    },
    data () {
      return {
        spinning: false,
        queryParam: {},
        data: [],
        columns: [
          { title: '任务日志id', dataIndex: 'clientTaskHistoryId', key: 'clientTaskHistoryId' },
          { title: '任务名称', dataIndex: 'name', key: 'name' },
          { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
          { title: '开始执行时间', dataIndex: 'createdTime', key: 'createdTime' },
          { title: '执行时长(毫秒)', dataIndex: 'time', key: 'time' },
          { title: '描述', dataIndex: 'reason', key: 'reason' },
        ],
        pagination: { pageSize: 10 },
        loading: false
      }
    },
    created () {
    this.fetch()
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '执行中',
          1: '正常结束',
          2: '异常结束'
        }
        return statusMap[status]
      }
    },
    methods: {
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
        params.clientTaskId = this.clientTaskId
        this.$http.post('/task/logPage',
          { ...params, ...this.queryParam }
        ).then(data => {
          const pagination = { ...this.pagination }
          pagination.total = data.result.totalCount
          this.loading = false
          this.data = data.result.data
          this.pagination = pagination
        })
      },
      channel () {
        this.$emit('handleCancel')
      }
    }
  }
</script>

<style scoped>

</style>