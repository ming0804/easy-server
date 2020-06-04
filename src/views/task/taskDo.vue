<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">
      <a-form>
        <a-form-item label="任务编码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="task.code" :disabled="nameDisabled"
          />
        </a-form-item>
        <a-form-item label="标签" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select mode="tags" style="width: 100%" placeholder="选择标签或者输入标签" @change="labelChange" v-model="modelLabel">
            <a-select-option v-for="i in listLabel" :key="i">
              {{i}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="task.descripe"
          />
        </a-form-item>
        <a-form-item label="类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-model="task.type"
          >
            <a-select-option :value="0">相同时间可重复执行</a-select-option>
            <a-select-option :value="1">相同时间不可重复执行</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间表达式" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="task.corn"
          />
        </a-form-item>
        <a-form-item label="任务是否开启" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-model="task.openFlag"
          >
            <a-select-option :value="0">不开启</a-select-option>
            <a-select-option :value="1">开启</a-select-option>
          </a-select>
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
    </a-spin>
  </div>
</template>

<script>
  import { taskUpdate, taskAdd,taskLabel } from '@/api/task'

  export default {
    name: 'taskDo',
    props: {
      task: {}
    },
    data() {
      return {
        spinning: false,
        hostUserParam: {},
        hostGroupList: [],
        nameDisabled: false,
        modelLabel: [],
        listLabel:[]
      }
    },
    created() {
      taskLabel().then(rst =>{
        this.listLabel = rst.result
      })
      if (this.task.clientTaskId != undefined) {
        this.nameDisabled = true
        if(this.task.label != undefined && this.task.label.length >0){
          this.modelLabel = [this.task.label]
        }
      }else {
        this.task.corn="0/10 * * * * ?"
      }
    },

    methods: {
      submit11() {

        this.spinning = true
        if (this.modelLabel.length ==0){
          this.task.label = ""
        }else {
          this.task.label = this.modelLabel[this.modelLabel.length - 1]
        }
        if (this.task.clientTaskId != undefined) {
          taskUpdate(this.task).then(rst => {
            this.spinning = false
            this.channel()
          }).catch(e => {
            this.spinning = false
          })
        } else {
          taskAdd(this.task).then(rst => {
            this.spinning = false
            this.channel()
          }).catch(e => {
            this.spinning = false
          })
        }


      },
      handleChange(selectedItems) {

        this.hostUserParam.otherGroup = selectedItems.join(',')
        // this.selectedItems = selectedItems;
      },
      labelChange(value) {
        console.log(value)
        if (value.length ==0){
          this.modelLabel = []
        }else {
          console.log(value[value.length - 1])
          this.modelLabel = [value[value.length - 1]]
        }
      },
      mainGroupChange(o) {
        this.hostUserParam.mainGroup = o
      },
      channel() {
        this.$emit('handleCancel')
      }
    }
  }
</script>

<style scoped>

</style>