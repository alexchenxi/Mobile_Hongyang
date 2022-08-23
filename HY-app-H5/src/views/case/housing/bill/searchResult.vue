<template>
    <div class="common-page">
        <div class="common-page-middle">
            <div class="main-container">
                <div class="search-section" :style="{ paddingTop: topSafe }">
                    <div class="back" @click="goBack"><i class="iconfont iconfanhui"></i></div>
                    <div class="search-wrap">
                        <search-bar placeholder="请输入客户姓名或手机号" :data="searchValue" readonly @focus="onFocus"></search-bar>
                    </div>
                </div>
                <div class="main-section" :style="{ height: pageContainerHeight }">
                    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                        <CustomerSection :list="list" @goDetail="goDetail" />
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/caseSystem/housing'
import CustomerSection from '@/components/CaseCustomer'
export default {
    name: 'billSearchResult',
    components: {
        SearchBar,
        CustomerSection
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'currentRole'])
    },
    data() {
        return {
            loading: false,
            finished: false,
            searchValue: '',
            pageNum: 1,
            pageSize: 10,
            list: []
        }
    },
    created() {},
    mounted() {
        this.searchValue = this.$route.query.searchKey
        this.getList()
    },
    methods: {
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getList()
        },
        handleChangeTag(val) {},
        onFocus() {
            this.$router.go(-1)
        },
        goBack() {
            this.$router.go(-1)
        },
        async getList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                keyWord: this.searchValue,
                type: Number(this.$route.query.dataType.split('-')[1]),
                sortType: 1
            }
            this.loading = true
            let result = await API.getBillList(params)
            if (result.list.length < 10) {
                this.finished = true
            } else {
                this.finished = false
            }
            result.list.map(item => {
                item.codeType = this.$route.query.dataType
                 // 无效时展示
                item.dataStatusName = item.status ? '' : item.dataStatusName
            })
            this.list = this.list.concat(result.list)
            this.loading = false
        },
        //单据详情
        goDetail(item) {
            this.$router.push({
                path: '/case/documentDetail',
                query: {
                    clientId: item.clientId,
                    type: Number(this.$route.query.dataType.split('-')[1]),
                    id: item.formId
                }
            })
        },
    }
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
                overflow: auto;
                .customer-list {
                    margin-top: 15px;
                }
            }
        }
    }
}
</style>

<style scoped lang="less"></style>
