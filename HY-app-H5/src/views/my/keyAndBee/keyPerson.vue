<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar title="我的关键人">
                <span @click="handleSearch" slot="append-suffix" class="iconfont iconsousuo"></span>
            </top-bar>
        </div>
        <div class="common-page-container" :style="{ height: pageMiddleWithButtonHeight }">
            <div class="main-container">
                <div class="customer-section">
                    <!-- 筛选条件 -->
                    <div class="multiple-filter">
                        <div class="multiple-filter-left">
                            <van-dropdown-menu :class="[activeFilter === 1 ? 'active-filter' : '']" active-color="#DB0826">
                                <van-dropdown-item ref="filter" v-model="filterForm.sortType" :options="sortOptions" @change="filterCustomer" @open="highlightFilter(1)"></van-dropdown-item>
                            </van-dropdown-menu>
                            <van-dropdown-menu :class="[activeFilter === 2 ? 'active-filter' : 'custom-filter']" active-color="#DB0826">
                                <van-dropdown-item title="筛选" ref="statusFilter">
                                    <van-radio-group class="custom-radio" v-model="filterForm.status" checked-color="#DB0826">
                                        <van-cell-group>
                                            <van-cell
                                                :class="[filterForm.status === item.status ? 'active' : '']"
                                                v-for="(item, index) in filterList"
                                                :key="index"
                                                :title="item.name + '(' + item.count + ')'"
                                                clickable
                                                @click="filterCellClick(item.status)"
                                            >
                                                <template #right-icon>
                                                    <van-radio :name="item.status" checked-color="#DB0826" />
                                                </template>
                                            </van-cell>
                                        </van-cell-group>
                                    </van-radio-group>
                                </van-dropdown-item>
                            </van-dropdown-menu>
                        </div>
                    </div>
                    <div class="main-section">
                        <van-list ref="customerList" offset="10" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                            <CustomerSection :list="customerList" @operate="operate" />
                        </van-list>
                    </div>
                </div>
            </div>
        </div>
        <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" @click="showQRcode">报备二维码</van-button>
        </div>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import CustomerSection from '@/components/ExtensionCustomer'
import FilterSection from '@c/FilterSection'
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
            filterForm: {
                sortType: 1,
                status: ''
            },
            sortOptions: [], // 排序列表
            filterList: [], // 筛选条件
            loading: false,
            finished: true,
            customerList: [], // 客户列表
            pageNum: 1,
            code: 'keyPerson'
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole']) },
    mounted() {
        this.initData()
    },
    methods: {
        // 初始化数据
        async initData() {
            this.sortOptions = getSortOptions(this.code)
            this.getBeeSubordinateStatistics()
            this.getCustomerList()
        },
        // 搜索
        handleSearch() {
            this.$router.push({
                path: '/searchHistory',
                query: {
                    dataType: 6,
                    type: 4
                }
            }).catch(()=>{})
        },
        // 筛选高亮
        highlightFilter(val) {
            this.activeFilter = val
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
        // 获取客户列表
        async getCustomerList() {
            let params = {
                pageNum: this.pageNum,
                pageSize: 10,
                roleCode: this.currentRole.roleCode,
                beeType: 6
            }
            Object.assign(params, this.filterForm)
            this.loading = true
            this.finished = false
            let result = await API.getBeeSubordinateList(params)
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
        },
        // 操作
        operate(data) {
            if (data.type.type === 'logoff') {
                this.$dialog
                    .confirm({
                        title: '',
                        message: `是否与${data.item.name}解除绑定`
                    })
                    .then(() => {
                        let params = {
                            beeId: data.item.userId,
                            type: 2,
                            leaderRoleCode: this.currentRole.roleCode
                        }
                        API.beeLogoff(params).then(res => {
                            this.$toast('解绑成功')
                            this.getBeeSubordinateStatistics()
                            this.filterCustomer()
                        })
                    })
                    .catch(() => {
                        // on cancel
                    })
            }
        },
        showQRcode() {
            this.$router.push({
                path: '/my/recommendCode',
                query: {
                    userType: 6
                }
            }).catch(()=>{})
        },
        // 下属状态统计
        async getBeeSubordinateStatistics() {
            let params = {
                roleCode: this.currentRole.roleCode,
                projectId: this.projectId,
                beeType: 6
            }
            const result = await API.getBeeSubordinateStatistics(params)
            this.filterList = result.statistics.map(item => {
                return {
                    name: item.status === '0' ? '失效' : '有效',
                    status: item.status,
                    count: Number(item.count)
                }
            })
            let total = this.filterList.map(x=>x.count).reduce((preValue, curValue) => {
                return preValue + curValue
            })
            this.filterList.unshift({
                name: '全部',
                status: '',
                count: total
            })
        },
        filterCellClick(status) {
            this.filterForm.status = status
            this.$refs.statusFilter.toggle()
            this.$forceUpdate()
            this.filterCustomer()
        }
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    background: #f6f8fa;
    .main-container {
        height: 100%;
        .customer-section {
            height: 100%;
            .main-section {
                height: calc(100% - 44px);
                overflow: auto;
            }
        }
    }
}
.main-container {
    .multiple-filter {
        background: #fff;
        height: 44px;
        .multiple-filter-left {
            .common-flex();
            justify-content: space-between;
            width: 100%;
            overflow-x: auto;
            .van-dropdown-menu {
                width: auto;
                margin-right: 50px;
                ::v-deep .van-dropdown-menu__item {
                    flex-grow: 1;
                    max-width: 100%;
                }
            }
            .custom-filter {
                margin-right: 0;
            }
        }
        .active-filter {
            ::v-deep .van-dropdown-menu__title {
                color: @theme-color;
            }
        }

        .van-cell.active {
            background: rgba(219, 8, 38, 0.1);
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
