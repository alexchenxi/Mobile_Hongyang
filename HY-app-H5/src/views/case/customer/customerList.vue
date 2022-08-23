<template>
    <div class="common-page">
        <TopBar :title="currentConfig.name + '客户'">
      <span
          slot="append-suffix"
          class="iconfont iconsousuo"
          @click="handleSearch"
      />
        </TopBar>
        <main
            class="common-page-container"
            :style="{ height: pageContainerHeight }"
        >
            <section class="filter-container">
                <div class="left-section">
                    <van-dropdown-menu
                        v-if="sortOptions && sortOptions.length"
                        active-color="#DB0826"
                    >
                        <van-dropdown-item
                            ref="filter"
                            v-model="orderBy"
                            :options="sortOptions"
                            @change="changeOrder"
                        />
                    </van-dropdown-menu>
                </div>
                <div class="right-section">
                    <div
                        v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.MODE']"
                        v-if="currentConfig.actions && currentConfig.actions.switch"
                        class="switch-button"
                        @click="switchCustomerType"
                    >
                        <span :class="['iconfont', showCollapse ? 'iconkehuqiehuan' : 'iconzhiyeguwenqiehuan']" />
                        {{ showCollapse ? '顾问' : '客户' }}
                    </div>
                    <div class="filter-section" v-if="showFilter">
                        <FilterSection
                            :filter-list="currentConfig.filterList"
                            @change="handleFilter"
                        />
                    </div>
                </div>
            </section>
            <section class="customer-container">
                <div class="tips" v-if="isTipsShow && customerList.length>0">提醒：以下客户待签约，详情请进入ERP系统查看</div>
                <van-list
                    v-model="loading"
                    :finished="finished"
                    :finished-text="finishedText"
                    offset="20"
                    :immediate-check="false"
                    @load="onLoad"
                >
                    <CaseCustomer
                        v-if="currentRole.roleCode === 'ST_SALES'"
                        :list="customerList"
                        @goDetail="goDetail"
                        @reception="reception"
                    />
                    <template v-else>
                        <van-collapse
                            v-model="activeNames"
                            :border="false"
                            @change="changeCollapse"
                        >
                            <van-collapse-item
                                v-for="item in subsalesList"
                                :key="item.userId"
                                :name="item.userId"
                                :border="true"
                            >
                                <template #title>
                                    <div class="common-collapse-title">
                                        {{ item.userName }}（{{ item.customerCount }}）
                                    </div>
                                </template>
                                <CaseCustomer
                                    :key="item.userId"
                                    :list="item.customerList"
                                    @goDetail="goDetail"
                                />
                                <div
                                    v-if="item.isShowMoreBtn"
                                    class="more-btn-wrap"
                                >
                                    <div
                                        class="more-btn"
                                        @click="showMoreClint"
                                    >
                                        查看更多
                                        <van-icon
                                            class="icon-arrow"
                                            name="arrow-down"
                                        />
                                    </div>
                                </div>
                            </van-collapse-item>
                        </van-collapse>
                    </template>
                </van-list>
            </section>
        </main>
        <ClientTypeSetting
            :show-setting="showSetting"
            :item="curItem"
            @handleClose="handleClose"
        />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import FilterSection from '@c/FilterSection'
import CaseCustomer from '@c/CaseCustomer'
import ClientTypeSetting from '@c/ClientTypeSetting'
import API from '@/request/api/caseSystem/customer'
import { getConfig, getSortOptions } from '@/config/caseCustomerConfig'
import { commonMethods } from 'movit-utils'
import WHITEBOARDAPI from '@/request/api/caseSystem/whiteboard'
import MyAPI from '@/request/api/my'

export default {
    name: 'CustomerList',
    components: {
        TopBar,
        FilterSection,
        CaseCustomer,
        ClientTypeSetting
    },
    data() {
        return {
            codeType: 'ST.CUSTOMER.FAV',
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
            curItem: {},
            refresh: false,
            showSetting: false,
            isTipsShow: false,
            showFilter:true
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole', 'keepAliveList'])
    },
    watch: {},
    created() {
        if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.FINISHRECEPTION') {
            this.orderBy = 3
        }
        // 认购未签约，列表上展示提醒文案
        if (this.$route.query.menuId === 'ST.HOME.OVERALERT.OVERCONTRACT') {
            this.isTipsShow = true
        }
        this.initConfig()
        this.initParams()
        if (this.currentRole.roleCode !== 'ST_SALES') {
            // 只有置业顾问才有标签筛选
            this.currentConfig.filterList = this.currentConfig.filterList.filter(item => item.field !== 'tagNames')
            if(this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.TOARRIVE'){
                this.showFilter=false
            }
            this.getSubSalesList()
        } else {
            this.getClientList()
        }
    },
    activated() {
        if (this.refresh) {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.customerList = []
            this.subsalesList = []
            this.activeNames = []
            this.getClientList()
            this.refresh = false
        }
    },
    methods: {
        initConfig() {
            this.currentConfig = getConfig(this.$route.query.menuId)
            let date = new Date()
            let defaultDate = this.$utils.spliceTime([commonMethods.DateToString(date), commonMethods.DateToString(date)])
            //筛选时间默认为当天
            if (this.$route.query.isFromHomePage === '1') {
                if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.FINISHRECEPTION') {
                    this.filterValue = {
                        visitStartDate: defaultDate[0],
                        visitEndDate: defaultDate[1]
                    }

                    const lastIndex = this.currentConfig.filterList.length - 1
                    this.currentConfig.filterList[lastIndex].defaultValue = [defaultDate[0].split(' ')[0], defaultDate[1].split(' ')[0]]
                    this.currentConfig.filterList[lastIndex].notShow = true
                }
                if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.TOVISIT') {
                    const lastIndex = this.currentConfig.filterList.length - 1
                    this.currentConfig.filterList[lastIndex].notShow = true
                }
            }
            this.sortOptions = getSortOptions(this.$route.query.menuId)
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
            if (this.currentRole.roleCode === 'ST_SALES') {
                this.getClientList()
            } else {
                this.getSubSalesList()
            }

        },
        //筛选
        handleFilter(val) {
            this.filterValue = val
            this.initParams()
            if (this.currentRole.roleCode === 'ST_SALES') {
                this.getClientList()
            } else {
                this.getSubSalesList()
            }
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            if (this.currentRole.roleCode !== 'ST_SALES') {
                this.finished = true
                return
            }
            this.getClientList()
        },
        //客户详情
        goDetail(item) {
            if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.TOARRIVE') {
                this.$router.push({
                    path: '/case/customerCaseRegisterDetail',
                    query: {
                        oppId: item.oppId,
                        clueId: item.clueId,
                        status: item.status,
                        customerId: item.customerId,
                        canEdit: item.canEdit,
                        menuId: item.menuId,
                        clientId: item.clientId,
                        noVisit: item.customerStep === 1
                    }
                }).catch(() => {
                })
            } else {
                this.$router.push({
                    path: '/case/customerDetail',
                    query: {
                        oppId: item.oppId,
                        clueId: item.clueId,
                        status: item.status,
                        customerId: item.customerId,
                        canEdit: item.canEdit,
                        menuId: item.menuId,
                        clientId: item.clientId,
                        noVisit: item.customerStep === 1
                    }
                }).catch(() => {
                })
            }

        },
        // 获取所有顾问列表
        async getSubSalesList() {
            let params = {
                menuId: this.$route.query.menuId,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                sortingStrategy: this.orderBy
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.getListByMenuGroupByStaff(params)
            this.subsalesList = result
            // if (result.length > 0) {
            //     this.activeNames = [result[0].userId]
            //     this.oldActiveNames = [result[0].userId]
            //     this.subsalesList[0].pageNum=1
            //     this.getClientList(this.subsalesList[0].userId,this.subsalesList[0].pageNum)
            // } else {
            //     this.finishedText = '没有更多了'
            // }
            this.finishedText = '没有更多了'
            this.finished = true
            this.$toast.clear()
        },
        async getClientList(userId,pageNum) {
            let params = {
                staffId: userId || '',
                menuId: this.$route.query.menuId,
                pageSize: this.pageSize,
                pageNum: pageNum||this.pageNum,
                projectId: this.projectId,
                currentRoleCode: this.currentRole.roleCode,
                roleCode: userId?'ST_SALES':this.currentRole.roleCode,  // 查置业顾问下的用户都是'ST_SALES'
                sortingStrategy: this.orderBy
            }
            Object.assign(params, this.filterValue)
            let result = await API.clientListByMenu(params)
            result.list.map((item) => {
                item.codeType = this.$route.query.menuId
            })
            // 展示顾问纬度下的客户
            if (userId) {
                this.subsalesList.map(item => {
                    if (item.userId === userId) {
                        item.customerList = item.customerList ? item.customerList.concat(result.list) : result.list
                        if (result.list.length < this.pageSize) {
                            item.isShowMoreBtn = false
                        } else {
                            item.isShowMoreBtn = true
                        }
                    }
                })
                this.finished = false
                this.loading = false
                this.$forceUpdate()
                this.$toast.clear()
                return
            }


            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        handleSearch() {
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
        // 完成接待
        async reception(item) {
            this.showSetting = true
            this.curItem = item
            return
        },
        // 关闭弹窗
        handleClose(val) {
            if (val.status === '无效') {
                this.getData()
            }
            this.showSetting = val.flag
        },
        changeCollapse(val) {
            this.pageNum = 1
            if (!val.length) return
            const curUserId = val[val.length - 1]
            const index = this.subsalesList.findIndex(item => item.userId === curUserId)
            if (val.length < this.oldActiveNames.length) {
                this.oldActiveNames = val
                return
            }
            //收起在展开不需要重新调用接口
            if (this.subsalesList && this.subsalesList[index]?.customerList?.length) return
            this.subsalesList[index].pageNum=this.subsalesList[index].pageNum||1
            this.getClientList(curUserId,this.subsalesList[index].pageNum)
            this.oldActiveNames = val
        },
        // 加载更多客户
        async showMoreClint() {
            const  curUserId=this.oldActiveNames[this.oldActiveNames.length - 1]
            const index = this.subsalesList.findIndex(item => item.userId === curUserId)
            this.subsalesList[index].pageNum=this.subsalesList[index].pageNum+1
            this.getClientList(curUserId,this.subsalesList[index].pageNum)
        },
        //切换客户列表展示形式
        switchCustomerType() {
            this.showCollapse = !this.showCollapse
            this.initParams()
            this.getClientList()
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            let aliveList = ['caseCustomerDetail', 'receptionRecord']
            if (array.indexOf('customerWithoutTab') === -1) {
                array.push('customerWithoutTab')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/case/customerDetail') || from.path.includes('/case/receptionRecord')) {
                vm.refresh = true
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/case/customerDetail') && !to.path.includes('/case/receptionRecord')) {
            array = array.filter((item) => {
                return item !== 'customerWithoutTab'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    }
}
</script>
<style scoped lang="less">
.iconsousuo {
    padding: 8px;
    padding-right: 0;
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

        /deep/ .van-dropdown-menu__title, .switch-button {
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
        }

        .tips {
            color: @theme-color;
            //font-weight: bold;
            padding: 5px;
            text-align: center;
        }

        .more-btn-wrap {
            margin-top: -20px;
            margin-bottom: 40px;
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
    }
}
</style>
