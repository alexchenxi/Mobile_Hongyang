<template>
    <div class="common-page">
        <TopBar :back="false" title="报表" />
        <main class="common-page-middle" :style="{ height: pageMiddleHeight }">
            <div class="main-statistics" style="padding-top: 60px">
                <div class="right-top-tip" @click="filterChange">
                    <FilterSection ref="filterSection" :filter-list="filterList" :isShowMaxDate="true" container="body"
                                   @change="handleFilterDate" />
                </div>
                <van-tabs
                    style="position: absolute; top: 10px; left: 0"
                    v-model="checkDefault"
                    @change="handleChangeTab"
                    background="none"
                    animated
                    swipeable
                    title-active-color="#ffffff"
                    title-inactive-color="#ffffff"
                    line-width="16px"
                    line-height="3px"
                >
                    <van-tab v-for="tab in checkList" :key="tab.value" :title="tab.label"></van-tab>
                </van-tabs>
                <div v-for="(item, index) in staticData" :key="index" class="label-item"
                     @click="goReportList(item, statisticsTotalData[item.field] || '0')">
                    <div class="label-content">
                        <span class="num">
                            {{ statisticsTotalData && numFormat(statisticsTotalData[item.field]) }}
                        </span>
                        <span class="unit">{{ item.unit }}</span>
                    </div>
                    <div class="label-title">
                        {{ item.text }}
                    </div>
                </div>
            </div>
            <div style="padding: 0 15px">
                <i class="iconfont iconjuxing common-report-vertical-bar" />
                <span style="font-size: 19px; font-weight: bold">排名统计</span>
            </div>
            <div class="line">
                <div class="tab">
                    <span v-for="(item, index) in tabList" :key="index"
                          :class="activeTab === index ? 'active li' : 'li'" @click="changeActiveTab(index)">{{ item.text
                        }}</span>
                </div>
                <FilterPopover v-model="tokerType" container="body" :list="tokerTypeList" @change="tokerTypeChange" />
            </div>
            <van-empty v-if="groupFlag && listData.length === 0 && activeTab !== 2" class="empty-container"
                       :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
            <Team v-if="activeTab !== 2 && listData.length > 0" :data="listData" @goCustomerList="goCustomerList" />
            <van-empty v-if="groupFlag && tokerList.length === 0 && activeTab === 2" class="empty-container"
                       :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
            <div v-if="activeTab === 2 && tokerList.length > 0" class="toker-style">
                <div class="table">
                    <div class="head">
                        <span class="s-width align-left" />
                        <span class="s-width align-left" />
                        <span class="b-width align-right">报备</span>
                        <span class="b-width align-right">到访</span>
                        <span class="m-width align-right">认购</span>
                        <span class="m-width align-right">签约</span>
                        <span class="m-width align-right">转化率</span>
                    </div>
                    <template v-for="(item, index) in tokerList">
                        <div v-if="showMore || (!showMore && index < 3)" class="tr">
                            <div class="s-width align-left" />
                            <div class="s-width align-left" />
                            <div class="b-width align-right" @click="goCustomerList(item, 10)">
                                <span
                                    :class="['num', tokerType === 1 ? 'color' : '']">{{ item.reportGroupNum | numFormat(item.reportGroupNum)
                                    }}</span>
                                <span :class="['unit', tokerType === 1 ? 'color' : '']">组</span>
                            </div>
                            <div class="b-width align-right" @click="goCustomerList(item, 20)">
                                <span
                                    :class="['num', tokerType === 2 ? 'color' : '']">{{ item.visitGroupNum | numFormat(item.visitGroupNum)
                                    }}</span>
                                <span :class="['unit', tokerType === 2 ? 'color' : '']">组</span>
                            </div>
                            <div class="m-width align-right" @click="goCustomerList(item, 40)">
                                <span :class="['num', tokerType === 3 ? 'color' : '']">{{ item.orderSetsNum || '--'
                                    }}</span>
                                <span class="unit">套</span>
                            </div>
                            <div class="m-width align-right" @click="goCustomerList(item, 50)">
                                <span :class="['num', tokerType === 4 ? 'color' : '']">{{ item.contractSetsNum || '--'
                                    }}</span>
                                <span class="unit">套</span>
                            </div>
                            <div class="m-width align-right">
                                <span class="num">{{ item.contractSetsNum }}</span>
                                <span class="unit">%</span>
                            </div>
                        </div>
                    </template>
                    <div class="fix">
                        <div class="head">
                            <span class="s-width align-left" style="width: 40px">排行</span>
                            <span class="s-width align-left">名称</span>
                        </div>
                        <div v-for="(item, index) in tokerList" :key="index" class="tr">
                            <div style="width: 40px" class="s-width align-left">
                                <span v-if="index < 3" :class="' index bg' + index">
                                    <img :src="$baseImgUrl + '/report/icon-medal' + index + '1.png'" />
                                </span>
                                <span v-else class="index">{{ index + 1 }}.</span>
                            </div>
                            <div style="width: 75px" class="s-width align-left">
                                {{ item.channel2Name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="add-more" v-if="activeTab === 2 && tokerList.length > 3" @click="showMore = !showMore">
                {{ showMore ? '收起排行' : '查看更多排行' }}
            </div>

            <div class="echart-container">
                <i class="iconfont iconjuxing common-report-vertical-bar" />
                <FilterPopover v-model="dateType" class="fliter-period" container="body" :list="dateTypeList"
                               @change="dateTypeChange" />
                <ChartLine ref="line" :chart-data="chartData" />
            </div>
        </main>
        <tab-bar active="/extension/report" :tab-data="tabData" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TabBar from '@c/TabBar'
import TopBar from '@c/TopBar'
import FilterPopover from '@/components/Report/FilterPopover'
import FilterSection from '@c/FilterSection'
import ChartLine from '@c/Chart/ChartLine'
import Team from '@c/Report/Team'
import API from '@/request/api/selfExtension/report'
import { commonMethods } from 'movit-utils'

export default {
    name: 'ExtensionReport',
    components: {
        TabBar,
        TopBar,
        ChartLine,
        Team,
        FilterPopover,
        FilterSection
    },
    computed: { ...mapGetters(['projectId', 'tabData', 'currentRole', 'safeArea', 'keepAliveList']) },
    data() {
        return {
            form: {
                dateType: 1
            },
            showMore: false,
            filterList: [
                {
                    name: '自定义时间',
                    type: 'date',
                    field: 'dateTime',
                    dateName: ['beginDate', 'endDate']
                }
            ],
            checkList: [
                {
                    label: '日',
                    value: 1
                },
                {
                    label: '周',
                    value: 2
                },
                {
                    label: '月',
                    value: 3
                },
                {
                    label: '',
                    value: 4
                }
            ],
            checkDefault: 0,
            chartData: {
                colorArr: [
                    { color: 'rgba(255,110,110, 0.2)', color1: '#FF6E6E' },
                    {
                        color: 'rgba(250,181,95, 0.2)',
                        color1: '#FAB55F'
                    },
                    {
                        color: 'rgba(79,192,232, 0.2)',
                        color1: '#4FC0E8'
                    },
                    {
                        color: 'rgba(71,207,174, 0.2)',
                        color1: '#47CFAE'
                    }
                ],
                echartData: [],
                xData: []
            },
            dateTypeList: [
                {
                    text: '月',
                    value: 1,
                    className: 'grid-item'
                },
                {
                    text: '周',
                    value: 2,
                    className: 'grid-item'
                },
                {
                    text: '日',
                    value: 3,
                    className: 'grid-item'
                },
                {
                    text: '',
                    value: 4,
                    className: 'grid-item'
                }
            ],
            tokerTypeList: [
                {
                    text: '报备数',
                    value: 1,
                    field: 'reportGroupNum',
                    unit: '组',
                    code: 10,
                    className: 'grid-item'
                },
                {
                    text: '到访数',
                    value: 2,
                    field: 'visitGroupNum',
                    unit: '组',
                    code: 20,
                    className: 'grid-item'
                },
                {
                    text: '认购数',
                    value: 3,
                    field: 'orderSetsNum',
                    unit: '套',
                    code: 40,
                    className: 'grid-item'
                },
                {
                    text: '签约数',
                    value: 4,
                    field: 'contractSetsNum',
                    unit: '套',
                    code: 50,
                    className: 'grid-item'
                }
            ],
            activeTab: 0,
            tabList: [
                {
                    text: '团队',
                    value: 0
                },
                {
                    text: '人员',
                    value: 1
                },
                {
                    text: '拓客方式',
                    value: 2
                }
            ],
            teamList: [],
            teamData: [],
            staticData: [
                {
                    field: 'reportGroupNum',
                    text: '报备量',
                    unit: '组',
                    code: 10,
                    menuId: 'ZT.REPORT.TJ'
                },
                {
                    field: 'firstVisitNum',
                    text: '首访量',
                    unit: '组',
                    code: 10,
                    menuId: 'ZT.REPORT.SF',
                    visitType: 0,
                    isVisit: true,
                },
                {
                    field: 'repeatVisitNum',
                    text: '复访量',
                    unit: '组',
                    code: 20,
                    menuId: 'ZT.REPORT.FF',
                    visitType: 1,
                    isVisit: true,
                },
                // {
                //     field: 'visitGroupNum',
                //     text: '到访量',
                //     unit: '组',
                //     code: 20,
                //     menuId: 'ZT.REPORT.DF'
                // },
                {
                    field: 'orderSetsNum',
                    text: '认购量',
                    unit: '套',
                    code: 40,
                    menuId:'ZT.REPORT.RG'
                },
                {
                    text: '认购金额',
                    field: 'orderAmount',
                    unit: '万',
                    menuId:'ZT.REPORT.RG'
                },
                {
                    field: 'contractSetsNum',
                    text: '签约量',
                    unit: '套',
                    menuId:'ZT.REPORT.QY'
                }
            ],
            statisticsTotalData: {},
            dateType: 1,
            tokerType: 1,
            team: '',
            listData: [],
            tokerList: [],
            groupFlag: false
        }
    },
    created() {
        this.form.projectId = this.projectId
        this.form.roleCode = this.currentRole.roleCode
    },
    mounted() {
        this.init()
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('ExtensionReport') === -1) {
                array.push('ExtensionReport')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList || []
        if (!to.path.includes('/extension/customerHome') && !to.path.includes('/extension/customerReportSort') && !to.path.includes('/extension/customerOrderOrSign')) {
            array = array.filter((item) => {
                return item !== 'ExtensionReport'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    },
    methods: {
        // 千分位
        numFormat(val) {
            if (!val) return '0'
            if (val === '--') return val
            val = val.toString()
            let reg = val.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g
            return val.replace(reg, '$1,')
        },
        init() {
            this.customerTrend()
            this.statisticsTotal()
            this.achievementGroupSort()
        },
        // 日期筛选
        handleChangeTab(val) {
            this.form.dateType = this.checkList[val].value
            delete this.form.beginDate
            delete this.form.endDate

            this.$refs.filterSection.resetFilter()

            this.statisticsTotal()
            if (this.activeTab === 0) {
                this.achievementGroupSort()
                return
            }
            if (this.activeTab === 1) {
                this.achievementStaffSort()
                return
            }
            if (this.activeTab === 2) {
                this.achievementChannelSort()
                return
            }
        },
        filterChange() {
            this.checkDefault = 3
        },
        handleFilterDate(val) {
            if (val?.beginDate || val?.endDate) {
                this.form.beginDate = val?.beginDate.substring(0, 10)
                this.form.endDate = val?.endDate.substring(0, 10)
                this.form.dateType = 4
            } else {
                this.checkDefault = 0
                this.form.dateType = 1
            }
            this.statisticsTotal()
            if (this.activeTab === 0) {
                this.achievementGroupSort()
                return
            }
            if (this.activeTab === 1) {
                this.achievementStaffSort()
                return
            }
            if (this.activeTab === 2) {
                this.achievementChannelSort()
                return
            }
        },
        // 情况统计数据
        statisticsTotal() {
            let params = this.$utils.deepCopy(this.form)

            API.statisticsTotal(params).then((res) => {
                this.statisticsTotalData = res
            })
        },
        dateTypeChange() {
            this.customerTrend()
        },
        // 客户趋势统计
        customerTrend() {
            let params = this.$utils.deepCopy(this.form)
            params.groupBy = this.dateType
            API.customerTrend(params).then((res) => {
                if (!res) {
                    this.chartData.echartData = []
                    this.chartData.xData = []
                } else {
                    this.chartData.echartData = res.data
                    this.chartData.xData = res.xdata
                }
            })
        },
        // 获取团队业绩排行
        achievementGroupSort() {
            let params = this.$utils.deepCopy(this.form)
            params.sortBy = this.tokerType
            this.groupFlag = false
            this.$utils.loading()
            API.achievementGroupSort(params)
                .then((res) => {
                    if (res) {
                        // let lineList = this.tokerTypeList.filter(x => x.value !== this.tokerType)
                        let selectList = this.tokerTypeList.filter((x) => x.value === this.tokerType)
                        // lineList.push({
                        //     text: '转化率',
                        //     field: 'transferRate',
                        //     unit: '%'
                        // })
                        for (let elem of res) {
                            elem.id = elem.groupId
                            elem.name = elem.groupName
                            elem.num = this.tokerTypeList
                            elem.add = elem[selectList[0].field]
                            elem.unit = selectList[0].unit
                        }
                    } else {
                        res = []
                    }
                    this.listData = res
                    this.groupFlag = true
                })
                .finally(() => {
                    this.$toast.clear()
                })
        },
        // 自渠专员业绩排行
        achievementStaffSort() {
            let params = this.$utils.deepCopy(this.form)
            params.sortBy = this.tokerType
            this.groupFlag = false
            this.$utils.loading()
            API.achievementStaffSort(params)
                .then((res) => {
                    if (res) {
                        // let lineList = this.tokerTypeList.filter(x => x.value !== this.tokerType)
                        let selectList = this.tokerTypeList.filter((x) => x.value === this.tokerType)
                        // lineList.push({
                        //     text: '转化率',
                        //     field: 'transferRate',
                        //     unit: '%'
                        // })
                        for (let elem of res) {
                            elem.id = elem.staffId
                            elem.name = elem.staffName
                            elem.num = this.tokerTypeList
                            elem.add = elem[selectList[0].field]
                            elem.unit = selectList[0].unit
                        }
                    } else {
                        res = []
                    }
                    this.listData = res
                    this.groupFlag = true
                })
                .finally(() => {
                    this.$toast.clear()
                })
        },
        // 拓客方式业绩排行
        achievementChannelSort() {
            let params = this.$utils.deepCopy(this.form)
            params.sortBy = this.tokerType
            this.groupFlag = false
            this.$utils.loading()
            API.achievementChannelSort(params)
                .then((res) => {
                    this.tokerList = res ? res : []
                    this.groupFlag = true
                })
                .finally(() => {
                    this.$toast.clear()
                })
        },
        changeActiveTab(index) {
            this.activeTab = index
            if (index === 1) {
                this.tokerType = 2
            }
            this.getList()
        },
        tokerTypeChange(val) {
            this.tokerType = val
            this.getList()
        },
        getList() {
            if (this.activeTab === 0) {
                this.achievementGroupSort()
                return
            }
            if (this.activeTab === 1) {
                this.achievementStaffSort()
                return
            }
            if (this.activeTab === 2) {
                this.achievementChannelSort()
                return
            }
        },
        goReportList(item, num) {
            if (!item.menuId || num === '0') return
            const params = JSON.parse(JSON.stringify(this.form))
            params.menuId = item.menuId
            if (['ZT.REPORT.RG','ZT.REPORT.QY'].includes(params.menuId)) {
                this.$router
                    .push({
                        path: '/extension/customerOrderOrSign',
                        query: params
                    })
                    .catch(() => {
                    })
            }else {
                params.type = 'report'
                if (['ZT.REPORT.SF','ZT.REPORT.FF'].includes(params.menuId)) {
                    params.visitType = item.visitType
                }
                this.$router
                    .push({
                        path: '/extension/customerHome',
                        query: params
                    })
                    .catch(() => {
                    })
            }
        },
        goCustomerList(item, code, num) {
            if (num === 0) return
            let menuId = this.findMenuId(code)
            if (!menuId) return
            const params = JSON.parse(JSON.stringify(this.form))
            params.menuId = menuId

            if (this.activeTab === 0) {
                params.groupId = item.groupId
            }else if (this.activeTab === 1) {
                params.userId = item.staffId
            }else if (this.activeTab === 2) {
                params.channelCode = item.channel2Code
            }

            params.activeTab = this.activeTab
            const menuIdArr = ['ZT.RANK.GROUP.RG','ZT.RANK.STAFF.RG','ZT.RANK.CHANNEL.RG','ZT.RANK.GROUP.QY','ZT.RANK.STAFF.QY','ZT.RANK.CHANNEL.QY']
            if (menuIdArr.includes(params.menuId)) {
                this.$router
                    .push({
                        path: '/extension/customerOrderOrSign',
                        query: params
                    })
                    .catch(() => {
                    })
            }else {
                this.$router
                    .push({
                        path: '/extension/customerReportSort',
                        query: params
                    })
                    .catch(() => {
                    })
            }
        },
        findMenuId(code) {
            const menuIdArray = ['GROUP', 'STAFF', 'CHANNEL']
            switch (code) {
                case 10:
                    return 'ZT.RANK.' + menuIdArray[this.activeTab] + '.BB'
                case 20:
                    return 'ZT.RANK.' + menuIdArray[this.activeTab] + '.DF'
                case 40:
                    return 'ZT.RANK.' + menuIdArray[this.activeTab] + '.RG'
                case 50:
                    return 'ZT.RANK.' + menuIdArray[this.activeTab] + '.QY'
            }
        }
    },
}
</script>
<style scoped lang="less">
.common-page {
    /deep/ .van-tabs {
        margin-top: 8px;

        .van-tabs__wrap {
            // margin-left: -22px;
            height: 25px;
        }

        .van-tab {
            flex-grow: 0;
            padding: 0 30px;
            font-size: 18px;
            line-height: 20px;
            height: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
        }

        .van-tabs__line {
            background: #ffffff;
        }
    }

    .echart-container {
        padding: 0 15px;
        position: relative;
        height: 360px;
        margin-top: 20px;

        .fliter-period {
            position: absolute;
            right: 15px;
            top: 4px;
            z-index: 10;
        }

        .iconjuxing {
            position: absolute;
            top: 3px;
        }
    }

    .filter-container {
        position: fixed;
        width: calc(100% - 36px);
        z-index: 100;
        background: #fff;
    }

    /deep/ .van-ellipsis {
        color: #fff;
    }

    .left-section {
        /deep/ .van-dropdown-menu {
            .van-ellipsis {
                color: #db0826;
            }

            .van-dropdown-menu__title::after {
                border-color: transparent transparent #db0826 #db0826;
            }
        }
    }

    /deep/ .filter-container {
        padding: 0 15px;
        .common-flex-between();
        height: 44px;
    }

    .line {
        padding: 0 15px;
        .common-flex-between();
        margin-top: 10px;

        .tab {
            display: flex;
            align-content: center;

            .li {
                font-size: 13px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #999999;
                margin-right: 30px;

                &.active {
                    font-size: 18px;
                    color: @theme-color;
                    line-height: 18px;
                }
            }
        }
    }

    .main-statistics {
        position: relative;
        box-sizing: border-box;
        padding: 21px 18px 6px;
        background-image: url('@{baseImgUrl}/case/home/red.png');
        background-position: -15px -20px;
        background-repeat: no-repeat;
        background-size: 375px 220px;
        border-radius: 4px;
        margin: 5px 15px 28px;
        flex-wrap: wrap;
        display: flex;

        .right-top-tip {
            position: absolute;
            top: 20px;
            right: 56px;
            color: #fff;
            z-index: 99;

            /deep/ .van-dropdown-menu .van-dropdown-menu__bar .van-dropdown-menu__title {
                color: #fff;
            }

            /deep/ .van-dropdown-menu__title--active {
                color: #fff !important;
            }

            /deep/ .van-dropdown-item {
                left: 14px !important;
                right: 14px !important;
            }
        }

        .img-style {
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
        }

        .label-item {
            position: relative;
            z-index: 2;
            width: 33.3%;
            margin-bottom: 18px;

            .label-content {
                margin-bottom: 8px;
                color: #ffffff;

                .num {
                    font-size: 16px;
                    line-height: 16px;
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

    .container {
        padding: 0 15px;
    }

    .toker-style {
        margin-top: 14px;
        margin-left: 15px;
        overflow: hidden;
        position: relative;

        .table {
            overflow-x: auto;
            border-collapse: collapse;
            position: relative;
            padding-right: 15px;

            &:last-child {
                border-bottom: none;
            }
        }

        .head {
            display: flex;
            flex-wrap: nowrap;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            width: 400px;
            padding-right: 15px;
        }

        .s-width {
            width: 58px;
        }

        .align-left {
            text-align: left;
        }

        .align-right {
            text-align: right;
        }

        .m-width {
            width: 67px;
        }

        .b-width {
            width: 90px;
        }

        &:last-child {
            border-bottom: none;
        }

        .tr {
            width: 400px;
            display: flex;
            flex-wrap: nowrap;
            height: 66px;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding-right: 15px;

            .team-name {
                font-size: 12px;
            }

            .name {
                font-size: 15px;
            }

            .num {
                font-size: 16px;
                font-weight: bold;
                font-family: DINAlternate, DINAlternate-Bold;
            }

            .unit {
                font-size: 10px;
                margin-left: 2px;
            }

            .color {
                color: #db0826;
            }
        }

        .fix {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            overflow-x: hidden;
            overflow-y: hidden;
            box-shadow: 0 0px 20px 0px rgba(0, 0, 0, 0.06);
            background: #fff;

            .tr,
            .head {
                width: 116px;
                padding-right: 0;

                .index {
                    position: relative;
                    width: 30px;
                    text-align: center;
                    display: inline-block;
                    font-weight: 600;
                    font-size: 18px;
                    font-family: DINAlternate-Bold, DINAlternate;

                    img {
                        width: 26px;
                    }
                }
            }
        }
    }
}

.add-more {
    width: 345px;
    height: 40px;
    line-height: 40px;
    background: rgba(241, 15, 15, 0.04);
    border-radius: 8px;
    margin: 10px auto;
    font-size: 15px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #f10f0f;
    text-align: center;
}

.empty-container {
    margin-bottom: 20px;
}
</style>
