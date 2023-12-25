import request from '@/utils/request'
export default {
  get(task) {
    return request({
      url: '/progressReport/task/get',
      method: 'post',
      data: task
    })
  }
}
