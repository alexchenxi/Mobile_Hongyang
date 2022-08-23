<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar title="我的客户">
                <span @click="handleSearch" slot="append-suffix" class="iconfont iconsousuo"></span>
            </top-bar>
        </div>
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <div class="main-container">
                <div class="customer-section">
                    <!-- 筛选条件 -->
                    <div class="multiple-filter">
                        <div class="multiple-filter-left">
                            <van-dropdown-menu :class="[activeFilter === 1 ? 'active-filter' : '']" active-color="#DB0826">
                                <van-dropdown-item ref="filter" v-model="filterForm.projectId" :options="projectArray" @change="filterCustomer" @open="highlightFilter(1)"></van-dropdown-item>
                            </van-dropdown-menu>
                            <van-dropdown-menu :class="[activeFilter === 2 ? 'active-filter' : '']" active-color="#DB0826">
                                <van-dropdown-item ref="filter" v-model="filterForm.sortType" :options="sortOptions" @change="filterCustomer" @open="highlightFilter(2)"></van-dropdown-item>
                            </van-dropdown-menu>
                        </div>
                        <div v-if="filterList.length>0" :class="[activeFilter === 3 ? 'active-filter' : '']" @click="highlightFilter(3)">
                            <FilterSection ref="filterSection" :filter-list="filterList" container=".customer-section" @change="handleFilter" />
                        </div>
                    </div>
                    <div class="main-section">
                        <van-list ref="customerList" offset="10" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                            <CustomerSection :list="customerList" @goDetail="goCustomerDetail" />
                        </van-list>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import CustomerSection from '@/components/ExtensionCustomer'
import FilterSection from '@c/FilterSection'
import PROJECTAPI from '@/request/api/caseSystem/home'
import { mapGetters } from 'vuex'
import { getSortOptions, getConfig } from '@/config/extensionCustomerConfig'
import API from '@/request/api/selfExtension/keyAndBee'
export default {
    components: {
        TopBar,
        CustomerSection,
        FilterSection
    },
    data() {
        return {
            activeFilter: '',
            projectArray: [], // 项目列表
            filterForm: {
                projectId: '',
                sortType: 1,
                clueStatus: ''
            },
            sortOptions: [], // 排序列表
            filterList: [], // 筛选条件
            loading: false,
            finished: true,
            customerList: [], // 客户列表
            pageNum: 1,
            code: ''
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole','user']) },
    mounted() {
        this.initData()
    },
    methods: {
        // 初始化数据
        async initData() {
            await this.getProjectList()
            if(this.user.roleCode === 'ZT_KEYMAN') {
                this.code = 'keyCustomer'
            } else if (this.user.roleCode = 'ZT_BEEMAN') {
                this.code = 'beeCustomer'
            }
            this.sortOptions = getSortOptions(this.code)
            this.filterList = getConfig(this.code).filterList
            this.getCustomerList()
        },
        // 搜索
        handleSearch() {
            this.$router.push({
                path: '/searchHistory',
                query: {
                    dataType: this.code,
                    type: 3
                },
            }).catch(()=>{})
        },
        // 筛选高亮
        highlightFilter(val) {
            this.activeFilter = val
        },
        // 获取项目列表
        async getProjectList() {
            let params = {
                roleCode: this.currentRole.roleCode
            }
            const result = await PROJECTAPI.projectListApi(params)
            this.projectArray = result.map(item => {
                return {
                    text: item.projectName,
                    value: item.projectId
                }
            })
            this.filterForm.projectId = this.projectArray[0].value
        },
        // 筛选
        handleFilter(val) {
            this.filterForm.clueStatus = val.status.length > 0 ? val.status[0] : null
            this.filterCustomer()
        },
        filterCustomer() {
            this.pageNum = 1
            this.customerList = []
            this.getCustomerList()
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getCustomerList()
        },
        // 跳转客户详情
        goCustomerDetail(item) {
            // 待报备客户不能跳转详情
            if (this.code === 'beeCustomer') {
                return
            }
            this.$router.push({
                path: '/extension/customerDetail',
                query: {
                    oppId: item.oppId,
                    clueId: item.clueId,
                    canEdit: item.canEdit
                }
            }).catch(()=>{})
        },
        // 获取客户列表
        async getCustomerList() {
            let params = {
                pageNum: this.pageNum,
                pageSize: 10
            }
            Object.assign(params, this.filterForm)
            this.loading = true
            this.finished = false
            let result = await API.beeCustomerList(params)
            this.loading = false
            if (result.list.length < 10) {
                this.finished = true
            } else {
                this.finished = false
            }
            result.list.map(item => {
                item.codeType = this.code
                item.canEdit = true
            })
            this.customerList = this.customerList.concat(result.list)
        }
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    background: #f6f8fa;
}
.main-container {
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
        .active-filter {
            ::v-deep .van-dropdown-menu__title {
                color: @theme-color;
            }
        }
    }
}
</style>
