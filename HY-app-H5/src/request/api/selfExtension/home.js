/**
 * 自渠首页相关API
 */
import { post, get } from '@/request/http'

export default {
	// 获取任务的统计数据
	projectTaskApi(params) {
		return post('/mapi/extension/projectTask/list', params)
    },
    // 获取所有任务ID列表
	getAllTaskId(params) {
		return get('/mapi/extension/taskId/list', params)
    },
    // 获取任务详情
	getTaskDetail(params) {
		return get('/mapi/extension/task/detail', params)
	},
	// 获取小蜜蜂是否已有团队
	getBeeRebindInfo(params) {
		return post('/mapi/bee/app/rebind/alert', params)
	},
	// 小蜜蜂重新绑定
	beeRebind(params) {
		return post('/mapi/bee/app/rebind/confirm', params)
    },
    //获取今日报备和今日到访数据
    todayReportAndVisitAndProtectDateOverdueCount(params) {
        return post('/mapi/selfChannel/statistics', params)
    },
    //获取客户逾期数据
    protectDateOverdueCount(params) {
        return post('/mapi/selfChannel/protectDateOverdueCount', params)
    },
	//查询自渠消息列表
	selfChannelMessageList(params) {
        return post('/mapi/msg/getNotReadNum', params)
    },
}
