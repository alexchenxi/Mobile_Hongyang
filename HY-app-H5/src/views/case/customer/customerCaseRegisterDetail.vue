<!-- 销售登记客户详情-->
<template>
    <div class="common-page">
        <nav class="common-page-top">
            <top-bar :back="true" title="客户详情" />
        </nav>
        <main
            class="common-page-container"
            :style="{ height: isShowFooter ? pageMiddleWithButtonHeight : pageContainerHeight }"
        >
            <div class="info">
                <div class="info-left">
                    <div class="line">
                        <span class="name van-ellipsis">{{ baseInfo.customerName }}</span>
                        <span
                            class="channel-tag"
                            :class="baseInfo.statusObj && baseInfo.statusObj.class"
                        >{{ baseInfo.statusObj && baseInfo.statusObj.name }}</span>
                        <span class="channel-tag common-tag-1">{{ baseInfo.channel1Name }}</span>
                    </div>
                    <div class="line tel" @click="handleCall"><span class="iconfont icondianhua"></span>
                        {{ baseInfo.customerTel | hidePhone(canEdit,'ST.CUSTOMER.BUTTON.SHOWTEL') }}
                    </div>
                    <div class="line1"><span class="label">二级渠道：</span> {{ baseInfo.childChannelName }}</div>
                </div>
                <div class="info-right" v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.FAV']">
                    <div @click="handleCollection" class="right-icon">
                        <img v-if="baseInfo.favFlag" :src="$baseImgUrl+ '/case/customer/icon-collect-on.png'" />
                        <span v-else class="iconfont iconshoucang"></span>
                    </div>
                </div>
            </div>
            <div class="info-buttom">
                <!-- <SettingTag class="button-section" v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.TAG']"
                 :type="1" :item="baseInfo" :data="baseInfo.customerDesc" /> -->
                <SettingTagUpdate
                    v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.TAG']"
                    :item="baseInfo"
                    :data="depictTagName"
                />
            </div>
            <div class="split"></div>
            <van-tabs v-model="tabIndex" class="no-tab">
                <van-tab title="时间轴">
                    <CustomerTimeline :data="timelineData" />
                </van-tab>
            </van-tabs>
        </main>
        <footer v-if="isShowFooter">
            <div class="fix-bottom common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
                <div
                    class="btn"
                    v-if="canEdit"
                    @click.stop="followCustomer()"
                    v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.FOLLOW']"
                >
                    跟客
                </div>
            </div>
        </footer>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import TopBar from '@c/TopBar'
    import CustomerTimeline from '@/components/CustomerTimeline'
    import API from '@/request/api/caseSystem/customer'
    import { getCustomerStatus } from '@/config/caseCustomerConfig'
    import SettingTagUpdate from '@/components/SettingTagUpdate'

    export default {
        name: 'customer',
        components: {
            TopBar,
            CustomerTimeline,
            SettingTagUpdate
        },
        data() {
            return {
                tabIndex: 0,
                baseInfo: {},
                // 是否到访 true 到访 false 未到访
                canEdit: false,
                // 是否展示底部区域
                isShowFooter: true,
                collect: false,
                // 是否展示手机号
                isShowPhone: false,
                timelineData: [],
                depictId: '',
                depictTagListId: '',
                depictTagName: '',
                depictTagList: []
            }
        },
        async created() {
            this.getInputCustomerDetail()
            this.depictGetTagOnCustomer()
        },
        computed: {
            ...mapGetters(['projectId', 'currentRole', 'device', 'codes']),
            menuId() {
                return this.$route.query.menuId
            }
        },
        methods: {
            async getInputCustomerDetail() {
                var param = {
                    clueId: this.$route.query.clueId || ''
                }
                this.baseInfo = await API.getInputCustomerDetail(param)
                this.baseInfo.oppId = this.$route.query.oppId
                this.baseInfo.clueId = this.$route.query.clueId || ''
                this.baseInfo.clientId = this.$route.query.clientId || ''
                this.baseInfo.statusObj = getCustomerStatus(this.menuId, this.baseInfo.avaStatus === 1 ? this.baseInfo.status : -1)
                this.getTimeline()
                this.buttonStatusConfig()
            },
            buttonStatusConfig() {
                this.canEdit = this.baseInfo.canEdit
                this.isShowFooter = this.baseInfo.avaStatus === 1 && this.canEdit && this.codes.includes('ST.CUSTOMER.BUTTON.FOLLOW')
                // 是自己客户或有后台权限
                this.isShowPhone = this.canEdit || this.codes.includes(
                    'ST.CUSTOMER.BUTTON.SHOWTEL')
            },
            //收藏
            async handleCollection() {
                let params = {
                    clueId: this.baseInfo.clueId,
                    doFav: !this.baseInfo.favFlag
                }
                let result = await API.favInputCustomer(params)
                if (result) {
                    this.baseInfo.favFlag = !this.baseInfo.favFlag
                    let message = this.baseInfo.favFlag ? '标记成功' : '取消标记'
                    this.$toast(message)
                }
            },
            followCustomer(item) {
                this.$router.push({
                    path: '/extension/customerFollow',
                    query: {
                        clueId: this.$route.query.clueId || '',
                        followSource: 1,
                        channel1Name: this.baseInfo.channel1Name,
                        reserveVisitDate: this.baseInfo.reserveVisitDate
                    }
                }).catch(() => {})
            },
            //电话
            async handleCall() {
                let params = {
                    id: this.baseInfo.clueId
                }
                await API.customerCall(params)
                let tel = this.baseInfo.customerTel
                if (!this.isShowPhone) {
                    tel = this.$utils.hidePhone(this.baseInfo.customerTel)
                }
                this.$appMethods.SendPhone(this.device, tel)
            },
            // 获取已经绑定的标签
            depictGetTagOnCustomer() {
                var params = {
                    clientId: this.$route.query.clientId
                }
                API.getTagOnCustomer(params).then(res => {
                    let depictTagList = res
                    this.depictTagList = depictTagList
                    for (let index in depictTagList) {
                        let depictTagListId = depictTagList[index].tagId
                        let depictTagName = depictTagList[index].tagName
                        this.depictTagName = depictTagName
                        this.depictId = depictTagListId
                        this.$emit('change', this.depictTagName)
                    }
                })
            },
            // 修改标签
            tagChange(val) {
                this.$emit('tagChange', true)
            },
            // 时间轴
            async getTimeline() {
                let params = {
                    type: 8,
                    clueId: this.baseInfo.clueId
                }
                const result = await API.getTimelinesApi(params)
                this.timelineData = result
            }
        }
    }
</script>
<style scoped lang="less">
    .common-page {
        .common-page-top {
            background: #FFFFFF;

            .header {
                .give-up {
                    font-size: 15px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #030303;
                    position: absolute;
                    right: 0;
                }
            }
        }

        .common-page-container {
            .tip {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #FAB55F;
                line-height: 14px;
                height: 36px;
                line-height: 36px;
                background: rgba(250, 181, 95, 0.1);
                margin-bottom: 18px;

                .iconfont {
                    margin: 0px 4px 0 15px;
                }

                .close {
                    font-size: 16px;
                    margin-right: 15px;
                    float: right;
                    color: #FAB55F;
                    width: 50px;
                    text-align: right;
                }
            }

            .info {
                .common-flex-between();
                align-items: flex-start;
                padding: 0 15px;

                .info-left {
                    flex-grow: 1;
                    margin-right: 20px;
                }

                .info-right {
                    flex-shrink: 0;
                    width: 40px;
                    margin-top: 9px;

                    .right-icon {
                        .common-flex-center();
                        flex-direction: column;

                        img {
                            width: 24px;
                        }

                        .collect-text {
                            font-size: 13px;
                            color: #999999;
                            line-height: 13px;
                            font-weight: 400;
                            margin-top: 6px;
                        }

                        span {
                            font-size: 24px;
                        }
                    }
                }

                .line {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;

                    .name {
                        font-size: 18px;
                        line-height: 18px;
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
                        color: #5F95FA;
                        flex-shrink: 0;
                    }

                    &.tel {
                        font-size: 18px;
                        line-height: 18px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;

                        .iconfont {
                            color: @theme-color;
                            font-size: 16px;
                            margin-right: 2px;
                        }
                    }

                    .channel-tag {
                        .common-flex-center();
                        min-width: 45px;
                        height: 18px;
                        font-size: 11px;
                        color: @theme-color;
                        line-height: 11px;
                        font-weight: 500;
                        margin-right: 6px;
                        padding: 0 6px;
                    }
                }

                .line1 {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-size: 13px;
                    line-height: 13px;
                    color: #333333;

                    &.space-between {
                        justify-content: space-between;
                    }

                    .level {
                        padding: 2px 10px;
                        font-size: 10px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        color: #999999;
                        background: #F6F6F6;
                        margin-right: 6px;

                        &.active {
                            color: #47CFAE;
                            font-weight: 600;
                            background: rgba(71, 207, 174, 0.09);
                        }
                    }

                    .label {
                        font-size: 13px;
                        line-height: 13px;
                        color: #999999;
                    }

                    .progress {
                        display: inline-block;
                        position: relative;
                        width: 230px;
                        height: 2px;
                        background: #F5F5F5;
                        border-radius: 2px;
                        margin-right: 13px;

                        .active-line {
                            position: absolute;
                            left: 0;
                            top: -1px;
                            height: 4px;
                            background: linear-gradient(270deg, #4183FF 0%, #4FC0E8 100%);
                            border-radius: 2px;
                        }
                    }

                    .per {
                        font-size: 15px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        color: #999999;
                    }
                }
            }

            .info-buttom {
                padding: 3px 15px 15px;
                .common-flex-between();

                .complete {
                    .label {
                        font-size: 12px;
                        line-height: 12px;
                        color: #999999;
                        font-weight: 400;
                    }

                    .per {
                        font-size: 15px;
                        line-height: 15px;
                        color: @header-text-color;
                        font-weight: bold;
                    }
                }
            }

            .customer-level {
                border-top: 10px solid #F0F4FA;
                padding: 15px;

                .title-section {
                    .common-flex();
                    padding: 3px 0 15px;

                    .title {
                        font-size: 16px;
                        line-height: 16px;
                        color: @header-text-color;
                        font-weight: 500;
                    }

                    .tips {
                        font-size: 12px;
                        line-height: 12px;
                        color: #FF7282;
                        font-weight: 400;
                        margin-left: 10px;
                    }
                }

                .level-section {
                    .common-flex-between();

                    .level {
                        .common-flex-center();
                        width: 80px;
                        height: 30px;
                        font-size: 13px;
                        margin-right: 9px;
                        border-radius: 2px;

                        &:last-child {
                            margin-right: 0;
                        }

                        &.disabled {
                            background: #F5F5F5;
                            color: #CCCCCC;
                        }

                        &.active {
                            color: #FFFFFF;
                            background: @theme-color;
                        }
                    }
                }
            }

            .split {
                height: 10px;
                background: #F0F4FA;
            }
        }

        .van-tabs {
            // padding-bottom: 80px;
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

            /deep/ .van-tabs__wrap {
                display: none;
            }
        }

        .fix-bottom {
            position: fixed;
            bottom: 0;
            // width: 100%;
            // box-sizing: border-box;
            // padding: 8px 15px 20px;
            background: #FFFFFF;
            box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.04);
            display: flex;
            justify-content: space-between;
            align-items: center;

            .btn {
                flex: 1;
                margin: 0 8px;
                padding: 12px 0;
                background: #F1AE59;
                border-radius: 22px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                text-align: center;

                &.save {
                    background: @theme-color;
                }
            }
        }

        .give-pop {
            background: #FFFFFF;
            margin: 55% auto 0;
            width: 345px;
            border-radius: 8px;

            .pop-container {
                padding: 24px 18px 0 18px;

                .form-item {
                    margin-bottom: 24px;

                    &:first-child {
                        margin-bottom: 14px;
                    }
                }

                .label {
                    font-size: 14px;
                    color: @header-text-color;
                    font-weight: 400;
                    margin-bottom: 15px;
                }

                .form-content {
                    .common-flex();
                    flex-wrap: wrap;

                    .check-button {
                        .common-flex-center();
                        height: 30px;
                        font-size: 13px;
                        line-height: 13px;
                        color: #999999;
                        padding: 0 17px;
                        background: rgba(153, 153, 153, 0.09);
                        border-radius: 15px;
                        margin: 0 10px 10px 0;

                        &.checked {
                            background: rgba(219, 8, 38, 0.08);
                            color: @theme-color;
                            font-weight: 500;
                        }
                    }
                }

                .van-cell {
                    border: 1px solid #DDDDDD;
                    border-radius: 4px;
                }
            }

            .title {
                padding: 21px 0;
                text-align: center;
                font-size: 18px;
                line-height: 18px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: @header-text-color;
                border-bottom: 1px solid #EEEEEE;
            }

            .btn {
                width: 100%;
                color: @header-text-color;
                font-size: 16px;
                display: flex;
                align-items: center;
                border-top: 1px solid #EAEAEA;

                & > span {
                    height: 50px;
                    width: 50%;
                    line-height: 50px;
                    text-align: center;
                    border-radius: 0px 0px 0px 8px;
                }

                .confirm {
                    background: @theme-color;
                    border-radius: 0px 0px 8px 0px;
                    color: #FFFFFF;
                }
            }
        }

        .grab-customer {
            width: 315px;
            border-radius: 8px;

            .content {
                width: 100%;
                text-align: center;
                padding: 50px 0;

                .status-image {
                    width: 74px;
                    height: 90px;
                }

                .status-text {
                    font-size: 18px;
                    line-height: 18px;
                    color: @header-text-color;
                    font-weight: 500;
                    margin: 30px 0 20px 0;
                }

                .message-box {
                    font-size: 14px;
                    line-height: 14px;
                    color: #999999;
                    font-weight: 400;

                    .btn-text {
                        color: @theme-color;
                        font-weight: 500;
                    }
                }
            }

            .button-area {
                padding: 0 30px 30px;
            }
        }
    }

    /deep/ .van-popup {
        border-radius: 8px;
    }

    .no-deal {
        border-bottom: 1px solid #EEEEEE;
    }

    /deep/ .no-deal .customer-item .top-container .section-header .section-header-left .tag-list .tag-item {
        background: rgba(255, 114, 130, 0.1);
        color: #FF7282;
    }

    /deep/ .van-popup {
        border-radius: 8px;
    }

    /deep/ .van-collapse-item__content {
        padding: 0;
    }
</style>
