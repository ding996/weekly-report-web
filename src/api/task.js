import request from '@/utils/request'

export default {
  getDepartmentTask(departmentId, yearTime) {
    return request({
      url: '/task/department/get',
      method: 'get',
      params: { departmentId, yearTime }
    })
  },
  personTaskList(uid, parentTaskId, type) {
    return request({
      url: '/task/person/list',
      method: 'get',
      params: { uid, parentTaskId, type }
    })
  }
}
