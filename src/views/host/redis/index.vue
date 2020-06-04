<template>
  <a-spin :spinning="spinning" tip="执行中...">
    <a-card :bordered="false" :style="{ height: '100%' }">

      redis状态：{{redisFlag|statusFilter}}
      <a-button type="primary" @click="()=>{this.getRedis(this.hostServerId)}" style="margin-left: 20px"  v-if="checkPermission(['redis-get'])">刷新</a-button>
      <a-button v-show="redisFlag!==0" type="primary" @click="start()" style="margin-left: 20px"  v-if="checkPermission(['redis-update'])">{{redisFlag|doFilter}}</a-button>

      <div style="margin-top: 20px">
        <div>
          <a-button type="primary" @click="()=>{this.redisEditvisible = true}" v-if="checkPermission(['redis-update'])">修改配置</a-button>
          <a-form>
            <a-form-item label="访问ip" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              <a-input
                :disabled=true
                v-model="redisConf.ip"
              />
            </a-form-item>
            <a-form-item label="端口号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              <a-input
                :disabled=true
                v-model="redisConf.port"
              />
            </a-form-item>
            <a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              <a-input
                :disabled=true
                v-model="redisConf.password"
              />
            </a-form-item>

          </a-form>
        </div>


      </div>
      <!--nginx主配置文件conf-->
      <a-modal
        v-model="redisEditvisible"
        v-if="redisEditvisible"
        title="操作"
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        :closable="false"
        width="75%"
      >
        <redisEdit :hostServerId="hostServerId" :redisConf="redisConf" @redisEditChannel="redisEditChannel"/>
      </a-modal>


    </a-card>
  </a-spin>
</template>

<script>
  import { hostServerAll } from '@/api/hostServer'
  import { redisStatus, redisStart } from '@/api/redis'
  import redisEdit from './redisEdit'
  import { STable } from '@/components'
  import checkPermission from '@/utils/permission'
  export default {
    name: 'index',
    components: {
      STable,
      redisEdit
    },
    data () {
      return {
        spinning: false,
        hostServerId: undefined,
        hostServerList: [],
        redisConf: {},
        redisFlag: 0,
        redisEditvisible: false
      }
    },
    created () {
      window.addEventListener('setItem', this.getHostServerId)
      this.getHostServerId()
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '未安装',
          1: '未启动',
          2: '已启动'
        }
        return statusMap[status]
      },
      doFilter (status) {
        const statusMap = {
          1: '启动',
          2: '停止'
        }
        return statusMap[status]
      }
    },
    methods: {
      checkPermission,
      getHostServerId () {
        let hostServerId = sessionStorage.getItem('watchStorage')
        if (hostServerId === null || hostServerId === undefined){

        }else {
          this.hostServerId = parseInt(hostServerId)
          this.getRedis(this.hostServerId)
        }
      },
      // first () {
      //   hostServerAll().then(rst => {
      //     this.hostServerList = rst.result
      //     if (this.hostServerList.length > 0) {
      //       this.hostServerId = this.hostServerList[0].value
      //       this.getRedis(this.hostServerList[0].value)
      //
      //     }
      //   })
      // },
      // selectChange (value) {
      //   this.hostServerId = value
      //   this.getRedis(value)
      // },
      getRedis (hostServerId) {
        redisStatus({ hostServerId: hostServerId }).then(rst => {
          this.redisFlag = rst.result.redisFlag
          this.redisConf = rst.result.redisConf

        })
      },
      redisEditChannel () {
        this.redisEditvisible = false
        this.getRedis(this.hostServerId)
      },
      start () {
        this.spinning = true
        redisStart({ hostServerId: this.hostServerId }).then(rst => {
          this.$notification.info({
            message: '操作成功'
          })
          this.spinning = false
          this.getRedis(this.hostServerId)
        })
      }
    },
    beforeDestroy () {
      window.removeEventListener('setItem', this.getHostServerId)
    }
  }
</script>

<style scoped>
  .ant-list-item {
    height: 50px;
  }
</style>