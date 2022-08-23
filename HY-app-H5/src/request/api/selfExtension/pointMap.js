/**
 * 自渠拓客图相关API
 */
 import { post, get } from '@/request/http'

 export default {
     // 获取项目拓客点数据
     getPointList(params) {
         return post('/mapi/point/list', params)
     },
 }
