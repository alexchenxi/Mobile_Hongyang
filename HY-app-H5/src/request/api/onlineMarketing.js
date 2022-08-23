/**
 * 在线营销相关API
 */
import { post, get } from '@/request/http'

export default {
    // 获取项目下的AI名片
    getAICardByProjectId(projectId) {
        return get(`/mapi/ai/card/info/${projectId}`)
    },
    // 获取最新物料信息
    getHomeLastThings(params) {
        return get('/mapi/portal/home/lastThings', params)
    },
    // 获取AI名片详情
    getAICardDetail(id) {
        return get(`/mapi/ai/card/detail/${id}`)
    },
    // 保存AI名片详情
    saveAICard(params) {
        return post('/mapi/ai/card/save', params)
    },
    // 获取楼盘详情
    getProjectDetail(params) {
        return get('/mapi/project/lp/detail', params)
    },
    // 获取户型
    getUnitTypeList(projectId) {
        return get(`/mapi/project/huxingtu/list/${projectId}`)
    },
    // 获取户型详情
    getUnitTypeDetail(params) {
        return get('/mapi/project/huxingtu/detail', params)
    },
    // 获取楼盘更多信息
    getMoreProjectInfo(params) {
        return get('/mapi/project/lp/moreInfo', params)
    },
    /************ 物料管理 ************/
    // 广告列表
    getAdList(params) {
        return post('/mapi/portal/ad/list', params)
    },
    // 广告详情
    getAdDetail(params) {
        return get(`/mapi/portal/ad/detail/${params.id}`)
    },
    // 资讯列表
    getNewsList(params) {
        return post('/mapi/portal/news/list', params)
    },
    // 资讯详情
    getNewsDetail(params) {
        return get(`/mapi/portal/news/detail/${params.id}`)
    },
    // 优惠券列表
    getMaterielList(params) {
        return post('/mapi/portal/materiel/list', params)
    },
    // 优惠券详情
    getMaterielDetail(params) {
        return get(`/mapi/portal/materiel/detail/${params.id}`)
    },
    // 获取小程序物品拓客二维码
    qrcodeGenerate(params) {
        return post('/mapi/qrcode/extendCustomer/generate', params)
    }
}
