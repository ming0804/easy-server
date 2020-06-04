<template>
  <div>
    <a-spin :spinning="spinning" tip="执行中...">


      <a-form>
        <a-form-item label="负载描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="nginxUpstream.name"
          />
        </a-form-item>

        <div>
          <a-button class="editable-add-btn" @click="handleAdd">添加地址</a-button>
          <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="false">
            <template slot="name" slot-scope="text, record">
              <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)"/>
            </template>
            <template slot="ipport" slot-scope="text, record">
              <editable-cell :text="text" @change="onCellChange(record.key, 'ipport', $event)"/>
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm
                v-if="dataSource.length"
                title="Sure to delete?"
                @confirm="() => onDelete(record)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>


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
  import { nginxUpstreamAdd } from '@/api/nginx'
  import EditableCell from './EditableCell'

  export default {
    name: 'nginxUpstreamAdd',
    components: {
      EditableCell
    },
    props: {
      hostServerId: null,
      nginxConfId: null,
      nginxUpstream: {}
    },
    data () {
      return {
        spinning: false,
        dataSource: [],
        count: 0,
        columns: [
          {
            title: '描述',
            dataIndex: 'name',
            width: '30%',
            scopedSlots: { customRender: 'name' }
          },
          {
            title: 'ip：port',
            dataIndex: 'ipport',
            width: '30%',
            scopedSlots: { customRender: 'ipport' }
          },

          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        nginxUpstreamServerDelIds: []
      }
    },
    created () {

      this.first()
    },
    methods: {
      first () {
        if (this.nginxUpstream.nginxUpstreamId !== undefined) {
          this.dataSource = this.nginxUpstream.nginxUpstreamServerList
          for (let index in this.dataSource) {

            this.dataSource[index].key = index
          }
          this.count = this.dataSource.length
        }

      },
      submit11 () {

        this.nginxUpstream.hostServerId = this.hostServerId
        this.nginxUpstream.nginxConfId = this.nginxConfId
        this.nginxUpstream['nginxUpstreamServerList'] = this.dataSource
        this.nginxUpstream['nginxUpstreamServerDelIds'] = this.nginxUpstreamServerDelIds

        this.spinning = true
        nginxUpstreamAdd(this.nginxUpstream).then(rst => {
          this.$notification.success({
            message: '操作成功'
          })
          this.channel()
        })

      },
      channel () {
        this.$emit('nginxUpstreamAddCancel') // 将改变通知父组件(保证父子组件数据一致)
      },
      //
      //
      onCellChange (key, dataIndex, value) {
        const dataSource = [...this.dataSource]
        const target = dataSource.find(item => item.key === key)
        if (target) {
          target[dataIndex] = value
          this.dataSource = dataSource
        }
      },
      onDelete (record) {
        const dataSource = [...this.dataSource]
        this.dataSource = dataSource.filter(item => item.key !== record.key)
        if (record.nginxUpstreamServerId !== undefined) {
          this.nginxUpstreamServerDelIds.push(record.nginxUpstreamServerId)
        }
      },
      handleAdd () {
        const { count, dataSource } = this
        const newData = {
          key: count,
          name: '',
          ipport: ''
        }
        this.dataSource = [...dataSource, newData]
        this.count = count + 1
      }
    }

  }
</script>

<style>
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
</style>