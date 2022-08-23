import API from '@/request/api/commonApi'
import { mapGetters } from 'vuex'
import routesConfig from '@/router/routes'
import router from '@/router'
import { resetRoute } from '@/router'

export const roleMixin = {
    data() {
        return {}
    },
    computed: { ...mapGetters(['user']) },
    creatd() {
    },
    methods: {
        // 角色处理
        async handleRole() {
            await this.getUserInfo()
            let roleList = await this.getRoleList()
            let roles = []
            for (let role of roleList) {
                role.modules.forEach((item, index) => {
                    let obj = {
                        roleName: role.roleName,
                        roleCode: role.roleCode,
                        moduleId: item.id,
                        roleId: role.roleId,
                        id: role.roleId + item.id,
                        name: `${ role.roleName }-${ item.name }`
                    }
                    // 一个角色下只有一个模块
                    if (role.modules.length < 2) {
                        obj.name = role.roleName
                    }
                    roles.push(obj)
                })
            }
            this.$store.dispatch('user/setRoleList', roles)
            // 只有一种角色，无需选择
            if (roles.length === 1) {
                this.handleMenu(roles[0])
                // 关键人小蜜蜂 roleCode 取上级的roleCode
                if (roles[0].roleCode === 'ZT_BEEMAN' || roles[0].roleCode === 'ZT_KEYMAN') {
                    roles[0].roleCode = this.user.leaderRoleCode
                }
                this.$store.dispatch('user/setCurrentRole', roles[0])
            } else {
                if (!this.isSAAS) {
                    // 多种角色
                    this.$router.replace({
                        path: this.$store.getters.microPrefix + '/my/switchRoles'
                    }).catch(() => {
                    })
                }

            }
        },
        // 处理菜单
        async handleMenu(item) {
            this.$utils.loading()
            let menuData = await this.getMenuByModule(item.moduleId, item.roleCode)
            this.$toast.clear()
            this.$store.dispatch('menu/setTabData', menuData)
            if (menuData.length) {
                let pathStr = this.$store.getters.microPrefix + menuData[0].url
                this.$router.replace({
                    path: pathStr
                }).catch(() => {
                })
                this.$store.dispatch('menu/setTabActice', menuData[0])
            }
        },
        // 获取角色和模块
        async getRoleList() {
            return API.getRoleList().then(res => {
                return res
            })
        },
        // 获取菜单
        async getMenuByModule(moduleId, roleCode) {
            return API.getMenuByModule(moduleId, roleCode).then(res => {
                this.$store.dispatch('user/setCodes', res.permissionList)
                return res.detail
            })
        },
        // 缓存数据
        setStorage(data) {
            if (data.hasOwnProperty('accessToken') && data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken)
            }
            localStorage.setItem('isRememberPassword', this.isRememberPassword)
            localStorage.setItem('isAutoLogin', this.isAutoLogin)
            localStorage.setItem('userName', this.userName)
            localStorage.setItem('password', this.password)
            localStorage.setItem('token', data.token)
            localStorage.setItem('needModify', data.needModify)
        },
        // 获取用户信息
        async getUserInfo() {
            this.$store.dispatch('other/setProject', {})
            this.$store.dispatch('other/setProjectList', {})
            let result = await this.userInfo()
            this.$store.dispatch('user/setUserInfo', result)
        },
        // 获取用户信息
        async userInfo() {
            return API.loginUserInfo().then(res => {
                return res
            })
        },
        // 动态添加路由
        addRoutes() {
            resetRoute()
            router.addRoutes(routesConfig.addRoute())
        },
        // 修改密码提示
        modifyPwdTip(pathStr) {
            if (localStorage.needModify === 'true') {
                this.$dialog
                    .confirm({
                        title: '',
                        message: '当前密码安全等级较低，为保障数据安全，请前往我的进行修改密码'
                    })
                    .then(() => {
                        this.$router
                            .push({
                                path: this.$store.getters.microPrefix + '/my/modifyPassword',
                                query: {
                                    backPath: pathStr
                                }
                            })
                            .catch(() => {
                            })
                    })
                    .catch(() => {
                    })
            }

        }
    },
    beforeRouteLeave(to, from, next) {
        if (from.path === '/login' && (to.path === '/case/home' || to.path === '/extension/home')) {
            setTimeout(() => {
                this.modifyPwdTip(to.path)
            },500)
        }
        next()
    }
}
