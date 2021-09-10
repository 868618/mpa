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
}

export default new Pub()
