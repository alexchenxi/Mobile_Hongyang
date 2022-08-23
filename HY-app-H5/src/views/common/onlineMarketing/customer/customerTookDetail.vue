<!-- 已获电客户详情 -->
<template>
    <div class="common-page">
        <nav class="common-page-top">
            <top-bar :back="true" title="客户详情"></top-bar>
        </nav>
        <main class="common-page-container" :style="{ height: canEdit ? pageMiddleWithButtonHeight : pageContainerHeight }">
            <div class="info">
                <div class="info-top">
                    <van-image class="avatar" round width="60px" height="60px" fit="cover" :src="baseInfo.avatar || $baseImgUrl + '/default-avatar.png'" />
                    <div class="info-right">
                        <div class="line">
                            <span class="name van-ellipsis">{{ baseInfo.name }}</span>
                        </div>
                        <div v-if="baseInfo.tel" class="tel">
                            <span class="iconfont icondianhua" @click="handleCall"></span>
                            <span class="customer-tel" @click="handleCall">{{ baseInfo.tel | hidePhone(canEdit, 'ST.CUSTOMER.BUTTON.SHOWTEL') }}</span>
                            <span class="copy" @click="copy(baseInfo.tel)">复制</span>
                        </div>
                    </div>
                </div>
                <div class="info-bottom">
                    <div class="info-item">
                        <span class="label">创建时间：</span>
                        {{ baseInfo.createAt }}
                    </div>
                    <!-- <div class="info-item">
                        <span class="label">浏览次数：</span>
                        5次
                    </div> -->
                </div>
            </div>
            <div class="split"></div>
            <van-tabs v-model="tabIndex" class="no-tab">
                <van-tab title="时间轴">
                    <CustomerTimeline :data="timelineData" />
                </van-tab>
            </van-tabs>
        </main>
        <footer v-if="canEdit">
            <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
                <van-button round block type="save" @click.stop="caseRegistration()">{{ isCase ? '销售登记' : '报备客户' }}</van-button>
            </div>
        </footer>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import CustomerTimeline from '@/components/CustomerTimeline'
import API from '@/request/api/caseSystem/customer'
export default {
    name: 'Customer',
    components: {
        TopBar,
        CustomerTimeline
    },
    data() {
        return {
            tabIndex: 0,
            baseInfo: {},
            canEdit: false,
            // 是否展示手机号
            isShowPhone: false,
            timelineData: [],
            isCase: true
        }
    },
    computed: {
        ...mapGetters(['device', 'codes'])
    },
    async created() {
        this.isCase = this.$route.query.from === 'ZT' ? false : true
        this.canEdit = this.$route.query.canEdit === 'true' ? true : false
        this.getCustomerDetail()
    },
    methods: {
        // 获取客户详情
        async getCustomerDetail() {
            var param = {
                id: this.$route.query.id,
                type: Number(this.$route.query.type)
            }
            this.baseInfo = await API.getPhoneUserDetail(param)
            if (!this.baseInfo.canRegister) {
                this.canEdit = false
            }
            if (!this.baseInfo.name) {
                this.baseInfo.name = '未知'
            }
            this.getTimeline()
            this.isShowPhone = this.canEdit || this.codes.includes('ST.CUSTOMER.BUTTON.SHOWTEL')
        },
        // 跳转销售登记
        caseRegistration() {
            this.$router
                .push({
                    path: this.isCase ? '/case/callEnter' : '/extension/customer/recommend',
                    query: {
                        fromType: 'took',
                        data: {
                            name: this.baseInfo.name,
                            tel: this.baseInfo.tel,
                            type: this.baseInfo.obtainCustomerType,
                            typeName: this.baseInfo.obtainCustomerTypeName,
                            id: this.baseInfo.id
                        }
                    }
                })
                .catch(() => {})
        },
        // 复制
        copy(text) {
            const el = document.createElement('textarea')
            if (!this.isShowPhone) {
                el.value = this.$utils.hidePhone(text)
            } else {
                el.value = text
            }
            el.setAttribute('readonly', '')
            el.style.position = 'absolute'
            el.style.left = '-9999px'
            document.body.appendChild(el)
            const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            if (selected) {
                document.getSelection().removeAllRanges()
                document.getSelection().addRange(selected)
            }
            this.$toast('复制成功')
        },
        //电话
        async handleCall() {
            let tel = this.baseInfo.tel
            if (!this.isShowPhone) {
                tel = this.$utils.hidePhone(this.baseInfo.tel)
            }
            this.$appMethods.SendPhone(this.device, tel)
        },
        // 时间轴
        async getTimeline() {
            let params = {
                userId: this.$route.query.customerId
            }
            const result = await API.getCustomerWxOptLog(params)
            this.timelineData = result
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    .common-page-container {
        .info {
            padding: 0 15px;
            .info-top {
                display: flex;
                justify-content: space-between;
            }
            .info-right {
                margin-left: 12px;
                flex: 1;
                .line {
                    display: flex;
                    align-items: center;
                    margin-bottom: 4px;
                    .name {
                        line-height: 32px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 600;
                        color: #333333;
                        margin-right: 8px;
                        font-size: 21px;
                    }
                    .tag-item {
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
                .tel {
                    display: flex;
                    align-items: center;
                    .iconfont {
                        color: @theme-color;
                        font-size: 16px;
                        margin-right: 4px;
                    }
                    .customer-tel {
                        color: @theme-color;
                        font-size: 18px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                    }
                    .copy {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid #e0e0e0;
                        margin-left: 10px;
                        border-radius: 4px;
                        width: 40px;
                        height: 24px;
                        font-size: 12px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #333333;
                        line-height: 12px;
                    }
                }
            }
            .info-bottom {
                margin-top: 11px;
                margin-bottom: 3px;
                display: flex;
                .info-item {
                    &:nth-of-type(odd) {
                        margin-right: 63px;
                    }
                }
            }
            .info-item {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                font-size: 13px;
                line-height: 13px;
                color: #333;
                .label {
                    font-size: 13px;
                    line-height: 13px;
                    color: #999;
                }
            }
        }
        .split {
            height: 10px;
            background: #f0f4fa;
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
}
</style>
