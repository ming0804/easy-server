import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/auth/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permission = store.getters.permission
    const permissionRoles = value
    const hasPermission = permission.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
