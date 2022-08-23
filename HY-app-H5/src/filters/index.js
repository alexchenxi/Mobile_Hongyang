/**
 * 全局过滤器文件
 */
import Vue from 'vue'
import store from '@/store'
import { commonMethods } from 'movit-utils'
/**
 * 隐号 前三后四
 */
Vue.filter('hidePhone', function (value, canEdit, code) {
    if (!value) return ''
    if (value === '--') return value

    // 判断是自己客户全号展示 或有后台显示手机号权限
    if (canEdit || store.getters.codes.includes(code)) {
        return value
    }
    let start = value.substring(0, 3),
        end = value.substring(7)
    return start + '****' + end
})
Vue.filter('numFormat', function (value) {
    if (!value) return 0
    if (value === '--') return value
    value = value.toString()
    let reg = value.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g
    return value.replace(reg, '$1,')
})
