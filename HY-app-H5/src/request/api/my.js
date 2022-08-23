/**
 * 我的页面相关API
 */
import { post, get } from '@/request/http'

export default {
    // 修改我的密码
    passwordUpdate(params) {
        return post('/mapi/user/password/update', params)
    },
    // 修改我的头像
    avatarUpdate(params) {
        return post('/mapi/user/avatar/update', params)
    },
    //查询消息列表
    messageList(params) {
        return post('/mapi/my/user/message/list', params)
    },
    //查询自渠消息列表
    selfChannelMessageList(params) {
        return post('/mapi/msg/getNotReadNum', params)
    },
    //查询自渠消息详情
    selfChannelMessageDetail(params) {
        return post('/mapi/msg/getMsgList', params)
    },
    //清除自渠消息已读状态
    selfChannelMessageRead(params) {
        return post('/mapi/msg/clearReadNum', params)
    },
    //查询经理待办中心数量
    selfChannelMyUnbindApplicationCount(params) {
        return post('/mapi/selfChannel/thingToDo', params)
    },
    // 获取置业计划书配置
    planBookSettingInfo() {
        return get(`/mapi/planBook/settingInfo`)
    },
    // 房源获取置业计划书配置
    planBookProjectSettingInfo(params) {
        return get(`/mapi/planBook/projectSettingInfo/${params.projectId}`)
    },
    // 获取版本
    serviceVersion() {
        return get(`/mapi/app/service/version`)
    },
    // 我的带看确认单列表
    getTakelookList(params) {
        return post('/mapi/takelook/my/list', params)
    },
    // 保存签名
    saveSign(params) {
        return post('/mapi/takelook/detail/saveSign', params)
    },
    // 获取带看确认单详情
    getTakelookDetail(recordId) {
        return get(`/mapi/takelook/detail/${recordId}`)
    },
    // 获取我的标签
    getMyTag() {
        return get(`/mapi/userTag/getMyTag`)
    },
    // 录用我的标签
    saveMyTag(params) {
        return post('/mapi/userTag/saveUserTag', params)
    },
    //删除我的标签
    deleteMyTag(params) {
        return post('/mapi/userTag/deleteTag', params)
    },
    // 我的下级经纪人列表
    getMyChildBroker(params) {
        return post('/mapi/selfChannel/getMyChildBroker', params)
    },
    // 获取我的邀请码
    getMyQrcode(projectId,code) {
        return get(`/mapi/selfChannel/getMyQrCode/${projectId}/${code}`)
    },
    //删除我的标签验证
    checkDeleteMyTag(params) {
        return post('/mapi/userTag/checkTag', params)
    },
    //获取我的消息
    messageNum(params) {
        return get('/mapi/my/user/messageNum', params)
    },
}
