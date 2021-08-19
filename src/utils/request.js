import axios from 'axios'
// import config from '@/config'

const { VUE_APP_BASE_URL } = process.env
// const baseURL = config.get(NODE_ENV)

console.log('baseURL----------', process.env)

const request = axios.create({
  baseURL: VUE_APP_BASE_URL, // url = base url + request url
  timeout: 10000, // request timeout
})

request.interceptors.request.use(config => {
  console.log('config+++++++++++', config)
  const localConfig = {}
  if (config.url === '/cmobile/index.php?app=pay&mod=pay_new_xcx') {
    console.log('8888')
    const { headers } = config
    Object.assign(headers, { 'Content-Type': 'application/x-www-form-urlencoded' })
    Object.assign(config, { headers })
    Object.assign(localConfig, config)
  } else {
    Object.assign(localConfig, config)
  }
  return Promise.resolve(localConfig)
})

// response interceptor
request.interceptors.response.use((res) => (res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)))

export default request
