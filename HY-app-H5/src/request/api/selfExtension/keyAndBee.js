/**
 * 关键人小蜜蜂相关API
 */
import { post, get } from '@/request/http'

export default {
    // 关键人和小蜜蜂报备
    customerRecApi(params) {
        return post(`/mapi/bee/recommend`, params)
    },
    // 获取我的关键人或我的小蜜蜂列表
    getBeeSubordinateList(params) {
        return post(`/mapi/bee/subordinate/list`, params)
    },
    // 获取我的关键人或我的小蜜蜂状态统计数据 有效无效
    getBeeSubordinateStatistics(params) {
        return post(`/mapi/bee/subordinate/statistics`, params)
    },
    // 解除绑定或删除
    beeLogoff(params) {
        return post(`/mapi/bee/logoff`, params)
    },
    // 小蜜蜂或关键人我的客户列表
    beeCustomerList(params) {
        return post(`/mapi/bee/customer/list`, params)
    },
    // 专员一键报备小蜜蜂报备的客户
    oneClickRecommend(params) {
        return get(`/mapi/bee/recommend/do`, params)
    }
}
