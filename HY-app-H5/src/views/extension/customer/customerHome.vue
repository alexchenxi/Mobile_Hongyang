<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :title="title"></top-bar>
        </div>
         <div class="multiple-filter" v-if="$route.query.type==='report'">
                        <Calendar ref="calendar" :disabled='true' />
                    </div>
        <div class="common-page-middle" :style="{ height: $route.query.type==='report'?pageMiddleHeight:pageContainerHeight }">
            <div class="main-container">
                <div class="customer-section">

                    <van-list ref="customerList" v-model="loading" offset="10" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
                        <!-- <div v-if="total > 0" class="customer-total">共<span class="text-strong">{{total}}</span>个客户</div> -->
                        <CustomerSection
                            :list="customerList"
                             @goDetail="goCustomerDetail"
                        />
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import CustomerSection from '@/components/ExtensionCustomer'
import API from '@/request/api/selfExtension/report'
import Calendar from '@/components/InitCalendar'
import { commonMethods } from 'movit-utils'
 import { getConfig} from '@/config/extensionCustomerConfig'
export default {
    name: 'CustomerReport',
    components: {
        TopBar,
        CustomerSection,
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
            refresh: false,
            list: [],
            total: 0,
            currentConfig:{},
            filterDate:[],
            // urlMap: {
            //     'ZT.REPORT.TJ': 'getReportCust',
            //     'ZT.REPORT.SF': 'getReportCust',
            //     'ZT.REPORT.FF': 'getReportCust',
            // },
            reqUrl: '',
            title:''
        }
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'keepAliveList', 'currentRole', 'device'])
    },
    activated() {
        if (this.refresh) {
            this.init()
            this.refresh = false
        }
    },
    created(){
        this.currentConfig =JSON.parse(JSON.stringify(getConfig(this.$route.query.menuId)))
        // this.reqUrl = this.urlMap[this.$route.query.menuId]
         if(this.$route.query.title){
             this.title=this.$route.query.title
         }else{
             this.title=this.currentConfig.name
         }


    },
    mounted() {
        this.init()
        if(this.$route.query.type!=='report') return
        let date = new Date()
        let now=commonMethods.DateToString(date)
        if(this.$route.query.dateType==='1'){
            this.$refs.calendar.setDate([now,now])
            return
        }
        if(this.$route.query.dateType==='3'){
            const init=new Date()
            init.setDate(1)
            let now=commonMethods.DateToString(new Date())
            this.$refs.calendar.setDate([commonMethods.DateToString(init), now])
            return
        }
        if(this.$route.query.dateType==='2'){
            const week = new Date().getDay() === 0 ? 7 : new Date().getDay()
            const init=new Date()
            init.setDate(init.getDate()-week+1)
            let now=commonMethods.DateToString(new Date())
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
            this.getCustomerList(this.reqUrl)
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getCustomerList(this.reqUrl)
        },
       //获取客户列表
        async getCustomerList(url) {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }
            delete this.$route.query.title
            Object.assign(params, this.$route.query)
            const menuIdList = ['ZT.REPORT.SF','ZT.REPORT.FF']
            if (menuIdList.includes(params.menuId)) {
                params.menuId = 'ZT.REPORT.DF'
                delete params.type
            }
            this.loading = true
            this.finished = false
            try {
                let result = null
                result = await API['getReportCust'](params)
                result.list.map(item => {
                        item.codeType = this.$route.query.menuId
                        item.customerName = item.customerName || '未知'
                        item.viewUserName = item.viewUserName || '未知'
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
        goCustomerDetail(item){
             this.$router
                .push({
                    path: '/extension/customerDetail',
                    query: {
                        oppId: item.oppId,
                        clueId: item.clueId,
                        canEdit: item.canEdit,
                        // 只有已报备的客户才可以在详情修改姓名及备注
                        editCustomerName: item.canEdit && item.clueStatus === 10 && item.avaStatus === 1 ? 1 : 0
                    }
                })
                .catch(() => {})
        }

    }
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
