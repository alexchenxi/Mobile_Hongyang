<!-- 销售登记客户列表-->
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
                <van-tabs v-model="activeTab" animated :before-change="beforeChangeTabs" @change="changeTab">
                    <van-tab v-for="tab in tabList" :key="tab.value" :title="tab.name" :name="tab.value">
                        <section class="filter-container" v-if="currentRole.roleCode === 'ST_SALES'">
                            <div class="left-section">
                                <van-dropdown-menu active-color="#DB0826">
                                    <van-dropdown-item ref="filter" v-model="orderBy" :options="sortOptions" get-container="body" @change="changeOrder" />
                                </van-dropdown-menu>
                            </div>
                            <div class="right-section">
                                <div
                                    v-if="currentConfig.actions && currentConfig.actions.switch"
                                    v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.MODE']"
                                    class="switch-button"
                                    @click="switchCustomerType"
                                >
                                    <!-- <span :class="['iconfont', showCollapse ? 'iconkehuqiehuan' : 'iconzhiyeguwenqiehuan']" />
                                    {{ showCollapse ? '顾问' : '客户' }} -->
                                </div>
                                <div class="filter-section">
                                    <FilterSection ref="filterSection" :filter-list="currentConfig.filterList" container=".customer-container" @change="handleFilter" />
                                </div>
                            </div>
                        </section>
                        <div class="common-total-style">共<span class="num">{{total}}</span>客户</div>
                        <van-list :style="currentRole.roleCode === 'ST_SALES'?'height: calc(100% - 80px)':''" v-model="loading" :finished="finished" :finished-text="finishedText" offset="20" :immediate-check="false" @load="onLoad">
                            <CaseCustomer v-if="!showCollapse" :list="customerList" @collect="handleCollect" @goDetail="goDetail" />
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
import { getConfig, getSortOptions, getTabList, getCodeType } from '@/config/caseCustomerConfig'
import MyAPI from '@/request/api/my'
export default {
    name: 'customerCaseRegister',
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
            activeTab: 10,
            title: '',
            tabList: [],
            activeNames: [],
            oldActiveNames: [],
            showCollapse: true,
            pageNum: 1,
            pageSize: 10,
            filterValue: {},
            customerList: [],
            subsalesList: [],
            refresh: false,
            groupId: '',
            groupList: [],
            acChildChannels: [],
            total:0
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList']) },
    watch: {},
    async created() {
        const tabData = getTabList(this.$route.query.menuId)
        this.tabList = tabData.tabList
        this.title = tabData.name
        this.acChildChannels = await this.getAcChildChannels()
        this.initConfig()
        this.initParams()
        this.showCollapse=this.currentRole.roleCode !== 'ST_SALES'
        if(this.currentRole.roleCode !== 'ST_SALES'){
            this.getList()
        }else{
            this.getInputCustomerList()
        }
    },
    mounted() {
        this.activeTab = localStorage.getItem('customerCaseRegisterActiveTab') === '全部' ? '' : Number(localStorage.getItem('customerCaseRegisterActiveTab')) || 10
    },
    activated() {
        if (this.refresh) {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.customerList = []
            this.subsalesList = []
            this.activeNames = []
            this.getList()
            this.refresh = false
        }
    },
    methods: {
        async initConfig() {
            this.orderBy = 1
            const code = getCodeType(this.$route.query.menuId, this.activeTab)
            this.currentConfig = JSON.parse(JSON.stringify(getConfig(code)))

            this.currentConfig.filterList.unshift({
                name: '登记类型',
                type: 'check',
                field: 'childChannelCodeArray',
                list: this.acChildChannels
            })
            // if(code==='houseInspection'){
            //     this.currentConfig.filterList.splice(1,0,{
            //         name: '来访状态',
            //         type: 'check',
            //         field: 'step',
            //         list: [
            //             {
            //                 label: '首访',
            //                 value: 2
            //             },
            //             {
            //                 label: '复访',
            //                 value: 3
            //             }]
            //     } )
            // }
            // 只有置业顾问才有标签筛选
            if (this.currentRole.roleCode !== 'ST_SALES') {
                this.currentConfig.filterList = this.currentConfig.filterList.filter(item => item.field !== 'tagNames')
            } else {
                 if(code==='subscribe'||code==='sign'||code==='invalidation'){
                      this.currentConfig.filterList.splice(0,1)
                 }
            }
            this.sortOptions = getSortOptions(code)
        },
        initParams() {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.filterValue = {}
            this.customerList = []
            this.subsalesList = []
            this.activeNames = []
        },
        changeOrder() {
            this.initParams()
            this.getList()
        },
         // 获取二级渠道
        async getAcChildChannels() {
            return  API.getAcChildChannel(this.projectId).then((res) => {
               return res.map(x => {
                    return {
                        label: x.channelName,
                        value: x.channelCode
                    }
                })
            })
        },
        changeGroup() {
            this.initParams()
            this.getList()
        },
        async getTags() {
            let result = await MyAPI.getMyTag()
            let tagList = []
            result.forEach(item => {
                tagList.push({
                    label: item.tagName,
                    value: item.tagName
                })
            })
            this.currentConfig.filterList.unshift({
                name: '标签',
                type: 'check',
                field: 'tagName',
                list: tagList
            })
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
            this.getInputCustomerList()
        },
        //收藏
        async handleCollect(data) {
            let params = {
                clueId: data.clueId,
                doFav: !data.isFav
            }
            let result = await API.favInputCustomer(params)
            if (result) {
                data.isFav = !data.isFav
                let message = data.isFav ? '标记成功' : '取消标记'
                this.$toast(message)
            }
        },
        changeTab() {
            this.initConfig()
            this.initParams()
            this.orderBy = 1
            this.groupId = ''
             this.showCollapse=this.currentRole.roleCode !== 'ST_SALES'
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
        changeCollapse(val) {
            if (val.length < this.oldActiveNames.length) {
                this.oldActiveNames = val
                return
            }
            const curUserId = val[val.length - 1]
            const index = this.subsalesList.findIndex(item => item.userId === curUserId)
            if (this.subsalesList[index]&&this.subsalesList[index].customerList) return
            this.staffClientList(val[val.length - 1],1)
            this.oldActiveNames = val
        },
        //切换客户列表展示形式
        switchCustomerType() {
            this.showCollapse = !this.showCollapse
            this.initParams()
            this.getList()
        },
        getList() {
            if (this.showCollapse) {
                this.loading = false
                this.finished = true
                this.finishedText = ''
                this.staffSubsalesList()
            } else {
                this.getInputCustomerList()
            }
        },
        //客户详情
        goDetail(item) {
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
        },
        async getInputCustomerList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                sortingStrategy: this.orderBy
            }
            // 已失效
            if (this.activeTab === -1) {
                params.avaStatus = 0
            } else {
                params.avaStatus = 1
                // 按状态
                if (this.activeTab) {
                    params.status = this.activeTab
                }
            }
            Object.assign(params, this.filterValue)
            let result = await API.getInputCustomerList(params)
            result.list.map(item => {
                item.codeType = getCodeType(this.$route.query.menuId, params.avaStatus === 0 ? -1 : item.status)
            })
            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
                this.finishedText = '没有更多了'
            } else {
                this.finished = false
            }
            this.total=result.total
            this.loading = false
        },
        handleSearch() {
            this.$store.dispatch('other/setSearchCustomerListType', 'registerCustomer')
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
        // 获取所有下级置业顾问列表
        async staffSubsalesList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                menuId: this.$route.query.menuId
            }
            // 已失效
            if (this.activeTab === -1) {
                params.avaStatus = 0
            } else {
                params.avaStatus = 1
                params.status = this.activeTab
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()

            let result = await API.subsalesInputCustomerList(params)
            this.subsalesList = result
            this.total = 0
            if (result.length > 0) {
                this.total = this.$utils.getScore(result,'customerCount')
            }
            this.finished = true
            this.loading = false
            this.finishedText = '没有更多了'
            this.$toast.clear()
        },
          // 加载更多客户
        async showMoreClint(index,curUserId) {
            let pageNum=this.subsalesList[index].pageNum||1
            this.subsalesList[index].pageNum=pageNum+1
            this.staffClientList(curUserId,this.subsalesList[index].pageNum)
        },
        async staffClientList(id,pageNum) {
            if (!id) return
            let params = {
                menuId: this.$route.query.menuId,
                staffId: id,
                projectId: this.projectId,
                sortingStrategy: this.orderBy,
                avaStatus: 1,
                pageNum:pageNum,
                pageSize:this.pageSize
            }
            // 已失效
            if (this.activeTab === -1) {
                params.avaStatus = 0
            } else {
                params.avaStatus = 1
                params.status = this.activeTab
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.clientInputCustomerList(params)
            result.list.map(item => {
                /**案场接待的客户下有细分状态
                 * 此处添加对应的codeType，用来在caseCustomerConfig.js下查找对应配置
                 **/
                item.codeType = getCodeType(this.$route.query.menuId, params.avaStatus === 0 ? -1 : item.status)
            })
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
            this.$toast.clear()
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('customerCaseRegister') === -1) {
                array.push('customerCaseRegister')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/case/customerCaseRegisterDetail')) {
                vm.refresh = true
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/case/customerCaseRegisterDetail')) {
            array = array.filter(item => {
                return item !== 'customerCaseRegister'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }

        // 存储当前tab索引
        if (to.path === '/case/customerCaseRegisterDetail') {
            const activeTab = this.activeTab === '' ? '全部' : this.activeTab
            localStorage.setItem('customerCaseRegisterActiveTab', activeTab)
        } else {
            localStorage.setItem('customerCaseRegisterActiveTab', '')
        }
        next()
    }
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
     .more-btn-wrap {
            margin-top: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 45px;
            color: @theme-color;
            border-radius: 4px;
            font-size: 15px;
            font-weight: 500;
            .more-btn {
                width: 100px;
                text-align: center;
                line-height: 45px;
                border-radius: 20px;
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
                        height: calc(100% - 40px);
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
    }
}
</style>
