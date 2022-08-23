<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="true" title="任务"></top-bar>
        </div>
        <div class="common-page-container" :style="{height: pageContainerHeight}">
            <div class="main-container">
                <div class="search-section">
                    <search-bar :placeholder="placeholder" readonly @focus="onFocus"></search-bar>
                </div>
                <div class="task-section">
                    <van-tabs v-model="status" @change="changeTab" animated :before-change="beforeChangeTabs">
                        <van-tab v-for="tab in tabList" :key="tab[0]" :title="tab[1].name" :name="tab[0]">
                            <!-- 筛选条件 -->
                            <div class="multiple-filter">
                                <div class="multiple-filter-left"></div>
                                <div class="multiple-filter-right tab-filter-right">
                                    <FilterSection ref="filterSection" :filter-list="taskStatusMap[status]"
                                                   :checkType="'radio'"
                                                   container=".task-section" @change="handleFilter"
                                                   :before-close="beforeClose" />
                                </div>
                            </div>
                            <div class="main-section">
                                <div class="l-top-total">
                                    共 <span class="num">{{ total }}</span> 个任务
                                </div>
                                <van-list ref="taskList" v-model="loading" :finished="finished" finished-text="没有更多了"
                                          @load="onLoad" :immediate-check="false">
                                    <TaskSection :list="taskList" />
                                </van-list>
                            </div>
                        </van-tab>
                    </van-tabs>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import SearchBar from '@c/SearchBar'
import Calendar from '@/components/Calendar'
import FilterSection from '@c/FilterSection'
import TaskSection from '@/components/TaskSection'
import API from '@/request/api/selfExtension/task'
import { commonData } from '@/config/commonData'

export default {
    name: 'extensionTaskList',
    components: {
        TopBar,
        SearchBar,
        Calendar,
        TaskSection,
        FilterSection
    },
    computed: {
        ...mapGetters(['projectId', 'taskStatus', 'menuActive', 'currentRole'])
    },
    data() {
        return {
            //列表加载
            loading: false,
            finished: false,
            tabList: [],
            total: 0,
            status: -1,
            placeholder: '请输入任务标题',
            taskList: [],
            pageNum: 1,
            pageSize: 10,
            closeOutside: false,
            activeFilter: 1,
            timeFilter: [],
            beginNum: '',
            endNum: '',
            taskStatusMap: {
                '-1': [
                    {
                        name: '任务类型',
                        type: 'check',
                        checkType: 'radio',
                        field: 'statusList',
                        list: [
                            {
                                label: '结束未完成',
                                value: 2
                            },
                            {
                                label: '结束已完成',
                                value: 3
                            }
                        ]
                    },
                    {
                        name: '任务开始时间',
                        type: 'date',
                        field: 'dateTime',
                        dateName: ['beginTime', 'endTime']
                    },
                    {
                        name: '已完成指标数',
                        type: 'range',
                        fieldName: ['beginNum', 'endNum']
                    }
                ],
                '0': [
                    {
                        name: '任务开始时间',
                        type: 'date',
                        field: 'dateTime',
                        dateName: ['beginTime', 'endTime']
                    },
                    {
                        name: '已完成指标数',
                        type: 'range',
                        fieldName: ['beginNum', 'endNum']
                    }
                ],
                '1': [
                    {
                        name: '任务开始时间',
                        type: 'date',
                        field: 'dateTime',
                        dateName: ['beginTime', 'endTime']
                    },
                    {
                        name: '已完成指标数',
                        type: 'range',
                        fieldName: ['beginNum', 'endNum']
                    }
                ],
                '2': [
                    {
                        name: '任务类型',
                        type: 'check',
                        checkType: 'radio',
                        field: 'statusList',
                        list: [
                            {
                                label: '结束未完成',
                                value: 2
                            },
                            {
                                label: '结束已完成',
                                value: 3
                            }
                        ]
                    },
                    {
                        name: '任务开始时间',
                        type: 'date',
                        field: 'dateTime',
                        dateName: ['beginTime', 'endTime']
                    },
                    {
                        name: '已完成指标数',
                        type: 'range',
                        fieldName: ['beginNum', 'endNum']
                    }
                ]
            },
            filterValue: {}
        }
    },
    created() {
        this.initTypeList()
    },
    mounted() {
        this.status = this.taskStatus
        this.init(true)
    },
    methods: {
        init(isFirst) {
            this.taskList = []
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.activeFilter = 1
            this.timeFilter = []
            this.filterValue = {}
            this.getTaskList(isFirst)
        },
        initTypeList() {
            let taskTab = [...commonData.taskStatus]
            if (this.menuActive.code === 'ZT.HOME') {
                let taskManager = this.menuActive.childrenList.filter(x => x.code ===
                    'ZT.HOME.TASK')[0]
                let codes = taskManager.childrenList.map(x => x.code)
                for (let item of taskTab) {
                    if (codes.includes(item[1].code)) {
                        this.tabList.push(item)
                    }
                }
            }
            this.tabList.unshift([-1, {
                name: '全部'
            }])
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getTaskList()
        },
        beforeClose(done) {
            if (this.filterValue.endNum !== null && (this.filterValue.endNum < this.filterValue.beginNum)) {
                this.$toast('指标数量的最大值不能低于最小值')
                return
            } else {
                done()
                this.taskList = []
                this.pageNum = 1
                this.loading = true
                this.getTaskList()
            }
        },
        handleFilter(val) {
            val.beginNum = isNaN(parseFloat(val.beginNum)) ? '' : parseFloat(val.beginNum)
            val.endNum = isNaN(parseFloat(val.endNum)) ? '' : parseFloat(val.endNum)
            this.filterValue = val
        },
        toggleShowCalendar(val) {
            this.closeOutside = val
        },
        //切换tab
        changeTab(val) {
            this.status = val
            this.init()
        },
        beforeChangeTabs() {
            // return !this.loading
            if (this.loading) {
                return false
            } else {
                this.$refs.filterSection.map((ele) => {
                    ele.resetFilter()
                })
                return true
            }
        },
        //搜索
        onFocus() {
            this.$router.push({
                path: '/searchHistory',
                query: {
                    dataType: 2,
                    type: 2
                }
            }).catch(() => {
            })
        },
        //筛选挂载节点
        getContainer() {
            return document.querySelector('.main-container')
        },
        //获取客户列表
        async getTaskList(isFirst) {
            let params = {
                projectId: this.projectId,
                pageSize: this.pageSize,
                pageNum: this.pageNum * 1,
                roleCode: this.currentRole.roleCode,
                statusList: this.status == -1 ? [0, 1, 2, 3] : this.status == 2 ? [2, 3] : [this.status]
            }

            if (!isFirst && this.status === -1) {
                params.statusList = this.tabList.filter((n) => n[0] > -1).map(x => x[0])
            }
            Object.assign(params, this.filterValue)
            params.statusList = this.filterValue?.statusList ? [this.filterValue?.statusList] : params.statusList
            this.loading = true
            this.finished = false
            let result = await API.getTaskList(params)
            if (result.list.length < 10) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.taskList = this.taskList.concat(result.list)
            this.total = result.total
            this.loading = false
        }
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList || []
        if (!to.path.includes('/extension/taskDetail')) {
            this.$store.dispatch('other/setTaskStatus', -1)
        } else {
            this.$store.dispatch('other/setTaskStatus', this.status)
        }
        next()
    }
}
</script>
<style scoped lang="less">
.common-page {
    .common-page-top {
        background: #ffffff;

        .assign-task {
            position: absolute;
            right: 0;
            font-size: 15px;
            color: #333333;
            font-weight: 500;
        }
    }

    .common-page-container {
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
                height: calc(100% - 44px);
                padding: 0 15px;
                overflow: auto;

                &.assign-container {
                    position: relative;
                    z-index: 21;
                }

                .l-top-total {
                    margin-top: 15px;
                    font-size: 12px;
                    color: #999;

                    .num {
                        color: @theme-color;
                        fon-width: bold;
                    }
                }
            }

            .task-section {
                position: relative;
                height: calc(100% - @search-bar-height);
                overflow: auto;

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

    .multiple-filter {
        background: #fff;

        .multiple-filter-left {
            .common-flex();
            width: calc(100% - 75px);
            overflow-x: auto;

            .van-dropdown-menu {
                width: auto;
                margin-right: 50px;

                ::v-deep .van-dropdown-menu__item {
                    flex-grow: 1;
                    max-width: 100%;
                }
            }
        }
    }
}

/deep/ .van-dropdown-menu {
    width: 500px;
}

/deep/ .van-dropdown-menu__item {
    flex: 0;
    min-width: 88px;
    max-width: 100px;
}

.van-tabs {
    height: 100%;

}

/deep/ .van-tabs__content {
    height: calc(100% - 43px);
    overflow: auto;
    overflow-x: hidden;
    position: relative;

    .van-tab__pane {
        height: 100%;
    }
}

/deep/ .van-tabs__line {
    width: 18px;
    height: 3px;
}
</style>
