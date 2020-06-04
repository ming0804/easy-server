<template>
  <div>
    <a-col>
      <div style="max-width: 800px">
        <a-divider v-if="isMobile()"/>
        <a-form :form="form" :layout="isMobile() ? 'vertical' : 'horizontal'">

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="用户名称">
            <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Please input user name!' }]} ]"
                     placeholder="请填写用户名称"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="手机号">
            <a-input v-decorator="[ 'phone', {rules: [{ required: true, message: '请输入手机号' }]} ]"
                     placeholder="请输入手机号"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="邮箱">
            <a-input v-decorator="[ 'email', {rules: [{ required: true, message: '请输入邮箱' }]} ]"
                     placeholder="请填写邮箱"/>
          </a-form-item>
          <a-form-item
            v-if="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="密码">
            <a-input v-decorator="[ 'password', {rules: [{ required: true, message: '请输入密码' }]} ]"
                     placeholder="请输入密码"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态">
            <a-select v-decorator="[ 'status', {rules: []} ]">
              <a-select-option :value="0">正常</a-select-option>
              <a-select-option :value="1">禁用</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="角色">
            <a-select
              :allowClear=true
              v-decorator="[ 'baseRoleId', {rules: []} ]" @change="getOneModule">
              <a-select-option v-for="i in roles" :key="i.baseRoleId">
                {{i.name}}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注说明">
            <a-textarea :row="3"
                        v-decorator="[ 'describe', {rules: [{ required: true, message: '请输入说明' }]} ]"
                        placeholder="请填写说明"/>
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
                html-type="submit"
                :style="{ marginLeft: '8px' }"
                @click="submit11"
              >
                提交
              </a-button>
            </a-col>
          </a-row>
          <a-divider/>
          <a-form-item label="拥有权限">
            <a-row :gutter="16" v-for="(permission, index) in permissions" :key="index">
              <a-col :xl="4" :lg="24">
                {{ permission.name }}：
              </a-col>
              <a-col :xl="20" :lg="24">
                <a-checkbox
                  v-if="permission.actionsOptions.length > 0"
                  :indeterminate="permission.indeterminate"
                  :checked="permission.checkedAll"
                  :disabled="true"
                  @change="onChangeCheckAll($event, permission)">
                  全选
                </a-checkbox>
                <a-checkbox-group :options="permission.actionsOptions" v-model="permission.selected"
                                  @change="onChangeCheck(permission)"  :disabled="true"/>
              </a-col>
            </a-row>
          </a-form-item>

        </a-form>
      </div>
    </a-col>
  </div>
</template>

<script>
  import { listAll } from '@/api/permission'
  import { roleAll, roleGet } from '@/api/role'
  import { userGet, userEdit, userAdd } from '@/api/user'
  import pick from 'lodash.pick'

  export default {
    name: 'userDo',
    comments: {},
    props: {
      baseUserId: null
    },
    data () {
      return {
        show: false,
        labelCol: {
          xs: { span: 250 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 450 },
          sm: { span: 16 }
        },
        form: this.$form.createForm(this),
        permissions: [],
        mdl: {},
        roles: []
      }
    },
    created () {
      this.loadPermissions()
      this.getRoles()
      this.form.setFieldsValue({ baseUserId: this.baseUserId })
    },
    methods: {
      first () {
        userGet({ baseUserId: this.baseUserId }).then(rst => {
          this.form.setFieldsValue(pick(rst.result, 'name', 'status', 'describe', 'baseRoleId', 'phone', 'email'))
          this.getOneModule(rst.result.baseRoleId)
        })
      },
      submit11 () {
        let param = this.form.getFieldsValue()
        // let validateFields = this.form.validateFields
        // validateFields(function (errors, values) {
        //   debugger;
        // })
        console.log(param)

        if (this.baseUserId === undefined || this.baseUserId === null) {
          userAdd(param).then(rst => {
            this.$notification.success({
              message: '成功',
              description: `添加成功`
            })
            this.channel()
          })
        } else {
          param.baseUserId = this.baseUserId
          userEdit(param).then(rst => {
            this.$notification.success({
              message: '成功',
              description: `修改成功`
            })
            this.channel()
          })
        }
      },
      getRoles () {
        roleAll().then(rst => {
          this.roles = rst.result
        })
      },
      getOneModule (baseRoleId) {
        console.log(baseRoleId)
        if (baseRoleId === undefined || baseRoleId === null) {
          //清除选择
          this.permissions.forEach(permission => {
            permission.selected = []
            this.onChangeCheck(permission)
          })
        } else {
          roleGet({ baseRoleId: baseRoleId }).then(rst => {
            this.mdl = rst.result
            let data = rst.result
            // 有权限表，处理勾选
            if (data.permissions && this.permissions) {
              // 先处理要勾选的权限结构
              const permissionsAction = {}
              data.permissions.forEach(permission => {
                permissionsAction[permission.baseModuleId] = permission.actionEntitySet.map(entity => entity.action)
              })
              // 把权限表遍历一遍，设定要勾选的权限 action
              this.permissions.forEach(permission => {
                const selected = permissionsAction[permission.baseModuleId]
                permission.selected = selected || []
                this.onChangeCheck(permission)
              })
            }
          })
        }
      },

      channel () {
        this.$emit('handleCancel') // 将改变通知父组件(保证父子组件数据一致)
      },
      loadPermissions () {
        listAll().then(res => {
          const result = res.result
          this.permissions = result.map(permission => {
            const options = permission.actionData
            permission.checkedAll = false
            permission.selected = []
            permission.indeterminate = false
            permission.actionsOptions = options.map(option => {
              return {
                label: option.describe,
                value: option.action
              }
            })
            return permission
          })
          if (this.baseUserId !== undefined && this.baseUserId !== null) {
            this.first()
            this.show = false
          } else {
            this.show = true
          }

        })
      },
      isMobile () {
        return false
      },
      onChangeCheck (permission) {
        permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
        permission.checkedAll = permission.selected.length === permission.actionsOptions.length
      },
      onChangeCheckAll (e, permission) {
        Object.assign(permission, {
          selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
          indeterminate: false,
          checkedAll: e.target.checked
        })
      }

    }
  }
</script>

<style scoped>

</style>