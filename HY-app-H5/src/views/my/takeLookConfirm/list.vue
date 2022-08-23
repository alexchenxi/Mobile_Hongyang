<template>
    <div class="common-page">
        <TopBar title="带看确认单">
            <span @click="handleSearch" slot="append-suffix" class="iconfont iconsousuo"></span>
        </TopBar>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <section class="customer-container">
                <van-tabs v-model="activeTab" @change="changeTab" animated :before-change="beforeChangeTabs">
                    <van-tab v-for="tab in tabList" :key="tab.value" :title="tab.name" :name="tab.value">
                        <section class="filter-container">
                            <div class="left-section">
                                <van-dropdown-menu active-color="#DB0826" class="dropdown-project">
                                    <van-dropdown-item ref="filter" v-model="projectId" :options="projectList" @change="changeFilter" get-container="body"></van-dropdown-item>
                                </van-dropdown-menu>
                                <van-dropdown-menu active-color="#DB0826">
                                    <van-dropdown-item ref="filter" v-model="orderBy" :options="sortOptions" @change="changeFilter" get-container="body"></van-dropdown-item>
                                </van-dropdown-menu>
                            </div>
                            <div class="right-section">
                                <div class="filter-section">
                                    <FilterSection ref="filterSection" :filter-list="currentConfig.filterList" container=".customer-container" @change="handleFilter" />
                                </div>
                            </div>
                        </section>
                        <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad" offset="20" :immediate-check="false">
                            <CaseCustomer :list="takelookList" @goDetail="goDetail" @sign="sign" />
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
import API from '@/request/api/my'
import HOMEAPI from '@/request/api/caseSystem/home'
import { getConfig, getSortOptions } from '@/config/caseCustomerConfig'
export default {
    name: 'takelookList',
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
            projectId: 1,
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            activeTab: '',
            projectList: [],
            tabList: [
                {
                    value: 2,
                    name: '未确认'
                },
                {
                    value: 1,
                    name: '已确认'
                }
            ],
            pageNum: 1,
            pageSize: 10,
            filterValue: {},
            takelookList: [],
            refresh: false,
            codeText: 'takelook-',
            scrollY: 0
        }
    },
    computed: { ...mapGetters(['currentRole', 'keepAliveList', 'operatoreSaveSign']) },
    async created() {
        this.activeTab = this.tabList[0].value
        await this.getProjectList()
        this.initConfig()
        this.initParams()
        await this.getTakelookList()
    },
    async activated() {
        let vanList = document.querySelector('.van-list')
        vanList.scrollTop = this.scrollY
        if (this.operatoreSaveSign) {
            vanList.scrollTop = 0
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.takelookList = []
            this.getTakelookList()
            this.$store.dispatch('other/setSaveSign', false)
        }
    },
    methods: {
        initConfig() {
            this.orderBy = 1
            this.currentConfig = getConfig(this.codeText + this.activeTab)
            this.sortOptions = getSortOptions(this.codeText + this.activeTab)
        },
        initParams() {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.filterValue = {}
            this.takelookList = []
        },
        changeFilter() {
            this.initParams()
            this.getTakelookList()
        },
        //筛选
        handleFilter(val) {
            this.initParams()
            this.filterValue = val
            this.getTakelookList()
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getTakelookList()
        },
        changeTab() {
            this.initConfig()
            this.initParams()
            this.orderBy = 1
            this.getTakelookList()
        },
        beforeChangeTabs() {
            if (this.loading) {
                return false
            } else {
                this.$refs.filterSection.map(ele => {
                    ele.resetFilter()
                })
                return true
            }
        },
        //带看确认单详情
        goDetail(item) {
            this.$router
                .push({
                    path: '/my/takelookDetail',
                    query: {
                        id: item.id,
                        checkSign: item.checkSign
                    }
                })
                .catch(() => {})
        },
        // 在线签名
        sign(item) {
            this.$router
                .push({
                    path: '/signature',
                    query: {
                        id: item.id
                    }
                })
                .catch(() => {})
        },
        // 获取带看确认单
        async getTakelookList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                visitSortType: this.orderBy,
                type: this.activeTab
            }
            Object.assign(params, this.filterValue)

            let result = await API.getTakelookList(params)
            result.list.map(item => {
                item.codeType = this.codeText + this.activeTab
                item.canEdit = true
            })
            this.takelookList = this.takelookList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
                this.finishedText = '没有更多了'
            } else {
                this.finished = false
            }
            this.loading = false
        },
        // 搜索
        handleSearch() {
            this.$router
                .push({
                    path: '/searchHistory',
                    query: {
                        dataType: 'takelook',
                        type: 6
                    }
                })
                .catch(() => {})
        },
        // 获取项目
        async getProjectList() {
            let params = {
                roleCode: this.currentRole.roleCode
            }
            return HOMEAPI.projectListApi(params).then(data => {
                this.projectList = data.map(x => {
                    return {
                        text: x.projectName,
                        value: x.projectId
                    }
                })
                if (this.projectList.length) {
                    this.projectId = this.projectList[0].value
                }
            })
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList
            if (!array.includes('takelookList')) {
                array.push('takelookList')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        this.scrollY = document.querySelector('.van-list').scrollTop
        if(to.path.length - to.path.indexOf('/my') == 3) {
            this.$store.dispatch('other/setSaveSign', true)
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
        .dropdown-project {
            max-width: 160px;
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
