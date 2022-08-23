<template>
    <div class="common-page">
        <nav class="common-page-top">
            <TopBar title="款项信息" />
        </nav>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <div class="main-section">
                <van-form @submit="onSubmit" validate-trigger="onSubmit" :show-error-message="false">
                    <van-field v-model="paymentInfo.name" label="付款期数" input-align="right" placeholder="请输入付款期数" :rules="[{ required: true }]" />
                    <van-field v-model="paymentInfo.ratio" label="付款比例(%)" input-align="right" type="number" placeholder="请输入付款比例" :rules="[{ required: true }]" />
                    <van-field v-model="paymentInfo.date" label="截止时间(认购后)" input-align="right" type="number" placeholder="请输入截止时间" :rules="[{ required: true }]" />
                    <van-field v-model="paymentInfo.unit" label="时间单位" input-align="right" readonly is-link placeholder="请选择时间单位" :rules="[{ required: true }]" @click="showPop = true" />
                    <div class="section-footer">
                        <van-button round block type="save" native-type="submit">保存</van-button>
                        <van-button v-if="$route.params.type !== 'add'" round block type="danger" @click="deletePaymentInfo">删除</van-button>
                    </div>
                </van-form>
            </div>
            <van-popup v-model="showPop" position="bottom">
                <van-picker title="时间单位" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="onCancel" />
            </van-popup>
        </main>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import { commonMethods } from 'movit-utils'
export default {
    name: 'housePaymentInfo',
    components: {
        TopBar
    },
    data() {
        return {
            paymentInfo: {},
            showPop: false,
            columns: ['天', '周', '月']
        }
    },
    mounted() {
        if(this.$route.params.paymentInfo) {
            this.paymentInfo = this.$route.params.paymentInfo
        }
    },
    methods: {
        onSubmit() {
            let discountTotalPrice = parseFloat(this.$route.params.discountTotalPrice)
            let price = discountTotalPrice ? (discountTotalPrice * parseFloat(this.paymentInfo.ratio)) / 100 : 0
            let _price = price.toFixed(2)
            this.paymentInfo.priceOrigin = _price
            this.paymentInfo.price = commonMethods.NumFormat(_price)
            this.$router.push({
                name: 'planConfig',
                params: {
                    paymentInfo: this.paymentInfo,
                    type: 'save',
                    index: this.$route.params.index
                }
            }).catch(()=>{})
        },
        onConfirm(val) {
            this.paymentInfo.unit = val
            this.showPop = false
        },
        onCancel() {
            this.showPop = false
        },
        deletePaymentInfo() {
            this.$router.push({
                name: 'planConfig',
                params: {
                    paymentInfo: this.paymentInfo,
                    type: 'delete',
                    index: this.$route.params.index
                }
            }).catch(()=>{})
        }
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    background: #f6f8fa;
    .main-section {
        margin-top: 10px;
        background: #ffffff;
        /deep/ .van-cell {
            padding: 15px 15px;
            line-height: 25px;
            border-top: 1px solid #eeeeee;
            &:first-child {
                border-top: none;
            }
            &::after {
                display: none;
            }
            .van-field__label {
                width: 130px;
            }
            .van-field__label,
            .van-field__label span,
            .van-field__value .van-field__control {
                font-size: 15px;
                color: @header-text-color;
                font-weight: 400;
                font-family: PingFangSC-Regular, PingFang SC;
            }
        }
        .section-footer {
            .common-flex-between();
            background: #f6f8fa;
            height: 60px;
            padding: 50px 15px 0;
            .van-button {
                margin: 0 10px;
                &:first-child {
                    margin-left: 0;
                }
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>
