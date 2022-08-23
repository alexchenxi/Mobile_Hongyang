<template>
    <div class="common-container">
        <section class="filter-container">
            <div class="left-section">
                <van-dropdown-menu active-color="#DB0826" z-index="99">
                    <van-dropdown-item ref="filter" v-model="status" :options="statusList" @change="changeStatus" get-container="body"></van-dropdown-item>
                </van-dropdown-menu>
            </div>
            <div class="middle-section">
                <van-dropdown-menu active-color="#DB0826" z-index="99">
                    <van-dropdown-item ref="filter" v-model="dimension" :options="dimensionList" @change="changeDimension" get-container="body"></van-dropdown-item>
                </van-dropdown-menu>
            </div>
            <div class="right-section">
                <ReportFilter ref="filterSection" :checkList="checkList" dateType="month" :checkDefault="checkDefault" @change="handleFilter" title="本年" container="body" />
            </div>
        </section>
        <section class="main-container">
            <!-- 数据汇总 -->
            <div class="main-statistics">
                <img class="img-style" :src="$baseImgUrl + '/report/bg-statistics1.png'" />
                <div class="top">
                    <div class="top-left">
                        <div class="label-item">
                            <div class="label-content">
                                {{ numFormat(salesTotalData.value) }}
                                <span class="unit">{{ dimension === 1 ? amountUnit : '套' }}</span>
                            </div>
                            <div class="label-title">{{ status === 1 ? '实际认购' : '实际签约' }}</div>
                        </div>
                    </div>
                    <!-- <div class="top-right">
                        <van-button class="statistics-button" round block>{{ statusName }}单据</van-button>
                    </div> -->
                </div>
                <div class="bottom">
                    <van-grid :border="false" :column-num="3">
                        <van-grid-item>
                            <div class="label-item">
                                <div class="label-content">
                                    {{ salesTotalData.valueRate }}%
                                    <van-image v-if="salesTotalData.valueRateType === 1" width="14" height="14" :src="$baseImgUrl + '/report/icon-up.png'" />
                                    <van-image v-if="salesTotalData.valueRateType === 0" width="14" height="14" :src="$baseImgUrl + '/report/icon-down.png'" />
                                </div>
                                <div class="label-title">同比去年</div>
                            </div>
                        </van-grid-item>
                        <van-grid-item v-if="salesTotalData.hasOwnProperty('targetValue') && salesTotalData.targetValue !== null">
                            <div class="label-item">
                                <div class="label-content">
                                    {{ numFormat(salesTotalData.targetValue) }}
                                    <span class="unit">{{ dimension === 1 ? amountUnit : '套' }}</span>
                                </div>
                                <div class="label-title">{{ status === 1 ? '目标认购' : '目标签约' }}</div>
                            </div>
                        </van-grid-item>
                        <van-grid-item v-if="salesTotalData.hasOwnProperty('completionRate') && salesTotalData.completionRate !== null">
                            <div class="label-item">
                                <div class="label-content" style="padding-left: 20px;">{{ salesTotalData.completionRate }}%</div>
                                <div class="label-title" style="padding-left: 20px;">完成率</div>
                            </div>
                        </van-grid-item>
                        <van-grid-item>
                            <div class="label-item">
                                <div class="label-content">
                                    {{ numFormat(salesTotalData.nextStepValue) }}
                                    <span class="unit">{{ dimension === 1 ? amountUnit : '套' }}</span>
                                </div>
                                <div class="label-title">{{ status === 1 ? '认购未签约' : '签约未回款' }}</div>
                            </div>
                        </van-grid-item>
<!--                        <van-grid-item>-->
<!--                            <div class="label-item">-->
<!--                                <div class="label-content">-->
<!--                                    {{ numFormat(salesTotalData.totalNextStepValue) }}-->
<!--                                    <span class="unit">{{ dimension === 1 ? amountUnit : '套' }}</span>-->
<!--                                </div>-->
<!--                                <div class="label-title">{{ status === 1 ? '累计认购未签约' : '累计签约未回款' }}</div>-->
<!--                            </div>-->
<!--                        </van-grid-item>-->
                    </van-grid>
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
                        <FilterPopover container=".common-container" v-model="trendDateType" :list="dateTypeList" @change="trendDateTypeChange" />
                    </div>
                </div>
                <div class="container">
                    <LineAndBar :yAxisUnit="[dimension === 1 ? amountUnit : '套', '%']" :colors="colors" :data="trendData" />
                </div>
            </div>
            <!-- 排行 -->
            <div class="rank-container" v-if="projectLevel === 1">
                <div class="section-title-left">
                    <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                    王牌项目
                </div>
                <van-empty class="empty-container" v-if="flag && projectSortList.length === 0" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                <template v-else>
                    <div class="container">
                        <template v-for="(item, index) in projectSortList">
                            <div :class="[' index index' + index, index === 0 && projectSortList.length === 1 ? 'common' : '']" v-if="index < 3" :key="index">
                                <img :src="$baseImgUrl + '/report/icon-medal' + index + '1.png'" />
                                <div class="name">{{ item.projectName }}</div>
                                <div class="num">
                                    {{ item.totalMoney }}
                                    <span class="unit">万</span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <table class="table" cellspacing="10">
                        <thead>
                            <tr>
                                <th style="width: 36px;" class="align-left">排行</th>
                                <th class="align-left">项目名称</th>
                                <th class="align-right">{{ status === 1 ? '认购' : '签约' }}套数</th>
                                <th class="align-right">{{ status === 1 ? '认购' : '签约' }}金额</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in projectSortList" :key="i">
                                <td class="align-left" v-if="i < 3">
                                    <img class="modal" :src="$baseImgUrl + '/report/icon-medal' + i + '1.png'" />
                                </td>
                                <td class="align-center index" v-else>{{ i + 1 }}.</td>
                                <td class="align-left">
                                    <p class="name">{{ item.projectName }}</p>
                                    <p class="team-name">{{ item.regionName }}</p>
                                </td>
                                <td class="align-right">
                                    <span class="num">{{ numFormat(item.totalSetsNum) }}</span>
                                    <span class="unit">套</span>
                                </td>
                                <td class="align-right">
                                    <span class="num">{{ numFormat(item.totalMoney) }}</span>
                                    <span class="unit">万</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </div>
        </section>
        <van-popup class="team-popup" v-model="showTeamPop" position="bottom" get-container="body" :style="{ height: '60%' }">
            <div class="container">
                <van-form>
                    <div class="title-section">设置本月项目目标值</div>
                    <div class="setting-section">
                        <div class="setting-item" v-for="(item, index) in targetData" :key="index">
                            <div class="setting-label">{{ item.projectName }}</div>
                            <div class="setting-content">
                                <van-field
                                    v-model="item.targetValue"
                                    name="用户名"
                                    :type="dimension === 1 ? 'number' : 'digit'"
                                    placeholder="请输入目标值"
                                    clickable
                                >
                                    <span class="unit" slot="extra">{{ dimension === 1 ? amountUnit : '套' }}</span>
                                </van-field>
                                <!-- <van-number-keyboard v-model="item.targetValue" :extra-key="dimension === 1 ? '.' : ''" :show="item.show" @blur="hideKeyboard(index)" /> -->
                            </div>
                        </div>
                    </div>
                    <div class="action-section">
                        <van-button round block type="cancel" @click="closeTeamPop">取消</van-button>
                        <van-button round block type="save" @click="onSubmit">确定</van-button>
                    </div>
                </van-form>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CheckButton from '@/components/CheckButton'
import ReportFilter from '@/components/Report/ReportFilter'
import LineAndBar from '@/components/Chart/LineAndBar'
import FilterPopover from '@/components/Report/FilterPopover'
import { commonMethods } from 'movit-utils'
import Api from '@/request/api/manageSystem/report'
export default {
    components: {
        CheckButton,
        ReportFilter,
        LineAndBar,
        FilterPopover
    },
    data() {
        return {
            status: 1,
            statusName: '认购',
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
            dimensionList: [
                {
                    text: '金额维度',
                    value: 1
                },
                {
                    text: '套数维度',
                    value: 2
                }
            ],
            colors: ['#47CFAE', ['#5F95FA', '#4183FF'], '#FAB55F', ['rgba(250, 181, 95, 0.12)', 'rgba(250, 181, 95, 0)']],
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
            checkDefault: 1,
            currentRate: 0,
            trendDateType: 1,
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
            dateType: 1,
            date: [],
            showTeamPop: false,
            targetData: [],
            trendData: {},
            salesTotalData: {},
            projectSortList: [],
            amountUnit: '',
            flag: false
        }
    },
    computed: {
        text() {
            return this.currentRate.toFixed(0) + '%'
        },
        ...mapGetters(['projectIdList', 'projectLevel'])
    },
    mounted() {
        if (!this.projectIdList || this.projectIdList.length === 0) return
        this.formatUnit()
        this.initData()
    },
    methods: {
        changeStatus(val) {
            this.statusName = this.statusList.find(item => item.value === val).text
            this.initData()
        },
        changeDimension() {
            this.initData()
        },
        handleFilter(val) {
            if (val.date.length > 0) {
                this.date = this.$utils.deepCopy(val.date)
                this.date[0] = this.date[0] + '-01 00:00:00'
                let lastDay = new Date(this.date[1].split('-')[0], this.date[1].split('-')[1], 0).getDate()
                this.date[1] = this.date[1] + '-' + lastDay + ' 23:59:59'
                if (this.date[0] === this.date[1]) {
                    this.trendDateType = 3
                    this.date[0] = this.date[0] + '-01'
                    let lastDay = new Date(this.date[1].split('-')[0], this.date[1].split('-')[1], 0).getDate()
                    this.date[1] = this.date[1] + '-' + lastDay
                    this.dateTypeList[0].disabled = true
                } else {
                    this.dateTypeList.map(item => {
                        item.disabled = false
                    })
                }
                this.dateType = 4
            } else {
                this.date = []
                this.dateType = val.dateType
            }
            if (this.dateType === 1 || this.dateType === 4) {
                this.trendDateType = 1
            } else if (this.dateType === 2) {
                this.trendDateType = 2
            }
            this.initData()
        },
        trendDateTypeChange(val) {
            this.managerSalesStatisticsTrend()
        },
        // 设置目标
        settingGoal() {
            this.showTeamPop = true
            this.getManagerTargetProject()
        },
        closeTeamPop() {
            this.showTeamPop = false
        },
        onSubmit() {
            this.setManagerTargetProject()
        },
        numFormat(val) {
            if (!val) return '0'
            if(val === '--') return val
            val = val.toString()
            let reg = val.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g
            return val.replace(reg, '$1,')
        },
        formatUnit() {
            if (this.projectLevel === 1 || this.projectLevel === 2) {
                this.amountUnit = '亿'
            } else if (this.projectLevel === 3) {
                // this.amountUnit = '万'
                this.amountUnit = '亿' //暂时都用亿
            }
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
        initData() {
            this.managerSalesStatisticsAnalysis()
            this.managerSalesStatisticsTrend()
            this.managerAchievementProject()
        },
        // 获取销售情况统计数据
        async managerSalesStatisticsAnalysis() {
            let params = {
                projectIds: this.projectIdList,
                type: this.status,
                dimension: this.dimension,
                beginDate: this.date.length > 0 ? this.date[0] : '',
                endDate: this.date.length > 0 ? this.date[1] : '',
                dateType: this.dateType
            }
            const result = await Api.managerSalesStatisticsAnalysis(params)
            this.salesTotalData = result
            this.salesTotalData.valueRate = this.formatPercent(this.salesTotalData.value, this.salesTotalData.lastValue).rate
            this.salesTotalData.valueRateType = this.formatPercent(this.salesTotalData.value, this.salesTotalData.lastValue).type
        },
        // 获取项目目标值
        async getManagerTargetProject() {
            let params = {
                projectIds: this.projectIdList,
                type: this.status,
                dimension: this.dimension
            }
            let result = await Api.getManagerTargetProject(params)
            result.map(item => {
                item.targetValue = item.targetValue.toString()
                item.show = false
            })
            this.targetData = result
        },
        // 维护项目目标值
        async setManagerTargetProject() {
            let params = {
                projectId: this.projectIdList[0],
                type: this.status,
                targetValue: parseFloat(this.targetData[0].targetValue),
                dimension: this.dimension
            }
            const result = await Api.setManagerTargetProject(params)
            this.$toast('保存成功')
            this.showTeamPop = false
            this.managerSalesStatisticsAnalysis()
            this.managerSalesStatisticsTrend()
        },
        // 获取销售情况趋势数据
        async managerSalesStatisticsTrend() {
            let params = {
                projectIds: this.projectIdList,
                type: this.status,
                beginDate: this.date.length > 0 ? this.date[0] : '',
                endDate: this.date.length > 0 ? this.date[1] : '',
                dateType: this.dateType,
                groupBy: this.trendDateType,
                dimension: this.dimension
            }
            const result = await Api.managerSalesStatisticsTrend(params)
            this.trendData = result
        },
        // 项目排行
        async managerAchievementProject() {
            let params = {
                projectIds: this.projectIdList,
                type: this.status,
                beginDate: this.date.length > 0 ? this.date[0] : '',
                endDate: this.date.length > 0 ? this.date[1] : '',
                dateType: this.dateType
            }
            this.flag = false
            const result = await Api.managerAchievementProject(params)
            this.projectSortList = result
            this.flag = true
        },
        showKeyboard(index) {
            this.targetData.map(item => {
                item.show = false
            })
            this.targetData[index].show = true
        },
        hideKeyboard(index) {
            this.targetData[index].show = false
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
        padding: 0 18px;
        height: 44px;
    }
    .main-container {
        padding: 0 15px;
        .main-statistics {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            padding: 18px 18px 6px;
            background: linear-gradient(135deg, #2da5f9 0%, #0388fe 100%);
            border-radius: 4px;
            margin: 5px 0;
            .img-style {
                width: 100%;
                left: 0;
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
            }
            .label-item {
                .label-content {
                    .common-flex();
                    font-size: 16px;
                    color: #ffffff;
                    line-height: 16px;
                    font-weight: bold;
                    font-family: DINAlternate-Bold, DINAlternate;
                    margin-bottom: 8px;
                    .unit {
                        font-size: 12px;
                        line-height: 12px;
                        align-self: flex-end;
                        margin: 0 0 2px 2px;
                        font-family: PingFangSC-Regular, PingFang SC;
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
            .top {
                z-index: 1;
                .common-flex-between();
                .label-content {
                    font-size: 24px;
                    line-height: 24px;
                    .unit {
                        font-size: 12px;
                        line-height: 12px;
                    }
                }
                .top-right {
                    .statistics-button {
                        .common-flex-center();
                        width: 82px;
                        height: 30px;
                        font-size: 13px;
                        line-height: 13px;
                        color: #fff;
                        background: rgba(255, 255, 255, 0.19);
                        padding: 0;
                        font-weight: 500;
                        font-family: PingFangSC-Medium, PingFang SC;
                        border-radius: 22px;
                        border: none;
                    }
                }
            }
            .bottom {
                margin-top: 18px;
                .label-item {
                    margin-bottom: 18px;
                }
                /deep/ .van-grid {
                    .van-grid-item {
                        .van-grid-item__content {
                            background: none;
                            padding: 0;
                            align-items: baseline;
                        }
                    }
                }
            }
        }
        .section-title {
            .common-flex-between();
            padding: 24px 0;
            .section-title-left {
                .common-flex();
                font-size: 18px;
                color: @header-text-color;
                line-height: 18px;
                font-weight: 500;
                font-family: PingFangSC-Medium, PingFang SC;
            }
        }
        .trend-container {
            padding-bottom: 24px;
            .section-title {
                padding-bottom: 0;
            }
        }
    }
    .rank-container {
        .section-title-left {
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 18px;
            margin-bottom: 5px;
        }
        .container {
            position: relative;
            display: flex;
            justify-content: space-between;
            padding-top: 52px;
            min-height: 96px;
            .index {
                width: 108px;
                height: 96px;
                text-align: center;
                font-weight: 600;
                font-size: 18px;
                color: #fff;
                border-radius: 4px;
                font-family: DINAlternate-Bold, DINAlternate;
                .name {
                    margin-top: 6px;
                    font-size: 13px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                }
                .num {
                    font-size: 16px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #fe9402;
                    line-height: 14px;
                    margin-top: 12px;
                    .unit {
                        font-size: 10px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        line-height: 10px;
                        margin-left: 2px;
                    }
                }
                &.index0 {
                    top: 32px;
                    position: absolute;
                    left: 50%;
                    margin-left: -54px;
                    background: linear-gradient(135deg, rgba(250, 210, 60, 0.11) 0%, rgba(253, 169, 37, 0.11) 100%);
                    img {
                        margin-top: -27px;
                        width: 54px;
                    }
                    .num {
                        color: #fe9402;
                    }
                    &.common {
                        position: relative;
                        top: 0;
                    }
                }
                &.index1 {
                    background: linear-gradient(135deg, rgba(234, 237, 242, 0.36) 0%, rgba(203, 219, 238, 0.36) 100%);
                    img {
                        margin-top: -20px;
                        width: 40px;
                    }
                    .num {
                        color: #677afd;
                    }
                }
                &.index2 {
                    background: linear-gradient(135deg, rgba(253, 195, 152, 0.19) 0%, rgba(255, 172, 130, 0.19) 100%);
                    img {
                        margin-top: -20px;
                        width: 40px;
                    }
                    .num {
                        color: #fe78aa;
                    }
                }
            }
        }
    }
}
.empty-container {
    margin-bottom: 20px;
}
.table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
    th,
    td {
        padding: 0 2px;
    }
    thead tr th {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;
    }
    .modal {
        width: 26px;
    }
    tbody tr {
        border-top: 1px solid #eee;
        &:first-child {
            border: none;
        }
    }
    .align-left {
        text-align: left;
    }
    .align-right {
        text-align: right;
    }
    .align-center {
        text-align: center;
    }
    .name {
    }
    tbody tr td {
        height: 66px;
        display: table-cell;
        vertical-align: middle;
        p {
            &:first-child {
                margin-bottom: 6px;
            }
            &:last-child {
                color: #999999;
            }
            .num {
                font-size: 14px;
            }
        }
        .team-name {
            font-size: 12px;
        }
        .name {
            font-size: 15px;
        }
        .num {
            font-size: 16px;
            font-weight: bold;
        }
        .unit {
            font-size: 10px;
            margin-left: 2px;
        }
    }
    .index {
        font-weight: bold;
        font-size: 18px;
        font-family: YouSheBiaoTiHei, DINAlternate-Bold, DINAlternate;
    }
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
