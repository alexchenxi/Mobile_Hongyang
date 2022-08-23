<template>
    <div class="common-page">
        <div class="common-page-content" :style="{height: pageContentHeightWithSafe, paddingTop: topSafe}">
            <van-tabs class="report-tabs" v-model="active" animated line-height="0" title-active-color="#030303" title-inactive-color="#999999">
                <van-tab title="销售情况">
                    <SalesReport ref="salesReport" />
                </van-tab>
                <van-tab title="渠道情况">
                    <ChannelReport />
                </van-tab>
                <template v-if="active === 0 && projectLevel === 3" #nav-right><div class="target" @click="setGoal">设置目标</div></template>
            </van-tabs>
        </div>
        <tab-bar active="/manager/report" :tabData="tabData" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TabBar from '@c/TabBar'
import SalesReport from './salesReport'
import ChannelReport from './channelReport'
export default {
	name:'ManagerReport',
    components: {
        TabBar,
        SalesReport,
        ChannelReport
    },
    data() {
        return {
            active: 0
        }
    },
    computed: { ...mapGetters(['tabData', 'projectLevel']) },
    methods: {
        setGoal() {
            this.$refs.salesReport.settingGoal()
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .report-tabs {
    height: 100%;
    .van-tabs__wrap {
        padding: 0 18px;
    }
    .van-tabs__content {
        height: calc(100% - 44px);
        .van-tab__pane {
            height: 100%;
        }
    }
    .van-tab {
        flex: inherit;
        align-self: baseline;
        padding: 13px 0;
        margin-right: 24px;
        font-size: 13px;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
        line-height: 13px;
        &.van-tab--active {
            font-size: 18px;
            font-weight: 600;
            line-height: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
        }
    }
    .van-tabs__content--animated {
        height: calc(100% - 44px);
    }
    .van-tab__pane {
        height: 100%;
    }
    .target {
        flex-grow: 1;
        .common-flex();
        justify-content: flex-end;
        font-size: 15px;
        font-weight: 500;
        line-height: 15px;
        color: #303030;
        font-family: PingFangSC-Medium, PingFang SC;
    }
}
</style>
