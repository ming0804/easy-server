<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="uploadJarHost.descripe"
          />
        </a-form-item>
        <a-form-item label="指定端口" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="uploadJarHost.port"
                   :disabled="this.uploadJarHost.deployJarHostId != null && this.uploadJarHost.deployJarHostId != undefined"
          />
        </a-form-item>
        <a-form-item label="服务器" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-model="uploadJarHost.hostServerId"
            :disabled="this.uploadJarHost.deployJarHostId != null && this.uploadJarHost.deployJarHostId != undefined"
          >
            <a-select-option v-for="i in hostServerList" :key="i.value">
              {{i.label}}
            </a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item label="jar包版本" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-model="uploadJarHost.deployJarPackId"
          >
            <a-select-option v-for="i in deployJarPackList" :key="i.deployJarPackId">
              {{i.version}} ({{i.createdTime}})
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="是否监听服务状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-switch checkedChildren="是" unCheckedChildren="否" defaultChecked
                    :defaultChecked="uploadJarHost.watchFlag==1" @change="onWatchFlagChange"/>
        </a-form-item>
        <div v-if="uploadJarHost.watchFlag ==1">
          <a-form-item label="通知人员" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-select
              mode="multiple"
              v-model="uploadJarHost.watchUserIds"

            >
              <a-select-option v-for="i in userList" :key="i.baseUserId">
                {{i.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <a-form-item label="是否直接部署" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-switch checkedChildren="是" unCheckedChildren="否" defaultChecked @change="onChange"/>
        </a-form-item>

        <a-row>
          <a-col
            :span="24"
            :style="{ textAlign: 'right' }"
          >
            <a-button
              @click="channel"
            >
              取消
            </a-button>
            <a-button
              type="primary"
              @click="submit11"
              style="margin-top: 16px;margin-left: 20px"
            >
              提交
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
  import { deployJarEdit, deployJarPackList, deployJarHost, deployJarHostEdit } from '@/api/deployJar'
  import { userAllList } from '@/api/user'
  import { hostServerAll } from '@/api/hostServer'

  export default {
    name: 'deployHost',
    props: {
      deployJar: {},
      deployJarHost: {}
    },
    data() {
      return {
        spinning: false,
        uploadJarHost: { nowDeploy: true },
        deployJarPackList: [],
        hostServerList: [],
        disabled: false,
        userList: []
      }
    },
    created() {
      this.uploadJarHost = this.deployJarHost
      this.uploadJarHost.nowDeploy = true
      if (this.uploadJarHost.deployJarHostId != null && this.uploadJarHost.deployJarHostId != undefined) {
        this.disabled = true
      } else {
        this.uploadJarHost.watchFlag = 1
      }
      deployJarPackList({ deployJarId: this.deployJar.deployJarId }).then(rst => {
        this.deployJarPackList = rst.result
      })
      hostServerAll({}).then(rst => {
        this.hostServerList = rst.result
      })
      userAllList().then(rst => {
        this.userList = rst.result
      })
    },

    methods: {
      submit11() {
        if (this.uploadJarHost.hostServerId == null || this.uploadJarHost.hostServerId == '' ||
          this.uploadJarHost.deployJarPackId == null || this.uploadJarHost.deployJarPackId == '') {
          this.$notification.info({
            message: '服务和jar包一定要选择的哦'
          })
          return
        }
        this.uploadJarHost.deployJarId = this.deployJar.deployJarId
        this.spinning = true
        if (this.uploadJarHost.deployJarHostId != null && this.uploadJarHost.deployJarHostId != undefined) {
          deployJarHostEdit(this.uploadJarHost).then(rst => {
            this.spinning = false
            this.channel()
            this.$notification.info({
              message: rst.message
            })
          }).catch(error => {
            this.spinning = false
          })
        } else {
          deployJarHost(this.uploadJarHost).then(rst => {
            this.spinning = false
            this.channel()
            this.$notification.info({
              message: rst.message
            })
          }).catch(error => {
            this.spinning = false
          })
        }

      },

      onChange(checked) {
        this.uploadJarHost.nowDeploy = checked
      },
      onWatchFlagChange(checked) {
        if (checked) {
          this.uploadJarHost.watchFlag = 1
        } else {
          this.uploadJarHost.watchFlag = 0
        }

      },
      channel() {
        this.$emit('handleCanceluploadJar')
      }
    }
  }
</script>

<style scoped>

</style>