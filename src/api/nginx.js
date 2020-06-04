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

export function nginxConfGet (parameter) {
  return axios({
    url: '/nginxConf/get',
    method: 'post',
    data: parameter
  })
}

export function nginxConfEdit (parameter) {
  return axios({
    url: '/nginxConf/edit',
    method: 'post',
    data: parameter
  })
}
export function nginxConfStart (parameter) {
  return axios({
    url: '/nginxConf/start',
    method: 'post',
    data: parameter
  })
}



export function nginxServerAdd (parameter) {
  return axios({
    url: '/nginxServer/add',
    method: 'post',
    data: parameter
  })
}
export function nginxServerDel (parameter) {
  return axios({
    url: '/nginxServer/del',
    method: 'post',
    data: parameter
  })
}
export function nginxServerLocationAdd (parameter) {
  return axios({
    url: '/nginxServerLocation/add',
    method: 'post',
    data: parameter
  })
}


export function nginxUpstreamAdd (parameter) {
  return axios({
    url: '/nginxUpstream/add',
    method: 'post',
    data: parameter
  })
}
export function nginxUpstreamDel (parameter) {
  return axios({
    url: '/nginxUpstream/del',
    method: 'post',
    data: parameter
  })
}
export function nginxUpstreamAll (parameter) {
  return axios({
    url: '/nginxUpstream/list',
    method: 'post',
    data: parameter
  })
}