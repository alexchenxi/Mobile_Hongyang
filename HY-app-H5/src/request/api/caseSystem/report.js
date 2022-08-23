/**
 * 案场报表相关API
 */
import { post, get } from '@/request/http'

export default {
    // 案场分析销售团队业绩排行
    getAchievementGroupSort(params) {
        return post('/rptapi/case/achievement/group/sort', params)
    },
    // 案场分析置业顾问团队业绩排行
    getAchievementStaffSort(params) {
        return post('/rptapi/case/achievement/staff/sort', params)
    },
    // 案场分析客户到访趋势
    customerVisitTrend(params) {
        return post('/rptapi/case/customer/visit/trend', params)
    },
    // 案场分析客户趋势统计
    customerTrend(params) {
        return post('/rptapi/case/customer/trend', params)
    },
    // 获取团队筛选
    getTeam(params) {
        return post('/rptapi/sales/group/list', params)
    },
    // 获取客储情况统计数据
    storageStatisticsTotal(params) {
        return post(`/rptapi/storage/customerStore`, params)
    },
    // 客储情况客户漏斗
    customerFilter(params) {
        return post('/rptapi/storage/clientLoophole', params)
    },
    // 客储情况渠道占比
    channelCustomerRate(params) {
        return post('/rptapi/storage/channel1List', params)
    },
    // 客储情况渠道占比
    salesLevelRate(params) {
        return post('/rptapi/storage/salesLevel', params)
    },
    // 客储情况二级渠道占比
    channelTwoCustomerList(params) {
        return post('/rptapi/storage/channel2List', params)
    },
    // 获取客储到访客户趋势
    storageStatisticsTrend(params) {
        return post(`/rptapi/storage/visitTrend`, params)
    },
    // 获取客储置业顾问最新客户等级分布
    storageStaffLevel(params) {
        return post(`/rptapi/storage/staffLevel`, params)
    },
    // 获取客储情况团队目标完成数据
    storageStatisticsGroupTotal(params) {
        return post(`/rptapi/sales/statistics/group/total`, params)
    },
    // 获取销售情况统计数据
    salesStatisticsTotal(params) {
        return post(`/rptapi/sales/statistics/total`, params)
    },
    // 获取本月团队目标值
    getSalesTargetMonth(params) {
        return get(`/rptapi/sales/target/month/get`, params)
    },
    // 设置本月团队目标值
    setSalesTargetMonth(params) {
        return post(`/rptapi/sales/target/month/set`, params)
    },
    // 获取销售情况趋势数据
    salesStatisticsTrend(params) {
        return post(`/rptapi/sales/statistics/trend`, params)
    },
    // 获取自渠团队业绩排行
    achievementGroupSort(params) {
        return post(`/rptapi/storage/achievement/group/sort`, params)
    },
    // 获取自渠专员业绩排行
    achievementStaffSort(params) {
        return post(`/rptapi/storage/achievement/staff/sort`, params)
    },
    // 获取销售团队业绩排行
    salesStatisticsGroupSort(params) {
        return post(`/rptapi/sales/statistics/sortByTeam`, params)
    },
    // 获取销售团队流速趋势
    salesStatisticsSaleFlow(params) {
        return post(`/rptapi/sales/statistics/saleFlow`, params)
    },
    // 获取销售人员业绩排行
    salesStatisticsStaffSort(params) {
        return post(`/rptapi/sales/statistics/sortByZygw`, params)
    },
    // 置业顾问转化率排名
    staffVisitToOrderConversionRate(params) {
        return post(`/rptapi/storage/staffVisitToOrderConversionRate`, params)
    },
}
