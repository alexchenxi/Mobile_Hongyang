<template>
    <div class="common-container">
        <section class="main-container">
            <!-- 数据汇总 -->
            <div class="main-statistics">
                <div class="right-top-tip" @click="filterChange">
                    <FilterSection key="topFilterSection" ref="filterSection" :filter-list="filterList" :isShowMaxDate="true" container="body"
                                   @change="handleFilterDate" />
                </div>
                <van-tabs style="position:absolute;top:10px;left:0" v-model="checkDefault" @change="handleChangeTab"
                          background="none" animated swipeable title-active-color="#ffffff"
                          title-inactive-color="#ffffff" line-width="16px" line-height="3px">
                    <van-tab v-for="tab in checkList" :key="tab.value" :title="tab.label">
                    </van-tab>
                </van-tabs>
                <div class="bottom-label">
                    <div
                        v-for="(item, index) in staticData"
                        :key="index"
                        class="label-item"
                        @click="goReportList(item.menuId, statisticsTotalData[item.field])"
                    >
                        <div class="label-content">
                            <span class="num">{{
                                    statisticsTotalData ? statisticsTotalData[item.field] || '0' : ''
                                }}</span>
                            <span class="unit">{{ item.unit }}</span>
                        </div>
                        <div class="label-title">
                            {{ item.text }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- 趋势 -->
            <div class="trend-container">
                <div class="section-title">
                    <div class="section-title-left">
                        <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                        流速趋势
                    </div>
                    <div class="section-title-center">
                        <van-switch v-model="checked" @change="changeStatus" active-color="#DB0826" size="20px" inactive-color="#dcdee0" />
                        <span class="status-text">净认购口径</span>
                    </div>
                    <div class="section-title-right date-type">
                        <FilterPopover container=".common-container" v-model="buildProductType" :list="housingTypeList" @change="storageStatisticsTrend" />
                    </div>
                </div>
                <div class="container">
                    <van-empty v-if="trendData.xdata && trendData.xdata.length === 0" class="empty-container" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                    <LineAndBar v-else id="saleSwiperEchart" @getEchartData="changeStorageStatisticsTrend" :colors="colors" :data="trendData" :yAxisUnit="yAxisUnit"/>
                </div>
            </div>
            <!-- 自渠统计 -->
            <div class="team-statistics">
                <div class="line">
                    <div class="tab">
                        <span
                            v-for="(item, index) in tabList"
                            :key="index"
                            :class="activeTab === index ? 'active li' : 'li'"
                            @click="changeActiveTab(index)"
                        >{{ item.text }}</span>
                    </div>
                    <FilterPopover
                        v-model="tokerType"
                        container="body"
                        :list="tokerTypeList"
                        @change="tokerTypeChange"
                    />
                </div>
                <van-empty
                    v-if="groupFlag && listData.length === 0 && activeTab !== 1"
                    class="empty-container"
                    :image="$baseImgUrl + '/no-data.png'"
                    description="暂无数据~"
                />
                <Team
                    v-if="activeTab !== 1 && listData.length > 0"
                    :data="listData"
                    :tokerType="tokerType"
                    @goCustomerList="goCustomerList"
                />
                <van-empty
                    v-if="groupFlag && listData.length === 0 && activeTab === 1"
                    class="empty-container"
                    :image="$baseImgUrl + '/no-data.png'"
                    description="暂无数据~"
                />
                <div
                    v-if="activeTab === 1 && listData.length > 0"
                    class="toker-style"
                >
                    <div class="table">
                        <div class="head">
                            <span class="s-width align-left" />
                            <span class="s-width align-left" />
                            <span class="m-width align-right">认购套数</span>
                            <span class="b-width align-right">认购金额</span>
                            <span class="m-width align-right">签约套数</span>
                            <span class="b-width align-right">签约金额</span>
                        </div>
                        <template v-for="(item, index) in listData">
                            <div
                                v-if="showMore || (!showMore && index < 3)"
                                class="tr"
                            >
                                <div class="s-width align-left" />
                                <div class="s-width align-left" />
                                <div
                                    class="m-width align-right"
                                    @click="goCustomerList(item, 'ST.RANK.STAFF.RG', item.rgCount)"
                                >
                                    <span :class="['num', tokerType === 1 ? 'color' : '']">{{ item.rgCount | numFormat(item.rgCount) }}</span>
                                    <span :class="['unit', tokerType === 1 ? 'color' : '']">套</span>
                                </div>
                                <div
                                    class="b-width align-right"
                                    @click="goCustomerList(item, 'ST.RANK.STAFF.RG', item.rgAmount)"
                                >
                                    <span :class="['num', tokerType === 2 ? 'color' : '']">{{ item.rgAmount | numFormat(item.rgAmount) }}</span>
                                    <span :class="['unit', tokerType === 2 ? 'color' : '']">万</span>
                                </div>
                                <div
                                    class="m-width align-right"
                                    @click="goCustomerList(item, 'ST.RANK.STAFF.QY', item.signCount)"
                                >
                                    <span :class="['num', tokerType === 3 ? 'color' : '']">{{ item.signCount | numFormat(item.signCount) }}</span>
                                    <span class="unit">套</span>
                                </div>
                                <div
                                    class="b-width align-right"
                                    @click="goCustomerList(item, 'ST.RANK.STAFF.QY', item.signAmount)"
                                >
                                    <span :class="['num', tokerType === 4 ? 'color' : '']">{{ item.signAmount | numFormat(item.signAmount) }}</span>
                                    <span class="unit">万</span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="fix">
                        <div class="head">
                        <span
                            class="s-width align-left"
                            style="width: 40px;"
                        >排行</span>
                            <span class="s-width align-left">名称</span>
                        </div>
                        <div
                            v-for="(item, index) in listData"
                            :key="index"
                            class="tr"
                        >
                            <div
                                style="width: 40px;"
                                class="s-width align-left"
                            >
                            <span
                                v-if="index < 3"
                                :class="' index bg' + index"
                            >
                            <img :src="$baseImgUrl + '/report/icon-medal' + index + '1.png'">
                        </span>
                                <span
                                    v-else
                                    class="index"
                                >{{ index + 1 }}.</span>
                            </div>
                            <div
                                style="width: 75px;"
                                class="s-width align-left"
                            >
                                {{ item.userName }}
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="add-more" v-if="activeTab === 1 && listData.length > 3" @click="showMore=!showMore">{{showMore?'收起排行':'查看更多排行'}}</div>
            </div>
            <!-- 置业顾问转化率排名 -->
            <div class="team-statistics conversion-rate">
                <div class="section-title">
                    <div class="section-title-left">
                        <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                        置业顾问转化率排名
                        <div style="margin-left: 10px;">
                            <van-popover v-model="isShowRatePopover" trigger="click" placement="bottom-end" theme="light">
                                <div class="common-pop-style">
                                    <div v-for="item in formatRateActions">{{ item }}</div>
                                </div>
                                <template #reference>
                                    <van-icon color="#DB0826" size="16" name="question" @click.stop="isShowRatePopover = true" />
                                </template>
                            </van-popover>
                        </div>
                    </div>
                </div>
                <van-empty
                    v-if="conversionRateList.length === 0"
                    class="empty-container"
                    :image="$baseImgUrl + '/no-data.png'"
                    description="暂无数据~"
                />
                <div
                    v-if="conversionRateList.length > 0"
                    class="toker-style"
                >
                    <div class="table">
                        <div class="head">
                            <span class="s-width align-left" />
                            <span class="s-width align-left" />
                            <span class="m-width align-right">首访量</span>
                            <span class="b-width align-right">认购套数</span>
                            <span class="m-width align-right">转化率</span>
                        </div>
                        <template v-for="(item, index) in conversionRateList">
                            <div
                                v-if="rateShowMore || (!rateShowMore && index < 3)"
                                class="tr"
                            >
                                <div class="s-width align-left" />
                                <div class="s-width align-left" />
                                <div
                                    class="m-width align-right"
                                    @click="goRateCustomerList(item, 'SF')"
                                >
                                    <span :class="['num']">{{ item.visitCount | numFormat(item.visitCount) }}</span>
                                    <span :class="['unit']">组</span>
                                </div>
                                <div
                                    class="b-width align-right"
                                    @click="goRateCustomerList(item, 'RG')"
                                >
                                    <span :class="['num']">{{ item.orderCount | numFormat(item.orderCount) }}</span>
                                    <span :class="['unit']">套</span>
                                </div>
                                <div class="m-width align-right">
                                    <span :class="['num']">{{ item.rate === -9999 ? '--' : item.rate }}</span>
                                    <span class="unit" v-if="item.rate !== -9999">%</span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="fix">
                        <div class="head">
                        <span
                            class="s-width align-left"
                            style="width: 40px;"
                        >排行</span>
                            <span class="s-width align-left">名称</span>
                        </div>
                        <div
                            v-for="(item, index) in conversionRateList"
                            :key="index"
                            class="tr"
                        >
                            <div
                                style="width: 40px;"
                                class="s-width align-left"
                            >
                            <span
                                v-if="index < 3"
                                :class="' index bg' + index"
                            >
                            <img :src="$baseImgUrl + '/report/icon-medal' + index + '1.png'">
                        </span>
                                <span
                                    v-else
                                    class="index"
                                >{{ index + 1 }}.</span>
                            </div>
                            <div
                                style="width: 75px;"
                                class="s-width align-left"
                            >
                                {{ item.staffName }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="add-more" v-if="conversionRateList.length > 3" @click="rateShowMore = !rateShowMore">
                    {{ rateShowMore ? '收起' : '查看更多' }}
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineAndBar from '@/components/Chart/ELineAndBar'
import FilterPopover from '@/components/Report/FilterPopover'
import FilterSection from '@c/FilterSection'
import Team from '@c/Report/Team'
import Api from '@/request/api/caseSystem/report'

export default {
    components: {
        LineAndBar,
        FilterPopover,
        FilterSection,
        Team
    },
    data() {
        return {
            form: {
                dateType: 1
            },
            showMore: false,
            rateShowMore: false,
            isShowRatePopover: false,
            checked: true,
            status: 1,
            checkDefault: 0,
            formatRateActions: [
                '1、首访量：统计时间范围内置业',
                '顾问接待过的首访客户总组数',
                '2、认购套数：统计时间范围内',
                '置业顾问的净认购套数',
                '3、转化率：计算公式=',
                '(认购套数÷首访量)×100%'
            ],
            staticData: [
                {
                    field: 'rgAmount',
                    text: '认购金额',
                    unit: '万',
                    code: 10,
                    menuId: 'ST.RANK.STAFF.RG'
                },
                {
                    field: 'rgCount',
                    text: '认购套数',
                    unit: '套',
                    code: 20,
                    menuId: 'ST.RANK.STAFF.RG'
                },
                {
                    field: 'noSignAmount',
                    text: '认未签金额',
                    unit: '万',
                    menuId: 'ST.RANK.STAFF.RWQ',
                    code: 40
                },
                {
                    field: 'noSignCount',
                    text: '认未签套数',
                    unit: '套',
                    menuId: 'ST.RANK.STAFF.RWQ',
                },
                {
                    field: 'signAmount',
                    text: '签约金额',
                    unit: '万',
                    menuId: 'ST.RANK.STAFF.QY'
                },
                {
                    field: 'signCount',
                    text: '签约套数',
                    unit: '套',
                    menuId: 'ST.RANK.STAFF.QY'
                }
            ],
            statisticsTotalData: {},
            leftDate: '',
            rightDate: '',
            housingTypeList: [
                {
                    text: '住宅',
                    value: '住宅',
                    disabled: false,
                    className: 'grid-item',
                },
                {
                    text: '商办',
                    value: '商办',
                    disabled: false,
                    className: 'grid-item',
                },
                {
                    text: '储藏室',
                    value: '储藏室',
                    disabled: false,
                    className: 'grid-item',
                },
                {
                    text: '车位',
                    value: '车位',
                    disabled: false,
                    className: 'grid-item',
                },
            ],
            colors: ['#f35e6a', '#FAB55F'],
            yAxisUnit: ['套','元/㎡'],
            lengData: [],
            trendData: {},
            activeTab: 0,
            tabList: [
                {
                    text: '团队',
                    value: 0
                },
                {
                    text: '顾问',
                    value: 1
                }
            ],
            listData: [],
            tokerList: [],
            groupFlag: false,
            tokerType: 2,
            tokerTypeList: [
                {
                    text: '认购套数',
                    value: 1,
                    field: 'rgCount',
                    unit: '套',
                    code: 10,
                    className: 'grid-item'
                },
                {
                    text: '认购金额',
                    value: 2,
                    field: 'rgAmount',
                    unit: '万',
                    code: 20,
                    className: 'grid-item'
                },
                {
                    text: '签约套数',
                    value: 3,
                    field: 'signCount',
                    unit: '套',
                    code: 40,
                    className: 'grid-item'
                },
                {
                    text: '签约金额',
                    value: 4,
                    field: 'signAmount',
                    unit: '万',
                    code: 50,
                    className: 'grid-item'
                }
                // {
                //     text: '认购金额',
                //     value: 5,
                //     field: 'contractSetsNum',
                //     unit: '元',
                //     code: 60,
                //     className: 'grid-item'
                // },
                // {
                //     text: '签约金额',
                //     value: 6,
                //     field: 'contractSetsNum',
                //     unit: '元',
                //     code: 70,
                //     className: 'grid-item'
                // }
            ],
            buildProductType: '住宅',
            statusName: '认购',
            filterList: [
                {
                    name: '自定义时间',
                    type: 'date',
                    field: 'dateTime',
                    dateName: ['beginDate', 'endDate']
                }
            ],
            statusList: [
                {
                    text: '认购',
                    value: 1
                },
                {
                    text: '签约',
                    value: 2
                }
            ],
            dimension: 1,
            currentRate: 0,
            gradientColor: {
                '0%': '#88D561',
                '100%': '#47CFAE'
            },
            trendDateType: 1,
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
                    label: '年',
                    value: 5
                },
                {
                    label: '',
                    value: 4
                }
            ],
            dateTypeList: [
                {
                    text: '月',
                    value: 1,
                    disabled: false
                },
                {
                    text: '周',
                    value: 2,
                    disabled: false
                },
                {
                    text: '日',
                    value: 3,
                    disabled: false
                }
            ],
            dateType: 1,
            date: [],
            salesTotalData: {}, // 客储情况统计数据
            groupTotalData: [], // 团队统计数据
            salesTarget: [], // 本月团队目标值
            conversionRateList: [], // 置业顾问转化率排名
            flag: false
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole'])
    },
    created() {
        this.form.projectId = this.projectId
        this.form.roleCode = this.currentRole.roleCode
    },
    mounted() {
        this.initData()
    },
    methods: {
        // 日期筛选
        handleChangeTab(val, title) {
            let curItem = this.checkList.filter(item => item.label === title)
            delete this.form.beginDate
            delete this.form.endDate

            this.form.dateType = curItem[0] && curItem[0].value
            this.$refs.filterSection.resetFilter()
            this.salesStatisticsTotal()
            this.salesStatisticsTrend()
            this.staffVisitToOrderConversionRate()
            this.getList()
        },
        filterChange() {
            this.checkDefault = 4
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
            this.salesStatisticsTotal()
            this.salesStatisticsTrend()
            this.staffVisitToOrderConversionRate()
            this.getList()
        },
        // 数据看板穿透
        goReportList(code,num) {
            // if (num === 0 ) return
            const params = JSON.parse(JSON.stringify(this.form))
            params.menuId = code
            this.$router.push({
                path: '/case/customerOrderOrSign',
                query: params
            }).catch(() => {
            })
        },

        changeActiveTab(index) {
            this.activeTab = index
            this.listData = []
            this.getList()
        },
        tokerTypeChange(val) {
            this.tokerType = val
            this.getList()
        },
        changeStatus(val) {
            this.checked = val
            this.salesStatisticsTrend()
        },
        storageStatisticsTrend() {
            this.salesStatisticsTrend()
        },
        changeStorageStatisticsTrend(type) {
            this.salesStatisticsTrend(type)
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
        },
        // 获取团队业绩排行
        achievementGroupSort() {
            let params = this.$utils.deepCopy(this.form)
            params.sortBy = this.tokerType
            this.groupFlag = false
            this.$utils.loading()
            Api.salesStatisticsGroupSort(params).then(res => {
                if (res) {
                    let selectList = this.tokerTypeList.filter(x => x.value === this.tokerType)
                    for (let elem of res) {
                        elem.rgAmount = elem.rgAmount && Math.round(elem.rgAmount)
                        elem.signAmount = elem.signAmount && Math.round(elem.signAmount)
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
            }).finally(() => {
                this.$toast.clear()
            })
        },
        // 销售专员业绩排行
        achievementStaffSort() {
            let params = this.$utils.deepCopy(this.form)
            params.sortBy = this.tokerType
            this.groupFlag = false
            this.$utils.loading()
            Api.salesStatisticsStaffSort(params).then(res => {
                if (res) {
                    let lineList = this.tokerTypeList
                    let selectList = this.tokerTypeList.filter(x => x.value === this.tokerType)
                    for (let elem of res) {
                        elem.rgAmount = elem.rgAmount && Math.round(elem.rgAmount)
                        elem.signAmount = elem.signAmount && Math.round(elem.signAmount)
                        elem.id = elem.userGUID
                        elem.name = elem.userName
                        elem.num = lineList
                        elem.hideRight = true
                        // elem.add = elem[selectList[0].field]
                        // elem.unit = selectList[0].unit
                    }
                } else {
                    res = []
                }
                this.listData = res
                // this.listData = [{"ProjName":"南京桥林时光泊月园","UserName":"范建彬","UserGUID":"B635D545-EFDA-42F4-6602-08D849E18378","rgCount":-1,"rgAmount":-71.1200},{"ProjName":"南京桥林时光泊月园","signAmount":180.7500,"UserName":"虞孝伟","UserGUID":"A01B3CBD-B49E-4E68-A2B4-08D8DC0A5055","signCount":2,"rgCount":2,"rgAmount":180.7500},{"ProjName":"南京桥林时光泊月园","signAmount":654.7400,"UserName":"王书艳","UserGUID":"C500816A-D166-41F8-BD7E-9E9DF7F4F1AD","signCount":8,"rgCount":8,"rgAmount":655.1600},{"ProjName":"南京桥林时光泊月园","signAmount":-20.2800,"UserName":"滕岑","UserGUID":"A692BCA5-BA81-4ECE-B8AE-B3E47666B484","signCount":0,"rgCount":0,"rgAmount":-20.2800}]
                this.groupFlag = true
            }).finally(() => {
                this.$toast.clear()
            })
        },
        // 自渠报表穿透
        goCustomerList(item,code, num) {
            if (this.activeTab === 0) return
            const params = JSON.parse(JSON.stringify(this.form))
            params.menuId = code

            if (item.userGUID) {
                params.zygwid = item.userGUID
            }
            if (item.groupId) {
                params.groupId = item.groupId
            }
            this.$router.push({
                path: '/case/customerOrderOrSign',
                query: params
            }).catch(() => {
            })
        },

        trendDateTypeChange(val) {
            this.salesStatisticsTrend()
        },
        filterValidate(val) {
            if (val.dateType.length === 0) {
                if (!val.startDate && !val.endDate) {
                    this.$toast('请选择或填写时间')
                    return false
                } else if (!val.startDate) {
                    this.$toast('请填写开始时间')
                    return false
                } else if (!val.endDate) {
                    this.$toast('请填写结束时间')
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        },
        // 千分位
        numFormat(val) {
            if (!val) return '0'
            if(val === '--') return val
            val = Math.round(val).toString()
            let reg = val.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g
            return val.replace(reg, '$1,')
        },
        initData() {
            this.salesStatisticsTotal()
            this.achievementGroupSort()
            this.salesStatisticsTrend()
            this.staffVisitToOrderConversionRate()
        },
        // 计算同比百分比
        formatPercent(current, last) {
            let obj = {
                type: 0,
                rate: 0
            }
            if (current > last) {
                if (last === 0) {
                    obj.rate = 100
                    obj.type = 1
                } else {
                    let rate = ((current - last) / last) * 100
                    obj.rate = rate.toFixed(2)
                    obj.type = 1
                }
            } else if (current < last) {
                let rate = ((last - current) / last) * 100
                obj.rate = rate.toFixed(2)
                obj.type = 0
            } else {
                obj.rate = 0
                obj.type = 2
            }
            return obj
        },
        // 获取销售情况统计数据
        async salesStatisticsTotal() {
            let params = this.$utils.deepCopy(this.form)
            params.noCache = 1
            const result = await Api.salesStatisticsTotal(params)
            for (let item in result) {
                if (['rgAmount','noSignAmount','signAmount'].includes(item)) {
                    result[item] = result[item] ? this.numFormat(result[item]) : 0
                }
            }
            this.statisticsTotalData = result
        },
        // 获取销售情况团队目标完成数据
        async salesStatisticsGroupTotal() {
            let params = {
                projectId: this.projectId,
                type: this.status,
                dateType: this.dateType,
                beginDate: this.form.beginDate,
                endDate: this.form.endDate,
                dimension: this.dimension
            }
            this.flag = false
            let result = await Api.salesStatisticsGroupTotal(params)
            result.map(item => {
                item.currentRate = 0
            })
            this.groupTotalData = result
            this.flag = true
            this.$forceUpdate()
        },
        async staffVisitToOrderConversionRate() {
            let params = {
                beginDate: this.form.beginDate,
                endDate: this.form.endDate,
                projectId: this.projectId,
                dateType: this.form.dateType,
            }
            let result = await Api.staffVisitToOrderConversionRate(params)
            this.conversionRateList = result || []
        },
        goRateCustomerList(item, code) {
            let params = {
                staffId: item.staffId,
                projectId: this.projectId,
                dateType: this.form.dateType,
                roleCode: this.currentRole.roleCode,
                beginDate: this.form.beginDate,
                endDate: this.form.endDate,
            }
            if (code === 'SF') {
                params.visitType = 0
                this.$router
                    .push({
                        path: '/case/customerReportVisit',
                        query: params,
                    })
                    .catch(() => {})
            }else {
                params.menuId =  "ST.RANK.STAFF.RG"
                this.$router
                    .push({
                        path: '/case/storageOrderOrSignDetail',
                        query: params,
                    })
                    .catch(() => {})
            }
        },
        // 获取销售情况趋势数据
        async salesStatisticsTrend(type) {
            // 转时间戳进行比较
            const startTimestamp = this.form.beginDate && new Date(this.form.beginDate)
            const endTimestamp = this.form.beginDate && new Date(this.form.endDate)
            const leftTimestamp = this.leftDate && new Date(this.leftDate)
            const rightTimestamp = this.leftDate && new Date(this.rightDate)
            // 自定义时间 当左滑时间小于开始时间或者右滑时间大于结束时间时不请求接口
            const flag = (type === 'right' && startTimestamp && leftTimestamp && leftTimestamp < startTimestamp) || (type === 'left' && endTimestamp && rightTimestamp && rightTimestamp > endTimestamp)

            if (flag) return

            let params = {
                projectId: this.projectId,
                dateType: this.form.dateType,
                roleCode: this.currentRole.roleCode,
                zStartTime: this.form.beginDate,
                zEndTime: this.form.endDate,
                startTime: type === 'left' ? this.rightDate : '',
                endTime: type === 'right' ? this.leftDate : '',
                buildProductType: this.buildProductType,
                datenum: 7,
                querystatus: this.checked ? '认购' : '签约'
            }

            const result = await Api.salesStatisticsSaleFlow(params)
            let chartsObj = {
                data: [
                    {name: '成交套数', data: []},
                    {name: '成交单价', data: []},
                ],
                xdata:[]
            }
            if (!result.jsonArray) {
                this.trendData = chartsObj
                return
            }
            this.leftDate = result.leftDate
            this.rightDate = result.rightDate
            result.jsonArray.forEach(item => {
                item['成交单价'] = item['成交单价'].toFixed()
                const keys = Object.keys(item)
                chartsObj.data.map(col => {
                    if (keys.includes(col.name)) {
                        col.data.push(item[col.name])
                    }
                })
            })
            chartsObj.xdata = result.xdata
            this.lengData = chartsObj.data[1].data
            this.trendData = chartsObj
        },
        showKeyboard(index) {
            this.salesTarget.map(item => {
                item.show = false
            })
            this.salesTarget[index].show = true
        },
        hideKeyboard(index) {
            this.salesTarget[index].show = false
        }
    }
}
</script>

<style lang="less" scoped>
.common-container {
    overflow: auto;
    height: 100%;

    /deep/ .van-popover__action {
        width: 100px;
    }

    /deep/ .filter-container {
        .common-flex-between();
        position: fixed;
        width: calc(100% - 36px);
        top: 0;
        left: 0;
        padding: 0 18px;
        height: 44px;
        z-index: 999;
        background: #ffffff;
    }

    .main-container {
        //padding: 0 15px;
        //margin-top: 44px;
        .main-statistics {
            position: relative;
            //width: 100%;
            height: 260px;
            box-sizing: border-box;
            padding: 21px 14px 6px;
            background-image: url("@{baseImgUrl}/case/home/red.png");
            background-position: -15px -20px;
            background-repeat: no-repeat;
            background-size: 375px 280px;
            border-radius: 4px;
            margin: 5px 15px;

            /deep/ .van-tabs {
                margin-top: 8px;

                .van-tabs__wrap {
                    // margin-left: -22px;
                    height: 25px;
                }

                .van-tab {
                    flex-grow: 0;
                    padding: 0 24px;
                    font-size: 18px;
                    line-height: 20px;
                    height: 20px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #FFFFFF;
                    background: transparent;
                }

                .van-tab--active {
                    background: transparent;
                }

                .van-tabs__line {
                    background: #ffffff;
                }
            }

            .right-top-tip {
                position: absolute;
                top: 20px;
                right: 32px;
                color: #fff;
                z-index: 99;

                /deep/ .van-ellipsis {
                    color: #fff;
                }

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

            .bottom-label {
                margin-top: 40px;
                display: flex;
                flex-wrap: wrap;

                .label-item {
                    position: relative;
                    z-index: 2;
                    width: 50%;
                    margin-bottom: 18px;

                    .label-content {
                        margin-bottom: 8px;
                        color: #ffffff;

                        .num {
                            font-size: 21px;
                            line-height: 16px;
                            font-weight: bold;
                            color: #ffbb00;
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

        .section-title {
            .common-flex-between();
            padding: 24px 0 10px 0;

            .section-title-left {
                .common-flex();
                font-size: 18px;
                color: @header-text-color;
                line-height: 18px;
                font-weight: bold;
                font-family: PingFangSC-Medium, PingFang SC;
            }
            .section-title-center {
                display: flex;
                align-items: center;
                .status-text {
                    margin-left: 10px;
                }
            }
        }

        .team-statistics {
            padding-bottom: 24px;
            .section-title {
                padding: 0 15px;
            }
            .section-title-right {
                .setting {
                    .common-flex();
                    font-size: 14px;
                    line-height: 14px;
                    color: @theme-color;
                    font-weight: 400;
                    font-family: PingFangSC-Regular, PingFang SC;

                    .iconfont {
                        margin-right: 4px;
                    }
                }
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
                    width: 470px;
                    padding-right: 15px;
                }

                .s-width {
                    width: 58px;
                }

                .align-left {
                    text-align: left;
                }

                .align-right {
                    text-align: center;
                }

                .m-width {
                    width: 60px;
                }

                .b-width {
                    width: 120px;
                }

                &:last-child {
                    border-bottom: none;
                }

                .tr {
                    width: 470px;
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
                        color: #DB0826;
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
        .conversion-rate {
            .toker-style .m-width {
                flex: 1;
            }
        }
        .trend-container {
            padding-bottom: 24px;

            .section-title {
                padding-bottom: 0;
                margin: 0 15px;
            }

            //.container {
            //    padding: 0 10px;
            //}
        }
    }
}
.add-more{
    width: 345px;
    height: 40px;
    line-height: 40px;
    background: rgba(241,15,15,0.04);
    border-radius: 8px;
    margin:10px auto;
    font-size: 15px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #f10f0f;
    text-align: center;
}
.team-popup {
    .container {
        height: 100%;

        .van-form {
            height: 100%;
        }

        .title-section {
            .common-flex-center();
            height: 60px;
            border-bottom: 1px solid #eeeeee;
            font-size: 18px;
            line-height: 18px;
            color: @header-text-color;
            font-weight: 500;
            font-family: PingFangSC-Medium, PingFang SC;
        }

        .action-section {
            .common-flex-between();
            height: 60px;
            border-top: 1px solid #eeeeee;
            padding: 0 15px;

            .van-button:first-child {
                margin-right: 5px;
            }

            .van-button:last-child {
                margin-left: 5px;
            }
        }

        .setting-section {
            height: calc(100% - 120px);
            overflow: auto;
            padding: 0 15px;

            .setting-item {
                margin-bottom: 24px;

                &:first-child {
                    margin-top: 24px;
                }

                .setting-label {
                    font-size: 14px;
                    color: @header-text-color;
                    line-height: 14px;
                    font-weight: 400;
                    font-family: PingFangSC-Regular, PingFang SC;
                    margin-bottom: 10px;
                }

                .setting-content {
                    .van-field {
                        border: 1px solid #dddddd;
                        border-radius: 4px;
                        height: 56px;

                        .unit {
                            font-size: 14px;
                            color: @header-text-color;
                            font-weight: 400;
                            font-family: PingFangSC-Regular, PingFang SC;
                        }
                    }
                }
            }
        }
    }
}
</style>
