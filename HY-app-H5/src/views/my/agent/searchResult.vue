<template>
    <div class="common-page">
        <div class="common-page-middle">
            <div class="main-container">
                <div class="search-section" :style="{paddingTop: topSafe}">
                    <div class="back" @click="goBack"><i class="iconfont iconfanhui"></i></div>
                    <div class="search-wrap">
                        <search-bar placeholder="请输入下线经纪人的姓名/手机号" :data="searchValue" readonly @focus="onFocus"></search-bar>
                    </div>
                </div>
                <div class="main-section" :style="{ height: pageContainerHeight }">
                    <van-list ref="customerList" offset="10" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                        <CustomerSection :list="customerList" @goDetail="goDetail"/>
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/my'
import HOMEAPI from '@/request/api/caseSystem/home'
import CustomerSection from '@/components/agentCustomer'
export default {
    name: 'agentSearchResult',
    components: {
        SearchBar,
        CustomerSection,
    },
    computed: {
        ...mapGetters(['tabData',  'currentRole']),
    },
    data() {
        return {
            loading: false,
            finished: false,
            searchValue: '',
            projectId: '',
            orderParam: 1,
            pageNum: 1,
            pageSize: 10,
            customerList: [],
        }
    },
    created() {},
    async mounted() {
        this.searchValue = this.$route.query.searchKey
        await this.getProjectList()
        await this.getCustomerList()
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
        },
        async getCustomerList() {
           let params = {
                nameOrTel:this.searchValue,
                startTime:this.startTime,
                endTime:this.endTime,
                projectId:this.projectId,
                orderParam:this.orderParam,
                pageNum: this.pageNum,
                pageSize: 10,
               isUnbind:this.$route.query.activeTab
            }
            Object.assign(params)
            this.loading = true
            this.finished = false
            let result = await API.getMyChildBroker(params)
            this.loading = false
            if (result.list.length < 10) {
                this.finished = true
            } else {
                this.finished = false
            }
            // result.list.map(item => {
            //     item.codeType = this.code
            //     item.canEdit = true
            // })
            this.customerList = this.customerList.concat(result.list)
        },
        goDetail(item) {
            if (this.$route.query.activeTab === '1') return
            this.$router.push({
                path: '/extension/customer',
                query: {
                    id: item.id,
                    name:item.name
                }
            })
        }

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
                .customer-list {
                    margin-top: 15px;
                }
            }
        }
    }
}
</style>

<style scoped lang="less"></style>
