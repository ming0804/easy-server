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

export function hostStatusGet (parameter) {
  return axios({
    url: '/hostStatus/get',
    method: 'post',
    data: parameter
  })
}

export function hostStatusEdit (parameter) {
  return axios({
    url: '/hostStatus/edit',
    method: 'post',
    data: parameter
  })
}
