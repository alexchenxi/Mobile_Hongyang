/**
 * 成员管理相关API
 */
import { post, get } from '@/request/http'

export default {
    // 获取签到打卡记录
    attendanceQuery(params) {
        return get(`/mapi/attendance/sign/query`, params)
    },
    // 获取成员考勤记录列表
    attendanceMemberList(params) {
        return post(`/mapi/attendance/member/sign/list`, params)
    },
    // 获取成员考勤记录详情
    getMemberSignDetail(userId, params) {
        return get(`/mapi/attendance/member/sign/detail/${userId}`, params)
    },
    //保存签到打卡记录
    signSaveApi(params) {
        return post(`/mapi/attendance/sign/save`, params)
    },
    //是否在签到范围内
    checkSign(params) {
        return post(`/mapi/attendance/checkSign`, params)
    },
    // 根据用户获取任务任务签到记录
    clockInQuery(params) {
        return get(`/mapi/attendance/clock/query`, params)
    },
    // 根据用户获取签到记录(考勤签到)
    queryMySign(projectId) {
        return get(`/mapi/attendance/queryMySign/${projectId}`)
    },
    // 获取成员打卡记录列表
    clockInMembers(params) {
        return post(`/mapi/attendance/member/clock/list`, params)
    },
    // 获取成员打卡记录列表
    getSignDate(params) {
        return post(`/mapi/attendance/getSignDate`, params)
    },
    // 获取成员本月及当日补卡次数
    getApplicationNum(params) {
        return get(`/mapi/attendance/getApplicationNum/${params.projectId}/${params.date}`)
    },
    // 申请补卡
    signApplication(params) {
        return post(`/mapi/attendance/signApplication`, params)
    },

    // 根据项目和时间获取任务列表
    attendanceTaskList(params) {
        return get(`/mapi/attendance/task/list`, params)
    },
    // 获取所有进行中任务的成员坐标列表
    getTrackLatestPoint(params) {
        return post(`/mapi/attendance/track/latestPoint`, params)
    },
    // 获取人员轨迹
    getTrackPath(userId) {
        return get(`/mapi/attendance/track/trace/${userId}`)
    },
    // 获取当日置业顾问签到情况
    getSignStaffList(params) {
        return post(`/mapi/staff/getSignStaffList`, params)
    },
    // 获取报表当日置业顾问签到情况
    getReportSignStaffList(params) {
        return post(`/rptapi/storage/signStaffList`, params)
    },
    // 获取报表自渠成员签到情况
    getSelfChannelSignStaffList(params) {
        return post(`/rptapi/storage/selfChannelSignList`, params)
    },
}
