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

export function hostServerGet (parameter) {
  return axios({
    url: '/hostServer/get',
    method: 'post',
    data: parameter
  })
}

export function hostServerEdit (parameter) {
  return axios({
    url: '/hostServer/edit',
    method: 'post',
    data: parameter
  })
}

export function hostServerAdd (parameter) {
  return axios({
    url: '/hostServer/edit',
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
export function hostServerAll (parameter) {
  return axios({
    url: '/hostServer/list1',
    method: 'post',
    data: parameter
  })
}
export function hostServerRefesh (parameter) {
  return axios({
    url: '/hostServer/refresh',
    method: 'post',
    data: parameter
  })
}

export function hostServerDel (parameter) {
  return axios({
    url: '/hostServer/del',
    method: 'post',
    data: parameter
  })
}
