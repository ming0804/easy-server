<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="名称">
                  <a-input placeholder="请输入" v-model="queryParam.descripe"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="环境">
                  <a-select placeholder="请选择" v-model="queryParam.tag" @change="tagChange">
                    <a-select-option :value="0">测试</a-select-option>
                    <a-select-option :value="1">正式</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="fetch({pageNo:pagination.current})"
                        v-if="checkPermission(['deployJar-get'])">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {tag:0}">重置</a-button>
                            <a-button type="primary" style="margin-left: 8px" @click="toDeployJar({})"
                                      v-if="checkPermission(['deployJar-add'])">新添项目</a-button>
            </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <a-table :columns="columns" :dataSource="data"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange"
                 class="components-table-demo-nested">
    <span slot="type" slot-scope="text">
        {{ text | typeFilter }}
      </span>
          <a slot="operation" slot-scope="text">
            <a @click="toDeployJar(text)" v-if="checkPermission(['deployJar-update'])">编辑</a>
            <a-divider type="vertical"/>
            <a @click="toCommonFile(text)" v-if="checkPermission(['deployJar-update'])">通用文件管理</a>
            <a-divider type="vertical"/>
            <a @click="toUploadJar(text)" v-if="checkPermission(['deployJar-update'])">上传jar包</a>
            <a-divider type="vertical"/>
            <a @click="toDeployJarPackPage(text)" v-if="checkPermission(['deployJar-update'])">jar包管理</a>
            <a-divider type="vertical"/>
            <a @click="toDeployHost(text,{})" v-if="checkPermission(['deployJar-update'])">服务部署</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除？？" @confirm="goDeployJarDel(text)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;" v-if="checkPermission(['deployJar-delete'])">删除</a>
            </a-popconfirm>
          </a>
          <a-table
            slot="expandedRowRender"
            slot-scope="text"
            :columns="innerColumns"
            :dataSource="text.children1"
            :pagination="false"
          >
            <span slot="status" slot-scope="text">
              <a-tag
                :color="text.status===1 ?'green' : 'geekblue'"
              >
                {{text.status | statusFilter}}
              </a-tag>
            </span>
            <span slot="c_operation" slot-scope="text1" class="table-operation">
              <a @click="toDeployHost(text,text1)" v-if="checkPermission(['deployJar-update'])">编辑</a>
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item v-if="text1.status===1">
                      <a @click="goDeployHostStart(text1)" v-if="checkPermission(['deployJar-update'])">重启</a>
                  </a-menu-item>
                  <a-menu-item v-if="text1.status===0">
                      <a @click="goDeployHostStart(text1)" v-if="checkPermission(['deployJar-update'])">启动</a>
                  </a-menu-item>
                  <a-menu-item v-if="text1.status===1">
                      <a @click="goDeployJarHostStop(text1)" v-if="checkPermission(['deployJar-update'])">关闭</a>
                  </a-menu-item>
                  <a-menu-item>
                        <a-popconfirm title="删除会关闭程序 并删除文件，确定删除？？" @confirm="godeployJarHostDel(text1)" okText="Yes"
                                      cancelText="No">
                      <a v-if="checkPermission(['deployJar-delete'])">删除</a>
                          </a-popconfirm>
                  </a-menu-item>
                </a-menu>
                <a> 更多 <a-icon type="down"/> </a>
              </a-dropdown>
            </span>
          </a-table>
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
          <deployJarAddOrUpdate :deployJar="deployJar" @handleCancel="handleCancel"/>
        </a-modal>
        <a-modal
          v-model="visibleupload"
          v-if="visibleupload"
          title="操作"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          width="75%"
        >
          <uploadJar :deployJar="deployJar" @handleCanceluploadJar="handleCanceluploadJar"/>
        </a-modal>
        <a-modal
          v-model="visibleDeployHost"
          v-if="visibleDeployHost"
          title="部署服务"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          width="75%"
        >
          <deployHost :deployJar="deployJar" :deployJarHost="deployJarHost"
                      @handleCanceluploadJar="handleCanceluploadJar"/>
        </a-modal>
        <a-modal
          v-model="visibleDeployHostList"
          v-if="visibleDeployHostList"
          title="服务详情页"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          width="75%"
        >
          <deployHostList :deployJar="deployJar" @handleCanceluploadJar="handleCanceluploadJar"/>
        </a-modal>
        <a-modal
          v-model="deployJarPackPageVisible"
          v-if="deployJarPackPageVisible"
          title="项目jar包管理页"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          width="75%"
        >
          <deployJarPackPage :deployJar="deployJar" @channelDeployJarPackPage="channelDeployJarPackPage"/>
        </a-modal>
        <a-modal
          v-model="commonFileVisible"
          v-if="commonFileVisible"
          title="通用文件管理"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          width="75%"
        >
          <deployJarCommonFile :deployJar="deployJar" @channelCommonFile="channelCommonFile"/>
        </a-modal>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
  import { STable } from '@/components'
  import deployJarAddOrUpdate from './deployJarAddOrUpdate'
  import uploadJar from './uploadJar'
  import deployHost from './deployHost'
  import deployJarCommonFile from './deployJarCommonFile'
  import deployJarPackPage from '@/views/host/deployJar/deployJarPackPage'
  import checkPermission from '@/utils/permission'
  import { deployJarHostStart, deployJarHostDel, deployJarHostStop, deployJarDel } from '@/api/deployJar'

  const columns = [
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
    { title: '描述', dataIndex: 'descripe', key: 'descripe' },
    { title: '类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
    { title: 'jar包版本', dataIndex: 'version', key: 'version' },
    { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime' },
    { title: 'Action', key: 'operation', scopedSlots: { customRender: 'operation' } }
  ]

  const innerColumns = [
    { title: '描述', dataIndex: 'descripe', key: 'c-descripe' },
    { title: '状态', key: 'state', scopedSlots: { customRender: 'status' } },
    { title: '服务ip', dataIndex: 'ip', key: 'c_ip' },
    { title: '指定端口', dataIndex: 'port', key: 'c_port' },
    { title: '包版本', dataIndex: 'version', key: 'c_version' },
    { title: '创建时间', dataIndex: 'createdTime', key: 'c_createdTime' },
    { title: '更新时间', dataIndex: 'updatedTime', key: 'c_updatedTime' },
    {
      title: 'Action',
      key: 'c_operation',
      scopedSlots: { customRender: 'c_operation' }
    }
  ]

  export default {
    name: 'index',
    components: {
      STable,
      deployJarAddOrUpdate,
      uploadJar,
      deployHost,
      deployJarCommonFile,
      deployJarPackPage
    },
    data() {
      return {
        visible: false,
        spinning: false,
        queryParam: {tag:0},
        data: [],
        columns,
        pagination: { pageSize: 4, current: 1 },
        loading: false,
        innerColumns,
        deployJar: {},
        visibleupload: false,
        visibleDeployHost: false,
        visibleDeployHostList: false,
        deployJarHost: {},
        deployJarPackPageVisible: false,
        commonFileVisible:false,
      }
    },
    created() {
      this.fetch({ pageNo: this.pagination.current })
    },
    filters: {
      typeFilter(status) {
        const statusMap = {
          0: 'ktor项目',
          1: 'springboot项目'
        }
        return statusMap[status]
      },
      statusFilter(status) {
        const statusMap = {
          0: '未启动',
          1: '已启动'
        }
        return statusMap[status]
      }
    },
    methods: {
      checkPermission,
      tagChange(){
        this.fetch()
      },
      handleTableChange(pagination, filters, sorter) {
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
      fetch(params = {}) {
        this.loading = true
        this.$http.post('/deployJar/page',
          { ...params, ...this.queryParam }
        ).then(data => {
          const pagination = { ...this.pagination }
          pagination.total = data.result.totalCount
          this.loading = false
          this.data = data.result.data
          this.pagination = pagination
        })
      },
      toDeployJar(row) {
        this.deployJar = row
        this.visible = true
      },
      handleCancel() {
        this.visible = false
        this.fetch()
      },
      toUploadJar(row) {
        this.deployJar = row
        this.visibleupload = true
      },
      handleCanceluploadJar() {
        this.visibleupload = false
        this.visibleDeployHost = false
        this.visibleDeployHostList = false
        this.fetch()
      },
      toCommonFile(row){
        this.deployJar = row
        this.commonFileVisible = true
      },
      channelCommonFile(){
        this.deployJar = {  }
        this.commonFileVisible = false
        this.fetch()
      },

      goDeployJarDel(o) {  //删除项目
        this.spinning = true
        deployJarDel(o).then(rst => {
          this.spinning = false
          this.$notification.success({
            message: '成功'
          })
          this.fetch()
        })
      },
      toDeployHost(deployJar, deployJarHost) {
        this.deployJar = deployJar
        this.deployJarHost = deployJarHost
        this.visibleDeployHost = true
      },
      goDeployHostStart(row) {
        this.spinning = true
        deployJarHostStart(row).then(rst => {
          this.spinning = false
          this.$notification.success({
            message: '部署成功'
          })
          this.fetch()
        }).catch(e => {
          this.spinning = false
          this.fetch()
        })
      },
      godeployJarHostDel(row) {
        this.spinning = true
        deployJarHostDel(row).then(rst => {
          this.spinning = false
          this.$notification.success({
            message: '删除成功'
          })
          this.fetch()
        }).catch(e => {
          this.spinning = false
          this.fetch()
        })
      },
      goDeployJarHostStop(row) {
        this.spinning = true
        deployJarHostStop(row).then(rst => {
          this.spinning = false
          this.$notification.success({
            message: '停止成功'
          })
          this.fetch()
        }).catch(e => {
          this.spinning = false
          this.fetch()
        })
      },
      toDeployJarPackPage(row) {
        this.deployJar = row
        this.deployJarPackPageVisible = true
      },
      channelDeployJarPackPage() {
        this.deployJarPackPageVisible = false
        this.fetch()
      }
    },
    beforeDestroy() {
    }

  }
</script>

<style scoped>

</style>