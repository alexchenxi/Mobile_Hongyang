<!-- 销售登记客户列表-->
<template>
    <div class="common-page">
        <TopBar title="今日跟客情况">
            <!-- <template slot="append-suffix">
                <span @click="handleSearch" class="iconfont iconsousuo"></span>
            </template> -->
        </TopBar>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <section class="customer-container">
                <van-collapse v-model="activeNames" :border="false" @change="changeCollapse">
                    <van-collapse-item v-for="(item, index) in subsalesList" :key="item.userId" :name="item.userId" :border="true">
                        <template #title>
                            <div class="common-collapse-title">{{ item.userName }}（{{ item.customerCount }}）</div>
                        </template>
                        <CaseCustomer :key="item.userId" :list="item.customerList" @goDetail="goDetail" />
                        <div v-if="item.isShowMoreBtn" class="more-btn-wrap">
                            <div class="more-btn" @click="showMoreClint(index, item.userId)">
                                查看更多
                                <van-icon class="icon-arrow" name="arrow-down" />
                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-empty
                    v-if="!subsalesList || !subsalesList.length"
                    class="custom-image"
                    :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
            </section>
        </main>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import CaseCustomer from '@c/CaseCustomer'
import API from '@/request/api/caseSystem/customer'
import { getConfig } from '@/config/caseCustomerConfig'
export default {
    name: 'FollowCustomers',
    components: {
        TopBar,
        CaseCustomer,
    },
    data() {
        return {
            currentConfig: {},
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            activeTab: 10,
            oldActiveNames: [],
            activeNames: [],
            pageNum: 1,
            pageSize: 10,
            customerList: [],
            subsalesList: [],
            refresh: false,
            total: 0,
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList', 'user']) },
    watch: {},
    async created() {
        this.initParams()
        this.getList()
    },
    methods: {
        initParams() {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.customerList = []
            this.subsalesList = []
            this.activeNames = []
        },
        changeCollapse(val) {
            if (val.length < this.oldActiveNames.length) {
                this.oldActiveNames = val
                return
            }
            const curUserId = val[val.length - 1]
            const index = this.subsalesList.findIndex((item) => item.userId === curUserId)
            if (this.subsalesList[index] && this.subsalesList[index].customerList) return
            this.staffClientList(val[val.length - 1], 1)
            this.oldActiveNames = val
        },
        getList() {
            this.loading = false
            this.finished = true
            this.finishedText = ''
            this.getFollowGroupByStaff()
        },
        //客户详情
        goDetail(item) {
            if (item.oppId) {
                this.$router
                    .push({
                        path: '/case/customerDetail',
                        query: {
                            oppId: item.oppId,
                            clientId: item.clientId,
                            clueId: item.clueId,
                            menuId: item.menuId,
                        },
                    })
                    .catch(() => {})
            } else {
                this.$router
                    .push({
                        path: '/case/customerCaseRegisterDetail',
                        query: {
                            oppId: item.oppId,
                            clientId: item.clientId,
                            clueId: item.clueId,
                            menuId: 'ST.CUSTOMER.INPUT',
                        },
                    })
                    .catch(() => {})
            }
        },
        // 获取所有下级置业顾问列表
        async getFollowGroupByStaff() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                userId: this.user.id,
            }
            this.$utils.loading()

            let result = await API.getFollowGroupByStaff(params)
            this.subsalesList = result
            // if (result.length > 0) {
            //     this.activeNames = [result[0].userId]
            //     this.staffClientList(this.subsalesList[0].userId, 1)
            // } else {
            //     this.finished = true
            //     this.loading = false
            //     this.finishedText = '没有更多了'
            // }
            this.finished = true
            this.loading = false
            this.finishedText = '没有更多了'
            this.$toast.clear()
        },
        // 加载更多客户
        async showMoreClint(index, curUserId) {
            let pageNum = this.subsalesList[index].pageNum || 1
            this.subsalesList[index].pageNum = pageNum + 1
            this.staffClientList(curUserId, this.subsalesList[index].pageNum)
        },
        async staffClientList(id, pageNum) {
            if (!id) return
            let params = {
                userId: id,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                //  pageNum:pageNum,
                // pageSize:this.pageSize
            }
            this.$utils.loading()
            let result = await API.getFollowByStaff(params)
            this.subsalesList.map((item) => {
                if (item.userId === id) {
                    result.map((item) => {
                        item.codeType = 'ST.HOME.ACQK.GJQK'
                        if (item.visitType) {
                            item.isFirstVisit = item.visitType === '首访'
                        } else {
                            item.isFirstVisit = null
                        }
                    })
                    item.customerList = item.customerList ? item.customerList.concat(result) : result
                    // if (result.isLastPage || !result?.list.length) {
                    //     item.isShowMoreBtn = false
                    // } else {
                    //     item.isShowMoreBtn = true
                    // }
                }
            })
            this.$forceUpdate()
            this.$toast.clear()
        },
    },
}
</script>
<style scoped lang="less">
.common-page-container {
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
        .common-collapse-title {
            font-size: 16px;
        }
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
