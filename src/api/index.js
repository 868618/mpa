import Http from '@/utils/http'

class Api extends Http {
  getDetail(params) {
    return this.request({
      url: '/cmobile/index.php',
      params,
      method: 'get',
    })
  }
}

export default new Api()
