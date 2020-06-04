<template>
  <a-spin :spinning="spinning" tip="执行中...">
    <div style="margin-bottom: 30px">
      <span style="color: #3449c4;font-size: large">
      使用方式：先进行输入你要控制的文件夹绝对地址  然后回车  之后选择提交
      </span>
    </div>


    <a-input-search
      placeholder="输入文件绝对地址"
      @search="onSearch"
      enterButton="查询"
      size="large"
      style="width: 500px;margin-left: 200px;margin-bottom: 30px"
      v-if="checkPermission(['hostPermission-get'])"
    />

    <a-form>
      <a-form-item label="文件大小" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-model="data.size" :disabled="true"
        />
      </a-form-item>
      <a-form-item label="文件类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-model="data.type" :disabled="true"
        />
      </a-form-item>
      <a-form-item label="所属用户" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select
          :value="data.tempUser"
          @change="tempUserChange"
        >
          <a-select-option v-for="i in userList" :key="i.username">
            {{i.username}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所属用户组" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select
          :value="data.tempGroup"
          @change="tempGroupChange"
        >
          <a-select-option v-for="i in hostGroupList" :key="i.groupName">
            {{i.groupName}}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="所属用户权限" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select
          mode="multiple"
          :value="data.userPermission"
          @change="userPermissionChange"
          placeholder="Please select"
        >
          <a-select-option v-for="i in permissionList" :key="i.key">
            {{i.value}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所属用户组权限" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select
          mode="multiple"
          :value="data.groupPermission"
          @change="groupPermissionChange"
          placeholder="Please select"
        >
          <a-select-option v-for="i in permissionList" :key="i.key">
            {{i.value}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="其他用户组权限" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select
          mode="multiple"
          :value="data.otherUserPermission"
          @change="otherUserPermissionChange"
          placeholder="Please select"
        >
          <a-select-option v-for="i in permissionList" :key="i.key">
            {{i.value}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="子目录是否一起修改" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-switch checkedChildren="是" unCheckedChildren="否" @change="flagChange"/>
      </a-form-item>

      <a-row>
        <a-col
          :span="24"
          :style="{ textAlign: 'center' }"
        >
          <a-popconfirm :title="getText" @confirm="submit11()" okText="Yes"
                        cancelText="No">
            <a-button
              type="primary"
              html-type="submit"
              :style="{ marginLeft: '8px' }"
              v-if="checkPermission(['hostPermission-update'])"
            >
              提交
            </a-button>
          </a-popconfirm>
        </a-col>
      </a-row>

    </a-form>

  </a-spin>
</template>

<script>
  import { hostPermissionSearch, hostGroupList, getAllHostUser, editPermission } from '@/api/hostUserGroup'
  import checkPermission from '@/utils/permission'
  export default {
    name: 'index',
    data () {
      return {
        spinning: false,
        hostServerId: 0,
        permissionList: [{ key: 'r', value: '读' }, { key: 'w', value: '写' }, { key: 'x', value: '执行' }],
        data: { path: '' },
        hostGroupList: [],
        userList: [],
        path: '',
        flag: false
      }
    },
    created () {
      window.addEventListener('setItem', this.getHostServerId)
      this.getHostServerId()
      hostGroupList({ hostServerId: this.hostServerId }).then(rst => {
        this.hostGroupList = rst.result
      })
      getAllHostUser({ hostServerId: this.hostServerId }).then(rst => {
        this.userList = rst.result
      })
    },
    methods: {
      checkPermission,
      getText () {
        return '确认修改' + this.data.path + '的权限？？？'
      },
      onSearch (value) {
        if (value === '') {
          this.data = {}
          return
        }
        this.path = value
        this.spinning = true
        if (this.hostServerId !== 0) {
          hostPermissionSearch({ hostServerId: this.hostServerId, 'path': value }).then(rst => {
            this.data = rst.result

            this.spinning = false
          }).catch(e => {
            this.spinning = false
            this.data = {}
          })
        }

      },
      getHostServerId () {
        let hostServerId = sessionStorage.getItem('watchStorage')
        if (hostServerId === null || hostServerId === undefined) {
          this.hostServerId = 0
        } else {
          this.hostServerId = parseInt(hostServerId)
        }
        this.onSearch(this.path)
      },
      userPermissionChange (selectedItems) {

        this.data.userPermission = selectedItems

      },
      groupPermissionChange (selectedItems) {
        this.data.groupPermission = selectedItems

      },
      otherUserPermissionChange (selectedItems) {
        this.data.otherUserPermission = selectedItems
      },
      tempGroupChange (selectedItems) {
        this.data.tempGroup = selectedItems
      },
      tempUserChange (selectedItems) {
        this.data.tempUser = selectedItems
      },
      submit11 () {
        if (this.data.path == undefined || this.data.path == null || this.data.path == '') {
          this.$notification.success({
            message: '请输入绝对路径 回车即可'
          })
          return
        }
        this.spinning = true
        this.data.hostServerId = this.hostServerId
        this.data.flag = this.flag

        editPermission(this.data).then(rst => {
          this.spinning = false
          this.onSearch(this.path)
        }).catch(e => {
          this.spinning = false
        })
      },
      flagChange (checked) {

        this.flag = checked
      }
    },
    beforeDestroy () {
      window.removeEventListener('setItem', this.getHostServerId)
    }
  }
</script>

<style scoped>

</style>