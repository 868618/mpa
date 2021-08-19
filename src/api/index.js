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

  getAliPayUserId(params, headers = {}) {
    return this.request({
      url: '/api/frontend/member/update_alipay_user_id',
      params,
      headers,
      method: 'get',
    })
  }
}

export default new Api()
