import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */

export function deployJarEdit (parameter) {
  return axios({
    url: '/deployJar/edit',
    method: 'post',
    data: parameter
  })
}

export function deployJarPackList (parameter) {
  return axios({
    url: '/deployJar/packList',
    method: 'post',
    data: parameter
  })
}
export function deployJarHost (parameter) {
  return axios({
    url: '/deployJar/deployHost',
    method: 'post',
    data: parameter
  })
}

export function deployJarHostEdit (parameter) {
  return axios({
    url: '/deployJar/deployHostEdit',
    method: 'post',
    data: parameter
  })
}

export function deployJarHostStart (parameter) {
  return axios({
    url: '/deployJar/start',
    method: 'post',
    data: parameter
  })
}
export function deployJarHostDel (parameter) {
  return axios({
    url: '/deployJar/delJarHost',
    method: 'post',
    data: parameter
  })
}
export function deployJarHostStop (parameter) {
  return axios({
    url: '/deployJar/stopJarHost',
    method: 'post',
    data: parameter
  })
}
export function deployJarDel (parameter) {
  return axios({
    url: '/deployJar/delDeployJar',
    method: 'post',
    data: parameter
  })
}
export function commonFileList (parameter) {
  return axios({
    url: '/deployJar/getCommonfile',
    method: 'post',
    data: parameter
  })
}