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

export function nginxSslFileAllList (parameter) {
  return axios({
    url: '/nginxSslFile/allList',
    method: 'post',
    data: parameter
  })
}

export function nginxSslFileAdd (parameter) {
  return axios({
    url: '/nginxSslFile/add',
    method: 'post',
    data: parameter
  })
}
