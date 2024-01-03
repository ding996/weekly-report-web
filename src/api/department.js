import request from '@/utils/request'

export default {
  getDepartments(departmentId) {
    return request({
      url: `/department/${departmentId}`,
      method: 'get'
    })
  },
  getParentDept(departmentId) {
    return request({
      url: `/findParent/${departmentId}`,
      method: 'get'
    })
  }
}
