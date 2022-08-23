<template>
    <div class="common-page">
        <TopBar :title="$route.query.name">
            <span @click="handleSearch" slot="append-suffix" class="iconfont iconsousuo"></span>
        </TopBar>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <section class="filter-container">
                <div class="left-section">
                    <van-dropdown-menu active-color="#DB0826">
                        <van-dropdown-item ref="filter" v-model="orderBy" :options="sortOptions" @change="changeOrder"></van-dropdown-item>
                    </van-dropdown-menu>
                </div>
                <div class="right-section">
                    <div class="switch-button" v-if="currentRole.roleCode !== 'ST_SALES' && currentConfig.actions && currentConfig.actions.switch" @click="switchCustomerType">
                        <span :class="['iconfont', showCollapse ? 'iconkehuqiehuan' : 'iconzhiyeguwenqiehuan']"></span>
                        切换
                    </div>
                    <div class="filter-section">
                        <FilterSection :filter-list="currentConfig.filterList" @change="handleFilter" />
                    </div>
                </div>
            </section>
            <section class="customer-container">
                <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad" offset="20" :immediate-check="false">
                    <CaseCustomer v-if="!showCollapse" :list="billList" @goDetail="goDetail" />
                    <van-collapse v-model="activeNames" :border="false" v-else @change="changeCollapse">
                        <van-collapse-item v-for="item in subsalesList" :key="item.userId" :name="item.userId" :border="true">
                            <template #title>
                                <div class="common-collapse-title">{{ item.userName }}（{{ item.formCount }}）</div>
                            </template>
                            <CaseCustomer :key="item.userId" :list="item.billList" @goDetail="goDetail" />
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
import API from '@/request/api/caseSystem/housing'
import { getConfig, getSortOptions } from '@/config/caseCustomerConfig'
export default {
    name: 'billList',
    components: {
        TopBar,
        FilterSection,
        CaseCustomer
    },
    data() {
        return {
            codeType: '',
            currentConfig: {},
            sortOptions: [],
            orderBy: 1,
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            activeNames: [],
            oldActiveNames: [],
            // 切换模式
            showCollapse: false,
            pageNum: 1,
            pageSize: 10,
            filterValue: {},
            billList: [],
            subsalesList: [],
            refresh: false,
            total: 0
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList']) },
    created() {
        this.initConfig()
        this.initParams()
        this.getList()
    },
    activated() {
        if (this.refresh) {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.billList = []
            this.subsalesList = []
            this.activeNames = []
            this.getList()
            this.refresh = false
        }
    },
    methods: {
        initConfig() {
            this.codeType = 'bill-' + this.$route.query.type
            this.currentConfig = getConfig(this.codeType)
            this.sortOptions = getSortOptions(this.codeType)
        },
        initParams() {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.billList = []
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
            if(val.length === 0) {
                return
            }
            this.staffBillList(val[val.length - 1])
            this.oldActiveNames = val
        },
        //切换客户列表展示形式
        switchCustomerType() {
            this.showCollapse = !this.showCollapse
            this.initParams()
            this.getList()
        },
        //单据详情
        goDetail(item) {
            this.$router.push({
                path: '/case/documentDetail',
                query: {
                    clientId: item.clientId,
                    type: this.$route.query.type,
                    id: item.formId
                }
            })
        },
        // 获取列表数据
        async getBillList() {
            let params = {
                type: Number(this.$route.query.type),
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                sortingStrategy: this.orderBy
            }
            Object.assign(params, this.filterValue)
            console.log(params)
            let result = await API.getBillList(params)
            // 输出结果
            result.list.map(item => {
                item.codeType = this.codeType
                // 无效时展示
                item.dataStatusName = item.status ? '' : item.dataStatusName
            })
            this.billList = this.billList.concat(result.list)
            this.total = result.total
            if (this.billList.length === this.total) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        getList() {
            if (this.showCollapse) {
                this.loading = false
                this.finished = true
                this.finishedText = ''
                this.staffSubsalesList()
            } else {
                this.getBillList()
            }
        },
        handleSearch() {
            this.$router.push({
                path: '/searchHistory',
                query: {
                    dataType: this.codeType,
                    type: 5
                }
            })
        },
        // 获取所有下级置业顾问列表
        async staffSubsalesList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                type: Number(this.$route.query.type)
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.getSubsalesList(params)
            this.subsalesList = result
            if (result.length > 0) {
                this.activeNames = [result[0].userId]
                this.staffBillList(this.subsalesList[0].userId)
            } else {
                this.finishedText = '没有更多了'
            }
            this.$toast.clear()
        },
        async staffBillList(id) {
            let params = {
                type: Number(this.$route.query.type),
                staffId: id,
                projectId: this.projectId,
                sortingStrategy: this.orderBy
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.getBillListByStaff(params)
            result.map(item => {
                item.codeType = this.codeType
                // 无效时展示
                item.dataStatusName = item.status ? '' : item.dataStatusName
            })
            this.subsalesList.map(item => {
                if (item.userId === id) {
                    item.billList = result
                }
            })
            this.$forceUpdate()
            this.$toast.clear()
        }
    },
    watch: {},
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        let index = array.findIndex(item => item === 'billList')
        if (!to.path.includes('/case/documentDetail')) {
            if(index > -1) {
                array.splice(index, 1)
            }
        }else {
            if (index === -1) {
                array.push('billList')
            }
        }
        this.$store.dispatch('other/setKeepAlive', array)
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
