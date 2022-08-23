import axios from 'axios'
import { Toast } from 'vant'
axios.defaults.baseURL = process.env.VUE_APP_CAPTCHA_BASE_API

const service = axios.create({
  timeout: 40000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  },
})
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
     // 错误处理
    if (response.data.code !== '200') {
      Toast.clear()
      Toast(response.data.message || 'Error')
    }
    return res
  },
  error => {
  }
)
export default service
