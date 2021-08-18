import axios from 'axios'
// import config from '@/config'

const { VUE_APP_BASE_URL } = process.env
// const baseURL = config.get(NODE_ENV)

console.log('baseURL----------', process.env)

const request = axios.create({
  baseURL: VUE_APP_BASE_URL, // url = base url + request url
  timeout: 5000, // request timeout
})

// request.interceptors.request.use()

// response interceptor
request.interceptors.response.use((res) => (res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)))

export default request
