/**
 * 成员管理相关API
 */
import { post, get } from '@/request/http'

export default {
	// 获取团队成员列表
	getTeamUserList(params) {
        return post(`/mapi/extension/teamUser/info`, params)
    },
    // 变更团队成员状态
    changeUserStatus(params) {
        return post(`/mapi/extension/user/status/change`, params)
    }
}