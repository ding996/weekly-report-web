import request from '@/utils/request'

export function getDepartmentTask(departmentId) {
  return request({
    url: '/weeklyReport/department/task/get',
    method: 'get',
    params: { departmentId }
  })
}
