/**
 * 管理平台首页相关API
 */
import { post, get } from '@/request/http'

export default {
    // 根据用户获取项目权限层级
    managerProjectList() {
        return get(`/rptapi/manager/project/list`)
    },
    // 获取销售情况统计数据
    managerSalesStatisticsTotal(params) {
        return post(`/rptapi/manager/sales/statistics/total`, params)
    },
    // 销售情况趋势
    managerStatisticsTrend(params) {
        return post('/rptapi/manager/statistics/trend', params)
    },
    // 获取销售情况客户统计数据
    managerCustomerStatisticsTotal(params) {
        return post(`/rptapi/manager/customer/statistics/total`, params)
    }
}
