<template>
    <div class="common-page">
        <!-- 筛选条件 -->
        <section class="filter-container">
            <div>
                <ReportFilter ref="filterSection" :checkList="checkList" dateType="date" @change="handleFilter" :checkDefault="checkDefault" title="本月" container="body" />
            </div>
        </section>
        <div class="content">
            <!-- 统计数据 -->
            <div class="statistical-data">
                <div class="label-item" v-for="(item, index) in staticData" :key="index">
                    <div class="label-content">
                        <span class="num">{{ item.num }}</span>
                        <span class="unit">{{ item.unit }}</span>
                    </div>
                    <div class="label-title">{{ item.text }}</div>
                </div>
            </div>
            <!-- 客户漏斗 -->
            <div class="chart-box funnel-chart">
                <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                <div class="chart-select">
                    <FilterPopover container="body" v-model="channeType" @change="channeTypeChange" :list="channelList" />
                </div>
                <FunnelChart :chartData="funnelChartData" />
            </div>
            <!-- 渠道占比 -->
            <div class="chart-box pie-chart">
                <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                <div class="chart-select">
                    <FilterPopover container="body" v-model="status" @change="statusChange" :list="statusList" />
                </div>
                <PieChart :chartData="pieChartData" />
            </div>
            <!-- 渠道统计 -->
            <div class="channel-statistical-wrap">
                <div class="title-wrap">
                    <span class="title">
                        <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                        渠道统计
                    </span>
                </div>
                <van-empty class="empty-container" v-if="flag && list.length === 0" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                <div class="channel-statistical" @scroll="tableScroll" v-else>
                    <table class="channel-table">
                        <tr>
                            <th>名称</th>
                            <th>报备</th>
                            <th>到访</th>
                            <th>认购</th>
                            <th>签约</th>
                        </tr>
                        <tr v-for="(x, index) in list" :key="index">
                            <td>{{ x.channel1Name }}</td>
                            <td>
                                {{ x.reportCustomerGroupNum }}
                                <span class="unit">组</span>
                            </td>
                            <td>
                                {{ x.visitCustomerGroupNum }}
                                <span class="unit">组</span>
                            </td>
                            <td>
                                {{ x.orderSetsNum }}
                                <span class="unit">套</span>
                            </td>
                            <td>
                                {{ x.contractSetsNum }}
                                <span class="unit">套</span>
                            </td>
                        </tr>
                        <div class="left-fixed" :style="{ left: scrollLeft + 'px' }" v-if="scrollLeft > 10"></div>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ReportFilter from '@c/Report/ReportFilter'
import FilterPopover from '@c/Report/FilterPopover'
import FunnelChart from '@c/Chart/Funnel.vue'
import PieChart from '@c/Chart/Pie.vue'
import API from '@/request/api/manageSystem/report'
export default {
    name: 'channelReport',
    components: {
        ReportFilter,
        FunnelChart,
        PieChart,
        FilterPopover
    },
    data() {
        return {
            checkDefault: 2,
            form: {
                beginDate: '',
                endDate: '',
                dateType: 2
            },
            //  渠道权限集合
            channelCodes: [],
            staticData: [
                {
                    field: 'reportCustomerGroupNum',
                    text: '报备量',
                    unit: '组'
                },
                {
                    field: 'visitCustomerGroupNum',
                    text: '到访量',
                    unit: '组'
                },
                {
                    field: 'orderSetsNum',
                    text: '认购量',
                    unit: '套'
                },
                {
                    field: 'contractSetsNum',
                    text: '签约量',
                    unit: '套'
                }
            ],
            //   日期筛选
            checkList: [
                {
                    label: '本年',
                    value: 1
                },
                {
                    label: '本月',
                    value: 2
                }
            ],
            //   漏斗数据
            funnelChartData: {
                id: 'funnelChart',
                name: '客户漏斗',
                color: ['#5F95FA', '#4FC0E8', '#47CFAE', '#FAB55F'],
                data: [],
                unit: '人',
                conversionRate: []
            },
            pieChartData: {
                id: 'pieChart',
                name: '渠道占比',
                unit: '组',
                data: [],
                color: ['#0F58F1', '#1997FB', '#1ECB1F', '#FFC412', '#FE9402', '#EF4034'],
                colorObj: [
                    {
                        name: '全民营销',
                        color: '#0F58F1'
                    },
                    {
                        name: '中介分销',
                        color: '#1997FB'
                    },
                    {
                        name: '行销自拓',
                        color: '#1ECB1F'
                    },
                    {
                        name: '来电录入',
                        color: '#FFC412'
                    },
                    {
                        name: 'AI名片',
                        color: '#FE9402'
                    },
                    {
                        name: '预约看房',
                        color: '#EF4034'
                    }
                ]
            },
            channelList: [
                {
                    text: '全部渠道',
                    value: ''
                }
            ],
            channeType: '',
            statusList: [
                {
                    text: '报备量',
                    value: 1
                },
                {
                    text: '到访量',
                    value: 2
                },
                {
                    text: '认购量',
                    value: 4
                },
                {
                    text: '签约量',
                    value: 5
                }
            ],
            status: 1,
            list: [],
            scrollLeft: 0,
            flag: false
        }
    },
    computed: {
        ...mapGetters(['projectIdList'])
    },
    created() {
        // this.getChannelList()
    },
    mounted() {
        this.getChannelList()
        // this.init()
    },
    methods: {
        init() {
            this.channelStatisticsTotal()
            this.channelCustomerFilter()
            this.channelCustomerRate()
            this.channelCustomerAnalysis()
        },
        // 日期筛选
        handleFilter(val) {
            if (val.date.length) {
                this.form.beginDate = val.date[0]
                this.form.endDate = val.date[1]
                this.form.dateType = 4
            } else {
                this.form.dateType = val.dateType
                this.form.beginDate = ''
                this.form.endDate = ''
            }
            this.init()
        },
        tableScroll(e) {
            this.scrollLeft = e.currentTarget.scrollLeft
        },
        // 渠道情况统计数据
        channelStatisticsTotal() {
            let params = this.$utils.deepCopy(this.form)
            params.projectIds = this.projectIdList
            params.channel1Codes = this.channelCodes
            API.channelStatisticsTotal(params).then(res => {
                for (let item of this.staticData) {
                    item.num = res[item.field]
                }
            })
        },
        // 根据用户获取渠道权限列表
        getChannelList() {
            API.getChannelList().then(res => {
                this.channelList = res.map(item => {
                    return {
                        text: item.channel1Name,
                        value: item.channel1Code
                    }
                })
                this.channelList.unshift({
                    text: '全部渠道',
                    value: ''
                })
                this.channelCodes = res.map(item => {
                    return item.channel1Code
                })
                this.init()
            })
        },
        // 渠道情况客户漏斗
        channelCustomerFilter() {
            let params = this.$utils.deepCopy(this.form)
            params.projectIds = this.projectIdList
            params.channel1Codes = this.channeType ? [this.channeType] : this.channelCodes
            params.scope = [1, 2, 4, 5]
            API.channelCustomerFilter(params).then(res => {
                this.funnelChartData.data = res.data
                this.funnelChartData.conversionRate = res.transferRate
            })
        },
        // 渠道情况渠道占比
        channelCustomerRate() {
            let params = this.$utils.deepCopy(this.form)
            params.projectIds = this.projectIdList
            params.channel1Codes = this.channelCodes
            params.groupBy = this.status
            API.channelCustomerRate(params).then(res => {
                this.pieChartData.data = res
            })
        },
        channeTypeChange(val) {
            this.channeType = val
            this.channelCustomerFilter()
        },
        statusChange(val) {
            this.status = val
            this.channelCustomerRate()
        },
        // 渠道情况渠道统计
        channelCustomerAnalysis() {
            let params = this.$utils.deepCopy(this.form)
            params.projectIds = this.projectIdList
            params.channel1Codes = this.channelCodes
            this.flag = false
            API.channelCustomerAnalysis(params).then(res => {
                this.list = res
                this.flag = true
            })
        }
    }
}
</script>

<style lang="less" scoped>
.common-page {
    overflow: auto;
}
.filter-container {
    position: fixed;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: calc(100% - 30px);
    z-index: 100;
    padding: 0 18px;
    background: #fff;
    height: 44px;
    margin-top: -2px;
}
.content {
    position: relative;
    overflow: auto;
    margin-top: 44px;
    .title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        /deep/ .van-dropdown-menu {
            margin-right: 3px;
        }
    }
    .chart-box {
        position: relative;
    }
    .chart-box .iconjuxing {
        position: absolute;
        top: 3px;
    }
    .funnel-chart {
        height: 344px;
    }
    .pie-chart {
        height: 418px;
    }
    .funnel-chart,
    .pie-chart {
        .chart-select {
            position: absolute;
            right: 15px;
            top: 24px;
            z-index: 2;
        }
        .iconjuxing,
        .iconjuxing {
            top: 23px;
            left: 18px;
        }
    }
    .statistical-data {
        margin-bottom: 8px;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        padding: 15px 18px 0;
        width: calc(100% - 66px);
        height: calc(144px - 15px);
        margin-left: 15px;
        border-radius: 4px;
        background-image: url('@{baseImgUrl}/report/bg-statistics.png'), linear-gradient(135deg, #2da5f9 0%, #0388fe 100%);
        background-position: left bottom, center center;
        background-repeat: no-repeat, no-repeat;
        background-size: 100% 100%, 100% 100%;
        .label-item {
            width: 50%;
            margin-bottom: 16px;
            .label-content {
                margin-bottom: 4px;
                color: #ffffff;
                .num {
                    font-size: 21px;
                    font-weight: bold;
                    font-family: DINAlternate-Bold, DINAlternate;
                }
                .unit {
                    font-size: 12px;
                    margin-left: 2px;
                    font-weight: 400;
                }
            }
            .label-title {
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.69);
                line-height: 13px;
            }
        }
    }
}
.channel-statistical {
    overflow-x: scroll;
    margin-left: 15px;
    width: calc(100% - 15px);
}
.channel-table {
    position: relative;
    border-collapse: collapse;
    th {
        color: #999999;
        font-size: 13px;
        text-align: right;
        padding: 0 15px;
        &:first-child {
            position: sticky;
            left: -2px;
            z-index: 200;
            text-align: left;
            background: #fff;
        }
    }
    td {
        color: #333333;
        font-size: 16px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        white-space: nowrap;
        text-align: right;
        padding: 0 15px;
        border-bottom: 1px solid #eeeeee;
        .unit {
            font-size: 10px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
        }
    }
    tr td:first-child {
        position: sticky;
        left: -2px;
        z-index: 200;
        color: #333333;
        font-size: 15px;
        text-align: left;
        background: #fff;
        font-family: PingFangSC-Regular, PingFang SC;
    }
    tr {
        height: 66px;
        line-height: 66px;
        &:first-child {
            height: 33px;
            line-height: 33px;
        }
    }
    .left-fixed {
        position: absolute;
        width: 90px;
        height: 100%;
        box-shadow: 4px 0 10px rgba(0, 0, 0, 0.12);
        top: 0;
        overflow-y: hidden;
    }
}
.title-wrap {
    padding: 22px 14px 4px 15px;
    display: flex;
    justify-content: space-between;
    .title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #333333;
    }
    .common-report-vertical-bar {
        display: flex;
        align-items: center;
    }
}
</style>
