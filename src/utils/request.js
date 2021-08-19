import axios from 'axios'
// import config from '@/config'

const { VUE_APP_BASE_URL } = process.env
// const baseURL = config.get(NODE_ENV)

console.log('baseURL----------', process.env)

const request = axios.create({
  baseURL: VUE_APP_BASE_URL, // url = base url + request url
  timeout: 5000, // request timeout
})

request.interceptors.request.use(config => {
  console.log('config+++++++++++', config.data)
  console.log('config-----------', config)
  if (config.data && config.data.token) {
    // config.headers.token = config.data.token
    Object.assign(config.headers, { token: config.data.token })
    // eslint-disable-next-line no-param-reassign
    delete config.data.token
  }
  return Promise.resolve(config)
})

// response interceptor
request.interceptors.response.use((res) => (res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)))

export default request
