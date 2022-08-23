<template>
    <div class="common-page">
         <div class="common-page-top">
            <top-bar title="搜索"></top-bar>
        </div>
        <div class="common-page-middle" :style="{ height: pageContainerHeight }">
            <div class="main-container">
                <div class="search-section" >
                    <div class="search-wrap">
                        <van-dropdown-menu active-color="#DB0826" class="dropdown-project">
                            <van-dropdown-item ref="filter" v-model="projectId" :options="projectList" @change="changeFilter" get-container="body"></van-dropdown-item>
                        </van-dropdown-menu>
                        <search-bar placeholder="请输入客户姓名或手机号" :data="searchValue" readonly @focus="onFocus"></search-bar>
                    </div>
                </div>
                <div class="main-section">
                    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                        <CaseCustomer :list="takelookList" @sign="sign" />
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
import CaseCustomer from '@/components/CaseCustomer'
import TopBar from '@c/TopBar'
export default {
    name: 'customer',
    components: {
        SearchBar,
        CaseCustomer,
        TopBar
    },
    computed: {
        ...mapGetters(['currentRole'])
    },
    data() {
        return {
            loading: false,
            finished: false,
            searchValue: '',
            pageNum: 1,
            pageSize: 10,
            projectId: '',
            takelookList: [],
            projectList: []
        }
    },
    async mounted() {
        this.searchValue = this.$route.query.searchKey
        await this.getProjectList()
        await this.getTakelookList()
    },
    methods: {
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getTakelookList()
        },
        handleChangeTag(val) {},
        onFocus() {
            this.$router.go(-1)
        },
        goBack() {
            this.$router.go(-1)
        },
        async getTakelookList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                roleCode: this.currentRole.roleCode,
                keywords: this.searchValue,
                projectId: this.projectId
            }
            let result = await API.getTakelookList(params)
            result.list.map(item => {
                item.codeType = 'takelook-1'
                item.canEdit = true
            })
            this.takelookList = this.takelookList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
                this.finishedText = '没有更多了'
            } else {
                this.finished = false
            }
            this.loading = false
        },
        changeFilter() {
            this.pageNum = 1
            this.getTakelookList()
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
        // 在线签名
        sign(item) {
            this.$router
                .push({
                    path: '/signature',
                    query: {
                        id: item.id
                    }
                })
                .catch(() => {})
        },
        //带看确认单详情
        goDetail(item) {
            this.$router
                .push({
                    path: '/my/takelookDetail',
                    query: {
                        id: item.id
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
        .common-flex();
        .back {
            margin-right: 7px;
        }
        .search-wrap {
            flex-shrink: 0;
            flex-grow: 1;
            display: flex;
            align-items: center;
            .dropdown-project {
                margin-right: 15px;
                width: 80px;
                /deep/ .van-ellipsis {
                    text-overflow: clip;
                }
            }
        }
    }
    .common-page-middle {
        height: 100%;
        background: #f0f4fa;
        position: relative;
        .main-container {
            height: 100%;
            .search-section {
                padding: 8px 15px 8px;
                background: #ffffff;
                .search-bar {
                    height: 34px;
                    flex: 1;
                }
            }
            .main-section {
                height: calc(100% - 50px);
                overflow: auto;
            }
        }
    }
}
</style>

<style scoped lang="less"></style>
