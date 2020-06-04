<template>
  <a-spin :spinning="spinning" tip="执行中...">
    <a-card :bordered="false" :style="{ height: '100%' }">

      nginx状态：{{nginxConf.status|statusFilter}}
      <a-popconfirm title="确定操作？？" @confirm="start()" okText="Yes"
                    cancelText="No">
        <a-button type="primary" v-show="nginxConf.status !==0" v-if="checkPermission(['nginx-update'])">
          {{nginxConf.status|doFilter}}
        </a-button>
      </a-popconfirm>
      <div v-show="nginxConf.status !==0" style="margin-top: 20px">


        <a-collapse v-model="activeKey" :destroyInactivePanel="false">
          <a-collapse-panel header="http模块配置文件" key="1" :forceRender="true">
            <div>
              <a-button type="primary" @click="()=>{nginxConfEditvisible = true}"
                        v-if="checkPermission(['nginx-update'])">修改配置
              </a-button>
              <a-form :form="nginxConfForm">
                <a-form-item label="进程数(worker_processes)" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                  <a-input
                    :disabled=true
                    v-decorator="['workerProcesses', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                  />
                </a-form-item>

                <a-form-item label="最大连接数(worker_connections)" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                  <a-input
                    :disabled=true
                    v-decorator="['workerConnections', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                  />
                </a-form-item>
                <a-form-item label="默认返回类型(default_type)" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                  <a-select
                    v-decorator="[ 'defaultType',{ rules: [{ required: true, message: 'Please select your gender!' }] },]"
                    placeholder="Select a option and change input text above"
                    :disabled=true
                  >
                    <a-select-option value="application/octet-stream">
                      application/octet-stream
                    </a-select-option>
                    <a-select-option value="application/json">
                      application/json
                    </a-select-option>
                    <a-select-option value="text/html">
                      text/html
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="单个文件最大值/M(client_max_body_size)" :label-col="{ span: 8 }"
                             :wrapper-col="{ span: 14 }">
                  <a-input
                    v-decorator="['clientMaxBodySize', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                    :disabled=true
                  />
                </a-form-item>
                <a-form-item label="连接保持活动的超时时间(keepalive_timeout)" :label-col="{ span: 8 }"
                             :wrapper-col="{ span: 14 }">
                  <a-input
                    v-decorator="['keepaliveTimeout', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                    :disabled=true
                  />
                </a-form-item>
                <a-form-item label="响应客户端的超时时间(send_timeout)" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                  <a-input
                    v-decorator="['sendTimeout', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                    :disabled=true
                  />
                </a-form-item>

                <a-form-item
                  v-for="(k, index) in nginxConf.extendList"
                  :key="index"
                  :label="'扩展参数'"
                  :required="false"
                  :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"
                >
                  <a-input
                    :value="k"
                    style="width: 60%; margin-right: 8px"
                    :disabled="true"
                  />
                </a-form-item>
              </a-form>
            </div>
          </a-collapse-panel>
          <a-collapse-panel header="server监听端口模块" key="2" :forceRender="true">
            <a-divider>端口监听列表</a-divider>
            <div>
              <a-button type="primary" @click="nginxServerAdd()" style="margin-bottom: 20px"
                        v-if="checkPermission(['nginx-update'])">添加端口监听
              </a-button>
              <s-table
                ref="nginxServerTable"
                size="default"
                :rowKey="(record) => record.nginxServerId"
                :columns="nginxServerColumns"
                :data="nginxServerData"
              >
          <span slot="action" slot-scope="text, record">
            <a @click="nginxServerAdd(record)" v-if="checkPermission(['nginx-update'])">编辑</a>
            <a-divider type="vertical"/>
            <a @click="toNginxServerLocationList(record)">查看路由</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除？？" @confirm="deleteNginxServer(record)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;" v-if="checkPermission(['nginx-update'])">删除</a>
            </a-popconfirm>
          </span>
              </s-table>
            </div>
          </a-collapse-panel>
          <a-collapse-panel header="负载列表" key="3" :forceRender="true">
            <a-divider>负载列表</a-divider>
            <div>
              <a-button type="primary" @click="nginxUpstreamAdd()" style="margin-bottom: 20px"
                        v-if="checkPermission(['nginx-update'])">添加负载名称
              </a-button>
              <s-table
                ref="nginxUpstreamTable"
                size="default"
                :rowKey="(record) => record.nginxUpstreamId"
                :columns="nginxUpstreamColumns"
                :data="nginxUpstreamData"
              >

                <div
                  slot="expandedRowRender"
                  slot-scope="record"
                  style="margin: 0">
                  <a-row
                    :gutter="24"
                    :style="{ marginBottom: '12px' }">
                    <a-col :span="12" v-for="(nginxUpstreamServer, index) in record.nginxUpstreamServerList"
                           :key="index"
                           :style="{ marginBottom: '12px' }">
                      <a-col :span="10">
                        <span>{{ nginxUpstreamServer.name }}：</span>
                      </a-col>
                      <a-col :span="14">
                        <span>{{nginxUpstreamServer.ipport}}</span>
                      </a-col>
                    </a-col>
                  </a-row>
                </div>

                <span slot="action" slot-scope="text, record">
            <a @click="nginxUpstreamAdd(record)" v-if="checkPermission(['nginx-update'])">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除？？" @confirm="delNginxUpstreamDel(record)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;" v-if="checkPermission(['nginx-update'])">删除</a>
            </a-popconfirm>
          </span>
              </s-table>
            </div>
          </a-collapse-panel>
          <a-collapse-panel header="ssl证书" key="4" :forceRender="true">
            <div>
              <a-button type="primary" @click="toNginxSslFileAdd()" style="margin-bottom: 20px"
                        v-if="checkPermission(['nginx-update'])">添加证书
              </a-button>

              <s-table
                ref="nginxSslFileTable"
                size="default"
                :rowKey="(record) => record.nginxSslFileId"
                :columns="nginxSslFileColumns"
                :data="nginxSslFileData"
              >

              </s-table>
            </div>
          </a-collapse-panel>
        </a-collapse>


      </div>
      <!--nginx主配置文件conf-->
      <a-modal
        v-model="nginxConfEditvisible"
        v-if="nginxConfEditvisible"
        title="操作"
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        :closable="false"
        width="75%"
      >
        <nginxConfEdit :hostServerId="hostServerId" @nginxConfEditCancel="nginxConfEditCancel"/>
      </a-modal>
      <!--    nginx端口-->
      <a-modal
        v-model="nginxServerAddVisible"
        v-if="nginxServerAddVisible"
        title="操作"
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        :closable="false"
        width="75%"
      >
        <nginxServerAdd :hostServerId="hostServerId" :nginxConfId="nginxConf.nginxConfId" :nginxServer="nginxServer"
                        @nginxServerAddCancel="nginxServerAddCancel"/>
      </a-modal>
      <!--    nginx负载-->
      <a-modal
        v-model="nginxUpstreamAddVisible"
        v-if="nginxUpstreamAddVisible"
        title="操作"
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        :closable="false"
        width="75%"
      >
        <nginxUpstreamAdd :hostServerId="hostServerId" :nginxConfId="nginxConf.nginxConfId"
                          :nginxUpstream="nginxUpstream"
                          @nginxUpstreamAddCancel="nginxUpstreamAddCancel"/>
      </a-modal>
      <!--    nginx端口路由配置-->
      <a-modal
        v-model="nginxServerLocationListVisible"
        v-if="nginxServerLocationListVisible"
        title="操作"
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        :closable="false"
        width="75%"
      >
        <nginxServerLocationList :hostServerId="hostServerId" :nginxConfId="nginxConf.nginxConfId"
                                 :nginxServerId="nginxServerId"
                                 @nginxServerLocationListCancel="nginxServerLocationListCancel"/>
      </a-modal>
      <a-modal
        v-model="nginxSslFileVisible"
        v-if="nginxSslFileVisible"
        title="操作"
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        :closable="false"
        width="75%"
      >
        <nginxSslFileAdd :hostServerId="hostServerId"
                         @nginxSslFileAddCancel="nginxSslFileAddCancel"/>
      </a-modal>

    </a-card>
  </a-spin>
</template>

<script>
  import { hostServerAll } from '@/api/hostServer'
  import { nginxConfGet, nginxConfStart, nginxServerDel, nginxUpstreamDel } from '@/api/nginx'
  import pick from 'lodash.pick'
  import nginxConfEdit from './nginxConfEdit'
  import nginxServerAdd from './nginxServerAdd'
  import nginxUpstreamAdd from './nginxUpstreamAdd'
  import nginxServerLocationList from './nginxServerLocationList'
  import nginxSslFileAdd from './nginxSslFileAdd'
  import { STable } from '@/components'
  import checkPermission from '@/utils/permission'

  const page = JSON.parse("{\n" +
    "    \"totalCount\": 0,\n" +
    "    \"pageNo\": 1,\n" +
    "    \"pageSize\": 100,\n" +
    "    \"data\": [],\n" +
    "    \"totalPage\": 0,\n" +
    "    \"current\": 1\n" +
    "}")

  export default {
    name: 'index',
    components: {
      nginxConfEdit,
      nginxServerAdd,
      nginxUpstreamAdd,
      nginxServerLocationList,
      STable,
      nginxSslFileAdd
    },
    data() {
      return {
        activeKey: [],
        spinning: false,
        hostServerId: undefined,
        hostServerList: [],
        nginxConf: {},
        nginxConfForm: this.$form.createForm(this),
        nginxConfEditvisible: false,
        nginxServerColumns: [
          { title: '描述', dataIndex: 'name' },
          { title: 'server', dataIndex: 'serverName' },
          { title: '端口号', dataIndex: 'listen' },
          { title: '创建日期', dataIndex: 'createdTime' },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        nginxServerData: parameter => {
          if (this.hostServerId === undefined) {
            return {}
          }
          return this.$http.post('/nginxServer/list',
            { hostServerId: this.hostServerId }
          ).then(res => {
            return res.result
          })
        },
        nginxServerAddVisible: false,
        nginxServer: {},
        nginxUpstreamColumns: [
          { title: '描述', dataIndex: 'name' },
          { title: '唯一编码', dataIndex: 'code' },
          { title: '创建时间', dataIndex: 'createdTime' },
          { title: '更新时间', dataIndex: 'updatedTime' },
          { title: '操作', width: '150px', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        nginxUpstreamData: parameter => {
          // if (this.hostServerId === undefined) {
          //   return {}
          // }
          return this.$http.post('/nginxUpstream/list',
            { hostServerId: this.hostServerId }
          ).then(res => {
            return res.result
          })
        },
        nginxUpstreamAddVisible: false,
        nginxUpstream: {},
        nginxServerId: undefined,
        nginxServerLocationListVisible: false,
        nginxSslFileVisible: false,
        nginxSslFileColumns: [
          { title: 'id', dataIndex: 'nginxSslFileId' },
          { title: '描述', dataIndex: 'descripe' },
          { title: '创建时间', dataIndex: 'createdTime' },
          { title: '更新时间', dataIndex: 'updatedTime' }
        ],
        nginxSslFileData: parameter => {
          if (this.hostServerId === undefined) {
            return page
          }
          console.log(this.hostServerId)
          return this.$http.post('/nginxSslFile/page',
            { hostServerId: this.hostServerId }
          ).then(res => {
            return res.result
          })
        },
      }
    },
    mounted() {
      window.addEventListener('setItem', this.getHostServerId)
      this.getHostServerId()
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '未安装',
          1: '未启动',
          2: '已启动'
        }
        return statusMap[status]
      },
      doFilter(status) {
        const statusMap = {
          1: '启动',
          2: '更新配置'
        }
        return statusMap[status]
      }
    },
    methods: {
      checkPermission,
      getHostServerId() {
        let hostServerId = sessionStorage.getItem('watchStorage')
        if (hostServerId === null || hostServerId === undefined) {

        } else {
          this.hostServerId = parseInt(hostServerId)
          this.getNginx(this.hostServerId)
        }
      },
      // first () {
      //   hostServerAll().then(rst => {
      //     this.hostServerList = rst.result
      //     if (this.hostServerList.length > 0) {
      //       this.hostServerId = this.hostServerList[0].value
      //       this.getNginx(this.hostServerList[0].value)
      //
      //     }
      //   })
      // },
      // selectChange (value) {
      //   this.hostServerId = value
      //   this.getNginx(value)
      // },
      getNginx(hostServerId) {
        nginxConfGet({ hostServerId: hostServerId }).then(rst => {
          this.nginxConf = rst.result
          this.nginxConfForm.setFieldsValue(pick(rst.result, 'workerProcesses', 'workerConnections', 'defaultType', 'clientMaxBodySize', 'keepaliveTimeout', 'sendTimeout'))
          this.$refs.nginxServerTable.refresh(true)
          this.$refs.nginxUpstreamTable.refresh(true)
          this.$refs.nginxSslFileTable.refresh(true)
        })
      },
      nginxConfEditCancel() {
        this.nginxConfEditvisible = false
        this.getNginx(this.hostServerId)
      },
      nginxServerAdd(o) {
        if (o !== undefined) {
          this.nginxServer = o
        } else {
          this.nginxServer = { extendList: [], sslFlag: 0 }
        }
        this.nginxServerAddVisible = true
      },
      nginxServerAddCancel() {
        this.nginxServerAddVisible = false
        this.getNginx(this.hostServerId)
      },
      nginxUpstreamAdd(o) {
        if (o !== undefined) {
          this.nginxUpstream = o
        } else {
          this.nginxUpstream = {}
        }
        this.nginxUpstreamAddVisible = true
      },
      nginxUpstreamAddCancel() {
        this.nginxUpstreamAddVisible = false
        this.getNginx(this.hostServerId)
      },
      toNginxServerLocationList(o) {
        this.nginxServerId = o.nginxServerId
        this.nginxServerLocationListVisible = true
      },
      nginxServerLocationListCancel() {
        this.nginxServerId = undefined
        this.nginxServerLocationListVisible = false
      },
      deleteNginxServer(row) {
        this.spinning = true
        nginxServerDel(row).then(rst => {
          this.getNginx(this.hostServerId)
          this.$notification.success({
            message: '删除成功'
          })
          this.spinning = false
        }).catch(e => {
          this.spinning = false
        })
      },
      delNginxUpstreamDel(row) {
        this.spinning = true
        nginxUpstreamDel(row).then(rst => {
          this.getNginx(this.hostServerId)
          this.$notification.success({
            message: '删除成功'
          })
          this.spinning = false
        }).catch(e => {
          this.spinning = false
        })
      },
      start() {
        this.spinning = true
        nginxConfStart({ hostServerId: this.hostServerId }).then(rst => {
          this.getNginx(this.hostServerId)
          this.spinning = false
          this.$notification.success({
            message: '成功'
          })
        }).catch(e => {
          this.spinning = false
        })
      },
      toNginxSslFileAdd() {
        this.nginxSslFileVisible = true
      },
      nginxSslFileAddCancel() {
        this.nginxSslFileVisible = false
      }
    },
    beforeDestroy() {
      window.removeEventListener('setItem', this.getHostServerId)
    }
  }
</script>

<style scoped>
  .ant-list-item {
    height: 50px;
  }
</style>