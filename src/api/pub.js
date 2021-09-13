import Http from '@/utils/http'

import api from '@/api'

const { getScheme, getNewAppId } = api

class Pub extends Http {
  upLoadFile({ key, flag, param }) {
    return this.request({
      url: `/cmobile/index.php?app=usercenter&mod=upload&key=${key}&flag=${flag}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: param,
      method: 'post',
    })
  }

  getScheme = getScheme

  getNewAppId = getNewAppId

  getAppId(params) {
    return this.request({
      url: '/api/frontend/oauth/oauth/get_config',
      params,
    })
  }

  getOpenId(params) {
    return this.request({
      params,
      url: '/api/frontend/oauth/oauth/index',
    })
  }

  refreshPayStatus(data) {
    console.log('data________________', data)
    return this.request({
      url: '/api/frontend/cash/cash/index',
      data,
    })
  }
}

export default new Pub()
