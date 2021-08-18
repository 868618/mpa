import Http from '@/utils/http'

class Api extends Http {
  getDetail(params) {
    return this.request({
      url: '/cmobile/index.php?app=userorder&mod=order_info_xcx',
      params,
      method: 'get',
    })
  }

  getScheme(data) {
    return this.request({
      url: '/api/frontend/tool/scheme',
      data,
      method: 'post',
    })
  }
}

export default new Api()
