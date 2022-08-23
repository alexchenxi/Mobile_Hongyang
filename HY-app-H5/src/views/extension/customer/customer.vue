<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="!!$route.query.id" :title="title">
                <span slot="append-suffix" v-code="['ZT.CUSTOMER.BUTTON', 'ZT.CUSTOMER.BUTTON.ASSIGN']" v-if="!$route.query.id" class="distribution iconfont iconfenpei" @click="assignCustomer"></span>
            </top-bar>
        </div>
        <div class="common-page-middle" :style="{ height:!$route.query.id? pageMiddleHeight : pageContainerHeight }">
            <van-notice-bar
                color="#DB0826"
                left-icon="volume-o"
                text="本系统仅展示客户状态，案场判断和佣金结算依据以售楼部结算规则和制度为准"
            />
            <div class="main-container">
                <div class="search-section">
                    <search-bar v-if="!$route.query.id" :placeholder="placeholder" readonly @focus="onFocus"></search-bar>
                    <search-bar v-else :placeholder="placeholder" @changeInput="handleInput"></search-bar>
                </div>
                <div class="customer-section">
                    <van-tabs v-model="activeTab" animated :before-change="beforeChangeTabs" @change="changeTab">
                        <template v-for="tab in tabList">
                            <!-- 非专员不显示待报备 -->
                            <van-tab v-if="currentRole.roleCode === 'ZT_MEMBER' || (currentRole.roleCode !== 'ZT_MEMBER' && tab.value !== 5)" :key="tab.value" :title="tab.name" :name="tab.value">
                                <!-- 筛选条件 -->
                                <div class="multiple-filter">
                                    <div class="multiple-filter-left">
                                        <!-- 未获电不显示团队筛选 -->
                                        <van-dropdown-menu
                                            v-if="tab.value !== 1 && !$route.query.id"
                                            v-code="['ZT.CUSTOMER.BUTTON', 'ZT.CUSTOMER.BUTTON.TEAMFILTER']"
                                            :class="[activeFilter === 1 ? 'active-filter group-filter' : 'group-filter']"
                                            active-color="#DB0826"
                                        >
                                            <van-dropdown-item ref="filter" :title="staffSalesValue" :get-container="getContainer" @open="highlightFilter(1)">
                                                <TeamFilter v-model="teamFilterData" :list="list" @change="teamFilterChange" />
                                                <div class="filter-container-bottom">
                                                    <van-button block type="cancel" @click="closeFilter">取消</van-button>
                                                    <van-button block type="filter" native-type="submit" @click="handleSave">确定</van-button>
                                                </div>
                                            </van-dropdown-item>
                                        </van-dropdown-menu>
                                        <van-dropdown-menu :class="[activeFilter === 2 ? 'active-filter' : '']" active-color="#DB0826">
                                            <van-dropdown-item
                                                ref="filter"
                                                v-model="orderBy"
                                                :options="sortOptions"
                                                :get-container="getContainer"
                                                @change="changeOrder"
                                                @open="highlightFilter(2)"
                                            ></van-dropdown-item>
                                        </van-dropdown-menu>
                                    </div>
                                    <div
                                        v-if="currentTabType.filterList&&currentTabType.filterList.length"
                                        class="multiple-filter-right tab-filter-right"
                                        :class="[activeFilter === 3 ? 'active-filter' : '']"
                                        @click="highlightFilter(3)"
                                    >
                                        <FilterSection ref="filterSection" :filter-list="currentTabType.filterList" container=".customer-section" @change="handleFilter" />
                                    </div>
                                </div>
                                <div class="common-total-style">共<span class="num">{{total}}</span>客户</div>

                                <div v-if="currentTabType.code === tab.value" class="main-section">
                                    <van-list ref="customerList" v-model="loading" offset="10" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
                                        <!-- <div v-if="total > 0" class="customer-total">共<span class="text-strong">{{total}}</span>个客户</div> -->
                                        <CustomerSection
                                            :list="customerList"
                                            @goDetail="goCustomerDetail"
                                            @tagChange="tagChange"
                                            @recommendAgain="recommendAgain"
                                            @recommend="recommend"
                                            @operate="operate"
                                            @clickField="clickField"
                                            @collect="handleCollect"
                                            @report="report"
                                            @call="call"
                                        />
                                    </van-list>
                                </div>
                            </van-tab>
                        </template>
                    </van-tabs>
                </div>
            </div>
        </div>
        <tab-bar active="/extension/customer" :tab-data="tabData" v-if="!$route.query.id"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TabBar from '@c/TabBar'
import TopBar from '@c/TopBar'
import SearchBar from '@c/SearchBar'
import TeamFilter from '@/components/TeamFilter'
import CustomerSection from '@/components/ExtensionCustomer'
import FilterSection from '@c/FilterSection'
import API from '@/request/api/selfExtension/customer'
import keyAndBeeAPI from '@/request/api/selfExtension/keyAndBee'
import { getConfig, getSortOptions } from '@/config/extensionCustomerConfig'
import commonApi from '@/request/api/commonApi'
export default {
    name: 'ExtensionCustomer',
    components: {
        TopBar,
        TabBar,
        SearchBar,
        TeamFilter,
        CustomerSection,
        FilterSection
    },
    data() {
        return {
            //列表加载
            loading: false,
            finished: false,
            isCollect: false,
            // 客户列表预设
            tabList: [
                {
                    value: '',
                    name: '全部客户'
                },
                // {
                //     value: 1,
                //     name: '未获电'
                // },
                // {
                //     value: 2,
                //     name: '线上获电'
                // },
                // {
                //     value: 5,
                //     name: '待报备'
                // },
                {
                    value: 10,
                    name: '已报备'
                },
                {
                    value: 20,
                    name: '已到访'
                },
                {
                    value: 30,
                    name: '已认筹'
                },
                {
                    value: 40,
                    name: '已认购'
                },
                {
                    value: 50,
                    name: '已签约'
                },
                {
                    value: -1,
                    name: '已失效'
                },
                {
                    value: -2,
                    name: '重点客户'
                }
            ],
            activeTab: 10,
            checkList: [],
            placeholder: '请输入客户姓名/手机号',
            orderBy: null,
            //当前状态客户列表预设
            currentTabType: {},
            // 客户列表
            customerList: [],
            pageNum: 1,
            pageSize: 10,
            closeOutside: false,
            isUnVisit: false,
            refresh: false,
            activeFilter: 1,
            // 团队筛选
            teamFilterData: {},
            list: [],
            staffSalesValue: '全部团队全部',
            sortOptions: [],
            total: 0,
            filterValue: {},
            longitude: null,
            latitude: null,
            scrollTop: 0,
            timer:null,
            keyWord:''
        }
    },
    computed: {
        title(){
            const name = this.$route.query.name
            return name ? `${name}的客户` :'客户'
        },
        ...mapGetters(['tabData', 'projectId', 'keepAliveList', 'selfChannelCustomerListUpdate', 'currentRole', 'device'])
    },
    created() {
        this.orderBy = this.$route.query.orderBy ? Number(this.$route.query.orderBy) : 1
    },
    activated() {
       if (this.selfChannelCustomerListUpdate.isUpdate) {
           this.singleUpdateList()
       }
       this.$nextTick(() => {
           const box = document.querySelector('.main-section')
           box.scrollTop = this.scrollTop
       })
    },
    beforeDestroy() {
        this.$store.dispatch('other/selfChannelCustomerListUpdate', {isUpdate: false,id:'', isDelete: true})
    },
    mounted() {
        this.activeTab = Number(localStorage.getItem('extensionCustomerActiveTab')) || 10
        // 从全部客户列表进入详情返回
        if (localStorage.getItem('extensionCustomerSourceTab')) {
            this.activeTab = ''
        }
        // 从首页进入就到全部客户列表
        if (localStorage.getItem('isFromHome')) {
            this.activeTab = ''
            localStorage.setItem('isFromHome', '')
        }
        if (this.$route.query.id){
            this.activeTab = ''
        }
        this.init()
    },
    methods: {
        init() {
            this.customerList = []
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.getCurrentDataType()
            this.getCustomerList()
        },
        //获取当前客户列表配置预设
        getCurrentDataType() {
            this.currentTabType =JSON.parse(JSON.stringify(getConfig(this.activeTab)))
            if(this.currentRole.roleCode==='ZT_MEMBER'){
                 commonApi.ztChannelListApi().then(res => {
                 res.map((item)=>{
                     item.label=item.channelName
                     item.value=item.channelCode
                 })
                     if (!this.$route.query.id){
                         this.currentTabType.filterList.push(
                             {
                                 name: '拓客类型',
                                 type: 'check',
                                 field: 'channelCodeList',
                                 list: res
                             }
                         )
                     }
             })

            }

            this.sortOptions = getSortOptions(this.activeTab)
            this.orderBy = this.orderBy ? this.orderBy : 1
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getCustomerList()
        },
        //收藏
        async handleCollect(data) {
            if(this.currentRole.roleCode==='ZT_MANAGER') return
            let params = {
                 projectId:this.projectId,
                id: data.clueId,
                important: data.important === '1' ? 0 : 1
            }
            let result = await API.changeClientFav(params)
            if (result) {
                data.important = data.important === '1' ? 0 : '1'
                let message = data.important ? '标记成功' : '取消标记'
                this.$toast(message)
            }
        },
        //排序
        changeOrder() {
            this.customerList = []
            this.pageNum = 1
            this.loading = true
            this.getCustomerList()
        },
        // 分配客户
        assignCustomer() {
            this.$router.push('/extension/assignCustomer').catch(() => {})
        },
        handleFilter(val) {
            this.filterValue = val
            this.customerList = []
            this.pageNum = 1
            this.loading = true
            this.staffSalesValue = this.teamFilterData.name ? this.teamFilterData.name : this.staffSalesValue
            this.getCustomerList()
        },
        //筛选确认
        handleSave() {
            this.$refs.filter.map(item => {
                item.toggle(false)
            })
            this.customerList = []
            this.pageNum = 1
            this.loading = true
            this.staffSalesValue = this.teamFilterData.name ? this.teamFilterData.name : this.staffSalesValue
            this.getCustomerList()
        },
        // 筛选取消
        closeFilter() {
            this.$refs.filter.map(item => {
                item.toggle(false)
            })
        },
        //切换tab
        changeTab() {
            this.teamFilterData = {}
            this.filterValue = {}
            this.customerList = []
            this.init()
            this.orderBy = 1
            this.activeFilter = 1
            this.total = 0
            this.$nextTick(() => {
                this.staffSalesValue = '全部团队全部'
            })
        },
        beforeChangeTabs() {
            if (this.loading) {
                return false
            } else {
                return true
            }
        },
        tagChange() {
            this.init()
        },
        //客户详情
        goCustomerDetail(item) {
            // 待报备客户不能跳转详情
            if (item.codeType === 5) {
                return
            }
            // 未获电
            if (this.activeTab === 1) {
                return
            }
            // 已获电
            if (this.activeTab === 2) {
                this.$router
                    .push({
                        path: '/customerTookDetail',
                        query: {
                            from: 'ZT',
                            id: item.id,
                            canEdit: item.canEdit,
                            type: 0,
                            customerId: item.customerId
                        }
                    })
                    .catch(() => {})
                return
            }
            this.$router
                .push({
                    path: '/extension/customerDetail',
                    query: {
                        oppId: item.oppId,
                        clueId: item.clueId,
                        canEdit: item.canEdit,
                        important: item.important,
                        makeFlg: item.makeFlg,
                        // 只有已报备的客户才可以在详情修改姓名及备注
                        editCustomerName: item.canEdit && item.clueStatus === 10 && item.avaStatus === 1 ? 1 : 0
                    }
                })
                .catch(() => {})
        },
        // 报备
        recommend(item) {
            this.$utils.loading('报备中...')
            keyAndBeeAPI
                .oneClickRecommend({
                    beeRecommendRecordId: item.id
                })
                .then(() => {
                    this.$toast('报备成功')
                    this.init()
                })
                .catch(() => {
                    this.init()
                })
        },
        // 操作
        operate(data) {
            if (data.type.type === 'del') {
                this.$dialog
                    .confirm({
                        title: '',
                        message: `确认删除${data.item.customerName}客户?`
                    })
                    .then(() => {
                        API.deleteCustomer({ beeRecommendRecordId: data.item.id }).then(() => {
                            this.$toast('删除成功')
                            this.init()
                        })
                    })
                    .catch(() => {
                        // on cancel
                    })
            }
        },
        clickField(data) {
            if (['手机号码', '电话号码'].includes(data.field.name) && data.item.codeType === 5) {
                this.$appMethods.SendPhone(this.device, data.item[data.field.field])
            }
        },
        //搜索
        onFocus() {
            this.$router
                .push({
                    path: '/searchHistory',
                    query: {
                        type: 1
                    }
                })
                .catch(() => {})
        },
        //筛选挂载节点
        getContainer() {
            return document.querySelector('.main-container')
        },
        async singleUpdateList() {
            let params = {
                projectId: this.projectId,
                userList: this.teamFilterData.list,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                roleCode: this.currentRole.roleCode
            }
            if (this.activeTab !== 1 && this.activeTab !== 2) {
                params.sortingStrategy = this.orderBy
                if (this.currentTabType.code === -1) {
                    params.avaStatus = 0
                } else if (this.currentTabType.code === -2) {
                    params.important = 1
                }else if (this.currentTabType.code) {
                    params.clueStatus = this.currentTabType.code
                    params.avaStatus = 1
                }
            } else {
                params.sortingStrategy = this.orderBy
            }
            Object.assign(params, this.filterValue)
            this.loading = true
            this.finished = false
            try {
                let result = null
                result = await API.getCustomerList(params)
                result.list.map(item => {
                    if (item.avaStatus === 0) {
                        item.codeType = -1
                    } else {
                        item.codeType = item.clueStatus
                    }
                })
                const findOldItemIndex = this.customerList.findIndex(item => item.clueId === this.selfChannelCustomerListUpdate.id)
                const findNewItem = result.list.find(item => item.clueId === this.selfChannelCustomerListUpdate.id)
                if (this.selfChannelCustomerListUpdate.isDelete) {
                    this.customerList.splice(findOldItemIndex, 1)
                }else {
                    this.customerList.splice(findOldItemIndex, 1, findNewItem)
                }
                this.$store.dispatch('other/selfChannelCustomerListUpdate', {isUpdate: false,id:'', isDelete: true})
                this.loading = false
            } catch (err) {
                this.loading = false
                this.finished = true
            }
        },
        //获取客户列表
        async getCustomerList() {
            const userId = this.$route.query.id
            let params = {
                projectId: this.projectId,
                userList: this.teamFilterData.list,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                roleCode: this.currentRole.roleCode,
                childUserId:userId,
                keyWord:this.keyWord
            }

            if (userId){
                params.isChildBroker = 1
            }
            if (this.activeTab !== 1 && this.activeTab !== 2) {
                params.sortingStrategy = this.orderBy
                if (this.currentTabType.code === -1) {
                    params.avaStatus = 0
                } else if (this.currentTabType.code === -2) {
                    params.important = 1
                }else if (this.currentTabType.code) {
                    params.clueStatus = this.currentTabType.code
                    params.avaStatus = 1
                }
            } else {
                params.sortingStrategy = this.orderBy
            }
            Object.assign(params, this.filterValue)
            this.loading = true
            this.finished = false
            try {
                let result = null
                // 未获电
                result = await API.getCustomerList(params)
                result.list.map(item => {
                    if (item.avaStatus === 0) {
                        item.codeType = -1
                    } else {
                        item.codeType = item.clueStatus
                    }
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
        //团队列表
        async getStaffSalesList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode
            }
            let result = await API.getTeamUser(params)
            this.list = result
        },
        teamFilterChange(data) {
            this.teamFilterData = data
        },
        highlightFilter(val) {
            this.activeFilter = val
            if (val === 1) {
                this.getStaffSalesList()
            }
        },
        //重新报备
        async recommendAgain(data) {
            // this.getLocation().then(
            //     async () => {
                    let params = {
                        projectId: this.projectId,
                        clueId: data.clueId,
                        longitude: this.longitude,
                        latitude: this.latitude
                    }
                    let result = await API.recommendAgain(params)
                    this.init()
                    this.$toast(result.message)
                // },
            //     () => {
            //         this.$toast('未开启定位无法报备')
            //     }
            // )
        },
        // 报备客户-线上获电
        report(item) {
            this.$router
                .push({
                    path: '/extension/customer/recommend',
                    query: {
                        fromType: 'took',
                        data: {
                            name: item.customerName,
                            tel: item.customerTel,
                            type: item.obtainCustomerType,
                            typeName: item.obtainCustomerTypeName,
                            id: item.id
                        }
                    }
                })
                .catch(() => {})
        },
        // 打电话
        call(tel) {
            this.$appMethods.SendPhone(this.device, tel)
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
        handleInput(val){
            clearTimeout(this.timer)
            this.timer =  setTimeout(()=>{
                this.customerList = []
                this.pageNum = 0
                this.loading = true
                this.finished = true
                this.keyWord = val
                this.getCustomerList()
            },1000)
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('ExtensionCustomer') === -1) {
                array.push('ExtensionCustomer')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        let array = this.keepAliveList
        if (!to.path.includes('/extension/customerDetail')) {
            array = array.filter(item => {
                return item !== 'ExtensionCustomer'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        // 存储当前tab索引
        if (to.path === '/extension/customerDetail' || to.path === '/searchHistory') {
            localStorage.setItem('extensionCustomerActiveTab',this.activeTab)
            localStorage.setItem('extensionCustomerSourceTab', !this.activeTab ? 'all' : '')
        }else {
            localStorage.setItem('extensionCustomerActiveTab', '')
        }
        const box = document.querySelector('.main-section')
        this.scrollTop = box.scrollTop
        next()
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
                height: calc(100% - @search-bar-height);
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
        height: 44px;
        .multiple-filter-left {
            .common-flex();
            width: calc(100% - 75px);
            overflow-x: auto;
            .van-dropdown-menu {
                width: auto;
                margin-right: 50px;
                ::v-deep .van-dropdown-menu__item {
                    flex-grow: 1;
                    max-width: 100%;
                }
            }
        }
    }
}
.main-container{
    height: calc(100% - 42px) !important;
}
/deep/ .van-dropdown-menu {
    width: 500px;
}
/deep/ .van-dropdown-menu__item {
    flex: 0;
    min-width: 88px;
    max-width: 100px;
}
/deep/ .van-tree-select {
    .van-sidebar-item--select::before {
        display: none;
    }
}
/deep/ .van-tabs__line {
    width: 18px;
    height: 3px;
}
</style>
