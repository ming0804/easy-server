##简单的小应用
#部署
```
    1:到releases下载快照版
    2：把mmm_dev.sql注入到自己的mysql数据库中
    3：根据自己的数据库环境配置conf.properties文件
    4：启动java -jar my-server-1.0-jar-with-dependencies.jar
        更换端口启动 java -jar my-server-1.0-jar-with-dependencies.jar -port=8080
    5：默认端口80  则可用ip访问 用户名 超级用户 密码 111111
    6：注意事项 很多服务需要在添加过centos服务器之后才可使用
```
##模块介绍
https://mp.csdn.net/console/editor/html/105342081

##目标

#0.0.1最终版
```
    完善到每个按钮的权限管理

```

#0.0.2最终版
```
    1：nginx配置参数的自定义
    2：简易版的分布式任务调度

```
 #0.0.3最终版
 ```
     1：jar包部署的任务定时
     2：git的自动化任务定时部署
 
 ```
 
  #0.0.4最终版
  ```
      1：简易版的流程管理配置
  
  ```
  
 
 
## [一：单表sql操作](#1)
## 二：多表sql操作
## 三：ktor方法
## 四：基本代码生成器
## 五：基于redis全局锁、redis库存（money）操作



## 六：o命令快捷工具
## [last：小工具](#last)

#### 操作sql
```操作sql的时候 需要先初始化sql作用域
    1：无事务作用域 doMapper 
       参数有三 database 可不填 不填是使用全局数据库的配置
       isolationLevel事务等级 值为TransactionIsolationLevel.READ_UNCOMMITTED 等 默认读提交
        {}事务中业务逻辑
       doMapper { 
       业务逻辑    
       }
       doMapper(object :DataBase{
           override var baseDataUrl: String
               get() = "数据库连接地址"
               set(value) {}
           override var baseDataUserName: String
               get() = "用户名"
               set(value) {}
           override var baseDataPassword: String
               get() = "密码"
               set(value) {}
    
       }, TransactionIsolationLevel.READ_UNCOMMITTED.level ) { 
            业务逻辑
        }
        在使用database参数的时候是不走连接池的
    2：事务作用域 doMapperTra 方式如上
    3：继承上层sql作用域 doSuMapper  封装通用函数使用 
操作sql方法


```











#### <span id="last">last-1:md5加密</span>
#### last-2:二维码
#### last-3:httpclient
#### last-4:获取文件编码格式
#### last-5:日期工具
#### last-6:html标签过滤
#### last-7:钱转中文工具
#### last-8:中文转拼音工具
#### last-9:实体类转换
#### last-10:深度拷贝deepCopy
#### last-11:驼峰规则转换





