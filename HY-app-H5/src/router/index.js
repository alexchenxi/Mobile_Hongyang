import Vue from 'vue'
import VueRouter from 'vue-router'
import routesConfig from './routes'
import store from '@/store'
Vue.use(VueRouter)

// 重复点击当前路由防止报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes: routesConfig.routes
})
export const resetRoute = function() {
    router.matcher = new VueRouter({
        base: process.env.BASE_URL,
        routes: routesConfig.routes
    }).matcher
}
// 路由守卫
router.beforeEach((to, from, next) => {
    let token = localStorage.token
    if (process.env.VUE_APP_TYPE === 'saas') {
        if (!to.path.includes(store.getters.microPrefix) && to.path !== '/login') {
            next({
                path: `${store.getters.microPrefix}${to.path}`,
                query: to.query,
                params: to.params
            })
        } else {
            next()
        }
    } else {
        // 跳转到登录页
        if (to.path !== '/login' && !token && to.path !== '/register') {
            next({ name: 'login' })
        } else {
            next()
        }
    }
})
export default router
