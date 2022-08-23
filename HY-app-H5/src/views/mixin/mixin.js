import variables from '@/assets/styles/variables.less'
import { mapGetters } from 'vuex'
let mixin = {
    data() {
        return {
            variables: { ...variables },
            clientHeight: localStorage.getItem('clientHeight') || document.body.clientHeight,
            topBarHeight: null,
            tabBarheight: null,
            buttonAreaHeight: null,
            // 实时高度
            realHeight: localStorage.getItem('clientHeight') || document.body.clientHeight,
            // 键盘弹起时是否展示固定在底部的按钮
            showFixedFooter: true
        }
    },
    computed: {
        ...mapGetters(['safeArea']),
        // 无底部有头部
        pageContainerHeight() {
            return this.clientHeight - (this.topBarHeight + parseFloat(this.safeArea.topSafe)) + "px"
        },
        // 头部高度
        topBarsHeight() {
            return (this.topBarHeight - 1) + parseFloat(this.safeArea.topSafe) + "px"
        },
        // 有头部和底部（底部是tabBar）
        pageMiddleHeight() {
            return this.clientHeight - (this.topBarHeight + parseFloat(this.safeArea.topSafe)) - (this.tabBarheight + parseFloat(this.safeArea.bottomSafe)) + "px"
        },
        // 无头部有底部
        pageContentHeight() {
            return this.clientHeight - (this.tabBarheight + parseFloat(this.safeArea.bottomSafe)) + "px"
        },
        // 顶部安全距离
        topSafe() {
            return parseFloat(this.safeArea.topSafe) + 'px'
        },
        // 底部安全距离
        bottomSafe() {
            return parseFloat(this.safeArea.bottomSafe) + 'px'
        },
        // 有头部和底部（底部是按钮）
        pageMiddleWithButtonHeight() {
            return this.clientHeight - (this.topBarHeight + parseFloat(this.safeArea.topSafe)) - (this.buttonAreaHeight + parseFloat(this.safeArea.bottomSafe)) + "px"
        },
        // 无头部有底部（底部是按钮）
        pageContentWithButtonHeight() {
            return this.clientHeight - (this.buttonAreaHeight + parseFloat(this.safeArea.bottomSafe)) + "px"
        },
        // 有头部和底部且有部分内容（底部是tabBar）
        pageMiddleWidthOtherHeight() {
            return this.clientHeight - (this.topBarHeight + parseFloat(this.safeArea.topSafe)) - (this.tabBarheight + parseFloat(this.safeArea.bottomSafe)) - 170 + "px"
        },
        // 无头部无底部
        pageWithoutTabHeight() {
            return (this.clientHeight - parseFloat(this.safeArea.bottomSafe)) + "px"
        },
        // 无头部有底部且顶部有安全距离
        pageContentHeightWithSafe() {
            return this.clientHeight - parseFloat(this.safeArea.topSafe) - (this.tabBarheight + parseFloat(this.safeArea.bottomSafe)) + "px"
        }
    },
    created() {
    },
    mounted() {
        this.topBarHeight = Math.ceil(parseFloat(this.variables.topBarHeight) * 15)
        this.tabBarheight = Math.ceil(parseFloat(this.variables.tabBarHeight) * 15)
        this.buttonAreaHeight = Math.ceil(parseFloat(this.variables.buttonAreaHeight) * 15)
        // window.onresize监听页面高度的变化
        let routeList = ['extensionRecommend', 'caseCustomerDetail', 'extensionCustomerDetail']
        if (this.$route && this.$route.name && routeList.indexOf(this.$route.name) > -1) {
            window.addEventListener('resize', () => this.realHeight = document.body.clientHeight, false)
        }
    },
    //监听
    watch: {
        realHeight() {
            if (this.clientHeight > this.realHeight) {
                this.showFixedFooter = false
            } else {
                this.showFixedFooter = true
            }
        }
    },
    methods: {

    }
};
export default mixin;
