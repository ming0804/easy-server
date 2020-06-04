
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
export function edit (parameter) {
  return axios({
    url: '/baseModule/edit',
    method: 'post',
    data: parameter
  })
}

export function add (parameter) {
  return axios({
    url: '/baseModule/add',
    method: 'post',
    data: parameter
  })
}

export function listAll (parameter) {
  return axios({
    url: '/baseModule/listAll',
    method: 'post',
    data: parameter
  })
}
export function get (parameter) {
  return axios({
    url: '/baseModule/get',
    method: 'post',
    data: parameter
  })
}