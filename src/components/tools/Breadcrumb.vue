<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in breadList" :key="item.name">
      <router-link
        v-if="item.name != name && index != 1"
        :to="{ path: item.path === '' ? '/' : item.path }"
      >{{ item.meta.title }}
      </router-link>
      <span v-else>{{ item.meta.title }}</span>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="selectview">
    <span style="margin-left: 300px;color: #e932a2;font-size: large">
      服务器
    <a-select
      style="width: 120px"
      @change="selectChange"
      :value="hostServerId"
    >
      <a-select-option v-for="i in hostServerList" :key="i.value">
        {{i.label}}
      </a-select-option>
    </a-select>
      </span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
  import { hostServerAll } from '@/api/hostServer'

  export default {
    data () {
      return {
        name: '',
        breadList: [],
        hostServerId: undefined,
        hostServerList: [],
        selectview: false
      }
    },
    created () {
      this.getBreadcrumb()
      this.getHostServerList()
    },
    methods: {
      getBreadcrumb () {
        this.breadList = []
        // this.breadList.push({name: 'index', path: '/dashboard/', meta: {title: '首页'}})

        this.name = this.$route.name
        let flag = false
        this.$route.matched.forEach(item => {
          // item.name !== 'index' && this.breadList.push(item)
          this.breadList.push(item)
          let parent = item['parent']
          if (parent != undefined && parent['path'] == '/host') {
            let path = item['path']
            if (path == '/host/hostserver/index' || path == '/host/deployJar/index') {
              flag = false
            } else {
              flag = true
            }
          }
        })
        this.selectview = flag
        this.getHostServerList()

      },
      getHostServerList () {
        let hostServerId = parseInt(sessionStorage.getItem('watchStorage'))
        hostServerAll().then(rst => {
          this.hostServerList = rst.result
          if (this.hostServerList.length > 0) {
            if (hostServerId === null || hostServerId === undefined) {
              this.hostServerId = this.hostServerList[0].value
              this.resetSetItem('watchStorage', this.hostServerList[0].value)
            } else {
              let flag = false
              this.hostServerList.forEach(item => {
                if (item['value'] == hostServerId) {
                  flag = true
                }
              })
              if (!flag) {
                this.hostServerId = this.hostServerList[0].value
                this.resetSetItem('watchStorage', this.hostServerList[0].value)
              } else {
                this.hostServerId = hostServerId
                this.resetSetItem('watchStorage', hostServerId)
              }
            }
          } else {
            this.resetSetItem('watchStorage', null)
          }

        })
      },
      selectChange (value) {
        this.hostServerId = value
        this.resetSetItem('watchStorage', value)
      }
    },
    watch: {
      $route () {
        this.getBreadcrumb()
      }
    }
  }
</script>

<style scoped>
</style>
