<!-- 未获电 已获电客户列表 -->
<template>
    <div class="common-page">
        <TopBar :title="currentConfig.name + '客户'">
            <span slot="append-suffix" class="iconfont iconsousuo" @click="handleSearch"></span>
        </TopBar>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <section class="filter-container">
                <div class="left-section">
                    <van-dropdown-menu active-color="#DB0826">
                        <van-dropdown-item ref="filter" v-model="orderBy" :options="sortOptions" @change="changeOrder"></van-dropdown-item>
                    </van-dropdown-menu>
                </div>
                <div class="right-section">
                    <div v-if="currentConfig.actions && currentConfig.actions.switch" v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.MODE']" class="switch-button" @click="switchCustomerType">
                        <span :class="['iconfont', showCollapse ? 'iconkehuqiehuan' : 'iconzhiyeguwenqiehuan']"></span>
                        {{showCollapse ? '顾问' : '客户'}}
                    </div>
                    <div v-if="currentConfig.filterList.length" class="filter-section">
                        <FilterSection :filter-list="currentConfig.filterList" @change="handleFilter" />
                    </div>
                </div>
            </section>
            <section class="customer-container">
                <van-list v-model="loading" :finished="finished" :finished-text="finishedText" offset="20" :immediate-check="false" @load="onLoad">
                    <CaseCustomer v-if="!showCollapse" :list="customerList" @goDetail="goDetail" @call="call" @caseRegistration="caseRegistration" />
                    <van-collapse v-else v-model="activeNames" :border="false" @change="changeCollapse">
                        <van-collapse-item v-for="item in subsalesList" :key="item.userId" :name="item.userId" :border="true">
                            <template #title>
                                <div class="common-collapse-title">{{ item.userName }}（{{ item.customerCount }}）</div>
                            </template>
                            <CaseCustomer :key="item.userId" :list="item.customerList" @goDetail="goDetail" @call="call" @caseRegistration="caseRegistration" />
                        </van-collapse-item>
                    </van-collapse>
                </van-list>
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
import { getConfig, getSortOptions } from '@/config/caseCustomerConfig'
export default {
    name: 'CustomerWithoutTab',
    components: {
        TopBar,
        FilterSection,
        CaseCustomer
    },
    data() {
        return {
            menuId: '',
            currentConfig: {},
            sortOptions: [],
            orderBy: 1,
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            activeNames: [],
            oldActiveNames: [],
            showCollapse: false,
            pageNum: 1,
            pageSize: 10,
            filterValue: {},
            customerList: [],
            subsalesList: [],
            refresh: false,
            checkNums: 0,
            checkList: [],
            checkAll: false
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList', 'device']) },
    watch: {},
    created() {
        this.menuId = this.$route.query.menuId
        this.initConfig()
        this.initParams()
        this.getList()
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
        initConfig() {
            this.currentConfig = getConfig(this.menuId)
            this.sortOptions = getSortOptions(this.menuId)
        },
        initParams() {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.customerList = []
            this.subsalesList = []
            this.activeNames = []
        },
        changeOrder() {
            this.initParams()
            this.getList()
        },
        //筛选
        handleFilter(val) {
            this.filterValue = val
            this.initParams()
            this.getList()
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getList()
        },
        changeCollapse(val) {
            if (val.length < this.oldActiveNames.length) {
                this.oldActiveNames = val
                return
            }
            this.staffClientList(val[val.length - 1])
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
                this.getClientList()
            }
        },
        // 获取客户列表
        async getClientList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                sortingStrategy: this.orderBy,
                roleCode: this.currentRole.roleCode
            }
            Object.assign(params, this.filterValue)
            let apiName = 'getCustomerTel'
            if (this.menuId === 'ST.CUSTOMER.NOTPHONE') {
                apiName = 'getCustomerNoTel'
            }
            let result = await API[apiName](params)
            result.list.map(item => {
                item.codeType = this.menuId
                item.viewUserName = item.viewUserName || '未知'
                item.customerName = item.customerName || '未知'
                let infos = item.lastOptLog.content.map(x => {
                    return x.content
                })
                item.actionInfo = infos.join('-')
                Object.assign(item, item.lastOptLog)
            })
            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        // 获取所有下级置业顾问列表
        async staffSubsalesList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                isNeedNullStaff: false
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.getLatentSubsales(params)
            this.subsalesList = result
            if (result.length > 0) {
                this.activeNames = [result[0].userId]
                this.staffClientList(this.subsalesList[0].userId)
            } else {
                this.finishedText = '没有更多了'
            }
            this.$toast.clear()
        },
        // 跟进置业顾问id获取客户
        async staffClientList(id) {
            let params = {
                staffId: id,
                projectId: this.projectId,
                sortingStrategy: this.orderBy,
                roleCode: this.currentRole.roleCode
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.getCustomerTelByStaff(params)
            result.map(item => {
                item.codeType = this.menuId
                item.customerName = item.customerName || '未知'
                let infos = item.lastOptLog.content.map(x => {
                    return x.content
                })
                item.actionInfo = infos.join('-')
                Object.assign(item, item.lastOptLog)
            })
            this.subsalesList.map(item => {
                if (item.userId === id) {
                    item.customerList = result
                }
            })
            this.$forceUpdate()
            this.$toast.clear()
        },
        //客户详情
        goDetail(item) {
            // 未获电
            if (this.menuId === 'ST.CUSTOMER.NOTPHONE') {
                return
            }
            this.$router
                .push({
                    path: '/customerTookDetail',
                    query: {
                        id: this.menuId === 'ST.CUSTOMER.NOTPHONE' ? item.viewUserId : item.id,
                        canEdit: this.menuId === 'ST.CUSTOMER.NOTPHONE' ? false : item.canEdit,
                        type: this.menuId === 'ST.CUSTOMER.NOTPHONE' ? 1 : 0,
                        customerId: item.customerId
                    }
                })
                .catch(() => {})
        },
        // 销售登记
        caseRegistration(item) {
            this.$router
                .push({
                    path: '/case/callEnter',
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
        // 搜索
        handleSearch() {
            this.$store.dispatch('other/setSearchCustomerListType', 'customer')
            this.$store.dispatch('other/setSearchCustomerType', this.menuId)
            this.$router
                .push({
                    path: '/searchHistory',
                    query: {
                        dataType: this.menuId === 'ST.CUSTOMER.NOTPHONE' ? 'customerNotPhone' : 'customerPhone',
                        type: 7
                    }
                })
                .catch(() => {})
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('customerTook') === -1) {
                array.push('customerTook')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/customerTookDetail')) {
                vm.refresh = true
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/customerTookDetail')) {
            array = array.filter(item => {
                return item !== 'customerTook'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    }
}
</script>
<style scoped lang="less">
/deep/ .head-container {
    .head-c {
        position: absolute;
        width: 100%;
        z-index: 1;
    }
    .head-l,
    .head-r {
        position: relative;
        z-index: 2;
    }
    .iconsousuo {
        font-size: 19px;
        margin-left: 30px;
    }
    .iconfenpei {
        font-size: 20px;
    }
    .top-action {
        font-size: 15px;
        color: @theme-color;
        font-weight: 500;
    }
}
.common-page-container {
    .filter-container {
        height: 40px;
        padding: 0 18px;
        .common-flex-between();
        align-items: stretch;
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
    }
    .customer-container {
        height: calc(100% - 40px);
        background: @bg-color;
        overflow: auto;
        /deep/ .van-list {
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
            .van-checkbox {
                padding-left: 15px;
            }
        }
    }
}
/deep/ .common-fix-bottom {
    padding: 0 18px;
}
</style>
