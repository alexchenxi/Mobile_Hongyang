<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :title="title"></top-bar>
        </div>
        <div class="multiple-filter">
            <Calendar ref="calendar" :disabled="true" />
        </div>
        <div class="search-section">
            <search-bar ref="searchBar" placeholder="请输入客户姓名、手机号码、置业顾问姓名、房间号" @returnSearch="searchData"></search-bar>
        </div>
        <div class="tip" v-if="$route.query.menuId.includes('.RG')">提醒：以下客户已认购，详情请进入ERP系统查看</div>
        <div class="tip" v-if="$route.query.menuId.includes('QY')">提醒：以下客户已签约，详情请进入ERP系统查看</div>
        <div class="common-page-middle" :style="{ height: pageMiddleHeight }">
            <div class="main-container">
                <div class="customer-section">
                    <van-list ref="customerList" v-model="loading" offset="10" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
                        <template v-for="item in customerList">
                            <div class="customer-item" @click="goDetail(item)">
                                <div class="top-title">{{ item.roomStage }}</div>
                                <div class="section-body">
                                    <div class="field-section" style="width: 100%">
                                        <span class="form-content">{{ item.customerName }}</span>
                                        <span style="margin-left: 10px" class="form-content">{{ item.customerTel }}</span>
                                    </div>
                                    <div class="field-section" style="width: 100%">
                                        <div class="label">置业顾问：</div>
                                        <div class="form-content">{{ item.staffName }}</div>
                                    </div>
                                    <div class="field-section common-flex-between">
                                        <div class="common-flex">
                                            <div class="label">成交来源：</div>
                                            <div class="form-content">{{ item.channelSource }}</div>
                                        </div>
                                        <div class="common-flex" v-if="item.area">
                                            <div class="label">建筑面积：</div>
                                            <div class="form-content">{{ item.area }}m³</div>
                                        </div>
                                    </div>
                                    <div class="field-section common-flex-between">
                                        <div class="common-flex">
                                            <div class="label">{{ menuName }}金额：</div>
                                            <div class="form-content">{{ item.formMoney }}元</div>
                                        </div>
                                        <div v-if="item.reportName" class="common-flex" style="max-width: 180px">
                                            <div class="label">报备人：</div>
                                            <div class="form-content common-ellipsis">{{ item.reportName }}</div>
                                        </div>
                                    </div>
                                    <div class="field-section">
                                        <div class="label">{{ menuName }}时间：</div>
                                        <div class="form-content">{{ item.formTime }}</div>
                                    </div>
                                    <div class="common-tag-orange dJstatus">
                                        {{ item.status === '0' ? item.closeReason : item.formStatusStr && `新增${item.formStatusStr}` }}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import API from '@/request/api/caseSystem/customer'
import Calendar from '@/components/InitCalendar'
import { commonMethods } from 'movit-utils'
import { getConfig } from '@/config/extensionCustomerConfig'
import SearchBar from '@c/SearchBar'
export default {
    name: 'StorageOrderOrSignDetail',
    components: {
        TopBar,
        SearchBar,
        Calendar,
    },
    data() {
        return {
            //列表加载
            loading: false,
            finished: false,
            // 客户列表
            customerList: [],
            pageNum: 1,
            pageSize: 10,
            list: [],
            total: 0,
            filterDate: [],
            channelSourcelist: [
                {
                    label: '全民营销',
                    value: 'C01',
                },
                {
                    label: '中介分销',
                    value: 'C02',
                },
                {
                    label: '行销自拓',
                    value: 'C03',
                },
                {
                    label: '销售登记',
                    value: 'C04',
                },
                {
                    label: '自然来访',
                    value: 'C05',
                },
            ],
            title: '',
            searchParam: ''
        }
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'keepAliveList', 'currentRole', 'device']),
        menuName() {
            return this.$route.query.menuId.includes('.RG') ? '认购' : '签约'
        },
    },
    mounted() {
        this.init()

        if (this.$route.query.menuId.includes('.RG')) {
            this.title = '认购'
        } else {
            this.title = '签约'
        }
        let date = new Date()
        let now = commonMethods.DateToString(date)
        if (this.$route.query.dateType === '1') {
            this.$refs.calendar.setDate([now, now])
            return
        }
        if (this.$route.query.dateType === '2') {
            const week = new Date().getDay() === 0 ? 7 : new Date().getDay()
            const init = new Date()
            init.setDate(init.getDate() - week + 1)
            let now = commonMethods.DateToString(new Date())
            this.$refs.calendar.setDate([commonMethods.DateToString(init), now])
            return
        }
        if (this.$route.query.dateType === '3') {
            const init = new Date()
            init.setDate(1)
            let now = commonMethods.DateToString(new Date())
            this.$refs.calendar.setDate([commonMethods.DateToString(init), now])
            return
        }
        if (this.$route.query.dateType === '5') {
            const init = new Date()
            init.setDate(1)
            init.setMonth(0)
            let now = commonMethods.DateToString(new Date())
            this.$refs.calendar.setDate([commonMethods.DateToString(init), now])
            return
        }
        if (this.$route.query.dateType === '4') {
            this.$refs.calendar.setDate([this.$route.query.beginDate, this.$route.query.endDate])
            return
        }
    },
    methods: {
        init() {
            this.customerList = []
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.caseReqUrl()
        },
        searchData(e) {
            this.searchParam = e
            this.init()
        },
        caseReqUrl() {
            // 渠道占比二级渠道认购签约
            if (this.$route.query.channel2Code) {
                if (this.$route.query.menuId === 'ZT.RANK.GROUP.RG') {
                    this.getOrderOrSignCustomerList('getChannelOrderDetail')
                } else {
                    this.getOrderOrSignCustomerList('getChannelContractDetail')
                }
            }else if (this.$route.query.menuId === 'ST.RANK.STAFF.RG' && this.$route.query.staffId) {
                this.getOrderOrSignCustomerList('getOrderDetailByStaff')
            } else if (this.$route.query.menuId.includes('ZT.RANK.GROUP')){
                // 自渠统计团队认购签约
                this.getOrderOrSignCustomerList('getRankGroupOrderDetail')
            }else if (this.$route.query.menuId.includes('STATISTICS.TRADE')){
                // 案场首页数据看板认购签约
                this.getOrderOrSignCustomerList('getHomeStatisticsOrderAndSignDetail')
            }else {
                // 自渠统计人员认购签约
                this.getOrderOrSignCustomerList('getRankStafflOrderDetail')
            }
        },
        //客户详情
        goDetail(item) {
            if (!item.oppId) return
            this.$router
                .push({
                    path: '/case/customerDetail',
                    query: {
                        oppId: item.oppId,
                        clientId: item.clientId,
                        clueId: item.clueId,
                        menuId: 'ST.CUSTOMER.TOTAL',
                    },
                })
                .catch(() => {})
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.caseReqUrl()
        },
        // 自渠报表认购,签约量
        async getZtOrderOrSignCustomerList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                searchParam: this.searchParam
            }
            Object.assign(params, this.$route.query)
            this.loading = true
            this.finished = false
            try {
                let result = null
                result = await API.getReportOrderOrSignList(params)

                result.list.map((item) => {
                    item.codeType = this.$route.query.menuId
                    item.menuId = this.$route.query.menuId
                    item.roomStage = item.roomStage + '-' +item.roomBuilding + '-' + item.roomNo
                    item.channelSource = this.channelSourcelist.find((col) => col.value === item.channel1Code)?.label
                    item.formMoney = this.numFormat(item.formMoney)
                })

                this.customerList = this.customerList.concat(result.list)
                if (result.list.length < this.pageSize) {
                    this.finished = true
                } else {
                    this.finished = false
                }
                this.loading = false
            } catch (err) {
                this.loading = false
                this.finished = true
            }
        },
        // 自渠报表签约量
        async getOrderOrSignCustomerList(url) {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                searchParam: this.searchParam
            }
            Object.assign(params, this.$route.query)
            if (params.menuId.includes('ZT.RANK.STAFF')) {
                delete params.groupId
            }
            params.dateType = Number(params.dateType)
            delete params.activeTab
            this.loading = true
            this.finished = false
            try {
                let result = null
                result = await API[url](params)
                result.list.map((item) => {
                    item.codeType = this.$route.query.menuId
                    item.menuId = this.$route.query.menuId
                    item.roomStage = item.roomStage + '-' +item.roomBuilding + '-' + item.roomNo
                    item.channelSource = this.channelSourcelist.find((col) => col.value === item.channel1Code)?.label
                    item.formMoney = this.numFormat(item.formMoney)
                })

                this.customerList = this.customerList.concat(result.list)
                if (result.list.length < this.pageSize) {
                    this.finished = true
                } else {
                    this.finished = false
                }
                this.loading = false
            } catch (err) {
                this.loading = false
                this.finished = true
            }
        },
        // 千分位
        numFormat(val) {
            if (!val) return '0'
            if (val === '--') return val
            return parseFloat(val)
                .toFixed()
                .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('StorageOrderOrSignDetail') === -1) {
                array.push('StorageOrderOrSignDetail')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList || []
        if (!to.path.includes('/case/customerDetail')) {
            array = array.filter((item) => {
                return item !== 'StorageOrderOrSignDetail'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    },
}
</script>

<style scoped lang="less">
.common-page {
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
    .tip {
        padding: 0 14px;
        color: @theme-color;
    }
    .common-page-middle {
        position: relative;
        background: #f0f4fa;
        .main-container {
            height: 100%;
            .search-section {
                position: relative;
                padding: 0 15px;
                background: #ffffff;
            }
            .main-section {
                height: calc(100% - 84px);
                overflow: auto;
                &.assign-container {
                    position: relative;
                    z-index: 21;
                }
            }
            .customer-section {
                position: relative;
                height: calc(100% - 64px);
                &.assign-container {
                    ::v-deep .van-tabs__wrap:after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.2);
                    }
                }
                .customer-item {
                    background: #ffffff;
                    margin-bottom: 6px;
                    padding: 15px;
                    .top-title {
                        .common-flex();
                        flex: 1;
                        font-size: 16px;
                        color: @header-text-color;
                        line-height: 16px;
                        font-weight: 500;
                        margin-right: 8px;
                        padding-bottom: 10px;
                        border-bottom: 1px dotted #eee;
                    }
                    .section-body {
                        position: relative;
                        .common-flex();
                        flex-wrap: wrap;

                        .field-section {
                            width: 100%;
                            .common-flex();
                            align-items: flex-start;
                            font-size: 13px;
                            line-height: 13px;
                            font-weight: 400;
                            margin-top: 12px;
                            //margin-right: 40px;
                        }
                        .label {
                            color: #999999;
                            flex-shrink: 0;
                        }

                        .field-content {
                            color: @header-text-color;
                            word-break: break-all;

                            .unit {
                                font-size: 13px;
                                color: #999999;
                                margin-left: 2px;
                            }
                        }
                        .dJstatus {
                            position: absolute;
                            padding: 2px 4px;
                            top: 32px;
                            right: 40px;
                            font-size: 12px;
                        }
                    }
                }
            }
            .active-filter {
                ::v-deep .van-dropdown-menu__title {
                    color: @theme-color;
                }
            }
            /deep/ .van-tabs {
                height: 100%;
                .van-tabs__content {
                    height: calc(100% - 44px);
                    .van-tab__pane {
                        height: 100%;
                    }
                }
            }
        }
    }
    .call-enter {
        position: fixed;
        right: 15px;
        bottom: calc(30px + @tab-bar-height);
        width: 74px;
        height: 74px;
        z-index: 3;
        img {
            width: 100%;
        }
    }
    .customer-total {
        font-size: 12px;
        color: #999999;
        font-weight: 400;
        padding-top: 15px;
        .text-strong {
            font-size: 15px;
            color: @theme-color;
            padding: 0 5px;
        }
    }
    .multiple-filter {
        background: #fff;
        height: 34px;
        /deep/ .tab-bar {
            width: 100%;
        }
    }
}
</style>
