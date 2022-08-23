<template>
    <div class="common-page">
        <top-bar :back="true" title="销售登记"></top-bar>
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <van-form validate-trigger="onSubmit" :show-error-message="false" @submit="onSubmit" @failed="onFailed">
                <van-field
                    v-model="data.name"
                    :disabled="formDisabled"
                    :rules="[
                        { required: true, message: '请输入姓名' },
                        { pattern, message: '姓名请输入中文或字母' },
                    ]"
                    input-align="right"
                    required
                    label="姓名"
                    maxlength="20"
                    placeholder="请输入姓名"
                    name="pattern"
                />
                <van-field
                    v-model="data.phone"
                    :disabled="formDisabled || formDisabledPhone"
                    type="tel"
                    :rules="[
                        { required: true, message: '请输入手机号' },
                        { validator, message: '请填写正确手机号码' },
                    ]"
                    @input="handelPhone"
                    maxlength="11"
                    input-align="right"
                    name="validator"
                    required
                    label="手机号码"
                    placeholder="请输入手机号"
                />
                <van-field
                    v-model="data.childChannelName"
                    :disabled="formDisabled || formDisabledPhone || formDisabledChannel"
                    is-link
                    :rules="[{ required: true, message: '请选择登记类型' }]"
                    input-align="right"
                    required
                    readonly
                    clickable
                    label="登记类型"
                    placeholder="请选择登记类型"
                    @click="clickChannelPicker()"
                />
                <!-- <van-field
                    v-model="data.channelName"
                    is-link
                    :rules="[{ required: true, message: '请选择认知途径' }]"
                    input-align="right"
                    required
                    readonly
                    clickable
                    label="认知途径"
                    placeholder="请选择认知途径"
                    @click="showPicker = true"
                    v-if="$route.query.fromType !== 'reservation'"
                /> -->
                <van-field v-model="data.reserveVisitDate" is-link input-align="right" readonly clickable label="预约到访时间" placeholder="请选择预约到访时间" @click="showTimePicker = true" />
                <div class="cell-title">备注</div>
                <van-field v-model="data.remarks" maxlength="50" show-word-limit rows="4" autosize type="textarea" placeholder="请输入备注信息..." />
                <div class="save-button-div">
                    <van-button round block type="save" native-type="submit">保存</van-button>
                </div>
            </van-form>
        </div>
        <van-popup v-model="showPicker" round position="bottom">
            <van-picker show-toolbar :columns="columns" value-key="name" @cancel="showPicker = false" @confirm="onConfirm" />
        </van-popup>
        <!-- 登记类型 -->
        <van-popup v-model="showChannelPicker" round position="bottom">
            <van-picker show-toolbar :columns="childChannelCodes" value-key="label" @cancel="showChannelPicker = false" @confirm="onChannelConfirm" />
        </van-popup>
        <van-popup v-model="showTimePicker" round position="bottom">
            <van-datetime-picker show-toolbar type="date" title="选择年月日" :min-date="currentDate" @cancel="showTimePicker = false" @confirm="onConfirmDate" />
        </van-popup>
    </div>
</template>
<script>
import API from '@/request/api/caseSystem/customer'
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import { commonMethods } from 'movit-utils'
import CASECUSTOMERAPI from '@/request/api/caseSystem/customer'
export default {
    name: 'CallEnter',
    components: {
        TopBar,
    },
    data() {
        return {
            currentDate: new Date(),
            data: {
                name: null,
                phone: null,
                channelName: null,
                reserveVisitDate: null,
                remarks: null,
                childChannelName: null,
                childChannelCode: null,
            },
            showTimePicker: false,
            showPicker: false,
            columns: [],
            pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/,
            // 登记类型
            childChannelCodes: [],
            showChannelPicker: false,
            // 表单禁用
            formDisabled: false,
            // 只禁用手机号
            formDisabledPhone: false,
            // 只禁用渠道
            formDisabledChannel: false,
        }
    },
    computed: { ...mapGetters(['tabData', 'projectId', 'device']) },
    created() {
        // 从已获电客户跳转过来
        if (this.$route.query.fromType === 'took') {
            this.formDisabled = true
            const { name, tel, typeName, type } = this.$route.query.data
            this.data.name = name
            this.data.phone = tel
            this.data.childChannelName = typeName
            this.data.childChannelCode = type === 1 ? 'C0420' : 'C0421'
        }

        // 从我的预约客户跳转过来
        if (this.$route.query.fromType === 'reservation') {
            this.formDisabledPhone = true
            const { name, tel, time } = this.$route.query.data
            this.data.name = name
            this.data.phone = tel
            this.data.reserveVisitDate = time
            this.data.childChannelName = '线上预约'
            this.data.childChannelCode = 'C0421'
        }
    },
    mounted() {
        this.getCognitiveChannel()
        this.getAcChildChannel()
    },
    methods: {
        async getCognitiveChannel() {
            const result = await API.cognitionChannelTree()
            this.columns = result
            this.columns.map((group) => {
                group.children.map((item) => {
                    delete item.children
                })
            })
        },
        // 获取登记类型
        getAcChildChannel() {
            API.getAcChildChannel(this.projectId).then((res) => {
                this.childChannelCodes = res.map((x) => {
                    return {
                        label: x.channelName,
                        value: x.channelCode,
                    }
                })
            })
        },
        handelPhone(val) {
            if (val.length === 11) {
                this.checkActSignUp(val)
            }else {
                this.formDisabledChannel = false
            }
        },
        checkActSignUp(phone) {
            API.checkActSignUp(phone).then(res => {
                if (res && res > 0) {
                    this.data.childChannelName = '线上预约'
                    this.data.childChannelCode = 'C0421'
                    this.formDisabledChannel = true
                }
            })
        },
        onFailed(errorInfo) {
            this.$toast(errorInfo.errors[0].message)
        },
        validator(val) {
            return /1\d{10}/.test(val)
        },
        onSubmit() {
            let p = this.$utils.deepCopy(this.data)
            delete p.channelName
            delete p.childChannelName
            p.projectId = this.projectId
            if (p.reserveVisitDate) {
                p.reserveVisitDate = this.$utils.spliceTime(p.reserveVisitDate)
            }
            // 潜客id
            if (this.$route.query.id) {
                p.latentCustomerId = this.$route.query.id
            }
            API.customerCreate(p).then(() => {
                this.$toast('销售登记成功')
                if(this.$route.query.fromType === 'reservation'){
                     CASECUSTOMERAPI.updateAppointment(JSON.parse(localStorage.getItem('reservationParams'))).then(() => {
                          localStorage.setItem('reservationParams','')
                          this.$router.go(-1)
                    })
                }else{
                    this.$router.go(-1)
                }

            })
        },
        onConfirm(valueList, indexList) {
            this.data.cognitionChannel1Code = this.columns[indexList[0]].code
            this.data.cognitionChannel1Name = valueList[0]
            this.data.cognitionChannel2Code = this.columns[indexList[0]].children[indexList[1]].code
            this.data.cognitionChannel2Name = valueList[1]
            this.data.channelName = valueList[0] + '-' + valueList[1]
            this.showPicker = false
        },
        onChannelConfirm(value) {
            this.data.childChannelName = value.label
            this.data.childChannelCode = value.value
            this.showChannelPicker = false
        },
        onConfirmDate(value) {
            this.data.reserveVisitDate = commonMethods.DateToString(value)
            this.showTimePicker = false
        },
        clickChannelPicker() {
            if (this.formDisabled || this.formDisabledPhone || this.formDisabledChannel) {
                return
            }
            this.showChannelPicker = true
        },
    },
}
</script>
<style scoped lang="less">
.common-page {
    background: #ffffff;
    .common-page-container {
        background: @bg-color;
        .van-form {
            .save-button-div {
                padding: 40px 23px 0px;
                background: @bg-color;
            }
            /deep/ .van-field__label{
                width: 100px;
            }
            background: #fff;
            .cell-title {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 15px;
                padding: 18px 15px 0;
            }
        }
    }
}
</style>
