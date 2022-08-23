<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar  :title="title"></top-bar>
        </div>
        <div class="customer-total">置业顾问:<span class="text-strong">{{staffName}}</span></div>
        <div class="common-page-middle" :style="{ height: pageMiddleHeight }">
            <div class="main-container">
                <div class="customer-section">
                    <van-list ref="customerList" v-model="loading" offset="20" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
                         <CaseCustomer  :list="customerList"  @goDetail="goDetail" />
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import CaseCustomer from '@/components/CaseCustomer'
import API from '@/request/api/caseSystem/customer'
import { getCodeType } from '@/config/caseCustomerConfig'
export default {
    name: 'customerGradeDetail',
    components: {
        TopBar,
        CaseCustomer
    },
    data() {
        return {
            //列表加载
            loading: false,
            finished: false,
            // 客户列表
            customerList: [],
            pageNum: 1,
            pageSize: 10,
            list: [],
            total: 0,
            filterDate: [],
            title:'',
            staffName:''

        }
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'keepAliveList', 'currentRole', 'device'])
    },
    mounted() {
        this.title = this.$route.query.level + '等级客户'
        this.staffName = this.$route.query.staffName
        this.init()
    },
    methods: {
        init() {
            this.customerList = []
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.getCustomerList()
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
                            menuId: item.menuId
                        }
                    })
                    .catch(() => {
                    })
            } else {
                this.$router
                    .push({
                        path: '/case/customerCaseRegisterDetail',
                        query: {
                            oppId: item.oppId,
                            clientId: item.clientId,
                            clueId: item.clueId,
                            menuId: 'ST.CUSTOMER.INPUT'
                        }
                    })
                    .catch(() => {
                    })
            }
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getCustomerList()
        },
        async getCustomerList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }
            Object.assign(params, this.$route.query)
            if (params.staffName) delete params.staffName
            this.loading = true
            this.finished = false
            try {
                let result = null
                result = await API.getStaffLevelDetail(params)
                result.list.map(item => {
                    item.codeType = item.status
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
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('customerGradeDetail') === -1) {
                array.push('customerGradeDetail')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList || []
        if (!to.path.includes('/case/customerDetail')) {
            array = array.filter((item) => {
                return item !== 'customerGradeDetail'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    },
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
                height: calc(100% - 64px);
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
        font-size: 14px;
        color: #999999;
        font-weight: 400;
        background: #fff;
        height: 50px;
        line-height: 40px;
        padding: 0 15px;
        .text-strong {
            color: #333;
            padding: 0 5px;
        }
    }
    .multiple-filter {
        background: #fff;
        height: 64px;
        /deep/ .tab-bar {
            width: 100%;
        }
    }
}
</style>
