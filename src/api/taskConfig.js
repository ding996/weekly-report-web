import request from '@/utils/request'

export default {
  departmentTaskGet(departmentId) {
    return request({
      url: `/taskConfig/get/${departmentId}`,
      method: 'get'
    })
  },

  save(typeName, departmentId) {
    return request({
      url: `/taskConfig/create`,
      method: 'post',
      params: { typeName, departmentId }
    })
  },

  updateById(id, typeName) {
    return request({
      url: `/taskConfig/update`,
      method: 'post',
      params: { id, typeName }
    })
  },

  delete(id) {
    return request({
      url: `/taskConfig/delete/${id}`,
      method: 'post'
    })
  }
}
