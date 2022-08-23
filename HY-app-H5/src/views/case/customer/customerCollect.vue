<!-- 收藏客户列表-->
<template>
    <div class="common-page">
        <TopBar :title="title">
            <template slot="append-suffix">
                <span @click="handleSearch" class="iconfont iconsousuo"></span>
                <div v-if="currentRole.roleCode !== 'ST_SALES'" style="margin-left: 20px">
                    <FilterSection ref="filterSection" :filter-list="currentConfig.filterList" container=".customer-container" @change="handleFilter" />
                </div>
            </template>
        </TopBar>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <section class="customer-container">
                <van-tabs v-model="activeTab" @change="changeTab" animated :before-change="beforeChangeTabs" :class="isShowRegisterCustomer ? '' : 'no-tab'">
                    <van-tab v-for="tab in tabList" :key="tab.value" :title="tab.name" :name="tab.value">
                        <section class="filter-container" v-if="currentRole.roleCode === 'ST_SALES'">
                            <div class="left-section">
                                <van-dropdown-menu active-color="#DB0826">
                                    <van-dropdown-item ref="filter" v-model="orderBy" :options="sortOptions" @change="changeOrder" get-container="body"></van-dropdown-item>
                                </van-dropdown-menu>
                            </div>
                            <div class="right-section">
                                <div class="filter-section">
                                    <FilterSection ref="filterSection" :filter-list="currentConfig.filterList" container=".customer-container" @change="handleFilter" />
                                </div>
                            </div>
                        </section>
                        <div class="common-total-style">共<span class="num">{{total}}</span>客户</div>
                       <van-list :style="currentRole.roleCode === 'ST_SALES'?'height: calc(100% - 80px)':''" v-model="loading" :finished="finished" :finished-text="finishedText" offset="20" :immediate-check="false" @load="onLoad">
                            <CaseCustomer v-if="currentRole.roleCode === 'ST_SALES'" :list="customerList" @collect="handleCollect" @goDetail="goDetail" />
                            <van-collapse v-else v-model="activeNames" :border="false" @change="changeCollapse">
                                <van-collapse-item v-for="(item,index) in subsalesList" :key="item.userId" :name="item.userId" :border="true">
                                    <template #title>
                                        <div class="common-collapse-title">{{ item.userName }}（{{ item.customerCount }}）</div>
                                    </template>
                                    <CaseCustomer :key="item.userId" :list="item.customerList" @collect="handleCollect" @goDetail="goDetail" />
                                     <div v-if="item.isShowMoreBtn" class="more-btn-wrap">
                                        <div class="more-btn" @click="showMoreClint(index,item.userId)">
                                            查看更多
                                            <van-icon class="icon-arrow" name="arrow-down" />
                                        </div>
                                    </div>
                                </van-collapse-item>
                            </van-collapse>
                        </van-list>
                    </van-tab>
                </van-tabs>
            </section>
        </main>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import FilterSection from '@c/FilterSection'
import CaseCustomer from '@c/CaseCustomer'
import API from '@/request/api/caseSystem/customer'
import { getConfig, getSortOptions, getTabList } from '@/config/caseCustomerConfig'
import MyAPI from '@/request/api/my'

export default {
    name: 'customerCollect',
    components: {
        TopBar,
        FilterSection,
        CaseCustomer
    },
    data() {
        return {
            currentConfig: {},
            sortOptions: [],
            orderBy: 1,
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            activeTab: '',
            title: '',
            tabList: [],
            pageNum: 1,
            pageSize: 10,
            filterValue: {},
            customerList: [],
            activeNames:[],
            subsalesList:[],
            // 是否展示我登记的客户tab
            isShowRegisterCustomer: true,
            refresh:false,
            total:0
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList', 'codes']) },
     beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('customerCollect') === -1) {
                array.push('customerCollect')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/case/customerDetail')||from.path.includes('/case/customerCaseRegisterDetail')) {
                vm.refresh = true
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/case/customerDetail')&&!to.path.includes('/case/customerCaseRegisterDetail')) {
            array = array.filter(item => {
                return item !== 'customerCollect'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    },
    activated() {
        if (this.refresh) {
            this.pageNum = 1
            this.loading = true
            this.customerList = []
            this.subsalesList = []
            this.activeNames = []
            this.getList()
            this.refresh = false
        }
    },
    async created() {
        this.isShowRegisterCustomer = this.codes.includes('ST.CUSTOMER.INPUT')
        const tabData = getTabList(this.$route.query.menuId)
        this.tabList = tabData.tabList
        if (this.currentRole.roleCode === 'ST_MANAGER') {
            this.tabList = tabData.tabList.map(item => {
                return {
                    ...item,
                    name: item.value === 'receiveCustomer' ? '顾问接待的' : '顾问登记的'
                }
            })
        }

        this.title = tabData.name
        this.activeTab = this.tabList[this.isShowRegisterCustomer ? 0 : 1].value
        if (sessionStorage.getItem('customerCollect')) {
            this.activeTab = sessionStorage.getItem('customerCollect')
            sessionStorage.removeItem('customerCollect')
        }
        this.initConfig()
        this.initParams()
        this.getList()
    },
    methods: {
           // 加载更多客户
        async showMoreClint(index,curUserId) {
            let pageNum=this.subsalesList[index].pageNum||1
            this.subsalesList[index].pageNum=pageNum+1
            this[this.activeTab](curUserId,this.subsalesList[index].pageNum)
        },
        initConfig() {
            this.orderBy = 1
            this.currentConfig =JSON.parse(JSON.stringify(getConfig(this.activeTab)))
            this.sortOptions = getSortOptions(this.activeTab)
            if (this.currentRole.roleCode === 'ST_SALES') {
                if (this.activeTab === 'registerCustomer') {
                    this.currentConfig.filterList.unshift({
                        name: '客户等级',
                        type: 'check',
                        field: 'clientLevelList',
                        list: [
                            {
                                label: 'A级',
                                value: 'A'
                            },
                            {
                                label: 'B级',
                                value: 'B'
                            },
                            {
                                label: 'C级',
                                value: 'C'
                            },
                            {
                                label: 'D级',
                                value: 'D'
                            },
                            {
                                label: 'E级',
                                value: 'E'
                            },
                        ]
                    })
                     this.currentConfig.filterList.splice(2,1)
                     this.currentConfig.filterList.splice(3,1)
                }else{
                     this.currentConfig.filterList.splice(4,1)
                }
            }else {
                this.currentConfig.filterList = this.currentConfig.filterList.filter(item => item.field !== 'tagNames')
            }
        },
        initParams() {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.filterValue = {}
            this.customerList = []
        },
        changeOrder() {
            this.initParams()
            this.getList()
        },
        changeCollapse(val) {
            if(val.length===0) return
            const curUserId = val[val.length - 1]
            const index = this.subsalesList.findIndex(item => item.userId === curUserId)
            if (this.subsalesList[index]&&this.subsalesList[index].customerList) return
             this[this.activeTab](val[val.length - 1],this.subsalesList[0].pageNum)
        },
        //筛选
        handleFilter(val) {
            this.initParams()
            this.filterValue = val
            this.getList()
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getList()
        },
        //收藏
        async handleCollect(data) {
            let params = {
                doFav: !data.isFav
            }
            if (this.activeTab === 'registerCustomer') {
                params.clueId = data.clueId
            }
            if (this.activeTab === 'receiveCustomer') {
                params.clientId = data.clientId
            }
            let result = await API[this.activeTab === 'registerCustomer' ? 'favInputCustomer' : 'changeClientFav'](params)
            if (result) {
                data.isFav = !data.isFav
                let message = data.isFav ? '标记成功' : '取消标记'
                this.$toast(message)
                this.initParams()
                this.getList()
            }
        },
         // 所有顾问列表
        async getSubSalesList() {
            let params = {
                projectId: this.projectId,
                sortingStrategy: this.orderBy,
                roleCode: this.currentRole.roleCode
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API[this.activeTab](params)
            this.subsalesList = result
            this.total = 0
            if (result.length > 0) {
                this.total = this.$utils.getScore(result,'customerCount')
                this.subsalesList[0].pageNum=1
            } else {
                 this.loading = false
                 this.finished = true
                 this.finishedText = '没有更多了'
            }
            this.loading = false
            this.finished = true
            this.finishedText = '没有更多了'
            this.$toast.clear()
        },
        changeTab() {
            this.initConfig()
            this.initParams()
            this.orderBy = 1
            this.getList()
        },
        beforeChangeTabs() {
            if (this.loading) {
                return false
            } else {
                if (this.currentRole.roleCode === 'ST_SALES') {
                    this.$refs.filterSection.map(ele => {
                        ele.resetFilter()
                    })
                }else {
                    this.$refs.filterSection.resetFilter()
                }

                return true
            }
        },
        getList() {
            if(this.currentRole.roleCode !== 'ST_SALES'){
                this.getSubSalesList()
                return
            }
            if (this.activeTab === 'registerCustomer') {
                this.registerCustomer()
                return
            }
            if (this.activeTab === 'receiveCustomer') {
                this.receiveCustomer()
                return
            }
        },
        //客户详情
        goDetail(item) {
            if (this.activeTab === 'registerCustomer') {
                this.$router
                    .push({
                        path: '/case/customerCaseRegisterDetail',
                        query: {
                            clientId: item.clientId,
                            clueId: item.clueId,
                            menuId: item.menuId
                        }
                    })
                    .catch(() => {})
                return
            }
            this.$router
                .push({
                    path: '/case/customerDetail',
                    query: {
                        oppId: item.oppId,
                        clueId: item.clueId,
                        menuId: item.menuId,
                        activeTab: this.activeTab
                    }
                })
                .catch(() => {})
        },
        // 我接待的客户
        async receiveCustomer(id,pageNum) {
            let params = {
                pageSize: this.pageSize,
                projectId: this.projectId,
                sortingStrategy: this.orderBy,
                userId: id || '',
                pageNum: pageNum||this.pageNum
            }
            Object.assign(params, this.filterValue)
            let result = await API.getClientFavList(params)
            result.list.map(item => {
                if (item.menuId === 'ST.CUSTOMER.FOLLOWING') {
                    item.codeType = item.status
                } else {
                    item.codeType = item.menuId
                }
            })
            if (this.currentRole.roleCode === 'ST_SALES') {
                this.customerList = this.customerList.concat(result.list)
            }else {
                this.subsalesList.map(item => {
                    if (item.userId === id) {
                        item.customerList = item.customerList ? item.customerList.concat(result.list) : result.list
                        if (result.isLastPage || !result?.list.length) {
                            item.isShowMoreBtn = false
                        } else {
                            item.isShowMoreBtn = true
                        }
                    }
                })
                this.$forceUpdate()
            }
            if (result.list.length < this.pageSize) {
                this.finished = true
                this.finishedText = '没有更多了'
            } else {
                this.finished = false
            }
            if (this.currentRole.roleCode === 'ST_SALES')  this.total=result.total
            this.loading = false
        },
        // 我登记的客户
        async registerCustomer(id,pageNum) {
            let params = {
                pageSize: this.pageSize,
                userId: id || '',
                pageNum: pageNum||this.pageNum,
                projectId: this.projectId,
                sortingStrategy: this.orderBy
            }
            Object.assign(params, this.filterValue)
            let result = await API.favInputCustomerList(params)
            result.list.map(item => {
                /**案场接待的客户下有细分状态
                 * 此处添加对应的codeType，用来在caseCustomerConfig.js下查找对应配置
                 **/
                item.codeType = this.activeTab
            })
            if (this.currentRole.roleCode === 'ST_SALES') {
                this.customerList = this.customerList.concat(result.list)
            }else {
                this.subsalesList.map(item => {
                    if (item.userId === id) {
                        item.customerList = item.customerList ? item.customerList.concat(result.list) : result.list
                        if (result.list.length < this.pageSize) {
                            item.isShowMoreBtn = false
                        } else {
                            item.isShowMoreBtn = true
                        }
                    }
                })
                this.$forceUpdate()
            }
            if (result.list.length < this.pageSize) {
                this.finished = true
                this.finishedText = '没有更多了'
            } else {
                this.finished = false
            }

            if (this.currentRole.roleCode === 'ST_SALES')  this.total=result.total
            this.loading = false

        },
        handleSearch() {
            this.$store.dispatch('other/setSearchCustomerListType', 'customer')
            this.$store.dispatch('other/setSearchCustomerType', this.$route.query.menuId)
            this.$router
                .push({
                    path: '/searchHistory',
                    query: {
                        dataType: this.activeTab,
                        type: 0
                    }
                })
                .catch(() => {})
        },
        // 获取二级渠道
        async getAcChildChannels() {
            return API.getAcChildChannels().then(res => {
                return res.map(x => {
                    return {
                        label: x.channelName,
                        value: x.channelCode
                    }
                })
            })
        }
    },
    watch: {}
}
</script>
<style scoped lang="less">
.common-page-container {
    .filter-container {
        height: 40px;
        padding: 0 18px;
        .common-flex-between();
        align-items: stretch;
        background: #ffffff;

        .right-section {
            .common-flex();

            .filter-section {
                margin-left: 40px;
            }
        }

        /deep/ .van-dropdown-menu__title,
        .switch-button {
            font-size: 14px;
            color: @header-text-color;
            font-weight: 400;
        }

        .switch-button {
            span {
                padding-right: 3px;
                font-size: 14px;
            }
        }

        .left-section {
            .common-flex();

            .van-dropdown-menu:first-child {
                margin-right: 16px;
            }
        }
    }

    .customer-container {
        height: 100%;
        background: @bg-color;

        /deep/ .van-tabs {
            height: 100%;

            .van-tabs__content {
                height: calc(100% - 44px);

                .van-tab__pane {
                    height: 100%;

                    .van-list {
                        height: 100%;
                        overflow: auto;

                        .van-collapse-item {
                            margin-bottom: 6px;

                            .van-cell {
                                height: 56px;
                                font-size: 16px;
                                color: @header-text-color;
                                font-weight: 500;

                                &::after {
                                    left: 0;
                                    border-bottom: 1px solid @main-bg;
                                    transform: none;
                                }
                            }

                            .van-collapse-item__content {
                                padding: 0;
                            }
                        }
                    }
                }
            }
        }

        .no-tab {
            /deep/ .van-tabs__wrap {
                display: none;
            }
        }
    }
}
</style>
