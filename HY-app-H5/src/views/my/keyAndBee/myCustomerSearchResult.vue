<template>
    <div class="common-page">
        <div class="common-page-middle">
            <div class="main-container">
                <div class="search-section" :style="{paddingTop: topSafe}">
                    <div class="back" @click="goBack"><i class="iconfont iconfanhui"></i></div>
                    <div class="search-wrap">
                        <search-bar placeholder="请输入客户姓名或手机号" :data="searchValue" readonly @focus="onFocus"></search-bar>
                    </div>
                </div>
                <div class="main-section">
                    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                        <CustomerSection :list="customerList" @goDetail="goCustomerDetail" />
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/selfExtension/keyAndBee'
import CustomerSection from '@/components/ExtensionCustomer'
export default {
    name: 'customer',
    components: {
        SearchBar,
        CustomerSection,
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'currentRole']),
    },
    data() {
        return {
            loading: false,
            finished: false,
            searchValue: '',
            pageNum: 1,
            pageSize: 10,
            customerList: [],
        }
    },
    created() {},
    mounted() {
        this.searchValue = this.$route.query.searchKey
        this.getCustomerList()
    },
    methods: {
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getCustomerList()
        },
        handleChangeTag(val) {},
        onFocus() {
            this.$router.go(-1)
        },
        goBack() {
            this.$router.go(-1)
        },
        //客户详情
        goCustomerDetail(item) {
            if(item.codeType === 'beeCustomer') return
            this.$router.push({
                path: '/extension/customerDetail',
                query: {
                    oppId: item.oppId,
                    clueId: item.clueId,
                    canEdit: item.canEdit
                },
            }).catch(()=>{})
        },
        async getCustomerList() {
            let params = {
                keyWord: this.searchValue,
                projectId: this.projectId,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
            }
            this.loading = true
            let result = await API.beeCustomerList(params)
            if (result.list.length < 10) {
                this.finished = true
            } else {
                this.finished = false
            }
            result.list.map(item => {
                item.codeType = this.$route.query.dataType
                item.canEdit = true
            })
            this.customerList = this.customerList.concat(result.list)
            this.loading = false
        },
    },
}
</script>

<style scoped lang="less">
.common-page {
    height: 100%;
    .search-section {
        .common-flex();
        .back {
            margin-right: 7px;
        }
        .search-wrap {
            flex-shrink: 0;
            flex-grow: 1;
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
                height: calc(100% - 56px);
                padding: 0 15px;
                overflow: auto;
            }
        }
    }
}
</style>

<style scoped lang="less"></style>
