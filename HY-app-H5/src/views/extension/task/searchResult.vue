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
                <div class="main-section" :style="{height: pageContainerHeight}">
                    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                       <TaskSection :list="taskList" /> </van-list>
						       </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/selfExtension/task'
import TaskSection from '@/components/TaskSection'
export default {
    name: 'extensionTaskSearchHistory',
    components: {
        SearchBar,
        TaskSection,
    },
    computed: {
        ...mapGetters(['tabData', 'projectId']),
    },
    data() {
        return {
            loading: false,
            finished: false,
            searchValue: '',
            pageNum: 1,
            pageSize: 10,
            taskList: [],
        }
    },
    created() {},
    mounted() {
        this.searchValue = this.$route.query.searchKey
        this.getTaskList()
    },
    methods: {
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getTaskList()
        },
        handleChangeTag(val) {},
        onFocus() {
            this.$router.go(-1)
        },
        goBack() {
            this.$router.go(-1)
        },
        async getTaskList() {
            let params = {
                keyWord: this.searchValue,
                projectId: this.projectId,
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }
            this.loading = true
            let result = await API.getTaskList(params)
            if (result.list.length < 10) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.taskList = this.taskList.concat(result.list)
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
                background: #ffffff;
                padding: 0 15px;
                .search-bar {
                    height: 34px;
                    padding: 5px 15px;
                }
            }
            .main-section {
                padding: 0 15px;
                overflow: auto;
            }
        }
    }
}
</style>

<style scoped lang="less"></style>
