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
                        <CustomerSection :list="customerList" @goDetail="goCustomerDetail" @collect="handleCollect" />
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/selfExtension/customer'
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
        //收藏
        async handleCollect(data) {
            if(this.currentRole.roleCode==='ZT_MANAGER') return
            let params = {
                projectId:this.projectId,
                id: data.clueId,
                important: data.important === '1' ? 0 : 1
            }
            let result = await API.changeClientFav(params)
            if (result) {
                data.important = data.important === '1' ? 0 : '1'
                let message = data.important ? '标记成功' : '取消标记'
                this.$toast(message)
            }
        },
        //客户详情
        goCustomerDetail(item) {
            this.$router.push({
                path: '/extension/customerDetail',
                query: {
                    oppId: item.oppId,
                    clueId: item.clueId,
                    canEdit: item.canEdit,
                    important: item.important,
                    makeFlg: item.makeFlg,
                    // 只有已报备的客户才可以在详情修改姓名及备注
                    editCustomerName: item.canEdit && item.clueStatus === 10 && item.avaStatus === 1 ? 1 : 0
                },
            }).catch(()=>{})
        },
        async getCustomerList() {
            let params = {
                keyWord: this.searchValue,
                projectId: this.projectId,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                roleCode: this.currentRole.roleCode
            }
            this.loading = true
            let result = await API.getCustomerList(params)
            result.list.map(item => {
                if(item.avaStatus === 0) {
                    item.codeType = -1
                } else {
                    item.codeType = item.clueStatus
                }
            })
            if (result.list.length < 10) {
                this.finished = true
            } else {
                this.finished = false
            }
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
                /deep/ .van-list {
                    padding-top: 15px;
                }
            }
        }
    }
}
</style>

<style scoped lang="less"></style>
