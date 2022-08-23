<template>
    <div id="app">
        <!-- <transition :name="name"> -->
        <keep-alive :include="keepAliveList">
            <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
        <!-- </transition> -->
    </div>
</template>

<script>
import API from '@/request/api/commonApi'
import { mapGetters } from 'vuex'
import { roleMixin } from '@/views/mixin/role.js'
export default {
    name: 'App',
    mixins: [roleMixin],
    data() {
        return {
            name: '',
            // 是否记住密码
            isRememberPassword: false,
            // 是否自动登录
            isAutoLogin: false,
            userName: '',
            password: ''
        }
    },
    computed: { ...mapGetters(['keepAliveList']) },
    watch: {
        $route(to, from) {
            const toLevel = to.meta.level
            const fromLevel = from.meta.level

            if (toLevel > fromLevel) {
                this.name = 'slide-left'
            } else if (toLevel < fromLevel) {
                this.name = 'slide-right'
            } else {
                this.name = ''
            }
        }
    },
    created() {
        this.isRememberPassword = localStorage.isRememberPassword === 'true' ? true : false
        this.isAutoLogin = localStorage.isAutoLogin === 'true' ? true : false
        // 记住密码
        if (this.isRememberPassword) {
            this.userName = localStorage.userName
            this.password = localStorage.password
        }
        //在页面加载时读取localStorage里的状态信息
        localStorage.getItem('appStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem('appStore'))))

        //在页面刷新时将vuex里的信息保存到localStorage里
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('appStore', JSON.stringify(this.$store.state))
        })

        // 保存终端环境
        this.$store.dispatch('user/setDevice', this.$utils.getDevice())
        // 自动登录
        if (!this.isSAAS && localStorage.isAutoLogin === 'true') {
            this.autoLogin()
            return
        }
    },
    mounted() {
        let clientHeight = document.body.clientHeight
        let oldClientHeight = localStorage.getItem('clientHeight')
        if (!oldClientHeight) {
            localStorage.setItem('clientHeight', clientHeight)
        } else if (Number(oldClientHeight) < clientHeight) {
            localStorage.setItem('clientHeight', clientHeight)
        }
        this.addRoutes()
        if (this.isSAAS) {
            this.getSafeArea()
            this.handleRole()
        }
    },
    methods: {
        // 自动登录
        autoLogin() {
            this.getSafeArea()
            API.autoLogin({
                accessToken: localStorage.accessToken
            }).then(res => {
                this.setStorage(res)
                this.handleRole()
            })
        },
        // 获取安全区域
        getSafeArea() {
            this.$appMethods.getSafeArea(this.$utils.getDevice()).then(res => {
                this.$store.dispatch('user/setSafeArea', res)
            })
        }
    }
}
</script>

<style lang="less">
#app {
    width: 100%;
    height: 100vh;
    // 页面进出动画
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        will-change: transform;
        transition: all 300ms;
        position: fixed;
        left: 0;
        right: 0;
    }

    .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }

    .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-enter {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-leave-active {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }
}
</style>
