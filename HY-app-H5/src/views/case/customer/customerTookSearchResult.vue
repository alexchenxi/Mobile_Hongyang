<template>
    <div class="common-page">
        <div class="common-page-middle">
            <div class="main-container">
                <div class="search-section" :style="{ paddingTop: topSafe }">
                    <div class="search-wrap">
                        <search-bar :data="searchValue" readonly back @focus="goBack" />
                    </div>
                </div>
                <div class="main-section" :style="{ height: pageContainerHeight }">
                    <van-empty v-if="customerList.length === 0 && isFinished" class="custom-image" :image="$baseImgUrl + '/no-data.png'" description="暂无您想找的客户~" />
                    <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" offset="20" :immediate-check="false" @load="onLoad">
                        <CaseCustomer :list="customerList" @goDetail="goDetail" @call="call" @caseRegistration="caseRegistration" />
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/caseSystem/customer'
import CaseCustomer from '@c/CaseCustomer'
export default {
    name: 'CustomerTookSearchResult',
    components: {
        SearchBar,
        CaseCustomer
    },
    data() {
        return {
            loading: false,
            finished: false,
            searchValue: '',
            pageNum: 1,
            pageSize: 10,
            customerList: [],
            isFinished: false,
            isFocus: false
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole', 'searchCustomerType', 'device'])
    },
    created() {},
    mounted() {
        this.searchValue = this.$route.query.searchKey
        this.getClientList()
    },
    methods: {
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getClientList()
        },
        onFocus() {
            this.isFocus = true
        },
        goBack() {
            this.$router.go(-1)
        },
        async getClientList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                sortingStrategy: 1,
                customerNameOrTel: this.searchValue,
                roleCode: this.currentRole.roleCode
            }
            this.loading = true
            this.isFinished = false
            this.finished = false
            if (this.searchCustomerType === 'ST.CUSTOMER.NOTPHONE') {
                this.clientList(params, 'getCustomerNoTel')
                return
            }
            if (this.searchCustomerType === 'ST.CUSTOMER.PHONE') {
                this.clientList(params, 'getCustomerTel')
            }
        },
        // 获取客户列表
        clientList(params, name) {
            API[name](params).then(result => {
                result.list.map(item => {
                    item.codeType = this.searchCustomerType
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
                this.isFinished = true
            })
        },
        //客户详情
        goDetail(item) {
            // 未获电
            if (this.searchCustomerType === 'ST.CUSTOMER.NOTPHONE') {
                return
            }
            this.$router
                .push({
                    path: '/customerTookDetail',
                    query: {
                        id: this.searchCustomerType === 'ST.CUSTOMER.NOTPHONE' ? item.viewUserId : item.id,
                        canEdit: this.menuId === 'ST.CUSTOMER.NOTPHONE' ? false : item.canEdit,
                        type: this.menuId === 'ST.CUSTOMER.NOTPHONE' ? 1 : 0,
                        customerId: item.customerId
                    }
                })
                .catch(() => {})
        },
        // 打电话
        call(tel) {
            this.$appMethods.SendPhone(this.device, tel)
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
        }
    }
}
</script>

<style scoped lang="less">
.common-page {
    height: 100%;
    .search-section {
        .search-bar {
            height: @search-bar-height !important;
        }
        .common-flex();
        .back {
            margin-right: 7px;
        }
        .search-wrap {
            flex-shrink: 0;
            flex-grow: 1;
        }
        .search-text {
            font-size: 15px;
            line-height: 15px;
            color: #999999;
            font-weight: 400;
        }
        .search-focused {
            color: @theme-color;
        }
    }
    .common-page-middle {
        height: 100%;
        background: #f0f4fa;
        .main-container {
            height: 100%;
            .search-section {
                padding: 0 15px 5px;
                background: #ffffff;
                .search-bar {
                    height: 34px;
                }
            }
            .main-section {
                height: calc(100% - 86px);
                // padding: 0 15px;
                overflow: auto;
            }
        }
        .custom-image {
            margin-top: 150px;
            /deep/ .van-empty__description {
                margin-top: -13px;
            }
        }
    }
}
</style>

<style scoped lang="less"></style>
