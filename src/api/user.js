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

export function userGet (parameter) {
  return axios({
    url: '/baseUser/get',
    method: 'post',
    data: parameter
  })
}

export function userEdit (parameter) {
  return axios({
    url: '/baseUser/edit',
    method: 'post',
    data: parameter
  })
}
export function userEditPassword (parameter) {
  return axios({
    url: '/baseUser/editPassword',
    method: 'post',
    data: parameter
  })
}

export function userAdd (parameter) {
  return axios({
    url: '/baseUser/add',
    method: 'post',
    data: parameter
  })
}

export function userDel (parameter) {
  return axios({
    url: '/baseUser/del',
    method: 'post',
    data: parameter
  })
}

export function userAllList () {
  return axios({
    url: '/baseUser/allList',
    method: 'get'
  })
}