const state = {
  //   所有菜单数据
  tabData: null,
  //   当前选中菜单
  menuActive: {}
}
const mutations = {
  SET_TABDATA: (state, tabData) => {
    state.tabData = tabData
  },
  SET_TAB_ACTIVE: (state, menuActive) => {
    state.menuActive = menuActive
  }
}
const actions = {
  setTabData({ commit }, tabData) {
    commit('SET_TABDATA', tabData)
  },
  setTabActice({ commit }, menuActive) {
    commit('SET_TAB_ACTIVE', menuActive)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
