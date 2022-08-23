/**
 * 案场白板相关API
 */
import { post, get } from '@/request/http'

export default {
    // 保存白板任务详情
    saveWhiteboard(params) {
        return post(`/mapi/whiteboard/save`, params)
    },
    // 获取白板任务列表
    whiteboardList(params) {
        return post(`/mapi/whiteboard/list`, params)
    },
    // 获取顾问列表
    whiteboardListByStaffId(params) {
        return post(`/mapi/whiteboard/whiteboardListByStaffId`, params)
    },
    // 完成接待
    receptionDone(params) {
        return get(`/mapi/whiteboard/receptionStatus/done/${params.id}`)
    },
    // 获取白板任务详情
    getWhiteboardInfo(params) {
        return get(`/mapi/whiteboard/info/${params.id}`)
    }
}
