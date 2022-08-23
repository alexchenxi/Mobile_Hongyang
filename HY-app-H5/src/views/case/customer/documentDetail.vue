<template>
    <div class="common-page">
        <nav class="common-page-top">
            <top-bar :back="true" :title="formatTradeType($route.query.type) + '单'"></top-bar>
        </nav>
        <main class="common-page-container" :style="{height: pageContainerHeight}">
            <div class="split"></div>
            <div class="info">
                <div class="title">基本信息</div>
                <van-cell title="交易单号" :value="baseInfo.tradeInfo.formNo"></van-cell>
<!--                <van-cell title="未成交原因" v-if="!baseInfo.dealStatus">-->
<!--                    <span class="reason-tag">{{ baseInfo.tradeInfo.closeReason }}</span>-->
<!--                </van-cell>-->
                <van-cell value-class="val-width" title="客户" :value="baseInfo.oppInfo.customerName">
                </van-cell>
                <van-cell title="客户手机号" :value="baseInfo.oppInfo.customerTel | hidePhone(canEdit)"></van-cell>
                <!--                <van-cell title="联名购房人">-->
                <!--                    <span>{{ baseInfo.partnerNameList && baseInfo.partnerNameList.length > 0 ? baseInfo.partnerNameList.join(',') : ''
                }}</span>-->
                <!--                </van-cell>-->
            </div>
            <div class="split"></div>
            <div class="info">
                <div class="title">房源信息</div>
                <van-cell value-class="val-width" title="房间号" :value="baseInfo.roomInfo.roomNo"></van-cell>
                <van-cell title="房源业态" :value="baseInfo.roomInfo.productType"></van-cell>
<!--                <van-cell title="户型" :value="baseInfo.roomInfo.houseType"></van-cell>-->
                <van-cell title="建筑面积" :value="baseInfo.roomInfo.buildingArea">
                    <span v-if="baseInfo.roomInfo.buildingArea" slot="extra">㎡</span>
                </van-cell>
            </div>
            <div class="split"></div>
            <div class="info">
                <div class="title">交易信息</div>
                <van-cell :title="formatTradeType($route.query.type) + '金额'">
                    <span v-if="baseInfo.tradeInfo.formMoney">{{ baseInfo.tradeInfo.formMoney }}元</span>
                </van-cell>
                <van-cell v-if="$route.query.type === '1'" title="认购单价">
                    <span v-if="baseInfo.tradeInfo.unitMoney">{{ baseInfo.tradeInfo.unitMoney }}元</span>
                </van-cell>
                <!--                <van-cell v-if="$route.query.type === '2'" title="签约单价">-->
                <!--                    <span v-if="baseInfo.tradeInfo.unitMoney">{{ baseInfo.tradeInfo.unitMoney
                }}元</span>-->
                <!--                </van-cell>-->
                <van-cell :title="formatTradeType($route.query.type) + '时间'"
                          :value="baseInfo.tradeInfo.formTime"></van-cell>
                <!-- <van-cell title="折扣" :value="baseInfo.discountRate"></van-cell>
				<van-cell title="折扣说明" :value="baseInfo.discountDesc"></van-cell> -->
                <!--                <van-cell title="付款方式" :value="baseInfo.tradeInfo.paymentMethod"></van-cell>-->
                <van-cell v-if="$route.query.type === '0'" title="预计认购时间"
                          :value="baseInfo.tradeInfo.estimatedTime"></van-cell>
                <van-cell v-if="$route.query.type === '1'" title="预计签约时间"
                          :value="baseInfo.tradeInfo.estimatedTime"></van-cell>
                <van-cell title="成交来源" :value="baseInfo.tradeInfo.dealSource"></van-cell>
                <van-cell title="关闭原因" :value="baseInfo.tradeInfo.closeReason"></van-cell>
                <van-cell title="关闭时间" :value="baseInfo.tradeInfo.closeDate"></van-cell>
            </div>
            <div class="split"></div>
<!--            <div class="info">-->
<!--                <div class="title">交易记录</div>-->
<!--                <div class="table" v-if="baseInfo.tradeList.length > 0">-->
<!--                    <div class="th">-->
<!--                        <span class="align-left" style="width: 80px">名称</span>-->
<!--                        <span class="align-left" style="width: 170px">订单编号</span>-->
<!--                        <span class="align-left" style="width: 125px;">时间</span>-->
<!--                    </div>-->
<!--                    <div class="tr" v-for="(item, index) in baseInfo.tradeList" :key="index">-->
<!--                        <span class="align-left" style="width: 80px">{{ item.formStatus }}</span>-->
<!--                        <span class="align-left" style="width: 170px">-->
<!--                            <span class="num-tag" @click="goTradeDetail(item)">-->
<!--                                {{ item.formNo }}-->
<!--                                <van-icon name="play" />-->
<!--                            </span>-->
<!--                        </span>-->
<!--                        <span class="align-left" style="width: 125px;">{{ item.formTime }}</span>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
            <div class="split"></div>
            <div class="info">
                <div class="title">置业顾问</div>
                <van-cell title="置业顾问姓名" :value="baseInfo.oppInfo.salesName"></van-cell>
                <van-cell title="手机号码" :value="baseInfo.oppInfo.salesPhone"></van-cell>
            </div>
            <div class="split"></div>
<!--            <div class="info" v-if="$route.query.type !== '0'">-->
<!--                <div class="title">付款信息</div>-->
<!--                <div class="pay-info">-->
<!--                    <div class="pay-item" v-for="(item, index) in baseInfo.paymentList" :key="index">-->
<!--                        <div class="item-title">{{ item.name }}</div>-->
<!--                        <div class="item-content">-->
<!--                            <div class="item-section">-->
<!--                                <div class="item-content-part">-->
<!--                                    <span class="part-label">金额(元)：</span>-->
<!--                                    <span class="part-content">{{ item.paidAmount }}</span>-->
<!--                                </div>-->
<!--                                <div class="item-content-part">-->
<!--                                    <span class="part-label">付款期限：</span>-->
<!--                                    <span class="part-content">{{ item.expectedPayDate }}</span>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="item-section">-->
<!--                                <div class="item-content-part">-->
<!--                                    <span class="part-label">欠款(元)：</span>-->
<!--                                    <span class="part-content red">{{ item.unpaidAmount }}</span>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
        </main>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import CommonApi from '@/request/api/commonApi'
import API from '@/request/api/caseSystem/customer'
import { commonData } from '@/config/commonData'
import { commonMethods } from 'movit-utils'
export default {
    name: 'caseDocumentDetail',
    components: {
        TopBar
    },
    data() {
        return {
            baseInfo: {
                oppInfo: {},
                partnerNameList: [],
                roomInfo: {},
                tradeInfo: {},
                paymentList: [],
                tradeList: []
            },
            canEdit: false,
            tradeTypeList: [
                {
                    type: '0',
                    name: '认筹'
                },
                {
                    type: '1',
                    name: '认购'
                },
                {
                    type: '2',
                    name: '签约'
                }
            ]
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole', 'device', 'codes']),
        menuId() {
            return this.$route.query.menuId
        }
    },
    mounted() {
        this.canEdit = this.$route.query.canEdit === 'false' ? false : true
        this.getBaseData()
    },
    methods: {
        async getBaseData() {
            let param = {
                formId: this.$route.query.id,
                tradeType: this.$route.query.type,
                oppId: this.$route.query.oppId
            }
            let result = await API.getFormDetail(param)
            this.$nextTick(() => {
                this.baseInfo = result
            })
        },
        goDetail() {
            this.$router.push({
                path: '/case/customerDetail',
                query: {
                    oppId: this.baseInfo.oppInfo.oppId,
                    menuId: 'ST.CUSTOMER.FOLLOWING'
                }
            }).catch(()=>{})
        },
        goTradeDetail(data) {
            this.$router.push({
                path: '/case/documentDetail',
                query: {
                    oppId: this.baseInfo.oppInfo.oppId,
                    type: data.tradeType,
                    id: data.formId,
                    time: new Date().getTime()
                }
            }).catch(()=>{})
        },
        //千分位
        numFormat(num) {
            return commonMethods.NumFormat(num)
        },
        formatTradeType(type) {
            return this.tradeTypeList.find(item => item.type === type).name
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    .split {
        width: 100%;
        height: 10px;
        background: #f6f8fa;
    }
    .info {
        .title {
            height: 16px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 16px;
            border-left: 3px solid @theme-color;
            padding-left: 12px;
            margin: 20px 0;
        }
        .val-width {
            flex: 2;
        }
        .van-cell__title,
        .van-cell__value {
            font-size: 15px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
        }
        .van-icon-arrow {
            line-height: 24px;
            margin-right: -4px;
        }
        .van-cell::after {
            left: 0;

            border-bottom: 1px solid #eee;
        }
        .van-cell {
            &:nth-child(2) {
                border-top: 1px solid rgba(238, 238, 238, 0.5);
            }
            .reason-tag {
                padding: 5px 18px;
                font-size: 15px;
                color: @danger-color;
                line-height: 15px;
                font-weight: 400;
                background: rgba(255, 114, 130, 0.1);
            }
        }
        .pay-info {
            padding: 18px 15px;
            .pay-item {
                padding: 18px 0;
                border-bottom: 1px solid #EEEEEE;
                &:last-child {
                    border: none;
                }
                &:first-child {
                    padding-top: 0;
                }
                .item-title {
                    font-size: 15px;
                    line-height: 15px;
                    color: @header-text-color;
                    font-weight: 500;
                    font-family: PingFangSC-Medium, PingFang SC;
                    margin-bottom: 3px;
                }
                .item-content {
                    .item-section {
                        .common-flex-between();
                        padding-top: 12px;
                        .item-content-part {
                            margin-right: 10px;
                            .part-label {
                                font-size: 13px;
                                line-height: 13px;
                                color: #999999;
                                font-weight: 400;
                                font-family: PingFangSC-Regular, PingFang SC;
                            }
                            .part-content {
                                font-size: 13px;
                                line-height: 13px;
                                color: @header-text-color;
                                font-weight: 400;
                                font-family: PingFangSC-Regular, PingFang SC;
                                &.red {
                                    color: @danger-color;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .table {
        border-top: 1px solid rgba(238, 238, 238, 0.5);
        padding: 18px 15px 0;
        .th {
            display: flex;
            font-size: 15px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #999999;
            font-weight: 400;
            line-height: 15px;
            margin-bottom: 18px;
        }
        .tr {
            display: flex;
            align-items: center;
            margin-bottom: 13px;
            font-size: 13px;
            line-height: 13px;
            color: #333;
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

        .num-tag {
            display: inline-flex;
            align-items: center;
            font-size: 13px;
            line-height: 13px;
            color: @theme-color;
            padding: 5px 6px;
            background: rgba(95, 149, 250, 0.09);
            .van-icon {
                font-size: 8px;
                margin-left: 4px;
            }
        }
    }
}
</style>
