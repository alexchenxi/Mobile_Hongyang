//存放一些其他的数据
const state = {
    projectId: '',
    projectName: '',
    projectIdIndexList: [],
    keepAliveList: [],
    checkedCustomerList: [],
    involveUserIdsArray: [],
    selfChannelCustomerListUpdate: { isUpdate: false, id: '' },
    taskStatus: -1,
    // 案场客户搜索类型
    searchCustomerType: '',
    searchCustomerListType: '',
    //创建任务选择地址对象
    addTaskAddress: {},
    //管理角色用
    projectIdList: [],
    projectLevel: '',
    // 带看确认单 是否保存了签名
    operatoreSaveSign: false,
    saleRoomIds:[]
}
const mutations = {
    SET_PROJECT: (state, data) => {
        state.projectId = data.projectId
        state.projectName = data.projectName
    },
    SET_PROJECT_LIST_INDEX: (state, data) => {
        state.projectIdIndexList = data
    },
    SET_KEEPALIVE: (state, data) => {
        state.keepAliveList = data
    },
    SET_CHECKEDCUSTOMER: (state, data) => {
        state.checkedCustomerList = data
    },
    SET_INVOLVEUSERIDSARRAY: (state, data) => {
        state.involveUserIdsArray = data
    },
    SET_TASKSTATUS: (state, data) => {
        state.taskStatus = data
    },
    SET_SEARCHCUSTOMERTYPE: (state, data) => {
        state.searchCustomerType = data
    },
    SET_SEARCHCUSTOMERLISTTYPE: (state, data) => {
        state.searchCustomerListType = data
    },
    SET_ADDTASKADDRESS: (state, data) => {
        state.addTaskAddress = data
    },
    SET_PROJECTLIST: (state, data) => {
        state.projectIdList = data.projectIdList
        state.projectLevel = data.projectLevel
        state.projectName = data.projectName
        state.projectId = data.projectId
    },
    SET_SAVE_SIGN: (state, data) => {
        state.operatoreSaveSign = data
    },
    SET_SELFCHANNELCUSTOMERLIST_UPDATE: (state, data) => {
        state.selfChannelCustomerListUpdate = data
    },
    SET_SALE_ROOM_IDS: (state, data) => {
        state.saleRoomIds = data
    },
}
const actions = {
    setProject({ commit }, data) {
        commit('SET_PROJECT', data)
    },
    setProjectListIndex({ commit }, data) {
        commit('SET_PROJECT_LIST_INDEX', data)
    },
    setKeepAlive({ commit }, data) {
        commit('SET_KEEPALIVE', data)
    },
    setCheckedCustomer({ commit }, data) {
        commit('SET_CHECKEDCUSTOMER', data)
    },
    setInvolveUserIdsArray({ commit }, data) {
        commit('SET_INVOLVEUSERIDSARRAY', data)
    },
    setTaskStatus({ commit }, data) {
        commit('SET_TASKSTATUS', data)
    },
    setSearchCustomerType({ commit }, data) {
        commit('SET_SEARCHCUSTOMERTYPE', data)
    },
    setSearchCustomerListType({ commit }, data) {
        commit('SET_SEARCHCUSTOMERLISTTYPE', data)
    },
    setAddTaskAddress({ commit }, data) {
        commit('SET_ADDTASKADDRESS', data)
    },
    setProjectList({ commit }, data) {
        commit('SET_PROJECTLIST', data)
    },
    setSaveSign({ commit }, data) {
        commit('SET_SAVE_SIGN', data)
    },
    selfChannelCustomerListUpdate({ commit }, data) {
        commit('SET_SELFCHANNELCUSTOMERLIST_UPDATE', data)
    },
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
}
