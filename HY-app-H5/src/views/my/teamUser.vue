<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar title="成员管理"></top-bar>
        </div>
        <div class="common-page-container" :style="{height: pageContainerHeight}">
            <div class="main-container">
                <div class="search-section">
                    <search-bar placeholder="请输入成员姓名或账号查询" :data="searchValue" @returnSearch="handleSearch"></search-bar>
                    <!-- 筛选条件 -->
                    <div class="multiple-filter">
                        <div class="multiple-filter-left">
                            <van-dropdown-menu :class="[activeFilter === 1 ? 'active-filter' : '']" active-color="#DB0826">
                                <van-dropdown-item ref="sort" v-model="currentProject" :options="projectArray" @change="changeOrder" @open="highlightFilter(1)"></van-dropdown-item>
                            </van-dropdown-menu>
                        </div>
                        <div class="multiple-filter-right">
                            <van-dropdown-menu
                                :class="[activeFilter === 2 ? 'active-filter group-filter' : 'group-filter']"
                                active-color="#DB0826"
                                class="group-filter"
                                v-if="currentRole.roleCode !== 'ST_SALES'"
                            >
                                <van-dropdown-item ref="group" :title="staffSalesValue" @open="highlightFilter(2)">
                                    <TeamFilter :list="list" @change="teamFilterChange" />
                                    <div class="filter-container-bottom">
                                        <van-button block type="cancel" @click="closeFilter">取消</van-button>
                                        <van-button block type="filter" native-type="submit" @click="handleSave">确定</van-button>
                                    </div>
                                </van-dropdown-item>
                            </van-dropdown-menu>
                        </div>
                    </div>
                </div>
                <div class="main-section">
                    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                        <van-list ref="customerList" v-model="loading" :finished="finished" finished-text="">
                            <div class="user-list">
                                <div class="user-item" v-for="user in teamUserList" :key="user.userId+user.roleCode">
                                    <van-swipe-cell :ref="'swipeCell' + user.userId" :before-close="beforeClose">
                                        <div class="item-section">
                                            <div class="item-left">
                                                <van-image round width="36px" height="36px" :src="user.avatar || $baseImgUrl + '/default-avatar.png'" />
                                            </div>
                                            <div class="item-middle">
                                                <div class="name">{{ user.name }}
                                                    <span class="tag-item common-tag-blue">{{user.roleCodeName}}</span>
                                                    <span v-if="user.status === 0" class="tag-item common-tag-red">已冻结</span>
                                                </div>
                                                <div class="account">{{ user.account }}</div>
                                                <!-- <div class="total">
                                                    <div class="total-item">
                                                        <div class="total-name">报备数</div>
                                                        <div class="total-num">{{ user.recommendNum }}</div>
                                                    </div>
                                                    <div class="divide"></div>
                                                    <div class="total-item">
                                                        <div class="total-name">到访数</div>
                                                        <div class="total-num">{{ user.arriveNum }}</div>
                                                    </div>
                                                    <div class="divide"></div>
                                                    <div class="total-item">
                                                        <div class="total-name">成交数</div>
                                                        <div class="total-num">{{ user.dealNum }}</div>
                                                    </div>
                                                </div> -->
                                            </div>
                                            <div class="item-right" @click="openCell($event, user)" ><van-icon name="ellipsis" color="#D8D8D8" /></div>
                                        </div>
                                        <template #right>
                                            <div v-if="user.status === 1" class="action-item red" @click="changeStatus(user)">冻结</div>
                                            <div v-if="user.status === 0" class="action-item green" @click="changeStatus(user)">解冻</div>
                                        </template>
                                    </van-swipe-cell>
                                </div>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import SearchBar from '@c/SearchBar'
import TeamFilter from '@/components/TeamFilter'
import CUSTOMERAPI from '@/request/api/selfExtension/customer'
import PROJECTAPI from '@/request/api/caseSystem/home'
import CASECUSTOMERAPI from '@/request/api/caseSystem/customer'
import TEAMUSERAPI from '@/request/api/selfExtension/teamUser'
export default {
    name: 'teamUser',
    components: {
        TopBar,
        SearchBar,
        TeamFilter,
    },
    computed: {
        ...mapGetters(['currentRole','projectId']),
    },
    data() {
        return {
            loading: false,
            finished: false,
            teamUserList: [],
            //团队筛选
            staffSalesValue: '全部团队全部成员',
            list: [],
            teamFilterData: {},
            activeFilter: 1,
            //项目列表
            projectArray: [],
            currentProject: '',
            searchValue: '',
            refreshing: false,
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.getProjectList()
        },
        initTeamUserList() {
            this.teamUserList = []
            this.activeId = ['']
            this.activeIndex = 0
            this.$nextTick(() => {
                this.staffSalesValue = '全部团队全部成员'
            })
            this.getTeamUserList()
        },
        //切换项目
        changeOrder() {
            this.teamUserList = []
            this.teamFilterData = {}
            this.timeFilter = []
            this.searchValue = ''
            this.$nextTick(() => {
                this.staffSalesValue = '全部团队全部成员'
            })
            this.getStaffSalesList()
            this.getTeamUserList()
        },
        //筛选确认
        handleSave() {
            this.$refs.group.toggle(false)
            this.teamUserList = []
            this.searchValue = ''
            this.staffSalesValue = this.teamFilterData.name ? this.teamFilterData.name : this.staffSalesValue
            this.getTeamUserList()
        },
        // 筛选取消
        closeFilter() {
            this.$refs.group.toggle(false)
        },
        //搜索
        handleSearch(val) {
            this.searchValue = val
            this.getTeamUserList()
        },
        //获取客户列表
        async getTeamUserList() {
            let params = {
                projectId: this.currentProject,
                userList: this.teamFilterData.list,
                roleCode: this.currentRole.roleCode,
                keyword: this.searchValue ? this.searchValue : null,
            }
            this.loading = true
            this.finished = false
            let result = await TEAMUSERAPI.getTeamUserList(params)
            this.teamUserList = result
            this.loading = false
            this.finished = true
            this.refreshing = false
        },
        //获取项目列表
        async getProjectList() {
            let params = {
                roleCode: this.currentRole.roleCode,
            }
            let result = await PROJECTAPI.projectListApi(params)
            this.projectArray = result.map((item) => {
                item.value = item.projectId
                item.text = item.projectName
                return item
            })
            this.currentProject = this.projectArray[0].projectId
            this.getStaffSalesList()
            this.initTeamUserList()
        },
        //置业顾问列表
        async getStaffSalesList() {
            let params = {
                projectId: this.currentProject,
                roleCode: this.currentRole.roleCode,
            }
            if(this.currentRole.moduleId === 'ZT'){
                let result = await CUSTOMERAPI.getTeamUser(params)
                this.list = result
            } else if(this.currentRole.moduleId === 'ST') {
                let result = await CASECUSTOMERAPI.staffSalesList(params)
                this.list = result
            }

        },
        //手动滑出操作按钮
        openCell(event, user) {
            event.stopPropagation()
            if (this.$refs['swipeCell' + user.userId][0].offset) {
                this.$refs['swipeCell' + user.userId][0].close()
                return
            }
            this.$refs['swipeCell' + user.userId][0].open('right')
        },
        teamFilterChange(data) {
            this.teamFilterData = data
        },
        highlightFilter(val) {
            this.activeFilter = val
            if (val === 2) {
                this.getStaffSalesList()
            }
        },
        // 冻结/解冻
        changeStatus(user) {
            let content = user.status === 0 ? '确认解冻成员吗' : '确认冻结成员吗'
            this.$dialog
                .confirm({
                    title: '',
                    message: content,
                })
                .then(async () => {
                    let params = {
                        projectId: this.projectId,
                        userId: user.userId,
                        roleCode: user.roleCode,
                        status: user.status === 0 ? 1 : 0,
                    }
                    TEAMUSERAPI.changeUserStatus(params).then(res=>{
                        if(res) {
                            let message = user.status === 0 ? '解冻成功' : '冻结成功'
                            this.$toast(message)
                            this.getTeamUserList()
                        }
                    })
                })
                .catch(() => {})
        },
        beforeClose() {},
        // 下拉刷新
        onRefresh() {
            this.getTeamUserList()
        },
    },
}
</script>
<style scoped lang="less">
.common-page {
    .common-page-top {
        background: #ffffff;
        padding: 0 15px;
    }
    .common-page-container {
        background: #f0f4fa;
        height: calc(100% - @top-bar-height);
        .main-container {
            height: 100%;
            .search-section {
                padding: 0 15px;
                background: #ffffff;
            }
            .main-section {
                height: calc(100% - @search-bar-height - 44px);
                padding: 0 15px;
                overflow: auto;
            }
        }
        .multiple-filter {
            background: #fff;
            padding: 0;
            .multiple-filter-left {
                .common-flex();
            }
        }
        .active-filter {
            ::v-deep .van-dropdown-menu__title {
                color: @theme-color;
            }
        }
        .user-list {
            margin-bottom: 20px;
            .user-item {
                background: #ffffff;
                border-radius: 4px;
                margin-top: 10px;
                .item-section {
                    .common-flex();
                    align-items: flex-start;
                    padding: 15px;
                    .item-left {
                        padding-top: 3px;
                    }
                    .item-middle {
                        flex-grow: 1;
                        padding: 3px 20px 0 12px;
                        .name {
                            margin-right: 4px;
                            font-size: 16px;
                            color: #333333;
                            font-weight: 500;
                            line-height: 16px;
                        }
                        .tag-item {
                            margin-left: 6px;
                            padding: 2px 7px;
                            font-size: 11px;
                            font-family: PingFangSC-Medium, PingFang SC;
                            font-weight: 500;
                            border-radius: 4px;
                        }
                        .account {
                            padding-top: 8px;
                            font-size: 12px;
                            color: #999999;
                            font-weight: 400;
                            line-height: 12px;
                        }
                        .total {
                            padding-top: 18px;
                            .common-flex();
                            .divide {
                                flex-grow: 0;
                                flex-shrink: 0;
                                width: 1px;
                                height: 24px;
                                background: #eeeeee;
                                margin: 0 14px;
                            }
                            .total-item {
                                flex-grow: 1;
                                .total-name {
                                    font-size: 12px;
                                    color: #999999;
                                    font-weight: 400;
                                    line-height: 12px;
                                }
                                .total-num {
                                    padding-top: 8px;
                                    font-size: 15px;
                                    color: #333333;
                                    font-weight: bold;
                                    line-height: 15px;
                                }
                            }
                        }
                    }
                    .item-right {
                    	text-align: right;
                        width: 25px;
                        height: 25px;
                    }
                }
                .action-item {
                    .common-flex-center();
                    width: 50px;
                    height: 100%;
                    color: #ffffff;
                    border-radius: 0 4px 4px 0;
                    &.red {
                        background: #eb6877;
                    }
                    &.green {
                        background: #47cfae;
                    }
                }
            }
        }
    }
}
/deep/ .van-tree-select {
    .van-sidebar-item--select::before {
        display: none;
    }
}
</style>
<style scoped lang="less"></style>
