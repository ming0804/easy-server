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

export function nginxStaticList (parameter) {
  return axios({
    url: '/nginxStatic/all',
    method: 'post',
    data: parameter
  })
}

export function nginxStaticListPage (parameter) {
  return axios({
    url: '/nginxStatic/list',
    method: 'post',
    data: parameter
  })
}
export function nginxStaticAdd (parameter) {
  return axios({
    url: '/nginxStatic/add',
    method: 'post',
    data: parameter
  })
}