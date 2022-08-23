/**
 * @author jinming
 * @date 2020/9/13 12:54
 * @desc 封装axios请求数据
 */
import Axios from 'axios'

import API from '@/request/api/commonApi'
import { Toast } from 'vant'
import router from '@/router'
import store from '@/store'
import Vue from 'vue'
// 创建axios实例
const axios = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60000 // 超时时间
})
// 请求拦截
axios.interceptors.request.use(
  config => {
    const token = localStorage.token
    if (token) {
      // 设置令牌请求头
      config.headers.Authorization = token
    }
    if(process.env.VUE_APP_TYPE === 'saas') {
      config.headers['Company-No'] =  localStorage.companyNo
    }
    return config
  },
  error => {
    // 请求错误预处理
    return Promise.reject(error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  // 通过自定义code判定响应状态，也可以通过HTTP状态码判定
  response => {
    // token失效
    if (response.data.code === 10001) {
      // 自动登录
      if (localStorage.isAutoLogin === 'true') {
        API.autoLogin({
          accessToken: localStorage.getItem('accessToken')
        }).then(res => {
          store.dispatch('user/setUserInfo', res)
          localStorage.setItem('token', res.token)
        }).catch(() => {
            localStorage.setItem('isAutoLogin', false)
            router.push('/login')
        })
      } else {
        router.push('/login')
      }
      return
    }
    if([10002,10003,10004,10005,10006,10007,10008,10009].includes(response.data.code)){
      // 10002 生成用户活跃记录错误
      // 10003 token解析错误
      // 10004 token错误
      // 10005 账号已冻结，登录失败
      // 10006 归属上级账号冻结，登录失败
      // 10007 重新绑定成功，请重新登录
      // 10008 目前无归属上级，登录失败
      // 10009 账号已被删除，登录失败
      Toast.clear()
      Toast(response.data.message || 'Error')
      router.push('/login')
      return
    }
    // 错误处理
    if (response.data.code !== 200) {
      Toast.clear()
      Toast(response.data.message || 'Error')
      return Promise.reject(response.data.message || 'Error')
    }
    return response.data
  },
  error => {
    Toast.clear()
    let errMsg = 'Error'
    if (error.hasOwnProperty('code') && error.code === 'ECONNABORTED') {
      // 超时
      errMsg = '系统繁忙，请稍后重试'
    } else if (error.hasOwnProperty('response') && error.response && error.response.data && error.response.data.message) {
      errMsg = error.response.data.message
    } else if (error.hasOwnProperty('message') && error.message) {
      errMsg = error.message
      if(error.message === 'Network Error') {
        errMsg = '无网络连接'
      }
    }
    Toast(errMsg)
    return Promise.reject(errMsg)
  }
)

export default axios

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
