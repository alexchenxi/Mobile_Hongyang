<template>
    <div class="common-page">
        <nav class="common-page-top">
            <top-bar :back="true" title="客户详情"></top-bar>
        </nav>
        <main class="common-page-middle" :style="{ height: isShowFooter ? pageMiddleWithButtonHeight : pageContainerHeight }">
            <van-notice-bar
                color="#DB0826"
                left-icon="volume-o"
                text="本系统仅展示客户状态，案场判断和佣金结算依据以售楼部结算规则和制度为准"
            />
            <div class="box">
                <div class="info">
                    <img
                        v-code="['ZT.CUSTOMER.BUTTON', 'ZT.CUSTOMER.BUTTON.QRCODE']"
                        v-if="detailInfo.avaStatus !== 0 && detailInfo.status !== 30 && !detailInfo.finished && canEdit && detailInfo.childChannelName !== '自渠下线经纪人'"
                        class="icon-qrcode"
                        @click="toQrcode"
                        :src="$baseImgUrl + '/icon-qrcode.png'"
                    />
                    <div class="line" v-if="detailInfo.statusStr">
                        <span class="name van-ellipsis">{{ detailInfo.customerName }}</span>
                        <span class="source level van-ellipsis" :class="detailInfo.statusStr.tagClass">{{ detailInfo.statusStr.name }}</span>
                        <div v-if="detailInfo.isShowReportButton === 1" class="anew-recommend-btn" @click="recommendAgain(detailInfo)">重新报备</div>
                    </div>
                    <div v-if="detailInfo.makeFlg&&detailInfo.makeFlg!=='0'||currentRole.roleCode==='ZT_MANAGER'"  class="collect-container" @click.stop="handleCollection(detailInfo)">
                        <img v-if="detailInfo.important === '1'" class="icon-collect" :src="$baseImgUrl + '/case/customer/icon-collect-on.png'" />
                        <img v-else class="icon-collect" :src="$baseImgUrl + '/case/customer/icon-collect.png'" />
                    </div>
                    <div class="line tel" @click="handleCall">
                        <span class="iconfont icondianhua"></span>
                        {{ detailInfo.customerTel | hidePhone(canEdit, 'ZT.CUSTOMER.BUTTON.SHOWTEL') }}
                    </div>
                    <div class="line" style="display: flex; justify-content: space-between">
                        <div>
                            <label class="label">报备人：</label>
                            {{ detailInfo.reportUserName }}
                        </div>
                        <div>
                            <label class="label">有效期：</label>
                            {{ detailInfo.expireAt }}
                        </div>
                    </div>
                    <div class="line bee-info" v-if="detailInfo.beeUserType">
                        <label class="label">{{ detailInfo.beeUserType }}：</label>
                        {{ detailInfo.beeUserName }}
                        <span>{{ detailInfo.beeUserTel }}</span>
                    </div>
                </div>
                <van-tabs v-model="tabIndex" :class="[oppId || editCustomerName ? '' : 'no-tab']">
                    <van-tab title="时间轴">
                        <CustomerTimeline :start-case-record="startCaseRecord" :data="timeData" @switchChange="switchChange"></CustomerTimeline>
                    </van-tab>
                    <van-tab title="修改信息" v-if="editCustomerName">
                        <van-form @submit="onSubmit" @failed="onFailed" validate-trigger="onSubmit" :show-error-message="false">
                            <van-field
                                v-model="editCustomerForm.customerName"
                                label="客户姓名"
                                placeholder="客户姓名"
                                input-align="right"
                                required
                                :rules="[{ required: true, message: '请填写客户姓名' }]"
                            />
                            <van-field
                                class="textarea-style"
                                input-align="left"
                                label="备注"
                                maxlength="50"
                                show-word-limit
                                v-model="editCustomerForm.remark"
                                rows="2"
                                autosize
                                type="textarea"
                                placeholder="请输入备注信息"
                            />
                        </van-form>
                    </van-tab>
                    <van-tab title="基本信息" v-if="oppId && !editCustomerName && baseInfoData.length">
                        <van-loading v-if="showLoading" type="spinner" />
                        <CustomerForm v-if="!showLoading && tabIndex === 1" ref="form" :formData="baseInfoData" :readonly="true"></CustomerForm>
                    </van-tab>
                </van-tabs>
            </div>
        </main>
        <footer v-code="['ZT.CUSTOMER.BUTTON', 'ZT.CUSTOMER.BUTTON.FOLLOW']" v-if="detailInfo.canEdit">
            <div class="common-fix-bottom" v-if="detailInfo.avaStatus === 1" :style="{ paddingBottom: bottomSafe }">
                <van-button class="btn" round block type="save" @click="followCustomer()">跟进客户</van-button>
            </div>
        </footer>
        <footer v-if="tabIndex === 1 && editCustomerName">
            <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
                <van-button class="btn" round block type="save" v-debounce="[onSubmit, `click`, 300]">保存</van-button>
            </div>
        </footer>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import CustomerForm from '@/components/CustomerForm'
import CustomerTimeline from '@/components/CustomerTimeline'
import API from '@/request/api/selfExtension/customer'
import TIMELINEAPI from '@/request/api/caseSystem/customer'
import { getCustomerTimelineType, getExtensionCustomerStatus } from '@/config/commonData'
import { getConfig } from '@/config/extensionCustomerConfig'

export default {
    name: 'customer',
    components: {
        TopBar,
        CustomerForm,
        CustomerTimeline
    },
    data() {
        return {
            tabIndex: 0,
            showLoading: false,
            detailInfo: {
                avaStatus: 0
            },
            baseInfoData: [],
            addressData: [],
            oppId: '',
            clueId: '',
            startCaseRecord: true,
            editCustomerName: false,
            editCustomerForm: {
                customerName: '',
                remark: ''
            },
            timeData: [],
            canEdit: false,
            isShowFooter: false,
            // 是否展示手机号
            isShowPhone: false
        }
    },
    async created() {
        this.clueId = this.$route.query.clueId
        this.oppId = this.$route.query.oppId
        this.editCustomerName = Number(this.$route.query.editCustomerName)
        this.canEdit = this.$route.query.canEdit === 'true' ? true : false
        this.getCustomerDetail()
        this.getCustomerBaseInfo()
        this.getLocation()
        this.isShowFooter = this.canEdit && this.codes.includes('ZT.CUSTOMER.BUTTON.FOLLOW')
        this.isShowPhone = this.canEdit || this.codes.includes('ZT.CUSTOMER.BUTTON.SHOWTEL')
        if (this.isStartCaseRecord) {
            this.getTimeLineData()
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole', 'codes', 'device'])
    },
    methods: {
         //收藏
        async handleCollection(data) {
            if(this.currentRole.roleCode==='ZT_MANAGER') return
            let params = {
                projectId:this.projectId,
                id: data.clueId,
                important: data.important === '1' ? 0 : 1
            }
            let result = await API.changeClientFav(params)
            if (result) {
                this.detailInfo.important = data.important === '1' ? 0 : '1'
                let message = data.important ? '标记成功' : '取消标记'
                this.$toast(message)
                this.$store.dispatch('other/selfChannelCustomerListUpdate', {isUpdate: true, id: data.clueId})
            }
        },
        getCustomerConfig(type) {
            return getConfig(type)
        },
        //   获取定位，报备截客
        getLocation() {
            return new Promise((resolve, reject) => {
                this.$appMethods.startLocation(this.device).then(
                    res => {
                        if (res.lon) {
                            this.longitude = res.lon
                            this.latitude = res.lat
                            resolve()
                        } else {
                            reject()
                        }
                    },
                    () => {
                        reject()
                    }
                )
            })
        },
        //重新报备
        async recommendAgain(data) {
            this.getLocation().then(
                async () => {
                    let params = {
                        projectId: this.projectId,
                        clueId: data.clueId,
                        longitude: this.longitude,
                        latitude: this.latitude
                    }
                    let result = await API.recommendAgain(params)
                    this.$store.dispatch('other/selfChannelCustomerListUpdate', {isUpdate: true,id: data.clueId, isDelete: true})
                    this.$router.go(-1)
                    setTimeout(() => {
                        this.$toast('报备成功')
                    }, 1000)
                },
                () => {
                    this.$toast('未开启定位无法报备')
                }
            )
        },
        // 是否开启案场跟进记录
        switchChange(val) {
            this.isStartCaseRecord = val
            this.getTimeLineData()
        },
        //获取案场跟进时间轴
        getTimeLineData() {
            let params = {
                type: 1,
                sourceList: this.isStartCaseRecord ? [] : [2]
            }
            params.clueId = this.$route.query.clueId
            console.log(params)
            API.getTimelinesApi(params).then(data => {
                this.timeData = data
                this.$forceUpdate()
            })
        },
        onFailed(errorInfo) {
            this.$toast(errorInfo.errors[0].message)
        },
        onSubmit() {
            if (!this.editCustomerForm?.customerName) {
                this.$toast('请填写客户姓名')
                return
            }
            if (this.detailInfo?.customerName === this.editCustomerForm?.customerName && !this.editCustomerForm.remark) {
                this.$toast('无内容修改，无法保存')
                return
            }

            let params = {
                oldCustomerName: this.detailInfo.customerName,
                newCustomerName: this.editCustomerForm.customerName,
                remark: this.editCustomerForm.remark,
                projectId: this.detailInfo.projectId,
                clueId: this.detailInfo.clueId,
                customerId: this.detailInfo.customerId
            }
            API.updateCustomer(params).then(() => {
                this.$toast('保存成功')
                this.editCustomerForm.remark = ''
                this.getCustomerDetail()
                this.getTimeline()
                this.$store.dispatch('other/selfChannelCustomerListUpdate', {isUpdate: true, id: this.detailInfo.clueId})
            })
        },
        //   获取客户详情
        getCustomerDetail() {
            API.customerDetail({
                clueId: this.clueId,
                roleCode: this.currentRole.roleCode
            }).then(data => {
                this.detailInfo = data
                if(this.$route.query.important){
                    this.detailInfo.important=this.$route.query.important
                    this.detailInfo.makeFlg=this.$route.query.makeFlg
                }
                this.editCustomerForm.customerName = data.customerName
                this.startCaseRecord = data.status === 10 ? false : true
                this.getTimeline()
                this.detailInfo.statusStr = getExtensionCustomerStatus(this.detailInfo.avaStatus === 0 ? -1 : this.detailInfo.status)
                this.detailInfo.codeType = this.detailInfo.avaStatus === 0 ? -1 : this.detailInfo.status
            })
        },
        //电话
        async handleCall() {
            let tel = this.detailInfo.customerTel
            if (!this.isShowPhone) {
                tel = this.$utils.hidePhone(this.detailInfo.customerTel)
            }
            this.$appMethods.SendPhone(this.device, tel)
        },
        //获取基本信息表单数据
        getCustomerBaseInfo() {
            if (!this.oppId) {
                return
            }
            this.showLoading = true
            API.getCustomerBaseInfo({
                oppId: this.oppId
            })
                .then(res => {
                    this.showLoading = false
                    this.dealFormData(res.itemInfos)
                })
                .catch(res => {
                    this.showLoading = false
                })
        },
        //表单数据处理 主要是手机号和地址，还有初始化的空数据
        dealFormData(formData) {
            var telArray = []
            var formData1 = JSON.parse(JSON.stringify(formData))
            //地址是需要push数据的会改变原来数组序值，需要计算下
            var addressIndex = 0
            formData.forEach((item, index) => {
                if (item.key === 'tel') {
                    item.readonly = true
                }
                var index = index * 1 + addressIndex
                item.required = false
                item.hidden = false
                //调整手机号顺序保证从表单第一个依次展示
                if (item.key.indexOf('tel') > -1) {
                    item.hidden = item.itemValues[0].name ? false : true
                    item.type = 'TEL'
                    item.name = item.name.replace(/\d+/g, '')
                    telArray.push(item)
                }
                //如果是地址 手动拆分成下拉和多行文本
                if (item.type === 'ADDRESS') {
                    if (!item.itemValues) {
                        item.itemValues = []
                    }
                    var object = JSON.parse(JSON.stringify(item))
                    object.name = '详细地址'
                    object.type = 'ADDRESS1'
                    if (item.itemValues.length === 0) {
                        formData1[index].itemValues = []
                        formData1[index].itemValues[0] = {
                            name: [],
                            id: []
                        }
                        object.itemValues[0] = {
                            name: '',
                            id: ''
                        }
                    } else {
                        formData1[index].itemValues[0].name = object.itemValues[0]?.name?.slice(0, 3)
                        formData1[index].itemValues[0].id = object.itemValues[0]?.id?.slice(0, 3)
                        object.itemValues[0].name = object.itemValues[0]?.name && object.itemValues[0]?.name[3]
                        object.itemValues[0].id = object.itemValues[0]?.id && object.itemValues[0]?.id[3]
                    }
                    formData1[index].optionalValueSet = []
                    formData1.splice(index + 1, 0, object)
                    addressIndex += 1
                }
            })
            telArray = telArray.sort((item, item1) => {
                if (item.key < item1.key) return -1
            })
            if (!this.isShowPhone) {
                telArray.forEach(item => {
                    item.itemValues[0].code = item.itemValues[0]?.code ? this.$utils.hidePhone(item.itemValues[0].code) : ''
                })
            }
            //把原先的手机号过滤掉
            formData1 = formData1.filter(item => item.key.indexOf('tel') === -1)
            formData1 = telArray.concat(formData1)
            //对初始化数据值为空的做处理，不然会有问题
            formData1.map(item => {
                item.required = false
                item.itemValues = item.itemValues || []
                if (item.type != 'MULTISELECT' && item.itemValues.length === 0) {
                    item.itemValues.push({
                        id: '',
                        name: ''
                    })
                }
                if (item.type === 'DATE') {
                    item.itemValues[0].name = item.itemValues[0]?.name && item.itemValues[0]?.name.split(' ')[0]
                }
                if (item.type === 'ADDRESS') {
                    item.itemValues[0].code = item.itemValues[0]?.code?.length > 3 ? item.itemValues[0]?.code.splice(0, 3) : item.itemValues[0]?.code
                }
                if (item.type === 'ADDRESS1') {
                    item.itemValues[0].code = item.itemValues[0]?.code?.length > 3 ? item.itemValues[0]?.code.splice(item.itemValues[0]?.code.length - 1) : item.itemValues[0]?.code
                }
            })
            this.baseInfoData = formData1
        },
        //判断手机号是否重复
        checkTelRepeat(formData) {
            let telList = formData.filter(item => {
                return item.name === '电话' && item.required
            })
            if (telList.length > 1) {
                let obj = {}
                for (let i in telList) {
                    if (obj[telList[i].itemValues[0].name]) return true
                    obj[telList[i].itemValues[0].name] = true
                }
            }
            return false
        },
        // 客户跟进
        followCustomer() {
            this.$router
                .push({
                    path: '/extension/customerFollow',
                    query: {
                        clueId: this.detailInfo.clueId,
                        oppId: this.detailInfo.oppId
                    }
                })
                .catch(() => {})
        },
        // 跳转带客看房页面
        toQrcode() {
            this.$router
                .push({
                    path: '/extension/showGuests',
                    query: {
                        clueId: this.detailInfo.clueId
                    }
                })
                .catch(() => {})
        },
        // 时间轴
        async getTimeline() {
            this.getTimeLineData()
            // let params = {
            //     type: 1,
            //     clueId: this.detailInfo.clueId
            // }
            // const result = await TIMELINEAPI.getTimelinesApi(params)
            // this.timeData = result
        }
    }
}
</script>
<style scoped lang="less">
    .box{
        height: calc(100% - 42px);
        overflow: auto;
    }
.common-page {
    .common-page-top {
        background: #ffffff;
    }

    .right-icon {
        img {
            width: 16px;
        }
    }

    .common-page-middle {
        .collect-container{
            position: absolute;
            right: 50px;
            top: 0;
            z-index:100;
            .icon-collect{
            width:18px;
            height: 18px;
        }
        }

        .info {
            margin-top: 15px;
            padding: 0 15px 12px;
            position: relative;
            background: linear-gradient(180deg, #fff, #fff1e7 100%);

            .icon-qrcode {
                position: absolute;
                top: 0;
                right: 15px;
                width: 22px;
                height: 22px;
                z-index: 99;
            }

            .line {
                position: relative;
                display: flex;
                align-items: center;
                line-height: 24px;

                .anew-recommend-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    z-index: 10;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 75px;
                    height: 30px;
                    border-radius: 8px;
                    border: 1px solid #db0826;
                    color: #db0826;
                    font-size: 12px;
                }

                .name {
                    font-size: 18px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                    margin-right: 8px;
                }

                .source {
                    max-width: 92px;
                    padding: 0 10px;
                    line-height: 19px;
                    font-size: 10px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    background: rgba(95, 149, 250, 0.1);
                    color: #5f95fa;
                    flex-shrink: 0;
                }

                &.tel {
                    font-size: 18px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    line-height: 40px;

                    .iconfont {
                        color: @theme-color;
                        font-size: 16px;
                        margin-right: 2px;
                    }
                }

                .label {
                    font-size: 13px;
                    color: #999;
                }

                .info-wrap {
                    flex: 1;
                }

                &.bee-info span {
                    margin-left: 8px;
                }
            }
        }

        .split {
            height: 10px;
            background: #f0f4fa;
        }
    }

    .van-tabs {
        padding-bottom: 80px;

        .van-loading.van-loading--spinner {
            text-align: center;
            margin-top: 70px;
        }
    }

    .no-tab {
        /deep/ .van-tab {
            justify-content: flex-start;
            padding: 18px 15px 10px;
            height: auto;
            font-size: 16px;
            color: @header-text-color;
            font-weight: 500;
            line-height: 16px;
        }

        /deep/ .van-tabs__line {
            display: none;
        }

        /deep/ .van-tabs__wrap {
            display: none;
        }
    }
}
</style>
