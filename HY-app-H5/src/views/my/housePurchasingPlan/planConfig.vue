<template>
    <div class="common-page">
        <nav class="common-page-top">
            <TopBar title="置业计划书" @back="back" backPath="-" />
        </nav>
        <van-form @submit="onSubmit" validate-trigger="onSubmit" @failed="onFailed" scroll-to-error :show-error-message="false">
            <main class="common-page-container" :style="{ height: pageMiddleWithButtonHeight }">
                <div class="section">
                    <div class="section-title">
                        <span class="section-title-text">基本信息</span>
                    </div>
                    <div class="section-content">
                        <template v-for="(item, index) in baseConfig">
                            <van-field
                                :key="index"
                                v-model="plan[item.field]"
                                :readonly="item.readonly"
                                :label="item.label"
                                :is-link="item.isLink"
                                input-align="right"
                                :placeholder="item.placeholder"
                                @click="formatPickerColumns(item, 'base')"
                                @input="handleInput($event, item, 'base')"
                                :rules="item.rules"
                                :type="item.fieldType ? item.fieldType : 'text'"
                            ></van-field>
                        </template>
                    </div>
                </div>
                <div class="section" v-for="(item, payIndex) in plan.paymentList" :key="payIndex">
                    <div class="section-title">
                        <span class="section-title-text">{{ item.name }}</span>
                        <div class="section-title-right" @click="deletePaymentMethods(payIndex)">
                            <i class="iconfont iconshanchu"></i>
                            删除
                        </div>
                    </div>
                    <div class="section-content">
                        <template v-for="(payItem, index) in paymentConfigList[payIndex]">
                            <van-field
                                :key="index"
                                v-model="item[payItem.field]"
                                :readonly="payItem.readonly"
                                :label="payItem.label"
                                :is-link="payItem.isLink"
                                input-align="right"
                                :placeholder="payItem.placeholder"
                                @click="formatPickerColumns(payItem, 'payment', payIndex)"
                                @input="handleInput($event, payItem, 'payment', payIndex)"
                                v-if="!payItem.hidden"
                                :rules="payItem.rules"
                                :type="payItem.fieldType ? payItem.fieldType : 'text'"
                            />
                        </template>
                        <template v-for="(stageItem, stageIndex) in item.paymentInfo">
                            <van-field
                                :key="stageIndex + 'stage'"
                                v-model="stageItem.price"
                                :label="stageItem.name + '(元)'"
                                input-align="right"
                                is-link
                                readonly
                                @click="editStage(stageItem, stageIndex)"
                            ></van-field>
                        </template>
                        <div class="add-top add-container" v-if="item.currentPayment === 2">
                            <div class="wrap" @click="addPaymentNumber(payIndex)">
                                <van-icon name="add-o" />
                                添加付款期数
                            </div>
                        </div>
                    </div>
                </div>
                <div class="add-bottom add-container">
                    <div class="wrap" @click="addPaymentMethods">
                        <van-icon name="add-o" />
                        添加付款方式
                    </div>
                </div>
                <div class="section">
                    <div class="section-title">
                        <span class="section-title-text">其他费用</span>
                    </div>
                    <div class="section-content">
                        <template v-for="(item, index) in chargeList">
                            <van-field
                                :key="index"
                                v-model="item.totalCost"
                                :readonly="chargeConfig.readonly"
                                :label="item.name"
                                :is-link="chargeConfig.isLink"
                                input-align="right"
                                :placeholder="item.placeholder"
                                @click="formatPickerColumns(chargeConfig, 'charge', index)"
                                v-if="!chargeConfig.hidden"
                                rows="1"
                                autosize
                                type="textarea"
                            />
                        </template>
                    </div>
                </div>
                <div class="add-bottom add-container">
                    <div class="wrap" @click="addCharge">
                        <van-icon name="add-o" />
                        添加费用
                    </div>
                </div>
                <div class="label">备注</div>
                <van-field class="remark" v-model="plan.remark" rows="2" autosize label="" type="textarea" maxlength="50" placeholder="请输入备注信息..." show-word-limit />
            </main>
            <footer class="fix-bottom common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
                <van-button round block type="save" native-type="submit">生成置业计划书</van-button>
            </footer>
        </van-form>
        <van-popup v-model="showPop" position="bottom">
            <van-picker v-if="pickerType !== 'date'" :title="title" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="onCancel" />
            <van-datetime-picker v-else v-model="currentDate" :formatter="formatter" type="date" title="选择年月日" @confirm="dateConfirm" @cancel="onCancel" />
        </van-popup>
        <van-popup class="discount-pop" v-if="showDiscountPop" v-model="showDiscountPop" closeable position="bottom">
            <div class="discount-section">
                <div class="section-title">折扣公式</div>
                <div class="section-content">
                    <div class="section-item" v-for="(discountItem, index) in discountFormulas" :key="index">
                        <div class="item-left">
                            <div
                                :class="['action-item', discountItem.discountType === item.id ? 'active' : '']"
                                v-for="item in discountType"
                                :key="item.id"
                                @click="changeDiscountType(discountItem, item.id)"
                            >
                                {{ item.text }}
                            </div>
                        </div>
                        <div class="item-middle">
                            <van-field :key="index" v-model="discountItem.discountVlue" label="" type="number" placeholder="请输入用户名" @input="handleDiscountInput($event, index)" />
                            <span class="unit">{{ discountItem.discountType === 1 ? '折' : '元' }}</span>
                        </div>
                        <div class="item-right">
                            <i class="iconfont iconjia" @click="addDiscount"></i>
                            <i class="iconfont iconjian" @click="deleteDiscount(index)"></i>
                        </div>
                    </div>
                </div>
                <div class="section-footer">
                    <van-button round block type="cancel" @click="showDiscountPop = false">取消</van-button>
                    <van-button round block type="save" @click="saveDiscount">确定</van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import { commonMethods } from 'movit-utils'
import API from '@/request/api/my'
export default {
    name: 'planConfig',
    components: {
        TopBar
    },
    data() {
        return {
            showPop: false,
            columns: [],
            initPayment: {
                name: '付款方式',
                currentPayment: 1,
                paymentType: '按揭付款',
                calculationStandard: '标准总价',
                paymentInfo: []
            },
            plan: {
                paymentList: [
                    {
                        name: '付款方式',
                        currentPayment: 1,
                        paymentType: '按揭付款',
                        calculationStandard: '标准总价',
                        paymentInfo: []
                    }
                ],
                remark: '',
                area: 0,
                unitPrice: 0
            },
            currentField: '',
            pickerList: {
                housingSituation: {
                    list: [
                        { text: '首套房', id: 1 },
                        { text: '二套房', id: 2 },
                        { text: '多套房', id: 3 }
                    ],
                    title: '请选择购房情况'
                },
                paymentType: {
                    list: [],
                    title: '请选择付款方式'
                },
                paymentMethods: {
                    list: [],
                    title: '请选择付款方式名称'
                },
                calculationStandard: {
                    list: [],
                    title: '清选择计算标准'
                },
                loanType: {
                    list: [
                        { text: '等额本金', id: 1 },
                        { text: '等额本息', id: 2 }
                    ],
                    title: '请选择贷款类型'
                },
                timeLimit: {
                    list: [],
                    title: '请选择期限'
                },
                paymentEndDateUnit: {
                    list: [
                        { text: '天', id: 1 },
                        { text: '月', id: 2 }
                    ],
                    title: '请选择首付截止时间单位'
                },
                roomPriceSettingList: {
                    list: [],
                    title: '请选择类型'
                }
            },
            pickerType: '',
            currentDate: new Date(),
            value: '',
            currentPayment: 1,
            paymentConfig: {},
            baseConfig: {},
            paymentIndex: 0,
            infoType: '',
            showDiscountPop: false,
            discountType: [
                {
                    text: '乘以',
                    id: 1
                },
                {
                    text: '减去',
                    id: 2
                }
            ],
            paymentConfigList: [],
            chargeList: [],
            chargeConfig: {},
            paymentInfo: [],
            actionType: '',
            title: '',
            planBookInfo: {},
            discountFormulas: [{}]
        }
    },
    computed: {
        ...mapGetters(['keepAliveList', 'projectId'])
    },
    watch: {
        plan: {
            handler(newVal, oldVal) {
                if (this.actionType === 'noData') {
                    this.actionType = ''
                    return
                }
                this.computedDiscountUnitPrice()
                this.computedLoanTotalPrice()
                this.computedTotalCost()
                this.computedTotalPrice()
            },
            deep: true
        }
    },
    mounted() {
        this.planBookSettingInfo()
        this.formatPayment()
        this.init()
    },
    methods: {
        init() {
            let config = this.$utils.deepCopy(this.paymentConfig)
            this.paymentConfigList[this.paymentIndex] = config
            this.plan.paymentList[this.paymentIndex].discountData = [
                {
                    discountType: 1
                }
            ]
            this.pickerList.timeLimit.list = []
            for (let i = 1; i <= 30; i++) {
                this.pickerList.timeLimit.list.push({
                    text: i,
                    id: i
                })
            }
        },
        formatPayment() {
            this.baseConfig = [
                {
                    label: '购房情况',
                    field: 'housingSituation',
                    placeholder: '请选择购房情况',
                    readonly: true,
                    isLink: true,
                    rules: [{ required: false, message: '请选择购房情况' }]
                },
                {
                    label: '认购时间',
                    field: 'subscriptionDate',
                    placeholder: '请选择认购时间',
                    readonly: true,
                    isLink: true,
                    pickerType: 'date',
                    rules: [{ required: false, message: '请选择认购时间' }]
                },
                {
                    label: '选择类型',
                    field: 'roomPriceSettingList',
                    placeholder: '请选择类型',
                    readonly: true,
                    isLink: true,
                    rules: [{ required: true, message: '请选择类型' }]
                },
                {
                    label: '建筑面积(㎡)',
                    field: 'area',
                    placeholder: '请填写建筑面积',
                    readonly: false,
                    isLink: false,
                    rules: [{ required: true, message: '请填写建筑面积' }],
                    fieldType: 'number'
                },
                {
                    label: '标准单价(元/㎡)',
                    field: 'unitPrice',
                    placeholder: '请填写标准单价',
                    readonly: false,
                    isLink: false,
                    isAmount: true,
                    rules: [{ required: true, message: '请填写标准单价' }],
                    fieldType: 'number'
                },
                {
                    label: '标准总价(元)',
                    field: 'totalPrice',
                    placeholder: '',
                    readonly: true,
                    isLink: false,
                    isAmount: true
                }
            ]
            if (this.plan.paymentList[this.paymentIndex].currentPayment === 1) {
                this.paymentConfig = [
                    {
                        label: '付款类型',
                        field: 'paymentType',
                        placeholder: '请选择付款类型',
                        readonly: true,
                        isLink: true,
                        rules: [{ required: true, message: '请选择付款类型' }]
                    },
                    {
                        label: '付款方式名称',
                        field: 'paymentMethods',
                        placeholder: '请选择付款方式名称',
                        readonly: true,
                        isLink: true,
                        rules: [{ required: true, message: '请选择付款方式名称' }]
                    },
                    {
                        label: '计算标准',
                        field: 'calculationStandard',
                        placeholder: '请选择计算标准',
                        readonly: true,
                        isLink: true,
                        rules: [{ required: true, message: '请选择计算标准' }]
                    },
                    {
                        label: '折扣公式',
                        field: 'formula',
                        placeholder: '请填写折扣公式',
                        readonly: true,
                        isLink: true,
                        pickerType: 'link',
                        rules: [{ required: true, message: '请填写折扣公式' }]
                    },
                    {
                        label: '折后单价(元)',
                        field: 'discountUnitPrice',
                        placeholder: '',
                        readonly: true,
                        isLink: false
                    },
                    {
                        label: '折后总价(元)',
                        field: 'discountTotalPrice',
                        placeholder: '',
                        readonly: true,
                        isLink: false
                    },
                    {
                        label: '贷款类型',
                        field: 'loanType',
                        placeholder: '请选择贷款类型',
                        readonly: true,
                        isLink: true,
                        rules: [{ required: true, message: '请选择贷款类型' }]
                    },
                    {
                        label: '首付款比例(%)',
                        field: 'paymentRatio',
                        placeholder: '请填写首付款比例',
                        readonly: false,
                        isLink: false,
                        rules: [{ required: true, message: '请填写首付款比例' }],
                        fieldType: 'number'
                    },
                    {
                        label: '首付截止时间',
                        field: 'paymentEndDate',
                        placeholder: '请填写首付截止时间',
                        readonly: false,
                        isLink: false,
                        rules: [{ required: true, message: '请填写首付截止时间' }],
                        fieldType: 'number'
                    },
                    {
                        label: '首付截止时间单位',
                        field: 'paymentEndDateUnit',
                        placeholder: '请填写首付截止时间单位',
                        readonly: true,
                        isLink: true,
                        rules: [{ required: true, message: '请填写首付截止时间单位' }]
                    },
                    {
                        label: '贷款总金额(元)',
                        field: 'loanTotalPrice',
                        placeholder: '',
                        readonly: true,
                        isLink: false
                    },
                    {
                        label: '商贷贷款金额(元)',
                        field: 'businessPrice',
                        placeholder: '请填写商贷贷款金额',
                        readonly: false,
                        isLink: false,
                        type: 'business',
                        hidden: true,
                        group: 'loan',
                        isAmount: true,
                        rules: [{ required: true, message: '请填写商贷贷款金额' }],
                        fieldType: 'number'
                    },
                    {
                        label: '商贷利率(%)',
                        field: 'businessRatio',
                        placeholder: '请填写商贷利率',
                        readonly: false,
                        isLink: false,
                        type: 'business',
                        hidden: true,
                        group: 'loan',
                        rules: [{ required: true, message: '请填写商贷利率' }],
                        fieldType: 'number'
                    },
                    {
                        label: '公积金贷款金额(元)',
                        field: 'accumulationPrice',
                        placeholder: '请填写公积金贷款金额',
                        readonly: false,
                        isLink: false,
                        type: 'accumulation',
                        hidden: true,
                        group: 'loan',
                        isAmount: true,
                        rules: [{ required: true, message: '请填写公积金贷款金额' }],
                        fieldType: 'number'
                    },
                    {
                        label: '公积金利率(%)',
                        field: 'accumulationRatio',
                        placeholder: '请填写公积金利率',
                        readonly: false,
                        isLink: false,
                        type: 'accumulation',
                        hidden: true,
                        group: 'loan',
                        rules: [{ required: true, message: '请填写公积金利率' }],
                        fieldType: 'number'
                    },
                    {
                        label: '期限',
                        field: 'timeLimit',
                        placeholder: '请选择期限',
                        readonly: true,
                        isLink: true,
                        rules: [{ required: true, message: '请选择期限' }]
                    }
                ]
            } else {
                this.paymentConfig = [
                    {
                        label: '付款类型',
                        field: 'paymentType',
                        placeholder: '请选择付款类型',
                        readonly: true,
                        isLink: true,
                        rules: [{ required: true, message: '请选择付款类型' }]
                    },
                    {
                        label: '计算标准',
                        field: 'calculationStandard',
                        placeholder: '请选择计算标准',
                        readonly: true,
                        isLink: true,
                        rules: [{ required: true, message: '请选择计算标准' }]
                    },
                    {
                        label: '折扣公式',
                        field: 'formula',
                        placeholder: '请填写折扣公式',
                        readonly: true,
                        isLink: true,
                        pickerType: 'link',
                        rules: [{ required: true, message: '请填写折扣公式' }]
                    },
                    {
                        label: '折扣单价(元)',
                        field: 'discountUnitPrice',
                        placeholder: '请填写折扣单价',
                        readonly: false,
                        isLink: false
                    },
                    {
                        label: '折扣总价(元)',
                        field: 'discountTotalPrice',
                        placeholder: '请填写折扣总价',
                        readonly: true,
                        isLink: false
                    }
                ]
            }
            this.chargeConfig = {
                label: '费用名称',
                field: 'name',
                placeholder: '',
                readonly: true,
                isLink: true
            }
        },
        onConfirm(val) {
            if (this.infoType === 'base') {
                this.plan[this.currentField] = val.text
                if (this.currentField === 'roomPriceSettingList') {
                    this.plan.unitPriceOrigin = val.unitPrice
                    this.plan.unitPrice = commonMethods.NumFormat(val.unitPrice)
                }
            } else if (this.infoType === 'payment') {
                this.plan.paymentList[this.paymentIndex][this.currentField] = val.text
                if (this.currentField === 'loanType') {
                    this.plan.paymentList[this.paymentIndex][this.currentField + 'Id'] = val.id
                }
                if (this.currentField === 'paymentType') {
                    this.plan.paymentList[this.paymentIndex] = this.initPayment
                    this.plan.paymentList[this.paymentIndex].currentPayment = val.id
                    this.plan.paymentList[this.paymentIndex].paymentType = val.text
                    this.formatPayment()
                    let config = this.$utils.deepCopy(this.paymentConfig)
                    this.paymentConfigList[this.paymentIndex] = config
                    this.plan.paymentList[this.paymentIndex].discountData = [
                        {
                            discountType: 1
                        }
                    ]
                }
                if (this.currentField === 'paymentMethods') {
                    this.plan.paymentList[this.paymentIndex][this.currentField + 'Id'] = val.id
                    this.paymentConfigList[this.paymentIndex].map(item => {
                        if (item.group === 'loan') {
                            item.hidden = true
                        }
                        if (val.id === 1 && item.type === 'business') {
                            item.hidden = false
                            this.plan.paymentList[this.paymentIndex].businessRatio = 4.65
                        } else if (val.id === 2 && item.type === 'accumulation') {
                            item.hidden = false
                            this.plan.paymentList[this.paymentIndex].accumulationRatio = 3.25
                        } else if (val.id === 3 && item.group === 'loan') {
                            item.hidden = false
                            this.plan.paymentList[this.paymentIndex].businessRatio = 4.65
                            this.plan.paymentList[this.paymentIndex].accumulationRatio = 3.25
                        }
                    })
                }
            }
            this.computedDiscountUnitPrice()
            this.computedLoanTotalPrice()
            this.$forceUpdate()
            this.showPop = false
        },
        onCancel() {
            this.showPop = false
        },
        formatPickerColumns(data, type, index) {
            if (!data.isLink) return
            this.currentField = data.field
            this.pickerType = data.pickerType
            if (this.pickerType !== 'date' && this.pickerList[data.field]) {
                this.columns = this.pickerList[data.field].list
                this.title = this.pickerList[data.field].title
            }
            this.infoType = type
            if (type === 'payment') {
                this.paymentIndex = index
            }
            if (data.field === 'formula') {
                this.discountFormulas = this.$utils.deepCopy(this.plan.paymentList[index].discountData)
                this.showDiscountPop = true
            } else if (type === 'charge') {
                this.$router.push({
                    name: 'chargeDetails',
                    params: {
                        chargeDetails: this.chargeList[index],
                        index: index,
                        area: this.plan.area,
                        paymentList: this.plan.paymentList,
                        chargeDetailsList: this.chargeList,
                        type: 'edit'
                    }
                }).catch(()=>{})
            } else {
                this.showPop = true
            }
            this.$forceUpdate()
        },
        onSubmit() {
            let customPaymentList = this.plan.paymentList.filter(item => {
                return item.currentPayment === 2
            })
            if (customPaymentList.length > 0) {
                let arr = customPaymentList.filter(item => {
                    return item.paymentInfo.length === 0 || !item.paymentInfo
                })
                if (arr.length > 0) {
                    this.$toast('请设置' + arr[0].name + '的分期款项信息')
                    return
                }
            }
            this.plan.chargeList = this.chargeList
            this.$router.push({
                name: 'planPreview',
                params: {
                    plan: this.plan
                }
            }).catch(()=>{})
        },
        dateConfirm(val) {
            const date = commonMethods.DateToString(val).replace(/-/g, '.')
            this.plan[this.currentField] = date
            this.showPop = false
            this.currentDate = new Date()
        },
        formatter(type, val) {
            if (type === 'year') {
                return `${val}年`
            } else if (type === 'month') {
                return `${val}月`
            } else if (type === 'day') {
                return `${val}日`
            }
            return val
        },
        handleInput(val, data, type, index) {
            if (data.isAmount) {
                if (type === 'base') {
                    const value = this.plan[data.field].replace(/,/g, '')
                    this.plan[data.field + 'Origin'] = value
                    this.plan[data.field] = commonMethods.NumFormat(value)
                } else if (type === 'payment') {
                    const value = this.plan.paymentList[index][data.field].replace(/,/g, '')
                    this.plan.paymentList[index][data.field + 'Origin'] = value
                    this.plan.paymentList[index][data.field] = commonMethods.NumFormat(value)
                    if(this.plan.paymentList[index].paymentMethodsId === 3) {
                        const all = parseFloat(this.plan.paymentList[index]['loanTotalPriceOrigin'])
                        const remainder = all - parseFloat(this.plan.paymentList[index][data.field + 'Origin'])
                        if(data.field === 'businessPrice') {
                            this.plan.paymentList[index]['accumulationPriceOrigin'] = remainder
                            this.plan.paymentList[index]['accumulationPrice'] = commonMethods.NumFormat(remainder)
                        } else if(data.field === 'accumulationPrice') {
                            this.plan.paymentList[index]['businessPriceOrigin'] = remainder
                            this.plan.paymentList[index]['businessPrice'] = commonMethods.NumFormat(remainder)
                        }
                    }
                }
            }
            this.computedDiscountUnitPrice()
            this.computedLoanTotalPrice()
        },
        addPaymentMethods() {
            if (this.plan.paymentList.length > 2) {
                this.$toast('最多添加三种付款方式')
                return
            }
            this.plan.paymentList.push({
                name: '付款方式',
                currentPayment: 1,
                calculationStandard: '标准总价',
                paymentType: '按揭付款',
                discountData: [
                    {
                        discountType: 1
                    }
                ]
            })
            this.plan.paymentList.map((item, index) => {
                if (this.plan.paymentList.length === 1) {
                    item.name = '付款方式'
                } else {
                    item.name = '付款方式' + (index === 0 ? '一' : index === 1 ? '二' : '三')
                }
            })
            this.paymentIndex = this.plan.paymentList.length - 1
            this.formatPayment()
            let config = this.$utils.deepCopy(this.paymentConfig)
            this.paymentConfigList.push(config)
            this.$forceUpdate()
        },
        deletePaymentMethods(index) {
            if (this.plan.paymentList.length === 1) {
                this.$toast('至少保留一个付款方式')
                return
            }
            this.plan.paymentList.splice(index, 1)
            this.paymentConfigList.splice(index, 1)
            this.plan.paymentList.map((item, index) => {
                if (this.plan.paymentList.length === 1) {
                    item.name = '付款方式'
                } else {
                    item.name = '付款方式' + (index === 0 ? '一' : index === 1 ? '二' : '三')
                }
            })
            this.actionType = 'noData'
            this.$forceUpdate()
        },
        addDiscount() {
            this.discountFormulas.push({
                discountType: 1,
                discountVlue: ''
            })
            this.$forceUpdate()
        },
        handleDiscountInput(val, index) {
            this.discountFormulas[index].discountVlue = val
            this.$forceUpdate()
        },
        deleteDiscount(index) {
            if (this.discountFormulas.length === 1) {
                return
            }
            this.discountFormulas.splice(index, 1)
            this.$forceUpdate()
        },
        changeDiscountType(data, val) {
            data.discountType = val
            this.$forceUpdate()
        },
        saveDiscount() {
            this.plan.paymentList[this.paymentIndex].discountData = this.$utils.deepCopy(this.discountFormulas)
            let discountData = this.$utils.deepCopy(this.plan.paymentList[this.paymentIndex].discountData)
            let _discountData = discountData.filter(item => {
                return item.discountVlue
            })
            if (_discountData.length > 0) {
                let content = this.plan.paymentList[this.paymentIndex].calculationStandard
                _discountData.map(item => {
                    content += (item.discountType === 1 ? '*' : '-') + (item.discountType === 1 ? item.discountVlue * 10 + '%' : item.discountVlue)
                })
                this.$set(this.plan.paymentList[this.paymentIndex], 'formula', content)
                this.plan.paymentList[this.paymentIndex].formula = content
            } else {
                this.$set(this.plan.paymentList[this.paymentIndex], 'formula', '')
            }
            this.showDiscountPop = false
            this.computedDiscountUnitPrice()
            this.computedLoanTotalPrice()
        },
        //计算折后单价和总价
        computedDiscountUnitPrice() {
            if (!this.plan.paymentList[this.paymentIndex].formula || !this.plan.totalPriceOrigin) {
                this.plan.paymentList[this.paymentIndex].discountTotalPrice = ''
                this.plan.paymentList[this.paymentIndex].discountUnitPrice = ''
                return
            }
            let price =
                this.plan.paymentList[this.paymentIndex].calculationStandard === '标准总价'
                    ? this.plan.totalPriceOrigin
                        ? this.plan.totalPriceOrigin
                        : 0
                    : this.plan.unitPriceOrigin
                    ? this.plan.unitPriceOrigin
                    : 0
            if (price === '') {
                price = 0
            }
            let discountData = this.$utils.deepCopy(this.plan.paymentList[this.paymentIndex].discountData)
            let _discountData = discountData.filter(item => {
                return item.discountVlue
            })
            _discountData.map(item => {
                if (item.discountType === 1) {
                    price = parseFloat(price) * (parseFloat(item.discountVlue) / 10)
                } else {
                    price = parseFloat(price) - parseFloat(item.discountVlue)
                }
            })
            if (this.plan.paymentList[this.paymentIndex].calculationStandard === '标准总价') {
                let totalPrice = parseFloat(price).toFixed(2)
                this.plan.paymentList[this.paymentIndex].discountTotalPriceOrigin = totalPrice
                this.plan.paymentList[this.paymentIndex].discountTotalPrice = commonMethods.NumFormat(totalPrice)
                let unitPrice = this.plan.area == 0 ? 0 : (price / this.plan.area).toFixed(2)
                this.plan.paymentList[this.paymentIndex].discountUnitPriceOrigin = unitPrice
                this.plan.paymentList[this.paymentIndex].discountUnitPrice = commonMethods.NumFormat(unitPrice)
            } else {
                let unitPrice = parseFloat(price).toFixed(2)
                this.plan.paymentList[this.paymentIndex].discountUnitPriceOrigin = unitPrice
                this.plan.paymentList[this.paymentIndex].discountUnitPrice = commonMethods.NumFormat(unitPrice)
                let totalPrice = (price * 100 * this.plan.area) / 100
                this.plan.paymentList[this.paymentIndex].discountTotalPriceOrigin = totalPrice
                this.plan.paymentList[this.paymentIndex].discountTotalPrice = commonMethods.NumFormat(totalPrice)
            }
        },
        //计算贷款总金额
        computedLoanTotalPrice() {
            if (!this.plan.paymentList[this.paymentIndex].discountTotalPriceOrigin || !this.plan.paymentList[this.paymentIndex].paymentRatio) {
                this.plan.paymentList[this.paymentIndex].loanTotalPrice = ''
                return
            }
            let price = (this.plan.paymentList[this.paymentIndex].discountTotalPriceOrigin * (100 - this.plan.paymentList[this.paymentIndex].paymentRatio)) / 100
            let _price = parseFloat(price).toFixed(2)
            this.plan.paymentList[this.paymentIndex].loanTotalPriceOrigin = _price
            this.plan.paymentList[this.paymentIndex].loanTotalPrice = commonMethods.NumFormat(_price)
        },
        //添加付款期数
        addPaymentNumber(index) {
            this.$router.push({
                name: 'paymentInfo',
                params: {
                    index: index,
                    discountTotalPrice: this.plan.paymentList[this.paymentIndex].discountTotalPriceOrigin,
                    type: 'add'
                }
            }).catch(()=>{})
        },
        addCharge() {
            this.$router.push({
                name: 'chargeDetails',
                params: {
                    area: this.plan.area,
                    index: this.chargeList.length - 1,
                    type: 'add',
                    paymentList: this.plan.paymentList,
                    chargeDetailsList: this.chargeList
                }
            }).catch(()=>{})
        },
        setData() {
            if (this.$route.params.chargeDetails) {
                if (this.$route.params.type === 'save') {
                    let data = this.$route.params.chargeDetails
                    if (data.id) {
                        let chargeIndex = this.chargeList.findIndex(item => item.id === data.id)
                        this.chargeList[chargeIndex] = data
                    } else {
                        this.chargeList.push(this.$route.params.chargeDetails)
                        this.chargeList.map((item, index) => {
                            item.id = index + 1
                        })
                    }
                } else if (this.$route.params.type === 'delete') {
                    let data = this.$route.params.chargeDetails
                    let chargeIndex = this.chargeList.findIndex(item => item.id === data.id)
                    this.chargeList.splice(chargeIndex, 1)
                }
            }
            if (this.$route.params.paymentInfo) {
                if (this.$route.params.type === 'save') {
                    let data = this.$route.params.paymentInfo
                    if (data.id) {
                        let paymentInfoIndex = this.plan.paymentList[this.$route.params.index].paymentInfo.findIndex(item => item.id === data.id)
                        this.plan.paymentList[this.$route.params.index].paymentInfo[paymentInfoIndex] = data
                    } else {
                        this.plan.paymentList[this.$route.params.index].paymentInfo.push(this.$route.params.paymentInfo)
                        this.plan.paymentList[this.$route.params.index].paymentInfo.map((item, index) => {
                            item.id = index + 1
                        })
                    }
                } else if (this.$route.params.type === 'delete') {
                    let data = this.$route.params.paymentInfo
                    let paymentInfoIndex = this.plan.paymentList[this.$route.params.index].paymentInfo.findIndex(item => item.id === data.id)
                    this.plan.paymentList[this.$route.params.index].paymentInfo.splice(paymentInfoIndex, 1)
                }
            }
            this.$forceUpdate()
        },
        editStage(item, index) {
            this.$router.push({
                name: 'paymentInfo',
                params: {
                    index: index,
                    discountTotalPrice: this.plan.paymentList[this.paymentIndex].discountTotalPriceOrigin,
                    paymentInfo: item
                }
            }).catch(()=>{})
        },
        // 其他费用计算
        computedTotalCost() {
            this.chargeList.map(charge => {
                if (charge.computedTypeId === 1) {
                    charge.totalCostOrigin = charge.chargeStandardOrigin
                    charge.totalCost = charge.chargeStandard
                } else if (charge.computedTypeId === 2) {
                    let discountTotalPriceList = this.plan.paymentList.filter(item => {
                        return item.discountTotalPriceOrigin
                    })
                    if (discountTotalPriceList.length === 0 || !charge.chargeStandard) return
                    let totalCost = []
                    totalCost = discountTotalPriceList.map(item => {
                        let cost = (parseFloat(item.discountTotalPriceOrigin) * parseFloat(charge.chargeStandardOrigin)) / 100
                        let _cost = parseFloat(cost).toFixed(2)
                        if (this.plan.paymentList.length > 1) {
                            return commonMethods.NumFormat(_cost) + '(' + item.name + ')'
                        } else {
                            return commonMethods.NumFormat(_cost)
                        }
                    })
                    charge.totalCost = totalCost.join(',')
                } else if (charge.computedTypeId === 3) {
                    if (!this.plan.area || !charge.chargeStandard) return
                    let totalCost = parseFloat(this.plan.area) * parseFloat(charge.chargeStandardOrigin)
                    let _totalCost = parseFloat(totalCost).toFixed(2)
                    charge.totalCostOrigin = _totalCost
                    charge.totalCost = commonMethods.NumFormat(_totalCost)
                }
            })
        },
        back() {
            this.$dialog
                .confirm({
                    title: '',
                    message: '退出后将无法查看当前置业计划书内容'
                })
                .then(() => {
                    this.$router.push({
                        path: '/my'
                    }).catch(()=>{})
                })
                .catch(() => {
                    // on cancel
                })
        },
        onFailed(errorInfo) {
            this.$toast(errorInfo.errors[0].message)
        },
        async planBookSettingInfo() {
            const result = await API.planBookSettingInfo()
            this.planBookInfo = result
            if (result.roomPriceSettingList && result.roomPriceSettingList.length > 0) {
                this.pickerList.roomPriceSettingList.list = result.roomPriceSettingList.map(item => {
                    return {
                        id: item.seq,
                        text: item.typeName,
                        unitPrice: item.unitPrice
                    }
                })
            }
            this.pickerList.paymentType.list = result.payTypeArray.map(item => {
                return {
                    id: item.key,
                    text: item.name
                }
            })
            this.pickerList.paymentMethods.list = result.payMethod.map(item => {
                return {
                    id: item.key,
                    text: item.name
                }
            })
            this.pickerList.calculationStandard.list = result.calculationStandard.map(item => {
                return {
                    id: item.key,
                    text: item.name
                }
            })
            if (!result.allowEditUnitPrice) {
                this.baseConfig.map(item => {
                    if (item.field === 'unitPrice') {
                        item.readonly = true
                    }
                })
            } else {
                this.baseConfig.map(item => {
                    if (item.field === 'roomPriceSettingList') {
                        item.rules = [{ required: false, message: '请选择类型' }]
                    }
                })
            }
            this.$forceUpdate()
        },
        computedTotalPrice() {
            let price = !!this.plan.area && !!this.plan.unitPrice ? parseFloat(this.plan.area) * parseFloat(this.plan.unitPriceOrigin) : 0
            const data = price.toString().replace(/,/g, '')
            let _data = parseFloat(data).toFixed(2)
            this.plan.totalPriceOrigin = _data
            this.plan.totalPrice = commonMethods.NumFormat(_data)
            this.$forceUpdate()
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('planConfig') === -1) {
                array.push('planConfig')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            vm.setData()
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/my/chargeDetails') && !to.path.includes('/my/paymentInfo') && !to.path.includes('/my/planPreview')) {
            array = array.filter(item => {
                return item !== 'planConfig'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    background: #f6f8fa;
    .section {
        background: #ffffff;
        margin-top: 10px;
        .section-title {
            .common-flex-between();
            height: 56px;
            font-size: 16px;
            line-height: 16px;
            color: @header-text-color;
            font-weight: 500;
            font-family: PingFangSC-Medium, PingFang SC;
            padding: 0 15px 0 0;
            .section-title-text {
                border-left: 3px solid @theme-color;
                padding: 0 15px 0 12px;
            }
            .section-title-right {
                .common-flex();
                font-size: 13px;
                color: @danger-color;
                line-height: 13px;
                font-weight: 500;
                font-family: PingFangSC-Medium, PingFang SC;
                .iconfont {
                    margin-right: 4px;
                    font-size: 13px;
                    font-weight: 500;
                }
            }
        }
        .section-content {
            /deep/ .van-cell {
                padding: 15px 15px;
                line-height: 25px;
                border-top: 1px solid #eeeeee;
                &::after {
                    display: none;
                }
                .van-field__label {
                    width: 140px;
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
        }
    }

    .add-container {
        .common-flex-center();
        padding: 0 15px;
        .wrap {
            .common-flex-center();
            width: 100%;
            height: 45px;
            font-size: 15px;
            color: @theme-color;
            font-weight: 500;
            font-family: PingFangSC-Medium, PingFang SC;
            .van-icon {
                margin-right: 6px;
            }
        }
    }
    .add-top {
        height: 60px;
        background: #ffffff;
        .wrap {
            background: rgba(95, 149, 250, 0.03);
        }
    }
    .add-bottom {
        height: 65px;
        background: #f6f8fa;
        .wrap {
            border-radius: 4px;
            border: 1px dashed @theme-color;
        }
    }
    .label {
        font-size: 15px;
        color: @header-text-color;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        line-height: 15px;
        background: #ffffff;
        padding: 18px 15px 12px;
    }
    .remark {
        padding: 0 15px 16px;
    }
}
.van-popup {
    border-radius: 8px 8px 0 0;
}
.discount-pop {
    .discount-section {
        .section-title {
            font-size: 18px;
            color: @header-text-color;
            font-weight: 600;
            font-family: PingFangSC-Semibold, PingFang SC;
            text-align: center;
            padding: 19px 0;
            border-bottom: 1px solid #eeeeee;
        }
        .section-content {
            padding: 18px 15px;
            border-bottom: 1px solid #eeeeee;
            .section-item {
                .common-flex();
                margin-bottom: 18px;
                &:last-child {
                    margin-bottom: 0;
                }
                .item-left {
                    .common-flex();
                    margin-right: 10px;
                    .action-item {
                        .common-flex-center();
                        width: 48px;
                        height: 42px;
                        background: rgba(153, 153, 153, 0.09);
                        font-size: 13px;
                        font-weight: 400;
                        color: #999999;
                        border: 1px solid rgba(153, 153, 153, 0.09);
                        &:first-child {
                            border-radius: 4px 0 0 4px;
                        }
                        &:last-child {
                            border-radius: 0 4px 4px 0;
                        }
                        &.active {
                            background: rgba(91, 147, 250, 0.08);
                            border: 1px solid @theme-color;
                            color: @theme-color;
                        }
                    }
                }
                .item-middle {
                    .common-flex();
                    margin-right: 22px;
                    .van-field {
                        width: 130px;
                        padding: 10px 0;
                        border: 1px solid #dddddd;
                        border-radius: 4px;
                        margin-right: 10px;
                        /deep/ .van-field__control {
                            padding: 0 10px;
                        }
                    }
                    .unit {
                        font-size: 13px;
                        color: @header-text-color;
                        font-weight: 400;
                        font-family: PingFangSC-Regular, PingFang SC;
                    }
                }
                .item-right {
                    flex-grow: 1;
                    .common-flex-between();
                    .iconfont {
                        font-size: 18px;
                    }
                    .iconjia {
                        color: @theme-color;
                    }
                    .iconjian {
                        color: @danger-color;
                    }
                }
            }
        }
        .section-footer {
            .common-flex-between();
            height: 60px;
            padding: 0 15px;
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
    /deep/ .van-popup__close-icon {
        top: 22px;
        font-size: 17px;
    }
}
</style>
