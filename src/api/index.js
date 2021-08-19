import Http from '@/utils/http'

class Api extends Http {
  getDetail(params, headers = { abc: 123 }) {
    return this.request({
      url: '/cmobile/index.php?app=userorder&mod=order_info_xcx',
      params,
      method: 'get',
      headers,
    })
  }

  getScheme(data) {
    return this.request({
      url: '/api/frontend/tool/scheme',
      data,
      method: 'post',
    })
  }

  getAliPayUserId(data, headers = {}) {
    return this.request({
      url: '/api/frontend/member/update_alipay_user_id',
      data,
      headers,
      method: 'post',
    })
  }
}

export default new Api()
