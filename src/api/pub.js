import Http from '@/utils/http'

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
}

export default new Pub()
