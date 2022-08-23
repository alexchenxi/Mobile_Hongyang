import Vue from 'vue'
import App from './App.vue'
import '@u/vant'
import '@u/initApp'
import '@/directives'
import '@/filters'
import 'swiper/dist/css/swiper.min.css'
import './assets/styles/index.less'
import './assets/font/iconfont.css'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
//全局引用
import mixin from '@/views/mixin/mixin'
Vue.mixin(mixin)
import utils from '@/utils/commonUtil'
import VueTouch from 'vue-touch'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

import { appMethods } from 'movit-utils'
if (VueTouch) {
    Vue.use(VueTouch, { name: 'v-touch' })
    VueTouch.config.swipe = {
        threshold: 100, //手指左右滑动距离
    }
}
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
    relativeTime: {
        future: 'in%s',
        past: '%s前',
        s: '1秒',
        ss: '%d秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '一天',
        dd: '%d天',
        M: '一个月',
        MM: '%d月',
        y: '一年',
        yy: '%d年',
    },
})
Vue.use(utils)

Vue.config.productionTip = false

Vue.prototype.dayjs = dayjs
Vue.prototype.echarts = echarts

Vue.prototype.isSAAS = process.env.VUE_APP_TYPE === 'saas'

Vue.prototype.$baseImgUrl = process.env.VUE_APP_IMG_URL

let install = null
function render(props = {}) {
    const { container } = props
    Vue.prototype.$appMethods = props.appMethods
    store.dispatch('user/setMicroPrefix', props.prefix)
    localStorage.setItem('appStore', JSON.stringify(store.state))
    install = new Vue({
        router,
        store,
        render: (h) => h(App),
    }).$mount(container ? container.querySelector('#app') : '#app')
}
if (window.__POWERED_BY_QIANKUN__) {
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
} else {
    Vue.prototype.$appMethods = appMethods
    new Vue({
        router,
        store,
        render: (h) => h(App),
    }).$mount('#app')
}

export async function bootstrap() {}

export async function mount(props) {
    render(props)
}

export async function unmount() {
    store.dispatch('user/setCurrentRole', {})
    localStorage.setItem('appStore', JSON.stringify(store.state))
    install.$destroy()
}
