/**
 * 管理报表相关API
 */
import { post, get } from '@/request/http'

export default {
    // 根据用户获取渠道权限列表
    getChannelList() {
        return get('/rptapi/manager/channel/list')
    },
    // 渠道情况统计数据
    channelStatisticsTotal(params) {
        return post('/rptapi/manager/channel/statistics/total', params)
    },
    // 渠道情况客户漏斗
    channelCustomerFilter(params) {
        return post('/rptapi/manager/channel/customer/filter', params)
    },
    // 渠道情况渠道占比
    channelCustomerRate(params) {
        return post('/rptapi/manager/channel/customer/rate', params)
    },
    // 渠道情况渠道统计
    channelCustomerAnalysis(params) {
        return post('/rptapi/manager/channel/customer/analysis', params)
    },
    // 销售情况统计数据
    managerSalesStatisticsAnalysis(params) {
        return post(`/rptapi/manager/sales/statistics/analysis`, params)
    },
    // 销售情况趋势分析
    managerSalesStatisticsTrend(params) {
        return post(`/rptapi/manager/sales/statistics/trend`, params)
    },
    // 销售情况项目排行
    managerAchievementProject(params) {
        return post(`/rptapi/manager/achievement/project/sort`, params)
    },
    // 获取项目目标值
    getManagerTargetProject(params) {
        return post(`/rptapi/manager/target/project/get`, params)
    },
    // 维护项目目标值
    setManagerTargetProject(params) {
        return post(`/rptapi/manager/target/project/set`, params)
    },
}
