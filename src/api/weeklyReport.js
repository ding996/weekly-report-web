import request from '@/utils/request'

export default {
  getDepartmentReport(departmentId, week) {
    return request({
      url: `/weeklyReport/department/${departmentId}`,
      method: 'get',
      params: { week }
    })
  },
  getPersonalReport(uid) {
    return request({
      url: `/weeklyReport/person/${uid}`,
      method: 'get'
    })
  }
}
