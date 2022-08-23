<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar title="选择自渠人员"></top-bar>
        </div>
        <div class="common-page-middle" :style="{ height: pageMiddleWithButtonHeight }">
            <van-empty v-if="!dataList.length && isFinished" class="custom-image" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
            <div class="main-container">
                <van-checkbox-group v-model="checkData" :disabled="flag">
                    <van-collapse v-model="activeNames" accordion :border="false">
                        <van-collapse-item v-for="item in dataList" :key="item.groupId" :border="false" title="团队A" :name="item.groupId">
                            <div slot="title">{{ item.groupName + ' ' + '(' + item.members.length + ')' }}</div>
                            <van-checkbox v-for="member in item.members" :key="member.userId" :name="member.userId">
                                <span class="member-name">{{ member.userName }}</span>
                                <span class="customer-num" v-if="type !== '4'">
                                    共
                                    <span class="num-text">{{ member.customerCount }}</span>
                                    位{{ type === '0' ? '客户' : '自渠下线经纪人' }}
                                </span>
                            </van-checkbox>
                        </van-collapse-item>
                    </van-collapse>
                </van-checkbox-group>
            </div>
        </div>
        <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" native-type="submit" :disabled="flag" @click="handleConfirmSelect">确定分配</van-button>
        </div>
        <van-popup v-model="showLoadingPop" :overlay="false">
            <div class="popup-container">
                <van-circle v-model="currentRate" size="60" stroke-width="80" layer-color="rgba(255,255,255,0.19)" :color="gradientColor" :rate="rate" :speed="speed" :text="text" />
                <div class="loading-text">{{ circleText }}</div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import API from '@/request/api/selfExtension/customer'
export default {
    name: 'CustChooseConsultant',
    components: {
        TopBar
    },
    data() {
        return {
            activeNames: [],
            dataList: [],
            checkData: [],
            isFinished: false,
            showLoadingPop: false,
            currentRate: 0,
            gradientColor: {
                '0%': '#88D561',
                '100%': '#47CFAE'
            },
            rate: 90,
            speed: 80,
            circleText: '分配中',
            flag: false,
            type: 0
        }
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'checkedCustomerList', 'currentRole']),
        text() {
            return this.currentRate.toFixed(0) + '%'
        }
    },
    created() {},
    mounted() {
        this.type = this.$route.query.type
        this.searchKey = this.$route.query.searchKey
        this.transferList = this.$route.query.transferList
        this.statusList = this.$route.query.statusList
        this.initData()
    },
    methods: {
        async handleConfirmSelect() {
            if (this.flag) {
                return
            }
            if (!this.checkData.length) {
                this.$toast('请选择渠道人员')
            } else {
                let params = {}
                params.projectId = this.projectId
                if(this.type==='0'){
                   params.clientAssignType = 7
                }

                params.clueIds = this.checkedCustomerList
                params.transferList = this.transferList
                params.staffIds = this.checkData
                params.nameOrTel = this.searchKey || ''
                params.statusList = this.statusList || []
                this.flag = true
                const array=['assignCustomer','selfChannelAssignCustomer']
                try {
                    this.showLoadingPop=true
                    let result = await API[array[this.type]](params)
                    if (result) {
                        this.speed = 100
                        this.rate = 100
                        this.circleText = '分配成功'
                        setTimeout(() => {
                            this.$store.dispatch('other/setCheckedCustomer', [])
                            this.$router.go(-1)
                            this.flag = false
                        }, 1000)
                    } else {
                        this.showLoadingPop = false
                        this.$toast('分配失败')
                    }
                } catch {
                    this.showLoadingPop = false
                    this.flag = false
                }
            }
        },
        initData() {
            this.selfChannelMemberList()
        },
        async selfChannelMemberList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                isChildBroker: this.type === '1' ? '1' : ''
            }
            this.$utils.loading()
            this.isFinished = false
            let result = await API.selfChannelMemberList(params)
            this.isFinished = true

            if (result.length > 0) {
                this.activeNames = result[0].groupId
                result.forEach(item => {
                    item.members = item.members.filter(child => child.status > 0)
                })
                this.dataList = result
            }
            this.$toast.clear()
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    /deep/ .head-l {
        position: relative;
        z-index: 2;
    }
    /deep/ .head-c {
        position: absolute;
        width: 100%;
        z-index: 1;
    }
    .common-page-top {
        background: #ffffff;
        .assign-customers {
            position: absolute;
            right: 0;
            font-size: 15px;
            color: #333333;
            font-weight: 500;
        }
        .assign-customers-action {
            font-size: 15px;
            color: @theme-color;
            font-weight: 500;
        }
    }
    .common-page-middle {
        position: relative;
        background: #f0f4fa;
        .main-container {
            // padding: 10px 15px 0;
            ::v-deep .van-collapse-item {
                margin-bottom: 10px;
                .van-cell {
                    // border-radius: 4px;
                    .common-flex();
                    font-size: 16px;
                    line-height: 16px;
                    font-weight: 500;
                    color: @header-text-color;
                    padding: 16px 15px;
                    &.van-collapse-item__title--expanded {
                        border-radius: 4px 4px 0 0;
                    }
                }
                .van-collapse-item__wrapper {
                    border-top: 1px solid #f4f4f4;
                    border-radius: 0 0 4px 4px;
                    .van-collapse-item__content {
                        padding: 0;
                    }
                    .van-checkbox {
                        .common-flex();
                        height: 56px;
                        border-bottom: 1px solid #f4f4f4;
                        padding: 0 15px;
                        &:last-child {
                            border-bottom: none;
                        }
                        .van-checkbox__label {
                            .common-flex();
                            margin-left: 15px;
                            .member-name {
                                display: inline-block;
                                min-width: 72px;
                                font-size: 16px;
                                color: #333333;
                                font-weight: 500;
                            }
                            .customer-num {
                                font-size: 12px;
                                color: #999999;
                                .num-text {
                                    color: @theme-color;
                                    padding: 0 4px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .footer-bar {
        .common-flex-center();
        height: @tab-bar-height;
        padding: 0 15px;
    }
}
.popup-container {
    .common-flex-center();
    flex-direction: column;
    width: 120px;
    height: 120px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.5);
    .loading-text {
        font-size: 14px;
        color: #ffffff;
        opacity: 0.7;
        line-height: 14px;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        margin-top: 10px;
    }
    /deep/ .van-circle__text {
        color: #47cfae;
    }
}
.van-popup {
    background: none;
}
</style>
