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

export function roleGet (parameter) {
  return axios({
    url: '/role/get',
    method: 'post',
    data: parameter
  })
}

export function roleEdit (parameter) {
  return axios({
    url: '/role/edit',
    method: 'post',
    data: parameter
  })
}

export function roleAdd (parameter) {
  return axios({
    url: '/role/add',
    method: 'post',
    data: parameter
  })
}

export function roleDel (parameter) {
  return axios({
    url: '/role/del',
    method: 'post',
    data: parameter
  })
}
export function roleAll (parameter) {
  return axios({
    url: '/role/all',
    method: 'post',
    data: parameter
  })
}