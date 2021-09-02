import Http from '@/utils/http'

class Qyk extends Http {
  getDCardDetail(params, headers = {}) {
    return this.request({
      url: '/../../api/frontend/card/show',
      params,
      headers,
    })
  }
}

export default new Qyk()
