<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar  :title="title"></top-bar>
        </div>
         <div class="multiple-filter">
                        <Calendar ref="calendar" :disabled="true" />
                    </div>
        <div class="common-page-middle" :style="{ height: pageMiddleHeight }">
            <div class="main-container">
                <div class="customer-section">

                    <van-list ref="customerList" v-model="loading" offset="20" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
                        <!-- <div v-if="total > 0" class="customer-total">共<span class="text-strong">{{total}}</span>个客户</div> -->
                         <CaseCustomer  :list="customerList"  @goDetail="goDetail" />
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import CaseCustomer from '@/components/CaseCustomer'
import API from '@/request/api/caseSystem/customer'
import Calendar from '@/components/InitCalendar'
import { commonMethods } from 'movit-utils'
export default {
    name: 'CustomerReportVisit',
    components: {
        TopBar,
        CaseCustomer,
        Calendar
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
            title:''

        }
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'keepAliveList', 'currentRole', 'device'])
    },
    mounted() {
        this.init()
        const titleArray=['首访量','复访量', '报备量', '到访量']
        this.title=this.$route.query.visitType?titleArray[this.$route.query.visitType]:'总到访量'
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
         if(this.$route.query.dateType==='4'){
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
            this.caseUrlReq()
        },
        //客户详情
        goDetail(item) {
            if (item.oppId) {
                this.$router
                    .push({
                        path: '/case/customerDetail',
                        query: {
                            oppId: item.oppId,
                            clientId: item.clientId,
                            clueId: item.clueId,
                            menuId: item.menuId
                        }
                    })
                    .catch(() => {
                    })
            } else {
                this.$router
                    .push({
                        path: '/case/customerCaseRegisterDetail',
                        query: {
                            oppId: item.oppId,
                            clientId: item.clientId,
                            clueId: item.clueId,
                            menuId: 'ST.CUSTOMER.INPUT'
                        }
                    })
                    .catch(() => {
                    })
            }
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.caseUrlReq()
        },
        caseUrlReq(){
            if (this.$route.query.visitType === '2') {
                this.getReportCustomerList()
            }else if (this.$route.query.channel2Code) {
                // 渠道占比-到访
                this.getCustomerList('getChannelVisitDetail')
            }else if (this.$route.query.staffId) {
                // 销售报表-置业顾问转化率排名
                this.getCustomerList('getVisitDetailByStaff')
            }else {
                this.getCustomerList('getRankVisitList')
            }
        },
        async getReportCustomerList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }
            Object.assign(params, this.$route.query)
            this.loading = true
            this.finished = false
            try {
                let result = null
                result = await API.getRankReportList(params)
                result.list.map(item => {
                    item.codeType = 'ZT.RANK.GROUP.BB'
                    item.menuId = 'ZT.RANK.GROUP.BB'
                })
                this.customerList = this.customerList.concat(result.list)
                this.total = result.total
                if (this.customerList.length === this.total) {
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
        //获取客户列表
        async getCustomerList(url) {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }
            Object.assign(params, this.$route.query)
            // delete params.visitType
            this.loading = true
            this.finished = false
            try {
                let result = null
                // result = await API.getRankVisitList(params)
                result = await API[url](params)
                result.list.map(item => {
                    item.codeType = 'ZT.RANK.VISIT'
                    item.menuId = 'ZT.RANK.VISIT'
                    item.visitType=item.visitType==='2'?'首访':''
                })
                this.customerList = this.customerList.concat(result.list)
                this.total = result.total
                if (result.isLastPage || !result?.list.length) {
                     this.finished = true
                } else {
                     this.finished = false
                }

                this.loading = false
            } catch (err) {
                this.loading = false
                this.finished = true
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('CustomerReportVisit') === -1) {
                array.push('CustomerReportVisit')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList || []
        if (!to.path.includes('/case/customerDetail')) {
            array = array.filter((item) => {
                return item !== 'CustomerReportVisit'
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
        height: 64px;
        /deep/ .tab-bar {
            width: 100%;
        }
    }
}
</style>
