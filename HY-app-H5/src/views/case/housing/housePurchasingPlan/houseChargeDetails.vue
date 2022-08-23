<template>
    <div class="common-page">
        <nav class="common-page-top">
            <TopBar title="费用明细" />
        </nav>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <div class="main-section">
                <van-form @submit="onSubmit" validate-trigger="onSubmit" :show-error-message="false">
                    <van-field
                        v-model="chargeDetails.name"
                        label="费用名称"
                        is-link
                        readonly
                        input-align="right"
                        placeholder="请输入费用名称"
                        :rules="[{ required: true }]"
                        @click="showPopContainer('费用名称', 'name')"
                    />
                    <van-field
                        v-model="chargeDetails.computedType"
                        label="计算方式"
                        :is-link="customCost"
                        readonly
                        input-align="right"
                        placeholder="请选择计算方式"
                        :rules="[{ required: true }]"
                        @click="showPopContainer('计算方式', 'computedType', !customCost)"
                    />
                    <van-field
                        v-model="chargeDetails.chargeStandard"
                        :label="'费用标准(' + chargeStandardUnit + ')'"
                        type="number"
                        input-align="right"
                        placeholder="请输入费用标准"
                        :rules="[{ required: true }]"
                        @input="handleInput"
                        :readonly="!planBookInfo.allowEditCost && !customCost"
                    />
                    <van-field
                        v-model="chargeDetails.chargeCycle"
                        label="收取周期"
                        input-align="right"
                        :is-link="customCost"
                        readonly
                        placeholder="请选择收取周期"
                        :rules="[{ required: true }]"
                        @click="showPopContainer('收取周期', 'chargeCycle', !customCost)"
                    />
                    <van-field v-model="chargeDetails.totalCost" label="费用合计" type="textarea" readonly input-align="right" placeholder="" />
                    <div class="section-footer">
                        <van-button round block type="save" native-type="submit">保存</van-button>
                        <van-button v-if="$route.params.type !== 'add'" round block type="danger" @click="deleteChargeDetails">删除</van-button>
                    </div>
                </van-form>
            </div>
            <van-popup v-model="showPop" position="bottom" class="cost-popup">
                <van-picker :title="title" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="onCancel" />
                <div class="custom-field" v-if="planBookInfo.allowAddCost && currentField === 'name'">
                    <div class="label">自定义</div>
                    <div class="content">
                        <van-field v-model="name" label="" placeholder="请输入" />
                    </div>
                </div>
            </van-popup>
        </main>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import { commonMethods } from 'movit-utils'
import API from '@/request/api/my'
import { mapGetters } from 'vuex'
export default {
    name: 'caseHouseChargeDetails',
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
                        id: 'All'
                    },
                    {
                        text: '每月',
                        id: 'Mounth'
                    },
                    {
                        text: '每年',
                        id: 'Year'
                    }
                ],
                name: []
            },
            currentField: '',
            chargeStandardUnit: '元',
            planBookInfo: {},
            currentCostId: '',
            name: '',
            customCost: false
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
    computed: {
        ...mapGetters(['projectId'])
    },
    async mounted() {
        await this.planBookProjectSettingInfo()
        if (this.$route.params.chargeDetails) {
            this.chargeDetails = this.$route.params.chargeDetails
            let index = this.planBookInfo.costDetails.findIndex(item => item.costName === this.$route.params.chargeDetails.name)
            if(index === -1) {
                this.name = this.chargeDetails.name
                this.customCost = true
            }
        }
    },
    methods: {
        onSubmit() {
            if (this.$route.params.type === 'add') {
                let arr = this.$route.params.chargeDetailsList.map(item => {
                    return item.name
                })
                if (arr.indexOf(this.chargeDetails.name) > -1) {
                    this.$toast('费用名称不能重复')
                    return
                }
            } else if (this.$route.params.type === 'edit') {
                let arr = this.$route.params.chargeDetailsList.map(item => {
                    if (item.id !== this.$route.params.chargeDetails.id) {
                        return item.name
                    }
                })
                if (arr.indexOf(this.chargeDetails.name) > -1) {
                    this.$toast('费用名称不能重复')
                    return
                }
            }
            this.$router.replace({
                path: this.$store.getters.microPrefix + '/case/housePlanConfig',
                params: {
                    chargeDetails: this.chargeDetails,
                    index: this.$route.params.index,
                    type: 'save'
                }
            }).catch(()=>{})
        },
        onConfirm(val) {
            console.log(val)
            this.chargeDetails[this.currentField] = val.text
            this.chargeDetails[this.currentField + 'Id'] = val.id
            if (this.currentField === 'computedType') {
                this.chargeStandardUnit = val.unit
            }
            if (this.currentField === 'name') {
                if(this.name) {
                    this.chargeDetails.name = this.name
                    this.chargeDetails.computedType = '固定金额'
                    this.chargeDetails.computedTypeId = 1
                    this.chargeDetails.chargeStandard = ''
                    this.chargeDetails.chargeCycle = ''
                    this.chargeDetails.totalCost = ''
                    this.customCost = true
                } else {
                    this.currentCostId = val.id
                    let cost = this.planBookInfo.costDetails.find(item => item.seq === val.id)
                    this.chargeDetails.computedType = this.columnsConfig.computedType.find(item => item.id === cost.calculationMethod).text
                    this.chargeDetails.computedTypeId = cost.calculationMethod
                    this.chargeDetails.chargeStandardOrigin = cost.costStandard
                    this.chargeDetails.chargeStandard = commonMethods.NumFormat(cost.costStandard)
                    this.chargeDetails.chargeCycle = this.columnsConfig.chargeCycle.find(item => item.id === cost.period).text
                    this.computedTotalCost()
                    this.customCost = false
                }
            }
            this.showPop = false
        },
        onCancel() {
            this.showPop = false
        },
        deleteChargeDetails() {
            this.$router.replace({
                path: this.$store.getters.microPrefix + '/case/housePlanConfig',
                params: {
                    chargeDetails: this.chargeDetails,
                    index: this.$route.params.index,
                    type: 'delete'
                }
            }).catch(()=>{})
        },
        showPopContainer(name, field, type) {
            if(type) return
            this.name = ''
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
                if (discountTotalPriceList.length === 0 || !this.chargeDetails.chargeStandard) return
                let totalCost = []
                totalCost = discountTotalPriceList.map(item => {
                    let cost = (parseFloat(item.discountTotalPriceOrigin) * parseFloat(this.chargeDetails.chargeStandardOrigin)) / 100
                    let _cost = cost.toFixed(2)
                    if (this.$route.params.paymentList.length > 1) {
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
            this.computedTotalCost()
            this.$forceUpdate()
        },
        async planBookProjectSettingInfo() {
            let params = {
                projectId: this.projectId
            }
            this.$utils.loading()
            const result = await API.planBookProjectSettingInfo(params)
            this.planBookInfo = result
            this.columnsConfig.computedType = result.calculationMethod.map(item => {
                return {
                    id: item.key,
                    text: item.name,
                    unit: item.key === 1 ? '元' : item.key === 2 ? '%' : '元/㎡'
                }
            })
            this.columnsConfig.name = result.costDetails.map(item => {
                return {
                    id: item.seq,
                    text: item.costName
                }
            })
            this.$toast.clear()
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
.cost-popup {
    .custom-field {
        padding: 0 15px;
        .label {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: @header-text-color;
            line-height: 16px;
            padding-bottom: 15px;
        }
        .content {
            margin-bottom: 18px;
        }
        .van-field {
            padding: 10px 15px;
            border: 1px solid #DDDDDD;
            border-radius: 4px;
        }
    }
}
</style>
