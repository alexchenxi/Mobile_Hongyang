/**
 * 自渠客户相关API
 */
import { post, get } from '@/request/http'

export default {
	// 客户详情
	customerDetail(params) {
		return get(`/mapi/extension/customerDetail`,params)
	},
	//报备
	customerRecApi(params) {
		return post(`/mapi/judge/recommend`,params)
    },
    //获取客户列表数据
    getCustomerList(params) {
        return post(`/mapi/extension/customer/list`, params)
    },
    //根据项目获取自拓人员列表
    getTeamUser(params) {
        return post(`/mapi/extension/teamUser`, params)
    },
    //设置客户标签
    customerTagSave(params) {
        return post(`/mapi/extension/customer/tag/add`, params)
    },
    //修改客户姓名
    updateCustomer(params) {
        return post(`/mapi/extension/updateCustomer`, params)
    },
    // 获取客户基本信息
    getCustomerBaseInfo(params) {
        return get(`/mapi/extension/customer/info`, params)
    },
    // 重新报备
    recommendAgain(params) {
        return post(`/mapi/judge/recommendAgain`, params)
    },
    // 删除待报备客户
    deleteCustomer(params) {
		return get(`/mapi/bee/customer/delete`,params)
    },
    //获取客户时间轴
    getTimelinesApi(params) {
        return post('/mapi/customer/info/timelines', params)
    },
    // 收藏客户
    changeClientFav(params) {
        return post('/mapi/extension/customer/makeImportance', params)
    },
     // 分配客户渠道专员外层列表
     selfChannelAssignGroupByUserId(params) {
        return post('/mapi/extension/selfChannelAssignGroupByUserId', params)
    },
    // 分配客户渠道专员内层列表
    selfChannelAssignListByUserId(params) {
        return post('/mapi/extension/selfChannelAssignListByUserId', params)
    },
    // 分配自渠人员列表
    selfChannelMemberList(params) {
        return post('/mapi/extension/selfChannelMemberList', params)
    },
    //分配自渠成员
    assignCustomer(params) {
        return post('/mapi/extension/assignCustomer', params)
    },
     // 自渠下线经纪人外层列表
    childBrokerGroupList(params) {
        return post('/mapi/selfChannel/childBrokerGroupList', params)
    },
    // 分配客户渠道专员内层列表
    childBrokerGroupListByUserId(params) {
        return post('/mapi/selfChannel/childBrokerGroupListByUserId', params)
    },
    //分配自渠下线经纪人
    selfChannelAssignCustomer(params) {
        return post('/mapi/selfChannel/assignCustomer', params)
    },
    //分配自渠下线经纪人
    getChildBrokerCount(params) {
        return post('/mapi/selfChannel/getChildBrokerCount', params)
    },
}
