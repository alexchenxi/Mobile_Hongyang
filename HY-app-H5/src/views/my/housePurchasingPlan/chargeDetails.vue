<template>
    <div class="common-page">
        <nav class="common-page-top">
            <TopBar title="费用明细" />
        </nav>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <div class="main-section">
                <van-form @submit="onSubmit" validate-trigger="onSubmit" :show-error-message="false">
                    <van-field v-model="chargeDetails.name" label="费用名称" input-align="right" placeholder="请输入费用名称" :rules="[{ required: true }]" />
                    <van-field
                        v-model="chargeDetails.computedType"
                        label="计算方式"
                        is-link
                        readonly
                        input-align="right"
                        placeholder="请选择计算方式"
                        :rules="[{ required: true }]"
                        @click="showPopContainer('计算方式', 'computedType')"
                    />
                    <van-field
                        v-model="chargeDetails.chargeStandard"
                        :label="'费用标准(' + chargeStandardUnit + ')'"
                        type="number"
                        input-align="right"
                        placeholder="请输入费用标准"
                        :rules="[{ required: true }]"
                        @input="handleInput"
                    />
                    <van-field
                        v-model="chargeDetails.chargeCycle"
                        label="收取周期"
                        input-align="right"
                        is-link
                        readonly
                        placeholder="请选择收取周期"
                        :rules="[{ required: true }]"
                        @click="showPopContainer('收取周期', 'chargeCycle')"
                    />
                    <van-field v-model="chargeDetails.totalCost" label="费用合计" type="textarea" readonly input-align="right" placeholder="" />
                    <div class="section-footer">
                        <van-button round block type="save" native-type="submit">保存</van-button>
                        <van-button v-if="$route.params.type !== 'add'" round block type="danger" @click="deleteChargeDetails">删除</van-button>
                    </div>
                </van-form>
            </div>
            <van-popup v-model="showPop" position="bottom">
                <van-picker :title="title" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="onCancel" />
            </van-popup>
        </main>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import { commonMethods } from 'movit-utils'
import API from '@/request/api/my'
export default {
    name: 'chargeDetails',
    components: {
        TopBar
    },
    data() {
        return {
            chargeDetails: {
                computedType: '固定金额',
                computedTypeId: 1
            },
            showPop: false,
            columns: [],
            title: '',
            columnsConfig: {
                computedType: [],
                chargeCycle: [
                    {
                        text: '一次性',
                        id: 1
                    },
                    {
                        text: '每月',
                        id: 2
                    },
                    {
                        text: '每年',
                        id: 3
                    }
                ]
            },
            currentField: '',
            chargeStandardUnit: '元',
            planBookInfo: {}
        }
    },
    watch: {
        chargeDetails: {
            handler(newVal, oldVal) {
                this.computedTotalCost()
            },
            deep: true
        }
    },
    mounted() {
        this.planBookSettingInfo()
        if (this.$route.params.chargeDetails) {
            this.chargeDetails = this.$route.params.chargeDetails
        }
    },
    methods: {
        onSubmit() {
            if(this.$route.params.type === 'add') {
                let arr = this.$route.params.chargeDetailsList.map(item => {
                    return item.name
                })
                if(arr.indexOf(this.chargeDetails.name) > -1) {
                    this.$toast('费用名称不能重复')
                    return
                }
            } else if(this.$route.params.type === 'edit') {
                let arr = this.$route.params.chargeDetailsList.map(item => {
                    if(item.id !== this.$route.params.chargeDetails.id) {
                        return item.name
                    }
                })
                if(arr.indexOf(this.chargeDetails.name) > -1) {
                    this.$toast('费用名称不能重复')
                    return
                }
            }
            this.$router.push({
                name: 'planConfig',
                params: {
                    chargeDetails: this.chargeDetails,
                    index: this.$route.params.index,
                    type: 'save'
                }
            }).catch(()=>{})
        },
        onConfirm(val) {
            this.chargeDetails[this.currentField] = val.text
            this.chargeDetails[this.currentField + 'Id'] = val.id
            if (this.currentField === 'computedType') {
                this.chargeStandardUnit = val.unit
            }
            this.showPop = false
        },
        onCancel() {
            this.showPop = false
        },
        deleteChargeDetails() {
            this.$router.push({
                name: 'planConfig',
                params: {
                    chargeDetails: this.chargeDetails,
                    index: this.$route.params.index,
                    type: 'delete'
                }
            }).catch(()=>{})
        },
        showPopContainer(name, field) {
            this.title = name
            this.currentField = field
            this.columns = this.columnsConfig[field]
            this.showPop = true
        },
        computedTotalCost() {
            if (this.chargeDetails.computedTypeId === 1) {
                this.chargeDetails.totalCostOrigin = this.chargeDetails.chargeStandardOrigin
                this.chargeDetails.totalCost = this.chargeDetails.chargeStandard
            } else if (this.chargeDetails.computedTypeId === 2) {
                let discountTotalPriceList = this.$route.params.paymentList.filter(item => {
                    return item.discountTotalPriceOrigin
                })
                if(discountTotalPriceList.length === 0 || !this.chargeDetails.chargeStandard) return
                let totalCost = []
                totalCost = discountTotalPriceList.map(item => {
                    let cost = (parseFloat(item.discountTotalPriceOrigin) * parseFloat(this.chargeDetails.chargeStandardOrigin)) / 100
                    let _cost = cost.toFixed(2)
                    if(this.$route.params.paymentList.length > 1) {
                        return commonMethods.NumFormat(_cost) + '(' + item.name + ')'
                    } else {
                        return commonMethods.NumFormat(_cost)
                    }
                })
                this.chargeDetails.totalCost = totalCost.join(',')
            } else if (this.chargeDetails.computedTypeId === 3) {
                if (!this.$route.params.area || !this.chargeDetails.chargeStandard) return
                let totalCost = parseFloat(this.$route.params.area) * parseFloat(this.chargeDetails.chargeStandardOrigin)
                let _totalCost = totalCost.toFixed(2)
                this.chargeDetails.totalCostOrigin = _totalCost
                this.chargeDetails.totalCost = commonMethods.NumFormat(_totalCost)
            }
        },
        handleInput(val) {
            const value = this.chargeDetails.chargeStandard.replace(/,/g, '')
            this.chargeDetails.chargeStandardOrigin = value
            this.chargeDetails.chargeStandard = commonMethods.NumFormat(value)
        },
        async planBookSettingInfo() {
            const result = await API.planBookSettingInfo()
            this.planBookInfo = result
            this.columnsConfig.computedType = result.calculationMethod.map(item => {
                return {
                    id: item.key,
                    text: item.name,
                    unit: item.key === 1 ? '元' : item.key === 2 ? '%' : '元/㎡'
                }
            })
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
