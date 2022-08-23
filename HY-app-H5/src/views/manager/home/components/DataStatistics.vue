<template>
    <div class="container">
        <van-image class="img-style" width="100%" fit="contain" :src="$baseImgUrl+'/manager/home/bg-statistics.png'" />
        <van-swipe class="my-swipe" width="100%"  indicator-color="white" :loop="false">
            <van-swipe-item>
                <div class="section-item">
                    <div class="section-top">
                        <div class="data-item">
                            <div class="content">
                                <div class="content-item">
                                    <span>{{ numFormat(salesStatisticsTotal.contractTotalMoney) }}</span>
                                    <span class="unit">{{ amountUnit }}</span>
                                </div>
                                <div class="content-item tag">
                                    同比
                                    <span class="text">{{ salesStatisticsTotal.contractRate }}%</span>
                                    <van-image v-if="salesStatisticsTotal.contractRateType === 1" width="14" height="14" :src="$baseImgUrl + '/report/icon-up.png'" />
                                    <van-image v-if="salesStatisticsTotal.contractRateType === 0" width="14" height="14" :src="$baseImgUrl + '/report/icon-down.png'" />
                                </div>
                            </div>
                            <div class="label">
                                签约金额
                            </div>
                        </div>
                    </div>
                    <div class="section-bottom">
                        <van-row gutter="10">
                            <van-col span="9">
                                <div class="data-item">
                                    <div class="content">
                                        <div class="content-item">
                                            {{ numFormat(salesStatisticsTotal.contractSetsNum) }}
                                            <span class="unit">套</span>
                                        </div>
                                    </div>
                                    <div class="label">
                                        签约套数
                                    </div>
                                </div>
                            </van-col>
                            <van-col span="15">
                                <div class="data-item">
                                    <div class="content">
                                        <div class="content-item">
                                            {{ numFormat(salesStatisticsTotal.orderNoContractMoney) }}
                                            <span class="unit">{{ amountUnit }}</span>
                                        </div>
                                    </div>
                                    <div class="label">
                                        认购未签约金额
                                    </div>
                                </div>
                            </van-col>
                        </van-row>
                        <van-row gutter="10">
                            <van-col span="9">
                                <div class="data-item">
                                    <div class="content">
                                        <div class="content-item">
                                            {{ numFormat(salesStatisticsTotal.orderSetsNum) }}
                                            <span class="unit">套</span>
                                        </div>
                                    </div>
                                    <div class="label">
                                        认购套数
                                    </div>
                                </div>
                            </van-col>
                            <van-col span="15">
                                <div class="data-item">
                                    <div class="content">
                                        <div class="content-item">
                                            {{ numFormat(salesStatisticsTotal.orderTotalMoney) }}
                                            <span class="unit">{{ amountUnit }}</span>
                                        </div>
                                        <div class="content-item tag">
                                            同比
                                            <span class="text">{{ salesStatisticsTotal.orderRate }}%</span>
                                            <van-image v-if="salesStatisticsTotal.orderRateType === 1" width="14" height="14"  :src="$baseImgUrl + '/report/icon-up.png'" />
                                            <van-image v-if="salesStatisticsTotal.orderRateType === 0" width="14" height="14" :src="$baseImgUrl + '/report/icon-down.png'" />
                                        </div>
                                    </div>
                                    <div class="label">
                                        认购金额
                                    </div>
                                </div>
                            </van-col>
                        </van-row>
                    </div>
                </div>
            </van-swipe-item>
            <van-swipe-item>
                <div class="section-item">
                    <div class="section-top">
                        <div class="data-item">
                            <div class="content">
                                <div class="content-item">
                                    <span>{{ numFormat(customerStatisticsTotal.visitCustomerGroupNum) }}</span>
                                    <span class="unit">组</span>
                                </div>
                            </div>
                            <div class="label">
                                到访组数
                            </div>
                        </div>
                    </div>
                    <div class="section-bottom">
                        <van-row gutter="10">
                            <van-col span="10">
                                <div class="data-item">
                                    <div class="content">
                                        <div class="content-item">
                                            {{ numFormat(customerStatisticsTotal.reportCustomerGroupNum) }}
                                            <span class="unit">组</span>
                                        </div>
                                    </div>
                                    <div class="label">
                                        报备组数
                                    </div>
                                </div>
                            </van-col>
                            <van-col span="8">
                                <div class="data-item">
                                    <div class="content">
                                        <div class="content-item">
                                            {{ numFormat(customerStatisticsTotal.orderCustomerGroupNum) }}
                                            <span class="unit">组</span>
                                        </div>
                                    </div>
                                    <div class="label">
                                        认购组数
                                    </div>
                                </div>
                            </van-col>
                            <van-col span="6">
                                <div class="data-item">
                                    <div class="content">
                                        <div class="content-item">
                                            {{ numFormat(customerStatisticsTotal.contractCustomerGroupNum) }}
                                            <span class="unit">组</span>
                                        </div>
                                    </div>
                                    <div class="label">
                                        签约组数
                                    </div>
                                </div>
                            </van-col>
                        </van-row>
                        <van-row gutter="10">
                            <van-col span="10">
                                <div class="data-item">
                                    <div class="content">
                                        <div class="content-item">
                                            {{ numFormat(customerStatisticsTotal.orderSetsNum) }}
                                            <span class="unit">套</span>
                                        </div>
                                    </div>
                                    <div class="label">
                                        认购套数
                                    </div>
                                </div>
                            </van-col>
                            <van-col span="8">
                                <div class="data-item">
                                    <div class="content">
                                        <div class="content-item">
                                            {{ numFormat(customerStatisticsTotal.contractSetsNum) }}
                                            <span class="unit">套</span>
                                        </div>
                                    </div>
                                    <div class="label">
                                        签约套数
                                    </div>
                                </div>
                            </van-col>
                        </van-row>
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/request/api/manageSystem/home'
import { commonMethods } from 'movit-utils'
export default {
    data() {
        return {
            salesStatisticsTotal: {},
            customerStatisticsTotal: {},
            amountUnit: ''
        }
    },
    created() {
        if (!this.projectIdList || this.projectIdList.length === 0) return
        this.formatUnit()
        this.initData()
    },
    computed: { ...mapGetters(['projectIdList', 'projectLevel']) },
    watch: {
        projectIdList: {
            handler(newVal, oldVal) {
                this.initData()
            },
            deep: true,
            immediate: false
        },
        projectLevel(val) {
            this.formatUnit()
        }
    },
    methods: {
        initData() {
            this.managerSalesStatisticsTotal()
            this.managerCustomerStatisticsTotal()
        },
        numFormat(val) {
            return commonMethods.NumFormat(val)
        },
        formatUnit() {
            if (this.projectLevel === 1 || this.projectLevel === 2) {
                this.amountUnit = '亿'
            } else if (this.projectLevel === 3) {
                // this.amountUnit = '万'
                this.amountUnit = '亿' //暂时都用亿为单位
            }
        },
        // 计算同比百分比
        formatPercent(current, last) {
            let obj = {
                type: 0,
                rate: 0
            }
            if (current > last) {
                if(last === 0) {
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
        async managerSalesStatisticsTotal() {
            let params = {
                projectIds: this.projectIdList,
                dateType: 1
            }
            const result = await API.managerSalesStatisticsTotal(params)
            this.salesStatisticsTotal = result
            this.salesStatisticsTotal.contractRate = this.formatPercent(this.salesStatisticsTotal.contractTotalMoney, this.salesStatisticsTotal.lastContractTotalMoney).rate
            this.salesStatisticsTotal.contractRateType = this.formatPercent(this.salesStatisticsTotal.contractTotalMoney, this.salesStatisticsTotal.lastContractTotalMoney).type
            this.salesStatisticsTotal.orderRate = this.formatPercent(this.salesStatisticsTotal.orderTotalMoney, this.salesStatisticsTotal.lastOrderTotalMoney).rate
            this.salesStatisticsTotal.orderRateType = this.formatPercent(this.salesStatisticsTotal.orderTotalMoney, this.salesStatisticsTotal.lastOrderTotalMoney).type
        },
        // 获取销售情况客户统计数据
        async managerCustomerStatisticsTotal() {
            let params = {
                projectIds: this.projectIdList,
                dateType: 1
            }
            const result = await API.managerCustomerStatisticsTotal(params)
            this.customerStatisticsTotal = result
        }
    }
}
</script>

<style lang="less" scoped>
.container {
    position: relative;
    .img-style {
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .my-swipe {
        .section-item {
            padding: 0 15px;
            .data-item {
                .content {
                    .common-flex();
                    margin-bottom: 8px;
                    .content-item {
                        display: inline-flex;
                        align-items: flex-end;
                        font-size: 18px;
                        color: #ffffff;
                        line-height: 16px;
                        font-weight: bold;
                        font-family: DINAlternate-Bold, DINAlternate;
                        .unit {
                            font-size: 10px;
                            font-weight: 400;
                            line-height: 10px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            margin: 0 0 1px 2px;
                        }
                        &.tag {
                            .common-flex();
                            height: 18px;
                            font-size: 13px;
                            line-height: 13px;
                            color: rgba(255, 255, 255, 0.69);
                            font-weight: 400;
                            font-family: PingFangSC-Regular, PingFang SC;
                            background: rgba(255, 255, 255, 0.1);
                            margin: 2px 0 0 12px;
                            padding: 0 6px;
                            span {
                                color: #ffffff;
                                font-weight: bold;
                                font-family: DINAlternate-Bold, DINAlternate;
                                padding: 0 2px 0 4px;
                            }
                        }
                    }
                }
                .label {
                    font-size: 13px;
                    line-height: 13px;
                    color: rgba(255, 255, 255, 0.7);
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                }
            }
        }
        .section-top {
            padding-top: 24px;
            margin-bottom: 24px;
            .data-item {
                .content {
                    align-items: flex-start;
                    margin-bottom: 12px;
                    .content-item {
                        font-size: 45px;
                        line-height: 40px;
                        .unit {
                            font-size: 12px;
                            line-height: 12px;
                            margin: 9px 0 4px 3px;
                        }
                        &.tag {
                            height: 18px;
                            font-size: 13px;
                            line-height: 13px;
                            color: rgba(255, 255, 255, 0.69);
                            font-weight: 400;
                            font-family: PingFangSC-Regular, PingFang SC;
                            background: rgba(255, 255, 255, 0.1);
                            margin: 0 0 0 12px;
                            padding: 0 6px;
                            span {
                                color: #ffffff;
                                font-weight: bold;
                                font-family: DINAlternate-Bold, DINAlternate;
                                padding: 0 2px 0 4px;
                            }
                        }
                    }
                }
            }
        }
        .section-bottom {
            .data-item {
                margin-bottom: 18px;
                .content {
                    height: 18px;
                    .content-item {
                        height: 18px;
                    }
                }
            }
        }
        /deep/ .van-swipe-item {
            padding-bottom: 15px;
        }
        /deep/ .van-swipe__indicators {
            bottom: 12px;
            .van-swipe__indicator {
                width: 4px;
                height: 4px;
                transition: all 0.3s ease;
            }
            .van-swipe__indicator--active {
                width: 15px;
                border-radius: 2px;
            }
        }
    }
}
</style>
