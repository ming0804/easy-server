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

export function hostGroupList (parameter) {
  return axios({
    url: '/hostUser/gropList',
    method: 'post',
    data: parameter
  })
}


export function hostUserEdit (parameter) {
  return axios({
    url: '/hostUser/editOtherGroup',
    method: 'post',
    data: parameter
  })
}
export function hostUserDel (parameter) {
  return axios({
    url: '/hostUser/delUser',
    method: 'post',
    data: parameter
  })
}
export function hostGroupDel (parameter) {
  return axios({
    url: '/hostUser/groupDel',
    method: 'post',
    data: parameter
  })
}
export function hostGroupEdit (parameter) {
  return axios({
    url: '/hostUser/groupEdit',
    method: 'post',
    data: parameter
  })
}
export function hostPermissionSearch (parameter) {
  return axios({
    url: '/hostUser/hostPermissionSearch',
    method: 'post',
    data: parameter
  })
}
export function getAllHostUser (parameter) {
  return axios({
    url: '/hostUser/getAllHostUser',
    method: 'post',
    data: parameter
  })
}
export function editPermission (parameter) {
  return axios({
    url: '/hostUser/editPermission',
    method: 'post',
    data: parameter
  })
}

