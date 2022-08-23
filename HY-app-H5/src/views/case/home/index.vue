<template>
    <div class="common-page ">
        <TopBar :back="false">
            <div slot="append-prefix">
                <ProjectSelection :data="projetcArray" />
            </div>
            <div
                slot="append-suffix"
                style="display: flex; align-items: center"
            >
        <span
            v-code="['ST.HOME.BUTTON', 'ST.HOME.BUTTON.SCAN']"
            class="iconfont iconsaoyisao"
            @click="scanCode"
        />
                <van-icon
                    size="20"
                    name="chat-o"
                    style="font-weight: bold; margin-left: 30px"
                    @click="justInfoDetail"
                    :dot="messageNum>0"
                ></van-icon>
            </div>
        </TopBar>
        <main
            class="common-page-middle"
            :style="{ height: pageMiddleHeight }"
        >
            <div class="middle-section">
                <search-bar
                    placeholder="请输入客户姓名/手机号"
                    readonly
                    @focus="goUrl"
                />
            </div>
            <div class="split" />
            <template v-for="item in menuActive.childrenList">
                <div
                    v-if="item.code === 'ST.HOME.BILLINGTIP' && billingTipCount"
                    class="middle-section billing-tip"
                >
                    <img
                        class="tip-icon"
                        :src="$baseImgUrl + '/case/home/notification-icon.png'"
                        alt=""
                    >{{ billingTipCount }}
                </div>
                <div
                    v-if="item.code === 'ST.HOME.DATASUMMARY' && currentRole.roleCode !== 'ST_SALES'"
                    :key="item.code"
                    class="middle-section"
                >
                    <DataStatistics ref="dataStatistics" @goDetail="goFirstOrVisit"/>
                </div>
                <div
                    v-if="item.code === 'ST.HOME.DATASUMMARY' && currentRole.roleCode === 'ST_SALES'"
                    :key="item.code"
                    class="middle-section"
                >
                    <DataStatisticsSales />
                </div>
                <div
                    v-if="item.code === 'ST.HOME.ALERT'"
                    :key="item.code"
                    class="full-section"
                >
                    <ReceptionCentre />
                </div>
                <div
                    v-if="item.code === 'ST.HOME.FOLLOWALERT' && item.childrenList.length > 0"
                    :key="item.code"
                    class="middle-section"
                >
                    <RemindStatistics
                        :title="item.name"
                        :icon="item.checkedIconName"
                        :data="item.childrenList"
                    />
                </div>
                <div
                    v-if="item.code === 'ST.HOME.DAILYTIP' && item.childrenList.length > 0"
                    :key="item.code"
                    class="middle-section"
                >
                    <RemindStatistics
                        :title="item.name"
                        :icon="item.checkedIconName"
                        :data="item.childrenList"
                    />
                </div>
                <!--  日常管理              -->
                <div
                    v-if="item.code === 'ST.HOME.DAILYMANAGEMEN'"
                    :key="item.code"
                    class="middle-section"
                >
                    <div class="common-title">
                        <div class="left">
                            <img
                                class="icon"
                                :src="$baseImgUrl + '/case/home/' + item.uncheckedIconName"
                            >{{ item.name }}
                        </div>
                    </div>
                    <DailyManagement
                        :key="item.code"
                        :list="dailyManagementList"
                        @clickInfo="toTaskPage"
                    />
                </div>
                <div
                    v-if="item.code === 'ST.HOME.OVERALERT' && item.childrenList.length > 0"
                    :key="item.code"
                    class="middle-section"
                >
                    <RemindStatistics
                        :title="item.name"
                        :needbg="true"
                        :icon="item.checkedIconName"
                        :data="item.childrenList"
                    />
                </div>
                <div
                    v-if="item.code === 'ST.HOME.ACQK' && item.childrenList.length > 0"
                    :key="item.code"
                    class="middle-section"
                >
                    <RemindStatistics
                        :title="item.name"
                        :needbg="true"
                        :icon="item.checkedIconName"
                        :data="item.childrenList"
                    />
                </div>
                <div
                    v-if="item.code === 'ST.HOME.TOKER'"
                    :key="item.code"
                    class="middle-section"
                >
                    <MarketingExtension code="ST" />
                </div>
            </template>
            <div style="height: 40px"></div>
        </main>
        <tab-bar
            active="/case/home"
            :tab-data="tabData"
        />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ProjectSelection from '@/components/ProjectSelection'
import DataStatistics from '@/views/case/home/components/DataStatistics'
import DataStatisticsSales from '@/views/case/home/components/DataStatisticsSales'
import ReceptionCentre from '@/views/case/home/components/ReceptionCentre'
import RemindStatistics from '@/views/case/home/components/RemindStatistics'
import DailyManagement from '@/views/case/home/components/DailyManagement'
import MarketingExtension from '@/views/common/onlineMarketing/components/MarketingExtension'
import TopBar from '@c/TopBar'
import TabBar from '@c/TabBar'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/caseSystem/home'
import MYAPI from '@/request/api/my.js'
import CommonApi from '@/request/api/commonApi'
export default {
    name: 'Index',
    components: {
        ProjectSelection,
        DataStatistics,
        DataStatisticsSales,
        ReceptionCentre,
        RemindStatistics,
        MarketingExtension,
        DailyManagement,
        TabBar,
        TopBar,
        SearchBar
    },
    data() {
        return {
            projetcArray: [],
            dailyManagementList: [
                // {
                //     code: '1',
                //     name: '指标管理',
                //     describe: '实时监测数据',
                //     checkedIconName: 'icon-target.png',
                // },
                {
                    code: '2',
                    name: '分配客户',
                    describe: '合理促达成',
                    checkedIconName: 'icon-distribute.png',
                },
            ],
            billingTipCount: '',
            menuIdMap: {
                'firstVisitCount': 'AC.STAT.SFL',
                'repeatedVisitCount': 'AC.STAT.FFL',
                'subscribeCount': 'STATISTICS.TRADE.RG',
                'signCount': 'STATISTICS.TRADE.QY',
                'subscribeMoney': 'STATISTICS.TRADE.RG',
                'signCountMoney': 'STATISTICS.TRADE.QY'
            },
            messageNum:0
        }
    },
    computed: { ...mapGetters(['tabData', 'menuActive', 'projectId', 'user', 'device', 'currentRole','keepAliveList']) },
    watch: {
        projectId() {
            if (!this.projectId) return
            this.getData()
        }
    },
    created() {
        if (!this.projectId) return
        if (!this.menuActive.url.includes('/case/home')) {
            this.$store.dispatch(
                'menu/setTabActice',
                this.tabData.find(x => x.url === '/case/home')
            )
        }
        this.getMessageCount()
        this.getData()
    },
    mounted() {
        this.$el.style.setProperty('@theme-color', 'red')
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('Index') === -1) {
                array.push('Index')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList||[]
        if (!to.path.includes('/case/storageOrderOrSignDetail') &&
            !to.path.includes('/case/homeFirstOrVisit') &&
            !to.path.includes('/case/customerMemberHome')
        ) {
            array = array.filter(item => {
                return item !== 'Index'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    },
    methods: {
        getMessageCount(){
            MYAPI.messageNum().then(res => {
                this.messageNum = res
            })
        },
        // 日常管理跳转
        toTaskPage(info) {
            if (info.code === '2') {
                this.$router.push({
                    path: '/case/assignCustomer',
                    query: {}
                }).catch(()=>{})
                return
            }
            this.$toast('敬请期待')
        },
        goUrl() {
            this.$store.dispatch('other/setSearchCustomerListType', 'customer')
            this.$store.dispatch('other/setSearchCustomerType', '')
            this.$router.push({
                path: '/searchHistory',
                query: {
                    type: 0
                }
            })
        },
        async getData() {
            // 获取跟进提醒、逾期提醒统计数据
            let followData, dailyTipData, overdueData, anChangCondition
            for (let elem of this.menuActive.childrenList) {
                let codes = elem.childrenList.map(x => x.code)
                if (elem.code === 'ST.HOME.FOLLOWALERT') {
                    followData = await this.followingApi(codes)
                }
                if (elem.code === 'ST.HOME.DAILYTIP') {
                    dailyTipData = await this.followingApi(codes)
                }
                if (elem.code === 'ST.HOME.OVERALERT') {
                    overdueData = await this.overdueApi(codes)
                }
                if (elem.code === 'ST.HOME.ACQK') {
                    anChangCondition = await this.anChangCondition(codes)
                }
                if (elem.code === 'ST.HOME.BILLINGTIP') {
                    this.billingTipCount = await this.getBillingTipCount(this.projectId)
                }
            }
            // 跟进提醒、逾期提醒统计数据与菜单关联
            for (let elem of this.menuActive.childrenList) {
                for (let child of elem.childrenList) {
                    if (elem.code === 'ST.HOME.FOLLOWALERT') {
                        this.$set(child, 'history', followData[child.code].history)
                        this.$set(child, 'today', followData[child.code].today)
                        this.$set(child, 'dataType', followData[child.code].dataType)
                    }
                    if (elem.code === 'ST.HOME.DAILYTIP') {
                        this.$set(child, 'history', dailyTipData[child.code].history)
                        this.$set(child, 'today', dailyTipData[child.code].today)
                        this.$set(child, 'dataType', dailyTipData[child.code].dataType)
                    }
                    if (elem.code === 'ST.HOME.OVERALERT') {
                        this.$set(child, 'history', overdueData[child.code].history)
                        this.$set(child, 'today', overdueData[child.code].today)
                        this.$set(child, 'dataType', overdueData[child.code].dataType)
                    }
                    if (elem.code === 'ST.HOME.ACQK') {
                        this.$set(child, 'today', anChangCondition[child.code]?.today)
                    }
                }
            }
        },
        // 获取跟进提醒数据
        async followingApi(menuIds) {
            // this.$utils.loading()
            return API.followingApi({
                projectId: this.projectId,
                menuIds: menuIds,
                roleCode: this.currentRole.roleCode
            }).then(res => {
                this.$toast.clear()
                return res
            })
        },
        // 获取逾期提醒数据
        async overdueApi(menuIds) {
            // this.$utils.loading()
            return API.overdueApi({
                projectId: this.projectId,
                menuIds: menuIds,
                roleCode: this.currentRole.roleCode
            }).then(res => {
                this.$toast.clear()
                return res
            })
        },
        // 获取案场情况数据
        async anChangCondition(menuIds) {
            this.$utils.loading()
            return API.anChangCondition({
                projectId: this.projectId,
                menuId: menuIds[0],
                roleCode: this.currentRole.roleCode
            }).then(res => {
                this.$toast.clear()
                return res
            })
        },
        async getBillingTipCount(projectId) {
            this.$utils.loading()
            return API.getOpenBillNotice(projectId).then(res => {
                this.$toast.clear()
                return res
            })
        },
        scanCode() {
            this.$appMethods.ScanCode(this.device).then(res => {
                console.log(res)
                CommonApi.qrcodeApi({
                    qrcode: res,
                    projectId: this.projectId
                }).then(() => {
                    this.$toast('签到成功')
                })
            })
        },
        justInfoDetail() {
            this.$router.push({
                path: '/my/infoList',
            })
        },
        // 看板数据穿透
        goFirstOrVisit(item) {
            // if (item.value === 0 ) return
            const typeList = ['firstVisitCount', 'repeatedVisitCount']
            if (typeList.includes(item.type)) {
                const params = {
                    projectId: this.projectId,
                    roleCode: this.currentRole.roleCode,
                    dateType: item.dateType,
                    menuId: this.menuIdMap[item.type]
                }
                if (item.beginDate && item.endDate) {
                    params.beginDate = item.beginDate
                    params.endDate = item.endDate
                }
                this.$router.push({
                    path: '/case/homeFirstOrVisit',
                    query: params,
                }).catch(()=>{})
            }else {
                const params = {
                    projectId: this.projectId,
                    roleCode: this.currentRole.roleCode,
                    dateType: item.dateType,
                    menuId: this.menuIdMap[item.type]
                }
                if (item.beginDate && item.endDate) {
                    params.beginDate = item.beginDate
                    params.endDate = item.endDate
                }

                this.$router.push({
                    path: '/case/storageOrderOrSignDetail',
                    query: params,
                }).catch(()=>{})
            }
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .iconsaoyisao {
            padding: 8px 0 8px 8px;
            font-size: 18px;
        }
    }
    .search {
        margin: 8px 0 0;
        height: 40px;
        background: @theme-color;
        border-radius: 20px;
        line-height: 40px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;
        .iconsousuo {
            margin: 0 6.5px 0 12px;
            color: #cccccc;
        }
    }
    .split {
        width: 100%;
        height: 10px;
    }
    .billing-tip {
        margin: 10px 0 20px;
        color: #ff7575;
        display: flex;
        align-items: center;
        .tip-icon {
            height: 16px;
            margin-right: 7px;
        }
    }
    .common-title {
        padding: 15px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
        }
        .icon {
            width: 18px;
            height: 18px;
            margin-right: 6px;
        }
    }
    .common-page-middle {
        background: linear-gradient(180deg, #ffffff 0%, #fafbfc 42%, #f6f8fa 100%);
        // padding: 0 15px;
        .middle-section {
            padding: 0 15px;
        }
        .middle-section:last-child {
            .container {
                margin-bottom: 15px;
            }
        }
    }
}
</style>
