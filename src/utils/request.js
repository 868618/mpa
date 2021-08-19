import axios from 'axios'

const { VUE_APP_BASE_URL } = process.env

const request = axios.create({
  baseURL: VUE_APP_BASE_URL, // url = base url + request url
  timeout: 10000, // request timeout
})

// request.interceptors.request.use()

// response interceptor
request.interceptors.response.use((res) => (res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)))

export default request
