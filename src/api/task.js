import request from '@/utils/request'

export function getDepartmentTask(departmentId) {
  return request({
    url: '/task/department/get',
    method: 'get',
    params: { departmentId }
  })
}
