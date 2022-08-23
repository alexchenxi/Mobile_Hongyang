<template>
    <div class="common-container">
        <section class="main-container">
            <!-- 数据汇总 -->
<!--            <div v-if="form.dateType === 4 && form.beginDate" style="position: relative; height: 30px;line-height: 30px">-->
<!--                <sapn style="position:absolute; top: 0; right: 20px">{{ form.beginDate }}至{{ form.endDate }}</sapn>-->
<!--            </div>-->
            <div class="main-statistics">
                <div class="right-top-tip" @click="filterChange">
                    <FilterSection ref="filterSection" :filter-list="filterList" :isShowMaxDate="true" container="body" @change="handleFilterDate" />
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
                <div class="bottom-label">
                    <div
                        v-for="(item, index) in staticData"
                        :key="index"
                        class="label-item"
                        @click="item.isVisit ? goVisitList(item.visitType, statisticsTotalData[item.field] || '0') : goItemDetail(item, statisticsTotalData[item.field] || '0')"
                    >
                        <div class="label-content">
                            <span class="num">{{ statisticsTotalData ? numFormat(statisticsTotalData[item.field]) : '' }}</span>
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
                        {{ statusName }}趋势
                    </div>
                    <div class="section-title-right date-type">
                        <FilterPopover container=".common-container" v-model="trendDateType" :list="dateTypeList" @change="storageStatisticsTrend" />
                    </div>
                </div>
                <div class="container">
                    <LineAndBar id="swiperEchart" @getEchartData="storageStatisticsTrend" :colors="colors" :lengData="lengData" :data="trendData" />
                </div>
            </div>
            <!-- 客户漏斗 -->
            <div class="funnel-statistics">
                <div class="section-title">
                    <div class="section-title-left">
                        <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                        客户漏斗
                    </div>
                    <div class="section-title-center">
                        <van-switch v-model="funnelChecked" @change="changeFunnelStatus" active-color="#DB0826" size="20px" inactive-color="#dcdee0" />
                        <span class="status-text">{{ funnelChecked ? '首访' : '最后到访'  }}</span>
                    </div>
                    <div class="section-title-right date-type">
                        <FilterPopover container="body" v-model="channel1Code" :list="channelList" @change="funnelChanneChange" />
                    </div>
                </div>
                <div class="chart-box">
                    <FunnelChart :chartData="funnelChartData" />
                </div>
                <van-empty v-if="funnelChartData && funnelChartData.data.length === 0" class="empty-container" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
            </div>
            <!-- 渠道占比 -->
            <div class="channel-statistics team-statistics">
                <div class="section-title" style="padding-top: 0">
                    <div class="section-title-left">
                        <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                        渠道占比
                        <div style="margin-left: 10px;">
                            <van-popover v-model="isShowChannelPopover" trigger="click" placement="right" theme="light">
                                <div class="common-pop-style">
                                    <div v-for="item in formatChannelActions">{{ item }}</div>
                                </div>
                                <template #reference>
                                    <van-icon color="#DB0826" size="16" name="question" @click.stop="isShowChannelPopover = true" />
                                </template>
                            </van-popover>
                        </div>
                    </div>
                    <div class="section-title-right date-type">
                        <FilterPopover container="body" v-model="channelTokerType" :list="tokerTypeList" @change="channelTokerTypeChange" />
                    </div>
                </div>
                <div class="container">
                    <van-empty v-if="pieChartData.data && pieChartData.data.length === 0" class="empty-container" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                    <div class="pie-chart" v-else>
                        <PieChart :chartData="pieChartData" @handerChange="handerChangePieChar" />
                    </div>
                    <div v-if="channelTwoCustomerList && channelTwoCustomerList.length > 0" class="add-more">
                        {{ channelOneTitle }}
                    </div>
                    <div v-if="channelTwoCustomerList && channelTwoCustomerList.length > 0" class="toker-style">
                        <div class="table" style="padding-right: 0">
                            <div class="head channel-head" style="padding-right: 0;">
                                <span class="s-width align-left left-fixed" />
                                <span class="m-width align-right">报备</span>
                                <span class="m-width align-right">到访</span>
                                <span class="m-width align-right">认购套数</span>
                                <span class="m-width align-right">签约套数</span>
                                <span class="m-width align-right">认购金额</span>
                                <span class="m-width align-right">签约金额</span>
                            </div>
                            <template v-for="(item, index) in channelTwoCustomerList">
                                <div v-if="channelShowMore || (!channelShowMore && index < 3)" class="tr channel-hr">
                                    <div class="s-width align-left left-fixed" />

                                    <div class="m-width align-right" @click="item.channelName !== '自然来访' ? goCustomerList(item, 10) : ''">
                                        <span :class="['num', channelTokerType === 1 ? 'color' : '']">
                                            {{ item.channelName === '自然来访' ? '--' : item.reportGroupNum | numFormat(item.reportGroupNum) }}
                                        </span>
                                        <span :class="['unit', channelTokerType === 1 ? 'color' : '']">组</span>
                                    </div>
                                    <div class="m-width align-right" @click="goCustomerList(item, 20)">
                                        <span :class="['num', channelTokerType === 2 ? 'color' : '']">{{ item.visitGroupNum | numFormat(item.visitGroupNum) }}</span>
                                        <span :class="['unit', channelTokerType === 2 ? 'color' : '']">组</span>
                                    </div>
                                    <div class="m-width align-right" @click="goCustomerList(item, 40)">
                                        <span :class="['num', channelTokerType === 3 ? 'color' : '']">{{ item.orderSetsNum || '--' }}</span>
                                        <span class="unit">套</span>
                                    </div>
                                    <div class="m-width align-right" @click="goCustomerList(item, 50)">
                                        <span :class="['num', channelTokerType === 4 ? 'color' : '']">{{ item.contractSetsNum || '--' }}</span>
                                        <span class="unit">套</span>
                                    </div>
                                    <div class="m-width align-right" style="padding: 0 5px" @click="goCustomerList(item, 40)">
                                        <span :class="['num', tokerType === 5 ? 'color' : '']">{{ item.orderMoney | numFormat(item.orderMoney) }}</span>
                                        <span class="unit">万</span>
                                    </div>
                                    <div class="m-width align-right" style="padding: 0 5px" @click="goCustomerList(item, 50)">
                                        <span :class="['num', tokerType === 6 ? 'color' : '']" style="margin-left: 10px">{{ item.contractMoney | numFormat(item.contractMoney) }}</span>
                                        <span class="unit">万</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="fix left-fixed">
                            <div class="head">
                                <span class="s-width align-left">二级渠道</span>
                            </div>
                            <div v-for="(item, index) in channelTwoCustomerList" :key="index" class="tr left-fixed">
                                <div class="s-width align-left left-fixed">
                                    {{ item.channelName }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="add-more" v-if="channelTwoCustomerList.length > 3" @click="channelShowMore = !channelShowMore">
                        {{ channelShowMore ? '收起' : '查看更多' }}
                    </div>
                </div>
            </div>
            <!-- 成交等级分析 -->
            <div class="channel-statistics team-statistics">
                <div class="section-title">
                    <div class="section-title-left">
                        <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                        成交等级分析
                    </div>
                </div>
                <div class="container">
                    <van-empty v-if="salesLevelPieChartData.data && salesLevelPieChartData.data.length === 0" class="empty-container" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                    <div class="pie-chart" v-else>
                        <PieChart :chartData="salesLevelPieChartData" />
                    </div>
                </div>
            </div>
            <!-- 自渠统计 -->
            <div class="team-statistics">
                <div class="section-title">
                    <div class="section-title-left">
                        <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                        自渠统计
                    </div>
                </div>
                <div class="line">
                    <div class="tab">
                        <span v-for="(item, index) in tabList" :key="index" :class="activeTab === index ? 'active li' : 'li'" @click="changeActiveTab(index)">{{ item.text }}</span>
                    </div>
                    <FilterPopover v-model="tokerType" container="body" :list="tokerTypeList" @change="tokerTypeChange" />
                </div>
                <van-empty v-if="groupFlag && listData.length === 0 && activeTab !== 1" class="empty-container" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                <Team v-if="activeTab !== 1 && listData.length > 0" :tokerType="tokerType" :data="listData" @goCustomerList="goCustomerList" />
                <van-empty v-if="groupFlag && listData.length === 0 && activeTab === 1" class="empty-container" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                <div v-if="activeTab === 1 && listData.length > 0" class="toker-style">
                    <div class="table">
                        <div class="head" style="width: 590px">
                            <span class="s-width align-left" />
                            <span class="s-width align-left" />
                            <span class="m-width align-right">报备</span>
                            <span class="m-width align-right">到访</span>
                            <span class="m-width align-right">认购</span>
                            <span class="m-width align-right">签约</span>
                            <span class="align-right" style="flex: 1">认购金额</span>
                            <span class="align-right" style="flex: 1">签约金额</span>
                        </div>
                        <template v-for="(item, index) in listData">
                            <div v-if="showMore || (!showMore && index < 3)" class="tr" style="min-width: 590px;">
                                <div class="s-width align-left" />
                                <div class="s-width align-left" />
                                <div class="m-width align-right" @click="goCustomerList(item, 10)">
                                    <span :class="['num', tokerType === 1 ? 'color' : '']">{{ item.reportGroupNum | numFormat(item.reportGroupNum) }}</span>
                                    <span :class="['unit', tokerType === 1 ? 'color' : '']">组</span>
                                </div>
                                <div class="m-width align-right" @click="goCustomerList(item, 20)">
                                    <span :class="['num', tokerType === 2 ? 'color' : '']">{{ item.visitGroupNum | numFormat(item.visitGroupNum) }}</span>
                                    <span :class="['unit', tokerType === 2 ? 'color' : '']">组</span>
                                </div>
                                <div class="m-width align-right" @click="goCustomerList(item, 40)">
                                    <span :class="['num', tokerType === 3 ? 'color' : '']">{{ item.orderSetsNum | numFormat(item.orderSetsNum) }}</span>
                                    <span class="unit">套</span>
                                </div>
                                <div class="m-width align-right" @click="goCustomerList(item, 50)">
                                    <span :class="['num', tokerType === 4 ? 'color' : '']">{{ item.contractSetsNum | numFormat(item.contractSetsNum) }}</span>
                                    <span class="unit">套</span>
                                </div>
                                <div class="align-right" style="flex: auto; padding: 0 5px" @click="goCustomerList(item, 40)">
                                    <span :class="['num', tokerType === 5 ? 'color' : '']">{{ item.orderPrice | numFormat(item.orderPrice) }}</span>
                                    <span class="unit">万</span>
                                </div>
                                <div class="align-right" style="flex: auto; padding: 0 5px" @click="goCustomerList(item, 50)">
                                    <span :class="['num', tokerType === 6 ? 'color' : '']">{{ item.contractPrice | numFormat(item.contractPrice) }}</span>
                                    <span class="unit">万</span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="fix">
                        <div class="head">
                            <span class="s-width align-left" style="width: 40px">排行</span>
                            <span class="s-width align-left">名称</span>
                        </div>
                        <div v-for="(item, index) in listData" :key="index" class="tr">
                            <div style="width: 40px" class="s-width align-left">
                                <span v-if="index < 3" :class="' index bg' + index">
                                    <img :src="$baseImgUrl + '/report/icon-medal' + index + '1.png'" />
                                </span>
                                <span v-else class="index">{{ index + 1 }}.</span>
                            </div>
                            <div style="width: 75px" class="s-width align-left">
                                {{ item.staffName }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="add-more" v-if="activeTab === 1 && listData.length > 3" @click="showMore = !showMore">
                    {{ showMore ? '收起排行' : '查看更多排行' }}
                </div>
            </div>
            <!-- 置业顾问最后到访客户等级分布 -->
            <div class="team-statistics client-grade">
                <div class="section-title">
                    <div class="section-title-left">
                        <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                        置业顾问最后到访客户等级分布
                        <div style="margin-left: 10px;">
                            <van-popover v-model="isShowPopover" trigger="click" placement="bottom-end" theme="light">
                                <div class="common-pop-style">
                                    <div v-for="item in formatActions">{{ item }}</div>
                                </div>
                                <template #reference>
                                    <van-icon color="#DB0826" size="16" name="question" @click.stop="isShowPopover = true" />
                                </template>
                            </van-popover>
                        </div>
                    </div>
                </div>
                <van-empty v-if="clientGradeList.length === 0" class="empty-container" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                <div v-if="clientGradeList.length > 0" class="toker-style">
                    <div class="table">
                        <div class="head">
                            <span class="s-width align-left" />
                            <span class="s-width align-left" />
                            <span class="m-width align-right">A等级</span>
                            <span class="m-width align-right">B等级</span>
                            <span class="m-width align-right">C等级</span>
                            <span class="m-width align-right">D等级</span>
                            <span class="m-width align-right">E等级</span>
                        </div>
                        <template v-for="(item, index) in clientGradeList">
                            <div v-if="clientGradeShowMore || (!clientGradeShowMore && index < 3)" class="tr">
                                <div class="s-width align-left" />
                                <div class="s-width align-left" />
                                <div class="m-width align-right" @click="goCustomerGradeDetail(item, 'A')">
                                    <span :class="['num']">{{ item.levelA | numFormat(item.levelA) }}</span>
                                    <span :class="['unit']">组</span>
                                </div>
                                <div class="m-width align-right" @click="goCustomerGradeDetail(item, 'B')">
                                    <span :class="['num']">{{ item.levelB | numFormat(item.levelB) }}</span>
                                    <span :class="['unit']">组</span>
                                </div>
                                <div class="m-width align-right" @click="goCustomerGradeDetail(item, 'C')">
                                    <span :class="['num']">{{ item.levelC | numFormat(item.levelC) }}</span>
                                    <span class="unit">组</span>
                                </div>
                                <div class="m-width align-right" @click="goCustomerGradeDetail(item, 'D')">
                                    <span :class="['num']">{{ item.levelD | numFormat(item.levelD) }}</span>
                                    <span class="unit">组</span>
                                </div>
                                <div class="m-width align-right" @click="goCustomerGradeDetail(item, 'E')">
                                    <span :class="['num']">{{ item.levelE | numFormat(item.levelE) }}</span>
                                    <span class="unit">组</span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="fix">
                        <div class="head">
                            <span class="s-width align-left" style="width: 40px">排行</span>
                            <span class="s-width align-left">姓名</span>
                        </div>
                        <div v-for="(item, index) in clientGradeList" :key="index" class="tr">
                            <div style="width: 40px" class="s-width align-left">
                                <span v-if="index < 3" :class="' index bg' + index">
                                    <img :src="$baseImgUrl + '/report/icon-medal' + index + '1.png'" />
                                </span>
                                <span v-else class="index">{{ index + 1 }}.</span>
                            </div>
                            <div style="width: 75px" class="s-width align-left">
                                {{ item.staffName }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="add-more" v-if="clientGradeList.length > 3" @click="clientGradeShowMore = !clientGradeShowMore">
                    {{ clientGradeShowMore ? '收起' : '查看更多' }}
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
import FunnelChart from '@c/Chart/Funnel.vue'
import PieChart from '@c/Chart/Pie.vue'
import Team from '@c/Report/Team'
import Api from '@/request/api/caseSystem/report'
import { commonMethods } from 'movit-utils'
import API from '@/request/api/caseSystem/report'

export default {
    components: {
        LineAndBar,
        FilterPopover,
        FilterSection,
        FunnelChart,
        PieChart,
        Team,
    },
    data() {
        return {
            form: {
                dateType: 1,
            },
            isShowPopover: false,
            isShowChannelPopover: false,
            showMore: false,
            channelShowMore: false,
            clientGradeShowMore: false,
            clientGradeList: [],
            formatActions: ['当前置业顾问的A级、B级、C级、', 'D级、E级客户的数量'],
            formatChannelActions: ['1、到访量:按照客户首访渠道统计', '2、认购金额、认购套数、签约金额、签约套数：按照客户当前到访渠道统计'],
            status: 1,
            checkDefault: 0,
            funnelChecked: true,
            staticData: [
                {
                    field: 'firstVisitNum',
                    text: '首访量',
                    unit: '组',
                    code: 10,
                    menuId: 'ST.REPORT.SF',
                    visitType: 0,
                    isVisit: true,
                },
                {
                    field: 'repeatVisitNum',
                    text: '复访量',
                    unit: '组',
                    code: 20,
                    menuId: 'ST.REPORT.FF',
                    visitType: 1,
                    isVisit: true,
                },
                {
                    field: 'totalVisitNum',
                    text: '总到访量',
                    unit: '组',
                    code: 40,
                    visitType: '',
                    isVisit: true,
                },
                {
                    field: 'selfChannelAttendance',
                    text: '自渠出勤人次',
                    type: 'selfChanne',
                    unit: '次',
                },
                {
                    field: 'staffAttendance',
                    text: '置业顾问出勤人次',
                    type: 'staff',
                    unit: '次',
                },
                {
                    field: 'reportNum',
                    text: '报备量',
                    visitType: 2,
                    unit: '组',
                    isVisit: true,
                },
            ],
            statisticsTotalData: {},
            // 漏斗数据
            funnelChartData: {
                id: 'funnelChart',
                name: '',
                color: ['#FFB0B0', '#FFCD90', '#FFA570', '#FF494A'],
                unit: '组',
                data: [],
                conversionRate: [],
            },
            // 渠道占比
            pieChartData: {
                id: 'pieChart',
                unit: '组',
                data: [],
                color: ['#F10F0F', '#FF5F5F', '#FFBE5D', '#FFDD2E', '#FF981A'],
                colorObj: [
                    {
                        name: '全民营销',
                        color: '#F10F0F',
                    },
                    {
                        name: '中介分销',
                        color: '#FF5F5F',
                    },
                    {
                        name: '行销自拓',
                        color: '#FFBE5D',
                    },
                    {
                        name: '自然来访',
                        color: '#FFDD2E',
                    },
                    {
                        name: '其他',
                        color: '#FF981A',
                    },
                ],
            },
            // 客户等级分析占比
            salesLevelPieChartData: {
                id: 'salesLevelPieChart',
                unit: '组',
                data: [],
                color: ['#F10F0F', '#FF5F5F', '#FFBE5D', '#FFDD2E', '#FF981A'],
                colorObj: [
                    {
                        name: 'A等级',
                        color: '#FF0000',
                        code: 'A',
                    },
                    {
                        name: 'B等级',
                        color: '#FF9100',
                        code: 'B',
                    },
                    {
                        name: 'C等级',
                        color: '#FFD82D',
                        code: 'C',
                    },
                    {
                        name: 'D等级',
                        color: '#FF5252',
                        code: 'D',
                    },
                    {
                        name: 'E等级',
                        color: '#00AAF1',
                        code: 'E',
                    },
                    {
                        name: '无首访等级',
                        color: '#AAAAAA',
                        code: '无首访等级',
                    },
                ],
            },

            activeTab: 0,
            tabList: [
                {
                    text: '团队',
                    value: 0,
                },
                {
                    text: '人员',
                    value: 1,
                },
            ],
            listData: [],
            tokerList: [],
            groupFlag: false,
            tokerType: 1,
            channelTokerType: 2,
            tokerTypeList: [
                {
                    text: '报备量',
                    value: 1,
                    field: 'reportGroupNum',
                    unit: '组',
                    code: 10,
                    className: 'grid-item',
                },
                {
                    text: '到访量',
                    value: 2,
                    field: 'visitGroupNum',
                    unit: '组',
                    code: 20,
                    className: 'grid-item',
                },
                {
                    text: '认购套数',
                    value: 3,
                    field: 'orderSetsNum',
                    unit: '套',
                    code: 40,
                    className: 'grid-item',
                },
                {
                    text: '签约套数',
                    value: 4,
                    field: 'contractSetsNum',
                    unit: '套',
                    code: 50,
                    className: 'grid-item',
                },
                {
                    text: '认购金额',
                    value: 5,
                    field: 'orderPrice',
                    unit: '万',
                    code: 40,
                    className: 'grid-item',
                },
                {
                    text: '签约金额',
                    value: 6,
                    field: 'contractPrice',
                    unit: '万',
                    code: 50,
                    className: 'grid-item',
                },
            ],

            statusName: '到访客户',
            filterList: [
                {
                    name: '自定义时间',
                    type: 'date',
                    field: 'dateTime',
                    dateName: ['beginDate', 'endDate'],
                },
            ],
            statusList: [
                {
                    text: '认购',
                    value: 1,
                },
                {
                    text: '签约',
                    value: 2,
                },
            ],
            lengData: [],
            dimension: 1,
            currentRate: 0,
            gradientColor: {
                '0%': '#88D561',
                '100%': '#47CFAE',
            },
            trendDateType: 2,
            checkList: [
                {
                    label: '日',
                    value: 1,
                },
                {
                    label: '周',
                    value: 2,
                },
                {
                    label: '月',
                    value: 3,
                },
                {
                    label: '年',
                    value: 5,
                },
                {
                    label: '',
                    value: 4,
                },
            ],
            channel1Code: '',
            channelOneTitle: '',
            channelTwoCustomerList: [],
            channelList: [
                {
                    text: '全部渠道',
                    value: '',
                    className: 'grid-item',
                },
                {
                    text: '全民营销',
                    value: 'C01',
                    className: 'grid-item',
                },
                {
                    text: '中介分销',
                    value: 'C02',
                    className: 'grid-item',
                },
                {
                    text: '行销自拓',
                    value: 'C03',
                    className: 'grid-item',
                },
                {
                    text: '销售登记',
                    value: 'C04',
                    className: 'grid-item',
                },
                {
                    text: '自然来访',
                    value: 'C05',
                    className: 'grid-item',
                },
            ],
            dateTypeList: [
                {
                    text: '日',
                    value: 1,
                    disabled: false,
                    className: 'grid-item',
                },
                {
                    text: '周',
                    value: 2,
                    disabled: false,
                    className: 'grid-item',
                },
                {
                    text: '月',
                    value: 3,
                    disabled: false,
                    className: 'grid-item',
                },
                {
                    text: '季',
                    value: 4,
                    disabled: false,
                    className: 'grid-item',
                },
                {
                    text: '年',
                    value: 5,
                    disabled: false,
                    className: 'grid-item',
                },
            ],
            dateType: 1,
            date: [],
            colors: ['#f35e6a', '#FAB55F'],
            salesTotalData: {}, // 客储情况统计数据
            groupTotalData: [], // 团队统计数据
            salesTarget: [], // 本月团队目标值
            trendData: {},
            flag: false,
            tokerIdMap: {
                1: ['reportGroupNum', '组'],
                2: ['visitGroupNum', '组'],
                3: ['orderSetsNum', '套'],
                4: ['contractSetsNum', '套'],
                5: ['orderMoney', '万'],
                6: ['contractMoney', '万'],
            },
            beginDate: '',
            endDate: '',
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole']),
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
            let curItem = this.checkList.filter((item) => item.label === title)
            delete this.form.beginDate
            delete this.form.endDate

            this.form.dateType = curItem[0] && curItem[0].value
            this.$refs.filterSection.resetFilter()
            this.date = []
            this.channelTwoCustomerList = []
            this.storageStatisticsTotal()
            this.customerFilter()
            this.channelCustomerRate()
            this.salesLevelRate()
            this.getList()
        },
        filterChange() {
            this.checkDefault = 4
        },
        goCustomerList(item, code, num) {
            // if (num === 0) return
            let menuId = this.findMenuId(code)
            const selfChannelDfMenuld = ['ZT.RANK.GROUP.DF', 'ZT.RANK.STAFF.DF']
            if (!menuId) return
            const params = JSON.parse(JSON.stringify(this.form))
            params.menuId = menuId
            if (item.staffId) {
                params.userId = item.staffId
            }
            if (item.groupId) {
                params.groupId = item.groupId
            }
            if (item.channelCode) {
                params.channel2Code = item.channelCode
                // const type = this.channelTokerType === 1 ? code: this.channelTokerType
                const firstOrLastVisit = this.findChannelFirstOrLastVisit(code)
                if (firstOrLastVisit) params.firstOrLastVisit = firstOrLastVisit
            }
            // console.log('触发',menuId)
            // 总到访页面
            if (code === 20 && !selfChannelDfMenuld.includes(menuId)) {
                params.visitType = 3
                this.$router
                    .push({
                        path: '/case/customerReportVisit',
                        query: params,
                    })
                    .catch(() => {})
                return
            }

            // 认购签约跳转页面
            const menuIdArr = ['ZT.RANK.GROUP.RG', 'ZT.RANK.STAFF.RG', 'ZT.RANK.GROUP.QY', 'ZT.RANK.STAFF.QY']
            if (menuIdArr.includes(params.menuId)) {
                this.$router
                    .push({
                        path: '/case/storageOrderOrSignDetail',
                        query: params,
                    })
                    .catch(() => {})
                return
            }

            this.$router
                .push({
                    path: '/case/customerReportRank',
                    query: params,
                })
                .catch(() => {})
        },
        goCustomerGradeDetail(item,level) {
            const params = {
                level,
                staffId:item.staffId,
                staffName: item.staffName,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
            }
            this.$router
                .push({
                    path: '/case/customerGradeDetail',
                    query: params,
                })
                .catch(() => {})
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
            this.storageStatisticsTotal()
            this.customerFilter()
            this.channelCustomerRate()
            this.salesLevelRate()
            this.getList()
            this.channelTwoCustomerList = []
        },
        // 数据看板穿透
        goVisitList(visitType, num) {
            // if (num === '0') return
            const params = JSON.parse(JSON.stringify(this.form))
            params.visitType = visitType
            this.$router
                .push({
                    path: '/case/customerReportVisit',
                    query: params,
                })
                .catch(() => {})
        },
        goItemDetail(item, num) {
            // if (num === '0') return
            const params = JSON.parse(JSON.stringify(this.form))
            params.type = item.type
            this.$router
                .push({
                    path: '/case/selfChannelOrCounselorsignAgent',
                    query: params,
                })
                .catch(() => {})
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
        // 客户漏斗筛选
        funnelChanneChange(val) {
            this.channel1Code = val
            this.customerFilter()
        },
        // 渠道占比筛选
        channelTokerTypeChange(val) {
            this.channelTokerType = val
            this.channelTwoCustomerList = []
            this.channelCustomerRate()
        },
        // 渠道占比点击
        handerChangePieChar(channel2Code) {
            if (!channel2Code) return
            this.channelOneTitle = this.channelList.find((item) => item.value === channel2Code)?.text
            this.getChannelTwoCustomerList(channel2Code)
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
        // 客户漏斗首复访
        changeFunnelStatus(val) {
            this.funnelChecked = val
            this.customerFilter()
        },
        // 客户漏斗
        customerFilter() {
            let params = this.$utils.deepCopy(this.form)
            params.channel1Code = this.channel1Code
            params.firstOrLastVisit = this.funnelChecked ? 1 : 2

            API.customerFilter(params).then((res) => {
                const result = res
                this.funnelChartData.data = [
                    {
                        name: '报备',
                        value: result.reportGroupNum || 0,
                        id: 'reportGroupNum',
                    },
                    {
                        name: '到访',
                        value: result.visitGroupNum || 0,
                        id: 'visitGroupNum',
                    },
                    {
                        name: '认购',
                        value: result.orderSetsNum || 0,
                        id: 'orderSetsNum',
                    },
                    {
                        name: '签约',
                        value: result.contractSetsNum || 0,
                        id: 'contractSetsNum',
                    },
                ]

                this.funnelChartData.conversionRate = [
                    {
                        names: ['报备', '到访'],
                        percent: this.getPercent(result.visitGroupNum, result.reportGroupNum),
                        id: 'reportGroupNum',
                    },
                    {
                        names: ['到访', '认购'],
                        percent: this.getPercent(result.orderSetsNum, result.visitGroupNum),
                        id: 'visitGroupNum',
                    },
                    {
                        names: ['认购', '签约'],
                        percent: this.getPercent(result.contractSetsNum, result.orderSetsNum),
                        id: 'contractSetsNum',
                    },
                ]
                // 自然来访不需要报备
                if (this.channel1Code === 'C05') {
                    const funnelChartData = this.funnelChartData.data.filter((item) => item.id !== 'reportGroupNum')
                    this.funnelChartData.data = funnelChartData
                    this.funnelChartData.conversionRate = [
                        {
                            names: ['到访', '认购'],
                            percent: this.getPercent(result.orderSetsNum, result.visitGroupNum),
                            id: 'visitGroupNum',
                        },
                        {
                            names: ['认购', '签约'],
                            percent: this.getPercent(result.contractSetsNum, result.orderSetsNum),
                            id: 'contractSetsNum',
                        },
                    ]
                }
            })
        },
        // 渠道情况渠道占比
        channelCustomerRate() {
            let params = this.$utils.deepCopy(this.form)
            params.searchType = this.channelTokerType
            const firstOrLastVisit = this.findChannelFirstOrLastVisit(this.channelTokerType)
            if (firstOrLastVisit) params.firstOrLastVisit = firstOrLastVisit
            this.pieChartData.data = []
            API.channelCustomerRate(params).then((res) => {
                let total = 0;
                (res || []).forEach((item) => {
                    total += Number(item[this.tokerIdMap[this.channelTokerType][0]])
                })
                this.pieChartData.data = (res || []).map((item, index) => {
                    let num = item[this.tokerIdMap[this.channelTokerType][0]]
                    const percent = this.getPercent(num, total)
                    return {
                        code: item.channelCode,
                        name: item.channelName || '历史其他',
                        percent,
                        unit: this.tokerIdMap[this.channelTokerType][1],
                        value:
                            this.channelTokerType === 5 || this.channelTokerType === 6
                                ? this.$utils.formatNumber(item[this.tokerIdMap[this.channelTokerType][0]])
                                : item[this.tokerIdMap[this.channelTokerType][0]],
                    }
                })
            })
        },
        // 成交等级分析
        salesLevelRate() {
            let params = this.$utils.deepCopy(this.form)
            this.salesLevelPieChartData.data = []
            let total = 0
            API.salesLevelRate(params).then((res) => {
                ;(res || []).forEach((item) => {
                    total += Number(item.mvalue)
                })
                this.salesLevelPieChartData.data = (res || []).map((item) => {
                    let num = item.mvalue

                    const percent = this.getPercent(num, total)
                    return {
                        name: !item.mkey ? '无首访等级' : `${item.mkey}等级`,
                        value: item.mvalue,
                        unit: '组',
                        percent,
                    }
                })
            })
        },
        // 渠道情况二级渠道统计
        getChannelTwoCustomerList(channel2Code) {
            let params = this.$utils.deepCopy(this.form)
            params.channel1Code = channel2Code
            const firstOrLastVisit = this.findChannelFirstOrLastVisit(this.channelTokerType)
            this.$utils.loading()
            API.channelTwoCustomerList(params)
                .then((res) => {
                    this.channelTwoCustomerList = (res || []).map((item) => {
                        return {
                            ...item,
                            contractMoney: this.$utils.formatNumber(item.contractMoney),
                            orderMoney: this.$utils.formatNumber(item.orderMoney),
                        }
                    })
                })
                .finally(() => {
                    this.$toast.clear()
                })
        },
        // 获取团队业绩排行
        achievementGroupSort() {
            let params = this.$utils.deepCopy(this.form)
            params.sortBy = this.tokerType
            this.groupFlag = false

            this.$utils.loading()
            Api.achievementGroupSort(params)
                .then((res) => {
                    const result = (res || []).map((item) => {
                        return {
                            ...item,
                            contractPrice: this.$utils.formatNumber(item.contractPrice),
                            orderPrice: this.$utils.formatNumber(item.orderPrice),
                        }
                    })
                    if (result) {
                        let selectList = this.tokerTypeList.filter((x) => x.value === this.tokerType)
                        for (let elem of result) {
                            elem.id = elem.groupId
                            elem.name = elem.groupName
                            elem.num = this.tokerTypeList
                            elem.add = elem[selectList[0].field]
                            elem.unit = selectList[0].unit
                        }
                    } else {
                        result = []
                    }
                    this.listData = result
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
            Api.achievementStaffSort(params)
                .then((res) => {
                    let result = (res || []).map((item) => {
                        return {
                            ...item,
                            contractPrice: this.$utils.formatNumber(item.contractPrice),
                            orderPrice: this.$utils.formatNumber(item.orderPrice),
                        }
                    })
                    if (result) {
                        let lineList = this.tokerTypeList
                        let selectList = this.tokerTypeList.filter((x) => x.value === this.tokerType)
                        for (let elem of result) {
                            elem.id = elem.staffId
                            elem.name = elem.staffName
                            elem.num = lineList
                            elem.add = elem[selectList[0].field]
                            elem.unit = selectList[0].unit
                        }
                    } else {
                        result = []
                    }
                    this.listData = result
                    this.groupFlag = true
                })
                .finally(() => {
                    this.$toast.clear()
                })
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
        initData() {
            this.storageStatisticsTotal()
            this.customerFilter()
            this.channelCustomerRate()
            this.salesLevelRate()
            this.getList()
            this.storageStatisticsTrend()
            this.getStorageStaffLevel()
        },
        // 获取客储情况统计数据
        async storageStatisticsTotal() {
            let params = this.$utils.deepCopy(this.form)
            const result = await Api.storageStatisticsTotal(params)
            this.statisticsTotalData = result
        },
        // 获取客储情况团队目标完成数据
        async storageStatisticsGroupTotal() {
            let params = {
                projectId: this.projectId,
                type: this.status,
                dateType: this.dateType,
                beginDate: this.form.beginDate,
                endDate: this.form.endDate,
                dimension: this.dimension,
            }
            this.flag = false
            let result = await Api.storageStatisticsGroupTotal(params)
            result.map((item) => {
                item.currentRate = 0
            })
            this.groupTotalData = result
            this.flag = true
            this.$forceUpdate()
        },
        // 获取客储情况趋势数据
        async storageStatisticsTrend(type) {
            let params = {
                projectId: this.projectId,
                type: this.status,
                startTime: type === 'left' ? this.rightDate : '',
                endTime: type === 'right' ? this.leftDate : '',
                dateType: this.dateType,
                groupBy: this.trendDateType,
            }

            // 返回的rightDate 大于等于当前时间时禁止左滑
            const curTimestamp = new Date()
            const rightTimestamp = this.leftDate && new Date(this.rightDate)
            const flag = type === 'left' && rightTimestamp - curTimestamp >= 0
            if (flag) return

            const result = await Api.storageStatisticsTrend(params)

            if (!result?.data[0].name) {
                result.data[0].name = '总到访量'
            }
            if (!result?.data[1].name) {
                result.data[1].name = '首访量'
            }
            if (!result?.data[2].name) {
                result.data[2].name = '复访量'
            }
            this.lengData = result.data[2].data
            this.leftDate = result.leftDate
            this.rightDate = result.rightDate
            result.data.splice(2, 1)
            this.trendData = result
        },
        // 置业顾问最后到访客户等级分布
        async getStorageStaffLevel(type) {
            let params = {
                projectId: this.projectId,
            }
            const result = await Api.storageStaffLevel(params)
            this.clientGradeList = result || []
        },
        /**
         * 求百分比
         * @param num 当前数
         * @param total 总数
         * @returns {string|string}
         */
        getPercent(num, total) {
            num = parseFloat(num)
            total = parseFloat(total)
            if (isNaN(num) || isNaN(total)) {
                return '-'
            }
            return total <= 0 ? '0' : Math.round((num / total) * 10000) / 100
        },
        /**
         *
         * @param code 返回menuId
         * @returns {string}
         */
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
        },
        // 查询渠道占比首复访字段传值
        findChannelFirstOrLastVisit(code){
            switch (code) {
                case 1:
                case 10:
                    return ''
                case 2:
                case 20:
                    return 1
                case 3:
                case 4:
                case 5:
                case 6:
                case 40:
                case 50:
                    return 3
            }
        },
        // 千分位
        numFormat(val) {
            if (!val) return '0'
            if (val === '--') return val
            val = val.toString()
            let reg = val.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g
            return val.replace(reg, '$1,')
        },
    },
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
            box-sizing: border-box;
            padding: 21px 14px 6px;
            background-image: url('@{baseImgUrl}/case/home/red.png');
            background-position: -15px -20px;
            background-repeat: no-repeat;
            background-size: 375px 220px;
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
                    color: #ffffff;
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
                    width: 33%;
                    margin-bottom: 18px;
                    text-align: center;

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
        .chart-box {
            position: relative;
            height: 344px;
            /deep/ .echart-box {
                .info {
                    top: 20px;
                }
            }
        }
        .pie-chart {
            height: 200px;
        }
        .team-statistics {
            padding-bottom: 24px;
            margin: 0 15px;
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
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .m-width {
                    min-width: 67px;
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
                .left-fixed {
                    width: 100px;
                }
            }
        }
        .client-grade {
            .toker-style {
                .head,
                .tr {
                    width: 500px;
                }
                .m-width {
                    flex: 1;
                }
            }
        }
        .channel-statistics {
            padding-bottom: 0;
            .table {
                padding-left: 100px;
                .channel-head,.channel-hr {
                    width: 100%;
                    width: -moz-available;          /* WebKit-based browsers will ignore this. */
                    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
                    width: fill-available;
                    min-width: 540px;
                    .unit {
                        white-space: nowrap;
                    }
                    .m-width {
                        width: 100%;
                        width: -moz-available;          /* WebKit-based browsers will ignore this. */
                        width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
                        width: fill-available;
                        flex: auto;
                        min-width: 80px;
                    }
                }
            }
        }
        .trend-container,
        .funnel-statistics {
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
