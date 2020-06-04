<template>
  <div>
    <a-col>
      <div style="max-width: 800px">
        <a-divider v-if="isMobile()"/>
        <div v-if="mdl.baseRoleId">
          <h3>角色：{{ mdl.name }}</h3>
        </div>
        <a-form :form="form" :layout="isMobile() ? 'vertical' : 'horizontal'">

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="角色名称">
            <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Please input role name!' }]} ]"
                     placeholder="请填写角色名称"/>
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
            label="备注说明">
            <a-textarea :row="3"
                        v-decorator="[ 'describe', {rules: [{ required: true, message: '请输入说明' }]} ]"
                        placeholder="请填写角色名称"/>
          </a-form-item>

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
                  @change="onChangeCheckAll($event, permission)">
                  全选
                </a-checkbox>
                <a-checkbox-group :options="permission.actionsOptions" v-model="permission.selected"
                                  @change="onChangeCheck(permission)"/>
              </a-col>
            </a-row>
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
        </a-form>
      </div>
    </a-col>
  </div>
</template>

<script>
  import { listAll } from '@/api/permission'
  import { roleGet, roleEdit, roleAdd } from '@/api/role'
  import pick from 'lodash.pick'

  export default {
    name: 'roleDo',
    comments: {},
    props: {
      baseRoleId: null
    },
    data () {
      return {
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
        mdl: {}
      }
    },
    created () {
      this.loadPermissions()
    },
    methods: {
      submit11 () {
        let param = this.form.getFieldsValue()
        // let validateFields = this.form.validateFields
        // validateFields(function (errors, values) {
        //   debugger;
        // })
        param.permissions = this.permissions
        if (this.baseRoleId === undefined || this.baseRoleId === null) {
          roleAdd(param).then(rst => {
            this.$notification.success({
              message: '成功',
              description: `添加成功`
            })
            this.channel()
          })
        } else {
          param.baseRoleId = this.baseRoleId
          roleEdit(param).then(rst => {
            this.$notification.success({
              message: '成功',
              description: `修改成功`
            })
            this.channel()
          })
        }
      },
      getOneModule () {
        if (this.baseRoleId === undefined || this.baseRoleId === null) {

        } else {
          roleGet({ baseRoleId: this.baseRoleId }).then(rst => {

            this.mdl = rst.result
            let data = rst.result
            // 有权限表，处理勾选
            if (data.permissions && this.permissions) {
              // 先处理要勾选的权限结构
              const permissionsAction = {}
              data.permissions.forEach(permission => {
                permissionsAction[permission.baseModuleId] = permission.actionEntitySet.map(entity => entity.action)
              })

              console.log('permissionsAction', permissionsAction)
              // 把权限表遍历一遍，设定要勾选的权限 action
              this.permissions.forEach(permission => {
                const selected = permissionsAction[permission.baseModuleId]
                permission.selected = selected || []
                this.onChangeCheck(permission)
              })

              console.log('this.permissions', this.permissions)
            }

            this.form.setFieldsValue(pick(this.mdl, 'name', 'status', 'describe'))

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
          this.getOneModule()
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