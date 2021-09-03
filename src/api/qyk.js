import Http from '@/utils/http'

class Qyk extends Http {
  getDCardDetail(params, headers = {}) {
    return this.request({
      url: '/../../api/frontend/card/show',
      params,
      headers,
    })
  }

  /*
        获取 pdr_sn
    */
  recharge(data) {
    return this.request({
      url: '/cmobile/index.php?app=cash&mod=recharge',
      data,
      method: 'POST',
    })
  }

  getAgree(params) {
    return this.request({
      url: '/api/frontend/agreement/index',
      params,
      // method: 'POST',
    })
  }
}

export default new Qyk()
