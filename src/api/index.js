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

  getAliPayUserId(data) {
    return this.request({
      url: '/api/frontend/member/update_alipay_user_id',
      data,
      method: 'post',
    })
  }

  getNewAppId() {
    return this.request({
      url: '/api/frontend/alipay/config_info',
    })
  }

  getAliPaySsn(data) {
    return this.request({
      url: '/cmobile/index.php?app=pay&mod=pay_new_xcx',
      data,
      method: 'post',
    })
  }
}

export default new Api()
