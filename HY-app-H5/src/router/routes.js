/**
 * @author jinming
 * @date 2020/11/17 21:17
 * @desc 路由文件
 */
import login from '../views/login'
import register from '../views/register'
import { menuData } from './menu'
import store from '@/store'
export const loadView = view => {
    return resolve => require([`@/views/${view}.vue`], resolve)
}
const routes = [
    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/register',
        name: 'register',
        component: register
    },
    {
        path: '/',
        redirect: '/login'
    }
]
// 动态路由
const addRoute = () => {
    let routes = []
    for (let item of menuData) {
        routes.push({
            path: process.env.VUE_APP_TYPE === 'saas' ? store.getters.microPrefix + item.path : item.path,
            name: item.name,
            component: loadView(item.viewPath)
        })
    }
    return routes
}
export default {
    routes,
    addRoute
}
