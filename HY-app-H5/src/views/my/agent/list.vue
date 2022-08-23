<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar title="自渠下线经纪人">
                <span @click="handleSearch" slot="append-suffix" class="iconfont iconsousuo"></span>
            </top-bar>
        </div>
        <div class="common-page-container" :style="{ height: pageMiddleWithButtonHeight }">
            <div class="main-container">
                <div class="customer-section">
                    <van-tabs v-model="activeTab" @change="changeTab" animated>
                        <van-tab v-for="tab in tabList" :key="tab.value" :title="tab.name" :name="tab.value" :disabled="loading">
                            <!-- 筛选条件 -->
                            <div class="multiple-filter">
                                <div class="multiple-filter-left">
<!--                                    <van-dropdown-menu>-->
<!--                                        <van-dropdown-item v-model="projectId" :options="projectList"-->
<!--                                                           @change="agentCustomer" get-container="body"/>-->
<!--                                    </van-dropdown-menu>-->
                                </div>
                                <div class="multiple-filter-right">
                                    <FilterSection ref="filterSection" :filter-list="filterList" :checkType="'radio'" :needCheckAll="false" :checkButtonDefaultValue='3' container="body" @change="handleFilter" :before-close="beforeClose" />
                                </div>
                            </div>
                            <div class="main-section">
                                <van-list ref="customerList" offset="10" v-model="loading" :finished="finished"
                                          finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                                    <CustomerSection :list="customerList" @goDetail="goDetail"/>
                                </van-list>
                            </div>
                        </van-tab>
                    </van-tabs>
                </div>
            </div>
        </div>
        <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" @click="showQRcode">邀请二维码</van-button>
        </div>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import CustomerSection from '@/components/agentCustomer'
import FilterSection from '@c/FilterSection'
import { mapGetters } from 'vuex'
import API from '@/request/api/my'
import HOMEAPI from '@/request/api/caseSystem/home'

export default {
    name: 'agentList',
    components: {
        TopBar,
        CustomerSection,
        FilterSection
    },
    data() {
        return {
            activeTab: 0,
            tabList: [
                {
                    value: 0,
                    name: '绑定中'
                },
                {
                    value: 1,
                    name: '已解绑'
                }
            ],
            sortOptions: [], // 排序列表
            filterList: [
                {
                    name: '排序',
                    type: 'check',
                    checkType: 'radio',
                    field: 'orderParam',
                    list: [
                        {
                            label: '最早成为经纪人',
                            value: 3
                        }, {
                            label: '最晚成为经纪人',
                            value: 4
                        },
                    ]
                },
                {
                    name: '成为经纪人时间',
                    type: 'date',
                    field: 'dateTime',
                    dateName: ['startTime', 'endTime']
                },
            ], // 筛选条件
            loading: false,
            finished: true,
            customerList: [], // 客户列表
            nameOrTel: '',
            startTime: '',
            project: '',
            endTime: '',
            pageNum: 1,
            projectList: [],
            filterValue: {}
        }
    },
    computed: { ...mapGetters(['currentRole', 'projectId']) },
    mounted() {
        this.project = this.projectId
        this.initData()
    },
    methods: {
        // 初始化数据
        async initData() {
            await this.getProjectList()
            await this.getCustomerList()
        },
        initParams() {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.filterValue = {}
            this.customerList = []
        },
        showQRcode() {
            this.$router.push({
                path: '/my/myQrCode',
                query: {
                    userType: 6
                }
            }).catch(()=>{})
        },
        // 搜索
        handleSearch() {
            this.$router.push({
                path: '/searchHistory',
                query: {
                    dataType: 'agentPhone',
                    type: '8',
                    activeTab: this.activeTab
                }
            }).catch(() => {
            })
        },
        agentCustomer() {
            this.pageNum = 1
            this.customerList = []
            this.getCustomerList()
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getCustomerList()
        },
        changeTab(val) {
            this.activeTab = val
            this.initParams()
            this.getCustomerList()
        },
        handleFilter(val) {
            this.filterValue = val
        },
        beforeClose(done) {
            done()
            this.pageNum = 1
            this.customerList = []
            this.getCustomerList()
        },
        // 获取客户列表
        async getCustomerList() {
            let params = {
                orderParam: 1,
                ...this.filterValue,
                nameOrTel: this.nameOrTel,
                projectId: this.project,
                isUnbind: this.activeTab,
                pageNum: this.pageNum,
                pageSize: 10
            }
            Object.assign(params)
            this.loading = true
            this.finished = false
            let result = await API.getMyChildBroker(params).finally(err => {
                this.loading = false
                this.finished = true
            })
            this.loading = false
            if (result.list.length < 10) {
                this.finished = true
            } else {
                this.finished = false
            }
            result.list.map(item => {
                item.codeType = this.$route.query.dataType
                // item.canEdit = true
            })
            this.customerList = this.customerList.concat(result.list)
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
                    this.project = this.projectList[0].value
                }
            })
        },
        goDetail(item) {
            if (this.activeTab === 1) return
            this.$router.push({
                path: '/extension/customer',
                query: {
                    id: item.id,
                    name:item.name
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    background: #f6f8fa;

    .main-container {
        height: 100%;
        ///deep/ .van-tabs {
        //    height: 100%;
        //    .van-tabs__content {
        //        height: calc(100% - 44px);
        //        .van-list {
        //            height: 100%;
        //            overflow: auto;
        //        }
        //    }
        //}
        .customer-section {
            height: 100%;

            //.main-section {
            //    height: calc(100% - 44px);
            //    overflow: auto;
            //}
        }
    }
}

.main-container {
    .multiple-filter {
        background: #fff;
        height: 44px;

        .multiple-filter-left {
            height: 40px;

            .group-filter {
                .van-dropdown-menu__title {
                    .van-ellipsis {
                        max-width: 120px;
                    }
                }
            }
        }

        .multiple-filter-right {
            height: 40px;

            .group-filter {
                .van-dropdown-menu__title {
                    .van-ellipsis {
                        max-width: 103px;
                    }
                }
            }
        }

        .active-filter {
            ::v-deep .van-dropdown-menu__title {
                color: @theme-color;
            }
        }

        .van-cell.active {
            background: #f2f6fe;
        }

        /deep/ .custom-radio {
            .van-radio {
                .van-icon {
                    border: none;
                }

                .van-radio__icon--checked {
                    .van-icon {
                        color: @theme-color;
                        border-color: none !important;
                        background: none !important;
                        width: 18px;
                        height: 18px;
                        font-size: 18px;
                        border: none;
                    }
                }
            }
        }
    }
}
</style>
