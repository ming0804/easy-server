<template>
  <a-spin :spinning="spinning" tip="执行中...">


  <a-table :columns="columns" :dataSource="data"
           :pagination="pagination"
           :loading="loading"
           @change="handleTableChange"
           class="components-table-demo-nested">

    <a slot="operation" slot-scope="text">
      <a-popconfirm title="确定删除？？" @confirm="goDeployJarPackDel(text)" okText="Yes"
                    cancelText="No">
        <a href="javascript:;" v-if="checkPermission(['deployJar-delete'])">删除</a>
      </a-popconfirm>
    </a>

  </a-table>
  </a-spin>
</template>

<script>
  import checkPermission from '@/utils/permission'

  const columns = [
    { title: 'id', dataIndex: 'deployJarPackId', key: 'deployJarPackId' },
    { title: '描述', dataIndex: 'descripe', key: 'descripe' },
    { title: 'jar包版本', dataIndex: 'version', key: 'version' },
    { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime' },
    { title: 'Action', key: 'operation', scopedSlots: { customRender: 'operation' } }
  ]
  export default {
    name: 'deployJarPackPage',
    props: {
      deployJar: {}
    },
    data() {
      return {
        spinning: false,
        data: [],
        columns,
        pagination: { pageSize: 10, current: 1 },
        loading: false
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      checkPermission,
      handleTableChange(pagination, filters, sorter) {
        console.log(pagination)
        // const pager = { ...this.pagination }
        // pager.current = pagination.current
        // this.pagination = pager
        // this.fetch({
        //   pageSize: pagination.pageSize,
        //   pageNo: pagination.current,
        //   sortField: sorter.field,
        //   sortOrder: sorter.order,
        //   ...filters
        // })
        this.pagination = pagination
        this.fetch()
      },
      fetch(params = {}) {
        console.log(this.pagination)
        this.loading = true
        this.$http.post('/deployJar/packPage',
          {
            ...params, ...this.queryParam, ...{
              deployJarId: this.deployJar.deployJarId,
              pageNo: this.pagination.current,
              pageSize: this.pagination.pageSize
            }
          }
        ).then(data => {
          const pagination = { ...this.pagination }
          pagination.total = data.result.totalCount
          this.loading = false
          this.data = data.result.data
          this.pagination = pagination
        })
      },
      goDeployJarPackDel(row) {
        this.spinning = true
        this.$http.post('/deployJar/delJarPack',
          { ...row }
        ).then(data => {
          this.spinning = false
          this.$notification.info({
            message: '删除成功'
          })
          this.fetch()
        }).catch(e => {
          this.spinning = false
          this.fetch()
        })
      }
    }
  }
</script>

<style scoped>

</style>