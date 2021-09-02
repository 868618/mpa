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
      url: '/index.php?app=cash&mod=recharge',
      data,
      method: 'POST',
    })
  }
}

export default new Qyk()
