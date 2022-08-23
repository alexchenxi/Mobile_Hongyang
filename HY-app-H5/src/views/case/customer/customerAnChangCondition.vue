<template>
    <div class="common-page">
        <TopBar v-if="!isAssign" :title="currentConfig.name + '客户'">
            <template slot="append-suffix">
                <div class="left-section">
                    <van-dropdown-menu
                        v-if="sortOptions && sortOptions.length"
                        active-color="#DB0826"
                        :z-index="100"
                    >
                        <van-dropdown-item
                            ref="filter"
                            v-model="orderBy"
                            get-container="body"
                            :options="sortOptions"
                            @change="changeOrder"
                        />
                    </van-dropdown-menu>
                </div>
            </template>
        </TopBar>
        <main class="common-page-container"
              :style="{ height: isAssign ? pageMiddleWithButtonHeight : pageContainerHeight }">
            <section class="customer-container">
                <van-tabs v-model="activeTab" @change="changeTab" sticky :offset-top="topBarsHeight" animated>
                    <van-tab v-for="tab in tabList" :key="tab.value" :title="tab.name" :name="tab.value">
                        <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad"
                                  offset="20" :immediate-check="false">
                            <van-collapse v-model="activeNames" :border="false" @change="changeCollapse">
                                <van-collapse-item v-for="item in subsalesList" :key="item.userId" :name="item.userId"
                                                   :border="true">
                                    <template #title>
                                        <div class="common-collapse-title">
                                            {{ item.userName }}（{{ item.customerCount }}）
                                        </div>
                                    </template>
                                    <CaseCustomer :key="item.userId" :list="item.customerList" :code="'ST.HONE.ACQK'"
                                                  @collect="handleCollect" @goDetail="goDetail" />
                                </van-collapse-item>
                            </van-collapse>
                        </van-list>
                    </van-tab>
                </van-tabs>
            </section>
        </main>
        <div class="common-fix-bottom" v-if="isAssign" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" native-type="submit" @click="handleDistribute">确定选择</van-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import FilterSection from '@c/FilterSection'
import CaseCustomer from '@c/CaseCustomer'
import API from '@/request/api/caseSystem/customer'
import MyAPI from '@/request/api/my'
import { getConfig, getSortOptions, getCodeType } from '@/config/caseCustomerConfig'

export default {
    name: 'customerWithoutTab',
    components: {
        TopBar,
        FilterSection,
        CaseCustomer
    },
    data() {
        return {
            codeType: 'ST.CUSTOMER.FAV',
            currentConfig: {},
            orderBy: '1',
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            activeNames: [],
            oldActiveNames: [],
            sortOptions: [
                {
                    text: '留电客户',
                    value: '1'
                },
                {
                    text: '未留电客户',
                    value: '0'
                }
            ],
            pageNum: 1,
            pageSize: 10,
            filterValue: {},
            customerList: [],
            subsalesList: [],
            refresh: false,
            //分配状态
            isAssign: false,
            checkNums: 0,
            checkList: [],
            checkAll: false,
            checkType: 'checkbox',
            activeTab: 1,
            tabList: [{ name: '接待中', value: 0 }, { name: '已接待', value: 1 }]
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList']) },
    created() {
        this.initConfig()
        this.initParams()
        this.activeTab = Number(localStorage.getItem('anChangeConditionActiveTab'))
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
        changeTab() {
            this.initConfig()
            this.initParams()
            this.groupId = ''
            this.showCollapse = false
            this.getList()
        },
        initConfig() {
            this.currentConfig = getConfig(this.$route.query.menuId)
        },
        initParams() {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.customerList = []
            this.subsalesList = []
            this.activeNames = []
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getList()
        },
        //收藏
        async handleCollect(data) {
            let result
            if (data.firstChannelCode === 'C04') {
                let params = {
                    clueId: data.clueId,
                    doFav: !data.isFav2
                }
                result = await API.favInputCustomer(params)
            } else {
                let params = {
                    clientId: data.clientId,
                    doFav: !data.isFav
                }
                result = await API.changeClientFav(params)
            }
            if (result) {
                if (data.firstChannelCode === 'C04') {
                    data.isFav2 = !data.isFav2
                } else {
                    data.isFav = !data.isFav
                }
                let message = data.isFav || data.isFav2 ? '标记成功' : '取消标记'
                this.$toast(message)
                if (this.$route.query.menuId === 'ST.CUSTOMER.FAV') {
                    this.initParams()
                    this.getList()
                }
            }
        },
        changeCollapse(val) {
            if (val.length < this.oldActiveNames.length) {
                this.oldActiveNames = val
                return
            }
            this.staffClientList(val[val.length - 1])
            this.oldActiveNames = val
        },
        changeOrder() {
            this.initParams()
            this.getList()
        },
        //客户详情
        goDetail(item) {
            // return
            if (!item.oppId) return
            this.$router.push({
                path: '/case/customerDetail',
                query: {
                    oppId: item.oppId,
                    clientId: item.clientId,
                    clueId: item.clueId,
                    menuId: item.menuId
                }
            }).catch(()=>{})
        },
        async getClientList() {
            let params = {
                menuId: this.$route.query.menuId,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                type: this.orderBy
            }
            Object.assign(params, this.filterValue)
            let result = await API.getClientList(params)
            result.list.map(item => {
                item.codeType = item.menuId
            })
            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        async getClientFavList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                sortingStrategy: this.orderBy
            }
            Object.assign(params, this.filterValue)
            let result = await API.getClientFavList(params)
            result.list.map(item => {
                /**案场接待的客户下有细分状态
                 * 此处添加对应的codeType，用来在caseCustomerConfig.js下查找对应配置
                 **/
                if (item.menuId === 'ST.CUSTOMER.FOLLOWING') {
                    item.codeType = item.status
                } else {
                    item.codeType = item.menuId
                }
                item.menuType = this.$route.query.menuId
            })
            for (let i = 0; i < 50; i++) {
                result.list.push({
                    customerName: '首尔一',
                    customerStep: 3,
                    customerTel: null,
                    customerType: null,
                    dataStatus: null,
                    dealPool: null,
                    firstChannelCode: null,
                    menuId: 'ST.HOME.ACQK.JDZKH',
                    firstChannelName: '销售登记'
                })
            }
            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        async getTotalClientList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                sortingStrategy: this.orderBy,
                roleCode: this.currentRole.roleCode,
                menuId: 'ST.CUSTOMER.TOTAL'
            }
            Object.assign(params, this.filterValue)
            let result = await API.getTotalClientList(params)
            result.list.map(item => {
                if (item.menuId === 'ST.CUSTOMER.FOLLOWING') {
                    this.$set(item, 'codeType', item.status)
                } else if (item.menuId === 'ST.CUSTOMER.INPUT') {
                    item.codeType = getCodeType('ST.CUSTOMER.INPUT', item.status === 30 ? 20 : item.status)
                } else {
                    this.$set(item, 'codeType', item.menuId)
                }
            })
            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        getList() {
            this.loading = false
            this.finished = true
            this.finishedText = ''
            this.staffSubsalesList()
        },
        handleSearch() {
            this.$store.dispatch('other/setSearchCustomerListType', 'customer')
            this.$store.dispatch('other/setSearchCustomerType', this.$route.query.menuId)
            this.$router.push({
                path: '/searchHistory',
                query: {
                    dataType: this.$route.query.menuId,
                    type: 0
                }
            }).catch(() => {
            })
        },
        // 获取所有下级置业顾问列表
        async staffSubsalesList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                menuId: this.$route.query.menuId,
                isInReception: this.activeTab,
                type: this.orderBy
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.getReceptionGroupByStaff(params)
            this.subsalesList = result
            // if (result.length > 0) {
            //     this.activeNames = [result[0].userId]
            //     this.staffClientList(this.subsalesList[0].userId)
            // } else {
            //     this.finishedText = '没有更多了'
            // }/case/followCustomers
            this.finishedText = '没有更多了'
            this.$toast.clear()
        },
        async staffClientList(id) {
            let params = {
                menuId: this.$route.query.menuId,
                staffId: id,
                projectId: this.projectId,
                type: this.orderBy,
                isInReception: this.activeTab
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.getReceptionByStaff(params)
            result.map(item => {
                /**案场接待的客户下有细分状态
                 * 此处添加对应的codeType，用来在caseCustomerConfig.js下查找对应配置
                 **/
                item.codeType = item.menuId
            })
            this.subsalesList.map(item => {
                if (item.userId === id) {
                    item.customerList = result
                }
            })
            this.$forceUpdate()
            this.$toast.clear()
        },
        //切换分配置业顾问模式
        toggleAssign(val) {
            this.isAssign = val
            if (!val) {
                this.checkList = []
                this.checkNums = 0
                this.checkAll = false
            }
        },
        //选择客户
        checkChange(val) {
            this.checkList = val
            this.checkNums = val.length
        },
        //全选
        toggleCheckALl() {
            this.checkAll = !this.checkAll
        },
        handleDistribute() {
            if (this.checkList.length === 0) {
                this.$toast('请选择客户')
            } else {
                this.$store.dispatch('other/setCheckedCustomer', this.checkList)
                this.$router.push({
                    path: '/customer/chooseConsultant',
                    query: {
                        type: 'REGISTER'
                    }
                }).catch(() => {
                })
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/case/customerDetail')) {
            array = array.filter((item) => {
                return item !== 'customerAnChangCondition'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }

        // 存储当前tab索引
        if (to.path === '/case/customerDetail') {
            localStorage.setItem('anChangeConditionActiveTab', this.activeTab)
        } else {
            localStorage.setItem('anChangeConditionActiveTab', '')
        }
        next()
    },
    watch: {}
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
        /deep/ .van-sticky--fixed {
            z-index: 20;
        }
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

.common-collapse-title {
    display: flex;
    align-items: center;

    .att-avatr {
        margin-right: 10px;;
    }
}
</style>
