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

export function redisStatus (parameter) {
  return axios({
    url: '/redis/status',
    method: 'post',
    data: parameter
  })
}

export function redisEdit (parameter) {
  return axios({
    url: '/redis/edit',
    method: 'post',
    data: parameter
  })
}
export function redisStart (parameter) {
  return axios({
    url: '/redis/start',
    method: 'post',
    data: parameter
  })
}
