<template>
    <div class="container">
        <!-- 到访客户趋势 -->
        <div class="chart-box line-chart">
            <i class="iconfont iconjuxing common-report-vertical-bar"></i>
            <div class="chart-select">
                <FilterPopover container="body" v-model="customerTrendDateType" :list="dateTypeList" @change="customerVisitTrend" />
            </div>
            <ChartLine :chartData="customerTrendChartData" ref="customerTrendsLine" title="到访客户趋势" id="customerTrendsLine" />
        </div>
        <!-- 客户漏斗 -->
        <div class="chart-box funnel-chart">
            <i class="iconfont iconjuxing common-report-vertical-bar"></i>
            <FunnelChart :chartData="funnelChartData" />
        </div>
        <!-- 趋势统计 -->
        <div class="chart-box line-chart">
            <i class="iconfont iconjuxing common-report-vertical-bar"></i>
            <div class="chart-select">
                <FilterPopover container="body" v-model="trendStatisticsDateType" :list="trendDateTypeList" @change="customerTrend" />
            </div>
            <ChartLine :chartData="trendStatisticsChartData" ref="trendStatisticsLine" title="趋势统计" id="trendStatisticsLine" />
        </div>
    </div>
</template>
<script>
import FunnelChart from '@c/Chart/Funnel.vue'
import ChartLine from '@c/Chart/ChartLine.vue'
import FilterPopover from '@/components/Report/FilterPopover'
import API from '@/request/api/caseSystem/report'
export default {
    components: {
        FunnelChart,
        ChartLine,
        FilterPopover
    },
    props: {
        filters: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            //   漏斗数据
            funnelChartData: {
                id: 'funnelChart',
                name: '客户漏斗',
                color: ['#5F95FA', '#4FC0E8', '#47CFAE', '#FAB55F'],
                unit: '人',
                data: [],
                conversionRate: []
            },
            //   到访客户趋势
            customerTrendDateType: 1,
            //   趋势统计
            trendStatisticsDateType: 1,
            //   图标x轴维度
            dateTypeList: [
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
            //   图标x轴维度
            trendDateTypeList: [
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
            // 到访客户趋势
            customerTrendChartData: {
                colorArr: [
                    {
                        color: 'rgba(71, 207, 174, 0.2)',
                        color1: '#47CFAE'
                    },
                    {
                        color: 'rgba(79, 192, 232, 0.2)',
                        color1: '#4FC0E8'
                    }
                ],
                echartData: [],
                xData: []
            },
            //  趋势统计
            trendStatisticsChartData: {
                colorArr: [
                    {
                        color: 'rgba(95, 149, 250, 0.2)',
                        color1: '#5F95FA'
                    },
                    {
                        color: 'rgba(79, 192, 232, 0.2)',
                        color1: '#4FC0E8'
                    },
                    {
                        color: 'rgba(71, 207, 174, 0.2)',
                        color1: '#47CFAE'
                    },
                    {
                        color: 'rgba(250, 181, 95, 0.2)',
                        color1: '#FAB55F'
                    }
                ],
                echartData: [],
                xData: []
            }
        }
    },
    watch: {
        filters: {
            handler(newValue) {
                this.init()
            },
            deep: true
        }
    },
    created() {},
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.customerFilter()
            this.customerVisitTrend()
            this.customerTrend()
        },
        //客户到访趋势
        customerVisitTrend() {
            let params = this.$utils.deepCopy(this.filters)
            params.groupBy = this.customerTrendDateType
            API.customerVisitTrend(params).then(res=>{
                this.customerTrendChartData.echartData = res.data
                this.customerTrendChartData.xData = res.xdata
            })
        },
        //客户到访趋势
        customerTrend() {
            let params = this.$utils.deepCopy(this.filters)
            params.groupBy = this.trendStatisticsDateType
            params.scope = [1,2,4,5]
            API.customerTrend(params).then(res=>{
                this.trendStatisticsChartData.echartData = res.data
                this.trendStatisticsChartData.xData = res.xdata
            })
        },
        // 客户漏斗
        customerFilter() {
            let params = this.$utils.deepCopy(this.filters)
            params.scope = [2,3,4,5]
            API.customerFilter(params).then(res=>{
                this.funnelChartData.data = res.data
                this.funnelChartData.conversionRate = res.transferRate
            })
        }
    }
}
</script>

<style lang="less" scoped>
.container {
    position: relative;
    overflow: auto;
    .title {
        font-size: 18px;
        padding: 0 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        display: flex;
        justify-content: space-between;
        span {
            font-weight: bold;
        }
        /deep/ .van-dropdown-menu {
            margin-right: 3px;
        }
    }
}
.chart-box {
    position: relative;
}
.chart-box .iconjuxing {
    position: absolute;
    top: 3px;
}
.funnel-chart .iconjuxing {
    top: 23px;
    left: 18px;
}
.funnel-chart {
    height: 344px;
}
.line-chart {
    position: relative;
    height: 360px;
    padding: 0 15px;
}
.chart-select {
    position: absolute;
    right: 15px;
    top: 5px;
    z-index: 2;
}
</style>
