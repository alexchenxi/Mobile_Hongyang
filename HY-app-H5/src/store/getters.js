const getters = {
    device: (state) => state.user.device,
    safeArea: (state) => state.user.safeArea,
    user: (state) => state.user.user,
    tabData: (state) => state.menu.tabData,
    projectId: (state) => state.other.projectId,
    projectIdIndexList: (state) => state.other.projectIdIndexList,
    projectName: (state) => state.other.projectName,
    currentRole: (state) => state.user.currentRole,
    roleList: (state) => state.user.roleList,
    keepAliveList: (state) => state.other.keepAliveList,
    codes: (state) => state.user.codes,
    menuActive: (state) => state.menu.menuActive,
    checkedCustomerList: (state) => state.other.checkedCustomerList,
    involveUserIdsArray: (state) => state.other.involveUserIdsArray,
    taskStatus: (state) => state.other.taskStatus,
    searchCustomerType: (state) => state.other.searchCustomerType,
    searchCustomerListType: (state) => state.other.searchCustomerListType,
    addTaskAddress: (state) => state.other.addTaskAddress,
    projectIdList: (state) => state.other.projectIdList,
    projectLevel: (state) => state.other.projectLevel,
    microPrefix: (state) => state.user.microPrefix,
    operatoreSaveSign: (state) => state.other.operatoreSaveSign,
    selfChannelCustomerListUpdate: (state) => state.other.selfChannelCustomerListUpdate,
    saleRoomIds: (state) => state.other.saleRoomIds,
}
export default getters
