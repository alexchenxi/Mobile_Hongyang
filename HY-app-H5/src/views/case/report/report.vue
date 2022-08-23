<template>
    <div class="common-page">
        <TopBar :back="false" title="报表" />
        <div class="common-page-content" :style="{ height: pageMiddleHeight }">
            <van-tabs class="report-tabs" v-model="active" animated line-height="0" title-active-color="#030303" title-inactive-color="#999999" @change="changeTab">
                <van-tab title="客储情况">
                    <StorageReport ref="report-0"  />
                </van-tab>
                <van-tab title="销售情况">
                    <SaleReport  ref="report-1" />
                </van-tab>
            </van-tabs>
        </div>
        <tab-bar active="/case/report" :tabData="tabData" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TabBar from '@c/TabBar'
import TopBar from '@c/TopBar'
import StorageReport from './storageReport'
// import CaseReport from './caseReport'
import SaleReport from './saleReport'

export default {
    name: 'CaseReport',
    components: {
        TabBar,
        StorageReport,
        SaleReport,
        TopBar,
    },
    data() {
        return {
            active: 0,
            scrollTop: 0
        }
    },
    methods: {
        changeTab(val) {
            this.$nextTick(() => {
                this.$refs['report-'+val].initData()
            })
        }
    },
    activated() {
        this.$nextTick(() => {
            const box = document.querySelector('.common-container')
            box.scrollTop = this.scrollTop
        })
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('CaseReport') === -1) {
                array.push('CaseReport')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList || []
        if (
            !to.path.includes('/case/customerReportRank') &&
            !to.path.includes('/case/customerReportVisit') &&
            !to.path.includes('/case/selfChannelOrCounselorsignAgent') &&
            !to.path.includes('/case/customerOrderOrSign') &&
            !to.path.includes('/case/storageOrderOrSignDetail')&&
            !to.path.includes('/case/customerGradeDetail')
        ) {
            array = array.filter((item) => {
                return item !== 'CaseReport'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        const box = document.querySelector('.common-container')
        this.scrollTop = box.scrollTop
        next()
    },
    computed: { ...mapGetters(['tabData']) },
}
</script>

<style lang="less" scoped>
.header {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0), #fff1e7 100%);
}

/deep/ .report-tabs {
    height: 100%;

    .van-tabs__wrap {
        //padding: 0 18px;
    }

    .van-tabs__content {
        height: calc(100% - 44px);

        .van-tab__pane {
            height: 100%;
        }
    }

    .van-tabs__nav {
        background: linear-gradient(180deg, #fff1e7, rgba(255, 255, 255, 0) 100%);
    }

    .van-tab {
        flex: 1;
        align-self: baseline;
        //padding: 13px 0;
        //margin-right: 24px;
        font-size: 13px;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
        line-height: 35px;
        background: linear-gradient(180deg, #fff1e7, rgba(255, 255, 255, 0) 100%);
        border-radius: 0 0 10px 0;

        &.van-tab--active {
            border-radius: 20px 20px 0 0;
            font-size: 18px;
            font-weight: 600;
            line-height: 44px;
            background: #fff;
            font-family: PingFangSC-Semibold, PingFang SC;
        }
    }

    .van-tabs__content--animated {
        height: calc(100% - 44px);
    }

    .van-tab__pane {
        height: 100%;
    }
}
</style>
