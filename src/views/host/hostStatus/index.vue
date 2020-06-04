<template>
  <a-card :bordered="false" :style="{ height: '100%' }">


    <div style="margin-top: 20px">
      <div>
        <a-button type="primary" @click="()=>{this.hostStatusVisible=true}"
                  v-if="checkPermission(['hostStatus-update'])">修改配置
        </a-button>
        <a-form>
          <a-form-item label="内存使用率" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              :disabled=true
              v-model="hostStatus.memory"
            />
          </a-form-item>
          <a-form-item label="cpu使用率" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              :disabled=true
              v-model="hostStatus.cpu"
            />
          </a-form-item>
          <a-form-item label="硬盘使用率" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              :disabled=true
              :value="`${hostStatus.ypUseSize}(${hostStatus.ypTotalSize}G)`"
            >
            </a-input>
          </a-form-item>
          <a-form-item label="当内存大于此值进行发邮件" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              :disabled=true
              v-model="hostStatus.maxMemory"
            />
          </a-form-item>
          <a-form-item label="当cpu大于此值进行发邮件" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              :disabled=true
              v-model="hostStatus.maxCpu"
            />
          </a-form-item>
          <a-form-item label="当硬盘使用率大于此值进行发邮件" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              :disabled=true
              v-model="hostStatus.maxYpUse"
            />
          </a-form-item>
          <a-form-item label="报警邮件" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              :disabled=true
              v-model="hostStatus.email"
            />
          </a-form-item>
        </a-form>
      </div>


      <a-divider>内存占用列表</a-divider>
      <div>
        <a-table
          :columns="nginxServerColumns"
          :rowKey="record => record.hostMemoryId"
          :dataSource="hostStatus.memoryList"
          :pagination="false"
          :loading="false"
        >
          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确定删除？？" @confirm="deleteRow(record)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;" v-if="checkPermission(['hostStatus-delete'])">删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
      <a-divider>cpu占用列表</a-divider>
      <div>
        <a-table
          :columns="nginxUpstreamColumns"
          :rowKey="record => record.hostCpuId"
          :dataSource="hostStatus.cpuList"
          :pagination="false"
          :loading="false"
        >
          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确定删除？？" @confirm="deleteRow(record)" okText="Yes"
                          cancelText="No">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
    </div>

    <a-modal
      v-model="hostStatusVisible"
      v-if="hostStatusVisible"
      title="操作"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      width="75%"
    >
      <a-form>
        <a-form-item label="报警内存" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-model="hostStatus.maxMemory"
          />
        </a-form-item>
        <a-form-item label="报警cpu" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-model="hostStatus.maxCpu"
          />
        </a-form-item>
        <a-form-item label="报警硬盘使用率" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-model="hostStatus.maxYpUse"
          />
        </a-form-item>
        <a-form-item label="报警邮箱" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-model="hostStatus.email"
          />
        </a-form-item>

        <a-row>
          <a-col
            :span="24"
            :style="{ textAlign: 'right' }"
          >
            <a-button
              @click="()=>{this.hostStatusVisible=false}"
            >
              取消
            </a-button>
            <a-button
              type="primary"
              html-type="submit"
              :style="{ marginLeft: '8px' }"
              @click="submit11"
            >
              提交
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
  import { hostServerAll } from '@/api/hostServer'
  import { hostStatusGet, hostStatusEdit } from '@/api/hostStatus'
  import { STable } from '@/components'
  import checkPermission from '@/utils/permission'

  export default {
    name: 'index',
    components: {
      STable
    },
    data() {
      return {
        hostServerId: undefined,
        hostServerList: [],
        hostStatus: {
          memoryList: [],
          cpuList: []
        },
        nginxServerColumns: [
          { title: 'pid', dataIndex: 'pid' },
          { title: '占用内存', dataIndex: 'value' },
          { title: '命令', dataIndex: 'common' },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        nginxUpstreamColumns: [
          { title: 'pid', dataIndex: 'pid' },
          { title: 'cpu', dataIndex: 'value' },
          { title: '命令', dataIndex: 'common' },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
        ],
        hostStatusVisible: false
      }
    },
    created() {
      window.addEventListener('setItem', this.getHostServerId)
      this.getHostServerId()
    },
    methods: {
      checkPermission,
      // first () {
      //   hostServerAll().then(rst => {
      //     this.hostServerList = rst.result
      //     if (this.hostServerList.length > 0) {
      //       this.hostServerId = this.hostServerList[0].value
      //       this.getStatus(this.hostServerList[0].value)
      //     }
      //   })
      // },
      // selectChange (value) {
      //   this.hostServerId = value
      //   this.getStatus(value)
      // },
      getHostServerId() {
        let hostServerId = sessionStorage.getItem('watchStorage')
        if (hostServerId === null || hostServerId === undefined) {

        } else {
          this.hostServerId = parseInt(hostServerId)
          this.getStatus(this.hostServerId)
        }
      },
      getStatus(hostServerId) {
        hostStatusGet({ hostServerId: hostServerId }).then(rst => {
          this.hostStatus = rst.result
        })
      },
      submit11() {
        hostStatusEdit(this.hostStatus).then(rst => {
          this.$notification.success({
            message: '修改成功'
          })
          this.hostStatusVisible = false
        })
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