const state = {
  // app环境（2：安卓环境，1：ios环境）
  device: null,
  // 安全区域
  safeArea: {
    bottomSafe: 0,
    leftSafe: 0,
    rightSafe: 0,
    topSafe: 20,
  },
  // 用户信息
  user: {},
  // 角色列表
  roleList: [],
  // 当前角色
  currentRole: {},
  // 用户权限code
  codes: [],
  // saas部署路由前缀
  microPrefix: ''
}
const mutations = {
  SET_DEVICE: (state, device) => {
    state.device = device
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_CURRENT_ROLE: (state, currentRole) => {
    state.currentRole = currentRole
  },
  SET_ROLELIST: (state, roleList) => {
    state.roleList = roleList
  },
  SET_CODES: (state, codes) => {
    state.codes = codes
  },
  SET_SAFEAREA: (state, safeArea) => {
    state.safeArea = safeArea
  },
  SET_MICROPREFIX: (state, microPrefix) => {
    state.microPrefix = microPrefix
  }
}
const actions = {
  setDevice({ commit }, device) {
    commit('SET_DEVICE', device)
  },
  setUserInfo({ commit }, user) {
    commit('SET_USER', user)
  },
  setCurrentRole({ commit }, currentRole) {
    commit('SET_CURRENT_ROLE', currentRole)
  },
  setRoleList({ commit }, roleList) {
    commit('SET_ROLELIST', roleList)
  },
  setCodes({ commit }, codes) {
    commit('SET_CODES', codes)
  },
  setSafeArea({ commit }, safeArea) {
    commit('SET_SAFEAREA', safeArea)
  },
  setMicroPrefix({ commit }, microPrefix) {
    commit('SET_MICROPREFIX', microPrefix)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
