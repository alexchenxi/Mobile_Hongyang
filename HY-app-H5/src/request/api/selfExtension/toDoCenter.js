/**
 * 待办中心相关API
 */
import { post, get } from '@/request/http'

export default {
    // 获取解绑列表
    getToDoList(params) {
        return post(`/mapi/selfChannel/myUnbindApplicationList`, params)
    },
    // 获取补卡列表
    getMySignApplication(params) {
        return post(`/mapi/attendance/getMySignApplication`, params)
    },
    //同意
    updateUnbindApplicationList(params) {
        return post(`/mapi/selfChannel/updateUnbindApplicationList`, params)
    },
    //同意补卡申请
    auditApplication(params) {
        return post(`/mapi/attendance/auditApplication`, params)
    },
}
