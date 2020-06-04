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

export function taskUpdate (parameter) {
  return axios({
    url: '/task/update',
    method: 'post',
    data: parameter
  })
}

export function taskAdd (parameter) {
  return axios({
    url: '/task/add',
    method: 'post',
    data: parameter
  })
}
export function taskDel (parameter) {
  return axios({
    url: '/task/del',
    method: 'post',
    data: parameter
  })
}
export function taskLabel (parameter) {
  return axios({
    url: '/task/getLabels',
    method: 'post',
    data: parameter
  })
}
