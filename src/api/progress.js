import request from '@/utils/request'
export default {
  get(task) {
    return request({
      // 获取部门该总体任务的所有进度
      url: '/progressReport/task/get',
      method: 'post',
      data: task
    })
  },
  saveOrUpdate(progressReportVO) {
    return request({
      url: '/progressReport/saveOrUpdate',
      method: 'post',
      data: progressReportVO
    })
  },
  personGet(uid, taskId, type) {
    return request({
      url: '/progressReport/task/person/get',
      method: 'get',
      params: { uid, taskId, type }
    })
  }
}
