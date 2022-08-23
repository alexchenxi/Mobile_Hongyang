/**
 * 自渠任务相关API
 */
import { post, get } from '@/request/http'

export default {
	//获取任务列表
	getTaskList(params) {
		return post(`/mapi/extension/task/list`, params)
	},
	//任务保存
	saveTask(params) {
		return post(`/mapi/extension/task/save`, params)
	},
	// 获取所有任务id
	getAllTaskId(params) {
		return get(`/mapi/extension/taskId/list`,params)
	},
	//根据项目获取下级成员列表
	teamUserList(params) {
		return get(`/mapi/extension/subordinate/teamUser`, params)
	},
	//终止任务
	changeAutoStatus(params) {
		return post(`/mapi/extension/task/changeAutoStatus`, params)
	},
	// 获取任务详情
	getTaskDetail(params){
		return get(`/mapi/extension/task/detail`, params)
	},
	// 获取任务签到详情
	getClockDetail(clockId) {
		return get(`/mapi/attendance/clock/detail/${clockId}`)
	},
	// 保存用户任务任务签到记录
	saveClockApi(params) {
		return post(`/mapi/attendance/clock/save`,params)
	}
}
