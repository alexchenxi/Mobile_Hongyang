/**
 * 案场客户相关API
 */
import { post, get } from '@/request/http'

export default {
    //	获取房源列表统计数据
    summaryListApi(params) {
        return post('/mapi/house/summary/list', params)
    },
    //	按分期获取房源统计数据
    summaryByStageListApi(params) {
        return post('/mapi/house/summaryByStage/list', params)
    },
    //根据分期获取楼栋列表
    houseBuildingListApi(params) {
        return get('/mapi/house/building/list/' + params.projectId, params)
    },
    //根据楼栋获取单元列表
    houseUnitListApi(params) {
        return get('/mapi/house/unit/list/' + params.projectId, params)
    },
    //	获取房间详情
    houseDetailApi(params) {
        return post('/rptapi/house/detail/info', params)
    },
    //	查看房源列表
    houseTileListApi(params) {
        return post('/mapi/house/tile/list', params)
    },
    //	查看房源列表(二级销控页面)
    houseDetailListApi(params) {
        return post('/mapi/house/detail/list', params)
    },
    //	批量更新房间状态（销控推盘）
    houseStatusUpdateApi(params) {
        return post('/mapi/house/status/update', params)
    },
    //	查询所有单据(房源交易订单使用)
    getBillList(params) {
        return post('/mapi/trade/form/list', params)
    },
    // 单据维度-- 获取所有下级置业顾问列表及单据数(房源交易订单使用)
    getSubsalesList(params) {
        return post('/mapi/trade/form/subsales/list', params)
    },
    // 查询下级置业顾问的所有单据数据(房源交易订单使用)
    getBillListByStaff(params) {
        return post('/mapi/trade/form/staff/list', params)
    },
    // 按分期查看所有房源（平铺）
    getHouseListByStage(params) {
        return post('/mapi/house/tile/listByStage', params)
    },

    saveSalesControl(params) {
        return post('/mapi/house/update/salesControl', params)
    },
    otherSetting(projectId) {
        return get(`/mapi/case/other/setting/${projectId}`)
    },
}
