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

export function commonSoftGet (parameter) {
  return axios({
    url: '/commonSoft/get',
    method: 'post',
    data: parameter
  })
}

export function commonSoftInstall (parameter) {
  return axios({
    url: '/commonSoft/install',
    method: 'post',
    data: parameter
  })
}