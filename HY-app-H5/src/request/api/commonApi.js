import { post, get } from '@/request/http'
import Vue from 'vue'
export default {
	// 登录
	login(params) {
		return post('/mapi/app/index/login2', params)
	},
	// 自动登录
	autoLogin(params) {
		return post('/mapi/app/index/autologin2', params)
	},
	// 获取当前用户信息
	loginUserInfo() {
		return get('/mapi/my/loginUserInfo')
	},
	// 获取角色和角色下的模块
	getRoleList() {
		return get('/mapi/my/role/list')
	},
	// 根据模块名称获取菜单
	getMenuByModule(moduleId,roleCode) {
		return get(`/mapi/my/menu/list/${roleCode}/${moduleId}`)
	},
	// 根据类别获取字典列表(入参type:查询内容)
	dictList(params) {
		return get('/mapi/app/dict/list', params)
	},
	// 二维码扫码业务处理
	qrcodeApi(params) {
		return post('/mapi/qrcode/info/excute', params)
	},
	// 上传图片接口
	commonUpload() {
		return '/mapi/file/common/upload'
	},
	// api前缀
	apiBase() {
		return process.env.VUE_APP_TYPE === 'signle' ? window.location.origin + process.env.VUE_APP_BASE_API : process.env.VUE_APP_BASE_API
	},
	// 获取下级省份城市
	areaListApi(params) {
		return get('/mapi/app/area/list',params)
	},
	//获取拓客方式
	channelTypeListApi(params) {
		return get('/mapi/extension/channelType/list',params)
	},
	//根据登录用户ID获取参与的进行中的任务列表
	myTaskApi(params) {
		return get('/mapi/extension/myTask/list',params)
	},
	// 上传接口
	uploadFile(params) {
		return post('/mapi/file/common/upload', params)
	},
	// 获取服务器当前时间
	getCurrentTime(projectId) {
		return get(`/mapi/attendance/getConfig/${projectId}`)
	},
	// 检索地理位置
	getLocationInfo(params) {
		return get('/mapi/app/common/location/info',params)
	},
	// 生成短参数
	generateShortScene(params) {
		return post('/mapi/shortScene/generate',params)
	},
    // 发送验证码
    sendCaptcha(params) {
        return post('/mapi/common/sms/sendCaptcha',params)
    },
	// 自渠
	//获取拓客方式
	ztChannelListApi(params) {
		return get('/mapi/channel/ztChannel',params)
	},
}
