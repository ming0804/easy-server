// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/index',
    // redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        // path: '/dashboard/workplace',
        path: '/dashboard/index',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '工作台', keepAlive: true, permission: ['dashboard'] }
      },
      // 组织人员管理
      {
        path: '/system',
        name: 'systemPage',
        component: PageView,
        meta: { title: '系统人员管理', icon: 'border-left' , permission: ['userModule']},
        redirect: '/system/permission/index',
        children: [
          {
            path: '/system/user/index',
            name: '用户管理',
            component: () => import('@/views/system/user/index'),
            meta: { title: '用户管理', icon: 'tool', keepAlive: true, permission: ['user'] }
          }, {
            path: '/system/role/index',
            name: '角色管理',
            component: () => import('@/views/system/role/index'),
            meta: { title: '角色管理', icon: 'tool', keepAlive: true, permission: ['role'] }
          }, {
            path: '/system/permission/index',
            name: '权限管理',
            component: () => import('@/views/system/permission/index'),
            meta: { title: '权限管理', icon: 'tool', keepAlive: true, permission: ['permission'] }
          }
        ]
      },
      // 任务管理
      {
        path: '/system/task/index',
        name: '任务管理',
        component: () => import('@/views/task/index'),
        meta: { title: '任务', icon: 'clock-circle', keepAlive: true, permission: ['task'] }
      },
      //
      {
        path: '/host',
        name: 'hostPage',
        component: PageView,
        meta: { title: 'centos服务器管理', icon: 'slack', permission: ['hostModule'] },
        redirect: '/host/hostserver/index',
        children: [
          {
            path: '/host/hostserver/index',
            name: 'centos列表',
            component: () => import('@/views/host/hostserver/index'),
            meta: { title: '服务器列表', icon: 'container', keepAlive: true, permission: ['hostserver'] }
          },
          {
            path: '/host/commonSoft/index',
            name: '软件库',
            component: () => import('@/views/host/commonSoft/index'),
            meta: { title: '软件库', icon: 'gift', keepAlive: true, permission: ['commonSoft'] }
          },
          {
            path: '/host/nginx/index',
            name: 'nginx管理',
            component: () => import('@/views/host/nginx/index'),
            meta: { title: 'nginx管理', icon: 'cloud-server', keepAlive: true, permission: ['nginx'] }
          },
          {
            path: '/host/static/index',
            name: '静态文件管理',
            component: () => import('@/views/host/static/index'),
            meta: { title: '静态文件管理', icon: 'google', keepAlive: true, permission: ['static'] }
          },
          {
            path: '/host/hostStatus/index',
            name: '服务状态查看',
            component: () => import('@/views/host/hostStatus/index'),
            meta: { title: '服务状态查看', icon: 'global', keepAlive: true, permission: ['hostStatus'] }
          },
          {
            path: '/host/firewalld/index',
            name: '防火墙',
            component: () => import('@/views/host/firewalld/index'),
            meta: { title: '防火墙', icon: 'safety', keepAlive: true, permission: ['firewalld'] }
          },
          {
            path: '/host/redis/index',
            name: 'redis管理',
            component: () => import('@/views/host/redis/index'),
            meta: { title: 'redis管理', icon: 'trademark', keepAlive: true, permission: ['redis'] }
          }, {
            path: '/host/hostUser/index',
            name: 'centos用户管理',
            component: () => import('@/views/host/hostUser/index'),
            meta: { title: 'centos用户管理', icon: 'user', keepAlive: true, permission: ['hostUser'] }
          }, {
            path: '/host/hostGroup/index',
            name: 'centos用户组管理',
            component: () => import('@/views/host/hostGroup/index'),
            meta: { title: 'centos用户组管理', icon: 'team', keepAlive: true, permission: ['hostGroup'] }
          }, {
            path: '/host/hostPermission/index',
            name: 'centos文件权限管理',
            component: () => import('@/views/host/hostPermission/index'),
            meta: { title: 'centos文件权限管理', icon: 'menu-unfold', keepAlive: true, permission: ['hostPermission'] }
          }
          , {
            path: '/host/deployJar/index',
            name: 'jar包自动化部署',
            component: () => import('@/views/host/deployJar/index'),
            meta: { title: 'jar包自动化部署', icon: 'yuque', keepAlive: true, permission: ['deployJar'] }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
