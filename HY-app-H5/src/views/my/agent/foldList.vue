<template>
    <div class="common-page">
        <TopBar title="自渠下线经纪人" />
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <div class="search-section">
                <search-bar placeholder="请输入自渠下线经纪人姓名查询" @changeInput="handleInput" />
            </div>
            <section class="filter-container">
                <div class="left-section">
                    <van-dropdown-menu active-color="#DB0826">
                        <van-dropdown-item :disabled="true"
                            ref="filter"
                            v-model="orderBy"
                            :options="sortOptions"
                            @change="handleOrder"
                        />
                    </van-dropdown-menu>
                </div>
                <div class="right-section">
                    <van-dropdown-menu
                        class="active-filter group-filter"
                        active-color="#DB0826"
                    >
                        <van-dropdown-item
                            ref="filter"
                            :title="staffSalesValue"
                            :get-container="getContainer"
                            @open="highlightFilter()"
                        >
                            <team-filter v-model="teamFilterData" :list="teamList" @change="teamFilterChange" />
                            <div class="filter-container-bottom">
                                <van-button block type="cancel" @click="closeFilter">取消</van-button>
                                <van-button block type="filter" native-type="submit" @click="handleSave">确定</van-button>
                            </div>
                        </van-dropdown-item>
                    </van-dropdown-menu>
                </div>
            </section>
            <section class="customer-container">
                <van-collapse v-model="activeNames" :border="false" @change="changeCollapse">
                    <van-collapse-item
                        v-for="(item,index) in list"
                        :key="item.userId + item.teamRoleCode"
                        :name="item.userId"
                        :border="true"
                    >
                        <template #title>
                            <div class="common-collapse-title">
                                {{ item.userName }}（{{ item.customerCount }}）
                                <div class="tag-item"> {{ roleMap[item.teamRoleCode] }}</div>
                            </div>
                        </template>

                        <CustomerSection :list="item.customerList" @goDetail="goDetail" />
                        <div class="more-btn-wrap" v-if="item.customerList && item.customerList.length !== item.total">
                            <div class="more-btn" @click="getCustomerList(index)">
                                查看更多
                                <van-icon class="icon-arrow" name="arrow-down" />
                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </section>
        </main>
    </div>
</template>

<script>
    import TopBar from '@c/TopBar'
    import { mapGetters } from 'vuex'
    import HomeAPI from '@/request/api/caseSystem/home'
    import MyAPI from '@/request/api/my'
    import API from '@/request/api/selfExtension/customer'
    import TeamFilter from '@/components/TeamFilter'
    import CustomerSection from '@/components/agentCustomer'
    import SearchBar from '../../../components/SearchBar'

    const roleMap = {
        'ZT_DIRECTOR': '渠道主管',
        'ZT_MANAGER': '渠道经理',
        'ZT_MEMBER': '渠道专员',
        'ZT_KEYMAN': '关键人',
        'ZT_BEEMAN': '小蜜蜂',
        'ST_DIRECTOR': '销售主管',
        'ST_MANAGER': ' 销售经理',
        'ST_SALES': ' 置业顾问'
    }

    export default {
        name: 'AgentFoldList',
        components: {
            SearchBar,
            TeamFilter,
            TopBar,
            CustomerSection
        },
        data() {
            return {
                sortOptions: [],
                orderBy: 1,
                filterValue: {},
                activeNames: [],
                list: [],
                staffSalesValue: '全部团队全部',
                teamFilterData: {},
                roleMap,
                timer: null,
                nameOrTel: '',
                teamList: []
            }
        },
        computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList', 'device', 'user']) },
        watch: {},
        created() {
            this.orderBy = this.projectId
            this.getProjects()
            this.getList()
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                var array = vm.keepAliveList || []
                if (array.indexOf('AgentFoldList') === -1) {
                    array.push('CustomerWithoutTab')
                    vm.$store.dispatch('other/setKeepAlive', array)
                }
                if (from.path.includes('/extension/customer')) {
                    vm.refresh = true
                }
            })
        },
        beforeRouteLeave(to, from, next) {
            var array = this.keepAliveList
            if (!to.path.includes('/extension/customer')) {
                array = array.filter(item => {
                    return item !== 'AgentFoldList'
                })
                this.$store.dispatch('other/setKeepAlive', array)
            }
            next()
        },
        methods: {
            //筛选挂载节点
            getContainer() {
                return document.querySelector('.main-container')
            },
            async highlightFilter() {
                this.teamList = await API.getTeamUser({
                    projectId: this.orderBy,
                    roleCode: this.currentRole.roleCode
                })
            },
            teamFilterChange(data) {
                this.teamFilterData = data
            },
            // 筛选取消
            closeFilter() {
                this.$refs.filter.toggle(false)
            },
            //筛选确认
            handleSave() {
                this.$refs.filter.toggle(false)
                this.staffSalesValue = this.teamFilterData.name ? this.teamFilterData.name : this.staffSalesValue
                this.getList()
            },
            handleInput(val) {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.nameOrTel = val
                    this.getList()
                }, 1000)
                console.log(val)
            },
            getProjects() {
                HomeAPI.projectList2Api({
                    roleCode: this.currentRole.roleCode
                }).then(res => {
                    let arr = []
                    res.forEach(item => {
                        arr = arr.concat(item.projectOrgVoList)
                    })

                    arr.forEach(item => {
                        item.text = item.orgName
                        item.value = item.orgCode
                    })
                    this.sortOptions = arr
                })
            },
            handleOrder(){
                this.staffSalesValue = '全部团队全部'
                this.teamFilterData = {}
                this.getList()
            },
            getList() {
                API.getChildBrokerCount({
                    projectId: this.orderBy,
                    roleCode: this.currentRole.roleCode,
                    userList: this.teamFilterData.list,
                    nameOrTel: this.nameOrTel
                }).then(res => {
                    this.list = res
                    if (res.length === 0) return
                    this.activeNames = [res[0].userId]
                    this.getCustomerList(0)
                })

            },
            getCustomerList(index) {
                const row = this.list[index]
                const pageNum = row.pageNum ? row.pageNum + 1 : 1
                MyAPI.getMyChildBroker({
                    nameOrTel: this.nameOrTel,
                    projectId: this.projectId,
                    isUnbind: 0,
                    userId: row.userId,
                    pageNum,
                    pageSize: 10
                }).then(res => {
                    if (pageNum === 1) {
                        row.customerList = res.list
                    }
                    else {
                        row.customerList = row.customerList.concat(res.list)
                    }

                    row.total = res.total
                    row.pageNum = pageNum

                    this.$set(this.list, index, row)
                }).finally(() => {
                    this.loading = false
                    this.finished = true
                })
            },
            changeCollapse(val) {
                const userId = val[val.length - 1]
                if (!userId) return
                const index = this.list.findIndex(item => item.userId === userId)
                const row = this.list[index]


                if (!row.customerList || row.customerList.length === 0) {
                    this.getCustomerList(index)
                }
            },
            goDetail(item) {
                this.$router.push({
                    path: '/extension/customer',
                    query: {
                        id: item.id,
                        name: item.name
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .pop-up {
        width: 90%;
        padding: 2rem;
        box-sizing: border-box;
    }

    /deep/ .head-container {
        .head-c {
            position: absolute;
            width: 100%;
            z-index: 1;
        }

        .head-l,
        .head-r {
            position: relative;
            z-index: 2;
        }

        .iconsousuo {
            font-size: 19px;
            margin-left: 30px;
        }

        .iconfenpei {
            font-size: 20px;
        }

        .top-action {
            font-size: 15px;
            color: @theme-color;
            font-weight: 500;
        }
    }

    .common-page-container {
        .filter-container {
            height: 40px;
            padding: 0 18px;
            .common-flex-between();
            align-items: stretch;

            .right-section {
                width: 40%;

                /deep/ .van-ellipsis {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .filter-section {
                    margin-left: 40px;
                }
            }

            /deep/ .van-dropdown-menu__title,
            .switch-button {
                font-size: 14px;
                color: @header-text-color;
                font-weight: 400;
            }

            .switch-button {
                span {
                    padding-right: 3px;
                    font-size: 14px;
                }
            }
        }

        .customer-container {
            height: calc(100% - 86px);
            background: @bg-color;
            overflow: auto;

            /deep/ .van-list {
                height: 100%;
                overflow: auto;

                .van-collapse-item {
                    margin-bottom: 6px;

                    .van-cell {
                        height: 56px;
                        font-size: 16px;
                        color: @header-text-color;
                        font-weight: 500;

                        &::after {
                            left: 0;
                            border-bottom: 1px solid @main-bg;
                            transform: none;
                        }
                    }

                    .van-collapse-item__content {
                        padding: 0;
                    }
                }

                .van-checkbox {
                    padding-left: 15px;
                }
            }

            .more-btn-wrap {
                margin-top: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 45px;
                color: @theme-color;
                border-radius: 4px;
                font-size: 15px;
                font-weight: 500;

                .more-btn {
                    width: 100px;
                    text-align: center;
                    line-height: 45px;
                    border-radius: 20px;
                }
            }
        }
    }

    /deep/ .common-fix-bottom {
        padding: 0 18px;
    }

    .common-collapse-title {
        display: flex;

        .tag-item {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 2px;
            font-size: 11px;
            padding: 0 7px;
            line-height: 18px;
            text-align: center;
            color: #FAB55F;
            background: rgba(255, 222, 159, 0.2);
        }
    }

    .search-section {
        padding: 0 15px;
    }

    /deep/ .van-tree-select__content {
        overflow-x: hidden;
    }
</style>
