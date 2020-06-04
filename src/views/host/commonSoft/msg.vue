<template>
  <div :style="'min-width:' + width" class="container">
<!--    <el-tooltip :content="content" class="lock item" effect="dark" placement="left">-->
<!--      <el-button type="info" size="mini" circle @click="doLock">-->
<!--        <svg-icon :icon-class="ico"/>-->
<!--      </el-button>-->
<!--    </el-tooltip>-->
    <div id="console" :style="'height:'+ height" class="console">
      <div v-for="item in data">
        <!--        <span>{{ item.name }}</span>-->
        <!--        <span style="color:#CD0066 ">{{ parseTime(item.timestamp)+' ' }}</span>-->
        <!--        <span style="color: #00CD00">{{ item.threadName+' ' }}</span>-->
        <!--        <span :style="'color:'+ getColor(item.level) ">-->
        <!--          {{ item.level+' ' }}-->
        <!--        </span>-->
        <!--        <span style="color: #DE00CC">{{ item.className+' ' }}</span>-->
        <span v-html="item"/>
      </div>
    </div>
  </div>
</template>

<script>

  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { axios } from '@/utils/request'
  import Vue from 'vue'

  export default {
    name: 'Msg',
    data() {
      return {
        ico: 'unlock', unlock: true, content: '锁定滚动条',
        height: document.documentElement.clientHeight - 300 + 'px;',
        width: document.documentElement.clientWidth - 210 + 'px;',
        data: [],
        // level
        INFO: '#0000ff', WARN: '#FFFF00', ERROR: '#FF0000', DEBUG: '#DEA000',

        path: 'ws://' + "localhost" + '/myws/echo',
        socket: ''

      }
    },
    computed: {},
    // 监听控制滚动条
    watch: {
      data: {
        handler(val, oldVal) {
          this.$nextTick(() => {
            if (this.unlock) {
              var div = document.getElementById('console')
              div.scrollTop = div.scrollHeight
            }
          })
        }
      }
    },
    mounted: function() {
      this.init()
      const that = this
      window.onresize = function temp() {
        that.height = document.documentElement.clientHeight - 94.5 + 'px;'
      }
    },
    beforeDestroy: function() {
// 销毁监听
      this.socket.close()
    },
    methods: {
      init: function() {
        if (typeof (WebSocket) === 'undefined') {
          alert('您的浏览器不支持socket')
        } else {
          // 实例化socket
          this.socket = new WebSocket(this.path)
          // 监听socket连接
          this.socket.onopen = this.open
          // 监听socket错误信息
          this.socket.onerror = this.error
          // 监听socket消息
          this.socket.onmessage = this.getMessage
          this.socket.onclose = this.close
        }
      },
      open: function() {
        console.log('socket连接成功')
        this.send(Vue.ls.get(ACCESS_TOKEN))
      },
      error: function() {
        console.log('连接错误')
      },
      getMessage: function(msg) {
        if (this.data.length > 200) {
          this.data = []
        }
        this.data.push(msg.data)
      },
      send: function(params) {
        this.socket.send(params)
      },
      close: function() {
        console.log('socket已经关闭')
      },
      getColor(level) {
        if (level === 'INFO') {
          return this.INFO
        } else if (level === 'WARN') {
          return this.WARN
        } else if (level === 'DEBUG') {
          return this.DEBUG
        } else {
          return this.ERROR
        }
      },
      doLock() {
        if (this.unlock) {
          this.content = '解除锁定'
          this.ico = 'lock'
        } else {
          this.content = '锁定滚动条'
          this.ico = 'unlock'
        }
        this.unlock = !this.unlock
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped>
  button, input, textarea {
    outline: 0
  }

  .container {
    width: 100%;
    margin: 5px
  }

  .container .console {
    font-family: "Interstate", "Hind", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
    overflow-y: scroll;
    /*background: #494949;*/
    color: #f7f7f7;
    padding: 10px;
    font-size: 14px;
    border-radius: 3px 1px 3px 3px;
  }

  .lock {
    position: fixed;
    right: 45px;
    bottom: 6.8%;
    z-index: 100000
  }
</style>
