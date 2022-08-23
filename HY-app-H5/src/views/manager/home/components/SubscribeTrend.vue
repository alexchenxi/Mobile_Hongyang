<template>
    <div class="trend-container">
        <div class="section-title">
            <div class="section-title-left">
                <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                认购趋势
            </div>
            <div class="section-title-right date-type">
                <FilterPopover container=".trend-container" v-model="groupBy" :list="groupByList" @change="groupByChange" />
            </div>
        </div>
        <div class="container">
            <LineAndBar :colors="colors" :data="trendData" />
        </div>
    </div>
</template>

<script>
import LineAndBar from '@/components/Chart/LineAndBar'
import FilterPopover from '@/components/Report/FilterPopover'
import { mapGetters } from 'vuex'
import API from '@/request/api/manageSystem/home'
export default {
    components: {
        LineAndBar,
        FilterPopover
    },
    data() {
        return {
            groupBy: 1,
            groupByList: [
                {
                    text: '月',
                    value: 1
                },
                {
                    text: '周',
                    value: 2
                },
                {
                    text: '日',
                    value: 3
                }
            ],
            colors: ['#1ECB1F', '#0F58F1', '#FE9402', ['rgba(250, 181, 95, 0.12)', 'rgba(250, 181, 95, 0)']],
            trendData: {}
        }
    },
    computed: { ...mapGetters(['projectIdList']) },
    watch: {
        projectIdList(newVal) {
            this.managerStatisticsTrend()
        }
    },
    created() {
        if (!this.projectIdList || this.projectIdList.length === 0) return
        this.managerStatisticsTrend()
    },
    methods: {
        async managerStatisticsTrend() {
            let params = {
                projectIds: this.projectIdList,
                type: 1,
                dateType: 1,
                groupBy: this.groupBy
            }
            const result = await API.managerStatisticsTrend(params)
            this.trendData = result
        },
        groupByChange() {
            this.managerStatisticsTrend()
        }
    }
}
</script>

<style lang="less" scoped>
.trend-container {
    padding:0 15px 24px;
    .section-title {
        .common-flex-between();
        padding: 24px 0 0;
        .section-title-left {
            .common-flex();
            font-size: 18px;
            color: @header-text-color;
            line-height: 18px;
            font-weight: 500;
            font-family: PingFangSC-Medium, PingFang SC;
            i {
                color: @dark-theme-color;
            }
        }
    }
    /deep/ .van-popover__action {
        width: 100px;
    }
}
</style>
