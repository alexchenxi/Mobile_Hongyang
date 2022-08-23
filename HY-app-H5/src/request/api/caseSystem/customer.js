/**
 * 案场客户相关API
 */
import { post, get } from '@/request/http'

export default {
    // 客户列表
    customerList(dataType, params) {
        return post(`/mapi/customer/list/${dataType}`, params)
    },
    // 搜索客户列表不分页
    searchCustomerList(params) {
        return post('/mapi/client/searchCustomer', params)
    },
    //保存客户标签
    customerTagSave(params) {
        return post('/mapi/customer/desc/save', params)
    },
    //客户详情表单
    customerFormApi(params) {
        return post('/mapi/customer/info/detail', params)
    },
    //完成客户接待
    receptionDone(params) {
        return post(`/mapi/customer/reception/done/${params.oppId}`)
    },
    //客户详情上半部分信息
    customerInfoApi(params) {
        return post('/mapi/customer/info/following', params)
    },
    //弃客api
    abandonApi(params) {
        return post('/mapi/client/abandon', params)
    },
    //无效客户api
    abandonQuestionnaire(params) {
        return post('/mapi/client/abandonQuestionnaire', params)
    },
    //收藏客户
    customerFavUpdate(params) {
        return post('/mapi/customer/fav/update', params)
    },
    //置业顾问标签-获取客户被绑标签
    getTagOnCustomer(params) {
        return post(`/mapi/userTag/getTagOnCustomer/${params.clientId}`)
    },
    // 置业顾问标签-为客户绑定标签
    bindTagOnCustomer(params) {
        return post('/mapi/userTag/bindTagOnCustomer', params)
    },
    //客户详情基本信息表单
    customerPurposeApi(params) {
        return post('/mapi/customer/info/purpose', params)
    },
    // 录入客户
    customerCreate(params) {
        return post('/mapi/customer/create', params)
    },
    //客户商机跟进信息
    infoFollowing(params) {
        return post('/mapi/customer/info/following', params)
    },
    //新增跟进记录
    followRecordAdd(params) {
        return post('/mapi/extension/followRecord/add', params)
    },
    //获取案场跟进规则
    getCaseFollowRule(projectId) {
        return get(`/mapi/case/rule/detail/${projectId}`)
    },
    //获取置业顾问团队列表
    staffSalesList(params) {
        return post('/mapi/staff/sales/list', params)
    },
    //我的预约客户列表
    getMyAppointmentList(params) {
        return post('/mapi/appointment/getMyAppointmentList', params)
    },
    //分客预约客户列表
    getAppointmentListByStaffId(params) {
        return post('/mapi/appointment/getAppointmentListByStaffId', params)
    },
    //分客客户列表获取
    getClientListBySubSale(params) {
        return post('/mapi/staff/getClientListBySubSale', params)
    },
    //有效/无效
    updateAppointment(params) {
        return post('/mapi/appointment/updateAppointment', params)
    },
    //获取客户时间轴
    getTimelinesApi(params) {
        return post('/mapi/customer/info/timelines', params)
    },
    //分配置业顾问
    assignCustomerStaff(params) {
        return post('/mapi/customer/staff/assign', params)
    },
    // 新增联名客户
    addJointCustomer(params) {
        return post('/mapi/customer/saveOrUpdateJointCustomer', params)
    },
    // 获取联名客户
    getJointCustomer(mainCustomerId) {
        return get(`/mapi/customer/getJointCustomer/${mainCustomerId}`)
    },
    //获取渠道来源
    channelList(params) {
        return get('/mapi/channel/list', params)
    },
    //更新客户基本资料和购房意向信息
    updateDetailAndPurpose(params) {
        return post('/mapi/customer/info/detailAndPurpose', params)
    },
    //拨打电话更新客户更新时间
    customerCall(params) {
        return get('/mapi/customer/call', params)
    },
    // 获取客户汇总列表数据
    getClientTotalList(params) {
        return post('/mapi/client/total/list', params)
    },
    // 获取客户列表数据
    getClientList(params) {
        return post('/mapi/client/list', params)
    },
    // 获取收藏客户列表数据
    getClientFavList(params) {
        return post('/mapi/client/fav/list', params)
    },
    // 更新客户收藏状态
    changeClientFav(params) {
        return post('/mapi/client/fav/change', params)
    },
    // 获取认知途径
    treeByChanne(params) {
        return get('/mapi/app/cognitionChannel/treeByChannel', params)
    },
    // 获取接待中所有下级置业顾问列表
    getReceptionGroupByStaff(params) {
        return post('/mapi/staff/getReceptionGroupByStaff', params)
    },
    // 获取所有下级置业顾问列表
    staffSubsalesList(params) {
        return post('/mapi/staff/subsales/list', params)
    },
    getTotalClientList(params) {
        return post('/mapi/client/getTotalClientList', params)
    },
    // 查询置业顾问的所有客户列表
    staffClientList(params) {
        return post('/mapi/staff/client/list', params)
    },
    // 查询接待中置业顾问的所有客户列表
    getReceptionByStaff(params) {
        return post('/mapi/staff/getReceptionByStaff', params)
    },
    //分配置业顾问
    staffAssign(params) {
        return post('/mapi/client/staff/assign', params)
    },
    // 客户列表（首页穿透）
    clientListByMenu(params) {
        return post('/mapi/client/listByMenu', params)
    },
    // 弃客原因
    abandonReason(params) {
        return get('/mapi/client/abandon/reason', params)
    },
    // 公客池抢客
    scrambleClient(params) {
        return get('/mapi/client/scramble', params)
    },
    // 单笔完成接待数据统计
    getReceptionServiceSummary(params) {
        return post('/mapi/reception/service/summary', params)
    },
    // 查询所有单据
    getFormList(params) {
        return post('/mapi/form/list', params)
    },
    // 单据详情
    getFormDetail(params) {
        return get(`/mapi/trade/formInfo/${params.oppId}/${params.tradeType}/${params.formId}`)
    },
    // 单据维度获取所有下级置业顾问列表
    getFormSubsalesList(params) {
        return post('/mapi/form/subsales/list', params)
    },
    // 查询下级置业顾问的所有单据数据
    getFormStaffList(params) {
        return post('/mapi/form/staff/list', params)
    },
    // 获取项目下的小组列表
    getTeamGroupList(params) {
        return post('/mapi/team/group/list', params)
    },
    // 查询下级置业顾问的所有单据数据
    getTradeFormList(params) {
        return post(`/mapi/trade/formList/${params.oppId}`, params)
    },
    // 根据项目获取销售登记类型
    getAcChildChannel(projectId) {
        return get(`/mapi/channel/acChildChannel/${projectId}`)
    },
    // 获取二级渠道数据
    getAcChildChannels() {
        return get('/mapi/channel/acChildChannels')
    },
    // 获取登记客户列表
    getInputCustomerList(params) {
        return post('/mapi/inputCustomer/customer/list', params)
    },
    // 更新问询客户收藏状态
    favInputCustomer(params) {
        return post('/mapi/inputCustomer/fav/change', params)
    },
    // 收藏登记客户列表
    favInputCustomerList(params) {
        return post('/mapi/inputCustomer/fav/list', params)
    },
    //登记的的置业顾问列表
    registerCustomer(params) {
        return post('/mapi/staff/subsales/clueFavlist', params)
    },
    // 接待的置业顾问列表
    receiveCustomer(params) {
        return post('/mapi/staff/subsales/clientFavlist', params)
    },
    // 销售登记所有下级置业顾问列表
    subsalesInputCustomerList(params) {
        return post('/mapi/inputCustomer/subsales/list', params)
    },
    // 问询客户根据置业顾问获取客户列表
    clientInputCustomerList(params) {
        return post('/mapi/inputCustomer/client/list', params)
    },
    // 确认分配置业顾问（销售登记)
    assignInputCustomer(params) {
        return post('/mapi/inputCustomer/recommender/assign', params)
    },
    // 确认分配置业顾问（预约客户)
    assignAppointment(params) {
        return post('/mapi/staff/assignAppointment', params)
    },
    // 问询客户详情
    getInputCustomerDetail(params) {
        return get('/mapi/inputCustomer/customerDetail', params)
    },
    // 问询客户维度所有下级置业顾问列表
    inputCustomerSubsalesList(params) {
        return post('/mapi/inputCustomer/subsales/list', params)
    },
    // 问询客户根据置业顾问获取客户列表
    inputCustomerClientList(params) {
        return post('/mapi/inputCustomer/client/list', params)
    },
    // 确认分配置业顾问（销售登记）
    inputCustomerRecommenderAssign(params) {
        return post('/mapi/inputCustomer/recommender/assign', params)
    },
    // 获取认知途径列表
    cognitionChannelTree() {
        return get('/mapi/app/cognitionChannel/tree')
    },
    // 获取未获电客户
    getCustomerNoTel(params) {
        return post('/mapi/portal/sysUser/customer/noTel', params)
    },
    // 获取已获电客户
    getCustomerTel(params) {
        return post('/mapi/latent/customer/list', params)
    },
    // 已获电客户获取所有置业顾问
    getLatentSubsales(params) {
        return post('/mapi/latent/subsales/list', params)
    },
    // 分配客户获取所有置业顾问
    getSubSalesList(params) {
        return post('/mapi/staff/getSubSalesList', params)
    },
    // 首页获取所有置业顾问
    getListByMenuGroupByStaff(params) {
        return post('/mapi/client/listByMenuGroupByStaff', params)
    },
    // 根据置业顾问id获取客户
    getCustomerTelByStaff(params) {
        return post('/mapi/latent/client/list', params)
    },
    // 已获电未获电客户详情信息
    getPhoneUserDetail(params) {
        return get('/mapi/portal/customer/detail', params)
    },
    //获取置业顾问今日跟客情况
    getFollowGroupByStaff(params) {
        return post('/mapi/staff/getFollowGroupByStaff', params)
    },
    //获取客户今日跟客情况
    getFollowByStaff(params) {
        return post('/mapi/staff/getFollowByStaff', params)
    },
    //置业顾问首页穿透客户列表
    getNormalDetail(params) {
        return post('/mapi/customer/statistics/normal/detail', params)
    },
    //获取案场经理首页看板首复访置业顾问
    getStatisticsGroupByStaff(params) {
        return post('/mapi/customer/statistics/deal/normal/group', params)
    },
    //获取案场经理首页看板首复访置业顾问名下客户
    getStatisticsGroupDetail(params) {
        return post('/mapi/customer/statistics/deal/normal/detail', params)
    },
    //获取案场经理首页数据看板认购签约客户列表
    getHomeStatisticsOrderAndSignDetail(params) {
        return post('/mapi/customer/statistics/trade/normal/detail', params)
    },
    //获取案场经理排行报备客户列表
    getRankRecommendDetail(params) {
        return post('/rptapi/storage/achievement/recommend/detail', params)
    },
    //获取案场经理排行到访客户列表
    getRankVisitDetail(params) {
        return post('/rptapi/storage/achievement/visit/detail', params)
    },
    //获取案场经理排行团队认购签约客户列表
    getRankGroupOrderDetail(params) {
        return post('/rptapi/storage/achievement/group/trade/detail', params)
    },
    //获取案场经理排行人员认购签约客户列表
    getRankStafflOrderDetail(params) {
        return post('/rptapi/storage/achievement/staff/trade/detail', params)
    },
    //获取案场经理渠道占比排行报备客户列表
    getChannelRecommendDetail(params) {
        return post('/rptapi/storage/channel2List/recommend/detail', params)
    },
    //获取案场经理渠道占比排行到访客户列表
    getChannelVisitDetail(params) {
        return post('/rptapi/storage/channel2List/visit/detail', params)
    },
    //获取案场经理渠道占比排行认购客户列表
    getChannelOrderDetail(params) {
        return post('/rptapi/storage/channel2List/order/detail', params)
    },
    //获取案场经理渠道占比排行签约客户列表
    getChannelContractDetail(params) {
        return post('/rptapi/storage/channel2List/contract/detail', params)
    },
    //获取案场经理数据看板首付访客户列表
    getRankVisitList(params) {
        return post('/rptapi/storage/visitList', params)
    },
    //获取案场经理销售报表首访量详情
    getVisitDetailByStaff(params) {
        return post('/rptapi/storage/getVisitDetailByStaff', params)
    },
    //获取案场经理数据看板报备客户列表
    getRankReportList(params) {
        return post('/rptapi/storage/reportList', params)
    },
    // 获取案场经理销售情况排行认购客户列表
    getRankOrdertList(params) {
        return post('/rptapi/sales/statistics/orderDetail', params)
    },
    // 获取案场经理销售情况-置业顾问到访客户等级分布-认购详情列表
    getOrderDetailByStaff(params) {
        return post('/rptapi/storage/getOrderDetailByStaff', params)
    },
    // 获取案场经理销售情况排行签约客户列表
    getRankSigntList(params) {
        return post('/rptapi/sales/statistics/signDetail', params)
    },
    // 获取案场经理销售情况数据看板认未签客户列表
    getStatisticsNoSigntList(params) {
        return post('/rptapi/sales/statistics/nosignDetail', params)
    },
    // 获取置业顾问最新客户等级分布详情
    getStaffLevelDetail(params) {
        return post('/rptapi/extension/achievement/staffLevel/detail', params)
    },
    // 校验手机号是否参与活动
    checkActSignUp(phone) {
        return post(`/mapi/customer/checkActSignUp?usePhone=${phone}`)
    },
}
