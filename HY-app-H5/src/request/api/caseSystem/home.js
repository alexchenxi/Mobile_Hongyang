/**
 * 案场首页相关API
 */
import { post, get } from '@/request/http'

export default {
    // 获取我参与的所有项目
    projectListApi(params) {
        return get('/mapi/my/project/list', params)
    },
    // 获取我参与的所有项目
    projectList2Api(params) {
        return get('/mapi/my/project/list2', params)
    },
    // 获取正常客户数据统计
    statisticsApi(params) {
        return get('/mapi/customer/statistics/normal', params)
    },
    // 获取正常客户数据统计
    statisticsDealApi(params) {
        return post('/mapi/customer/statistics/deal/normal', params)
    },
    // 获取未开单提示统计
    getOpenBillNotice(projectId) {
        return get(`/mapi/homePage/getOpenBillNotice/${projectId}`)
    },
    // 获取跟进提醒数据统计
    followingApi(params) {
        return post('/mapi/customer/statistics/alter/following', params)
    },
    // 获取跟进提醒数据统计
    overdueApi(params) {
        return post('/mapi/customer/statistics/alter/overdue', params)
    },
    // 获取案场情况统计
    anChangCondition(params) {
        return post(`/mapi/customer/statistics/anChangCondition`, params)
    },
    // 获取接待中客户列表
    visitingList(params) {
        return post(`/mapi/client/visiting/list`, params)
    },
    //完成客户接待
    receptionDone(params) {
        return post(`/mapi/customer/reception/done/${params.oppId}`)
    },
    //获取问卷列表
    getQuestionnaire(params) {
        return post(`/mapi/questionnaire/getQuestionnaire`, params)
    },
    //保存问卷结果
    saveQuestionnaire(params) {
        return post(`/mapi/questionnaire/submitQuestionnaire`, params)
    },
    //白板客户保存问卷结果
    submitWhiteboardQuestionnaire(params) {
        return post(`/mapi/questionnaire/submitWhiteboardQuestionnaire`, params)
    },
}
