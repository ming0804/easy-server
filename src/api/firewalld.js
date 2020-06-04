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

export function stopandstartFirewalld (parameter) {
  return axios({
    url: '/hostServer/firewalld',
    method: 'post',
    data: parameter
  })
}

export function firewalldDel (parameter) {
  return axios({
    url: '/firewalldPort/del',
    method: 'post',
    data: parameter
  })
}

export function firewalldAdd (parameter) {
  return axios({
    url: '/firewalldPort/add',
    method: 'post',
    data: parameter
  })
}
