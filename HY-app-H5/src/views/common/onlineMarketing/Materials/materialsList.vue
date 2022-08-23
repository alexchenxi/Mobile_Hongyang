<template>
    <div class="common-page">
        <TopBar title="拓客物料"></TopBar>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <van-tabs v-model="active" animated @change="changeTab">
                <van-tab v-code="[currentRole.moduleId + '.HOME.TOKER', currentRole.moduleId + '.HOME.TOKER.ADVERTISE']" title="广告" name="1">
                    <Advertise ref="pageContainer1" />
                </van-tab>
                <van-tab v-code="[currentRole.moduleId + '.HOME.TOKER', currentRole.moduleId + '.HOME.TOKER.ACTIVITY']" title="活动" name="2">
                    <Activity ref="pageContainer2" />
                </van-tab>
                <van-tab v-code="[currentRole.moduleId + '.HOME.TOKER', currentRole.moduleId + '.HOME.TOKER.NEWS']" title="资讯" name="3">
                    <News ref="pageContainer3" />
                </van-tab>
                <van-tab v-code="[currentRole.moduleId + '.HOME.TOKER', currentRole.moduleId + '.HOME.TOKER.COUPON']" title="优惠券" name="4">
                    <Coupon ref="pageContainer4" />
                </van-tab>
            </van-tabs>
        </main>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import Advertise from './components/advertise.vue'
import Activity from './components/activity.vue'
import News from './components/news.vue'
import Coupon from './components/coupon.vue'
export default {
    name: 'MaterialsList',
    components: {
        TopBar,
        Advertise,
        Activity,
        News,
        Coupon
    },
    data() {
        return {
            active: '1',
            scrollTop: 0
        }
    },
    computed: { ...mapGetters(['keepAliveList', 'currentRole']) },
    activated() {
        this.$refs['pageContainer' + this.active].$refs.scrollWrap.scrollTop = this.scrollTop
    },
    methods: {
        changeTab() {
            this.$nextTick(() => {
                this.$refs['pageContainer' + this.active].$refs.scrollWrap.scrollTop = 0
            })
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('MaterialsList') === -1) {
                array.push('MaterialsList')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        this.scrollTop = this.$refs['pageContainer' + this.active].$refs.scrollWrap.scrollTop
        var array = this.keepAliveList
        if (!to.path.includes('/materialsDetail')) {
            array = array.filter((item) => {
                return item !== 'MaterialsList'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    overflow: hidden;
    /deep/ .van-tabs {
        height: 100%;
        .van-tab {
            font-size: 15px;
            color: @info-color;
            font-weight: 400;
            &.van-tab--active {
                color: @theme-color;
            }
        }
        .van-tabs__content {
            height: 100%;
            .van-tab__pane {
                height: calc(100% - 44px);
                overflow: hidden;
            }
        }
    }
}
</style>
