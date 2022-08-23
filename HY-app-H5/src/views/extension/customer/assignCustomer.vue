<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar v-if="checkTotal == 0" :back="true" title="分配客户"></top-bar>
            <top-bar v-else :back="false" :title="'已选择' + checkTotal + '人'">
                <div slot="append-suffix" class="assign-customers-action assign-customers" @click="cancelAssignCustomer">取消</div>
            </top-bar>
        </div>
        <div class="common-page-container" :style="{ height: checkList.length > 0 ? pageMiddleWithButtonHeight : '' }">
            <div class="main-container">
                <van-tabs v-model="activeTab" animated @change="changeTab">
                    <van-tab v-for="tab in tabList" :key="tab.value" :title="tab.name" :name="tab.value">
                        <template>
                            <div class="search-section">
                                <search-bar
                                    style="width:300px"
                                    ref="searchBar"
                                    :placeholder="activeTab === 1 ? '请输入自渠下线经纪人姓名或手机号' : '请输入客户姓名或手机号'"
                                    @returnSearch="searchData"
                                ></search-bar>
                                <div class="filter-section">
                                    <FilterSection ref="filterSection" :filter-list="currentConfig.filterList" container=".main-container" @change="handleFilter" @reset="handleResetFilter" />
                                </div>
                            </div>
                            <div class="customer-section">
                                <div class="main-section">
                                    <div v-if="activeTab === 1" style="background: #fff; color: #DB0826;padding: 0 10px;">提醒： 本功能仅限于渠道专员/渠道主管离职前分配其名下所有自渠下线经纪人</div>
                                    <van-empty v-if="!staffSalesList.length && isFinished" class="custom-image" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                                    <van-checkbox-group ref="checkboxGroup" v-model="checkOuterList">
                                        <van-collapse v-model="activeList" :border="false" @change="changeCollapse">
                                            <div v-for="(item, index) in staffSalesList" :key="item.userId" class="list" @click="activeIndex = index">
                                                <van-collapse-item :name="index">
                                                    <template #title>
                                                        <div class="title">{{ item.userName }} ({{ item.customerCount }})</div>
                                                    </template>
                                                    <van-loading v-if="item.loading" type="spinner" />
                                                    <CaseCustomer
                                                        v-else
                                                        :ref="'customerList' + index"
                                                        :list="item.customerList"
                                                        :check-box="true"
                                                        :check-field="checkField"
                                                        @change="checkInnerChange"
                                                    />
                                                    <div v-if="item.isShowMoreBtn" class="more-btn-wrap">
                                                        <div class="more-btn" @click="showMore">
                                                            查看更多
                                                            <van-icon class="icon-arrow" name="arrow-down" />
                                                        </div>
                                                    </div>
                                                </van-collapse-item>
                                                <van-checkbox :name="index" @click="checkOuterChange(index, item)">
                                                    <template #icon="props">
                                                        <span class="iconfont" :class="props.checked ? 'iconqueding' : 'iconweixuanzhong1'"></span>
                                                    </template>
                                                </van-checkbox>
                                            </div>
                                        </van-collapse>
                                    </van-checkbox-group>
                                </div>
                                <div style="width: 100%; height: 60px"></div>
                            </div>
                        </template>
                    </van-tab>
                </van-tabs>
            </div>
        </div>

        <div v-if="checkTotal > 0" class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" native-type="submit" @click="handleDistribute">确定选择</van-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/selfExtension/customer'
import FilterSection from '@c/FilterSection'
import { getConfig } from '@/config/extensionCustomerConfig'
import CaseCustomer from '@c/ExtensionCustomer'
export default {
    name: 'AssignCustomer',
    components: {
        TopBar,
        SearchBar,
        FilterSection,
        CaseCustomer
    },
    data() {
        return {
            //列表加载
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            checkTotal: 0,
            checkOuterList: [],
            guestIsAll: false,
            // 客户列表
            closeOutside: false,
            // 分配客户
            checkList: [],
            checkAll: false,
            isShowMoreBtn: true,
            currentConfig: {},
            activeList: [],
            staffSalesList: [],
            searchKey: '',
            activeIndex: 0,
            isFinished: false,
            activeTab: 0,
            checkField: 'id',
            teamUserList: [],
            codeArray: ['ZT.CUSTOMER.CHANNEL', 'ZT.REFERRAL.BROKER'],
            statusMap: {
                10: '报备时间',
                20: '到访时间',
                30: '认筹时间',
            },
            tabList: [
                {
                    value: 0,
                    name: '渠道成员'
                },
                {
                    value: 1,
                    name: '自渠下线经纪人'
                }
            ],
            isLastPage: true,
            params: {}
        }
    },
    computed: { ...mapGetters(['projectId', 'keepAliveList', 'device', 'currentRole', 'checkedCustomerList', 'codes']) },
    created() {},
    mounted() {
        this.initConfig()
        this.initOutterData()
    },
    methods: {
        searchData(e) {
            this.params.nameOrTel = e
            this.initData()
        },
        async initConfig() {
            this.activeList = []
            this.activeIndex = 0
            this.currentConfig = getConfig(this.codeArray[this.activeTab])
            if (this.teamUserList.length === 0) {
                this.teamUserList = await API.getTeamUser({
                    projectId: this.projectId,
                    roleCode: this.currentRole.roleCode
                })
                this.teamUserList.map(item => {
                    item.value = item.groupId
                    item.label = item.groupName
                })
            }

            this.currentConfig.filterList[this.activeTab === 1 ? 0 : 1].list = this.teamUserList
            this.$forceUpdate()
        },
        //筛选确认
        handleFilter(value) {
            this.params = { ...this.params, ...value }
            this.params.nameOrTel = this.$refs.searchBar[this.activeTab].searchValue
            this.initData()
        },
        //筛选重置
        handleResetFilter() {
            this.params = {}
        },
        initData() {
            this.activeList = []
            this.initOutterData()
            this.loading = true
        },
        //筛选挂载节点
        getContainer() {
            return document.querySelector('.main-container')
        },
        changeCollapse(val) {
            this.activeList = val
            this.getCustomerList()
        },
        //修改选中值
        changeCheckLits(data) {
            const activeObj = this.staffSalesList[this.activeIndex]
            if (data) activeObj.checkList = data
            this.$nextTick(() => {
                this.$refs['customerList' + this.activeIndex][this.activeTab].checkList = activeObj.checkList
            })
            this.checkList = []
            this.staffSalesList.map(item => {
                if (item.checkList && item.checkList.length > 0) {
                    this.checkList = this.checkList.concat(item.checkList)
                }
                item.loading = false
            })
            this.$forceUpdate()
        },
        goCustomerDetail(item) {
            this.$router
                .push({
                    path: '/extension/customerDetail',
                    query: {
                        oppId: item.oppId,
                        clueId: item.clueId,
                        canEdit: item.canEdit,
                        // 只有已报备的客户才可以在详情修改姓名及备注
                        editCustomerName: item.canEdit && item.clueStatus === 10 && item.avaStatus === 1 ? 1 : 0
                    }
                })
                .catch(() => {})
        },
        //取消
        cancelAssignCustomer() {
            this.checkList = []
            this.checkOuterList = []
            this.checkTotal = 0
            this.staffSalesList.map(item => {
                item.checked = false
                item.checkList = []
                this.$refs['customerList' + this.activeIndex][this.activeTab].checkList = this.checkList
            })
            this.$forceUpdate()
        },
        //外层选择
        checkOuterChange(index) {
            this.activeIndex = index
            const activeObj = this.staffSalesList[this.activeIndex]
            activeObj.checked = !activeObj.checked
            this.staffSalesList.splice(index, 1, activeObj)
            //默认展开
            this.activeList.push(index)
            if (this.checkOuterList.indexOf(index) === -1) {
                this.changeCheckLits([])
                return
            }
            if (activeObj.customerList && activeObj.customerList.length > 0) {
                var array = []
                activeObj.customerList.map(item => {
                    array.push(item[this.checkField])
                })
                setTimeout(() => {
                    this.changeCheckLits(array)
                }, 100)
            } else {
                this.getCustomerList('check')
            }
            this.checkTotal = 0
            this.staffSalesList.forEach(item => {
                if (item.checked) {
                    this.checkTotal += item.customerCount
                } else if (!item.checked && item.checkList && item.checkList.length) {
                    this.checkTotal += item.checkList.length
                }
            })
        },
        //内层
        checkInnerChange(e) {
            const activObj = this.staffSalesList[this.activeIndex]
            activObj.checkList = e
            if (activObj.customerList && e.length === activObj.customerList.length) {
                if (this.checkOuterList.indexOf(this.activeIndex) === -1) {
                    this.checkOuterList.push(this.activeIndex)
                }
                activObj.checked = true
            } else {
                let index = this.checkOuterList.indexOf(this.activeIndex)
                if (index > -1) {
                    this.checkOuterList.splice(index, 1)
                }
                activObj.checked = false
            }

            this.checkList = []
            this.checkTotal = 0

            this.staffSalesList.map(item => {
                if (item.checkList && item.checkList.length > 0) {
                    this.checkList = this.checkList.concat(item.checkList)
                }
                if (item.checked) {
                    this.checkTotal += item.customerCount
                } else if (!item.checked && item.checkList && item.checkList.length) {
                    this.checkTotal += item.checkList.length
                }
            })
            this.$forceUpdate()
        },
        // 确定分配
        handleDistribute() {
            if (this.checkList.length === 0) {
                this.$toast('请选择客户')
            } else {
                let isAll,
                    formatArr,
                    allName = []
                formatArr = this.staffSalesList
                    .filter(item => item.checked || (item.checkList && item.checkList.length > 0))
                    .map(item => {
                        if (item.checked) {
                            allName.push(item.userName)
                        }
                        return {
                            type: item.checked ? 0 : 1, // 0 为全部转移 1 为批量转移
                            userId: item.userId,
                            ids: item.checked ? [] : item.checkList
                        }
                    })

                if (isAll === 0 || allName.length) {
                    this.confirmTip(allName, isAll, formatArr)
                    return
                }
                this.goChoose(isAll, formatArr)
            }
        },
        confirmTip(name, isAll, formatArr) {
            const ChannelTip = `您确定分配${name.length ? name.join(',') + '名下的客户吗？' : '所有客户吗'}`
            const selfChannelChildTip = `您确定分配${name.length ? name.join(',') + '名下的自渠下线经纪人及他的客户吗？' : '所有客户吗'}`
            this.$dialog
                .confirm({
                    title: '确认分配',
                    message: this.activeTab !== 0 ? selfChannelChildTip : ChannelTip
                })
                .then(() => {
                    this.goChoose(isAll, formatArr)
                })
                .catch(() => {
                    // on cancel
                })
        },
        goChoose(isAll, formatArr) {
            this.$store.dispatch('other/setCheckedCustomer', this.checkList)
            this.$router.push({
                path: '/extension/chooseConsultant',
                query: {
                    isAll,
                    transferList: formatArr,
                    type: this.activeTab,
                    searchKey: this.params.nameOrTel,
                    statusList: this.params.statusList
                }
            })
        },
        //获取客户列表
        async getCustomerList(type) {
            this.pageNum = 1
            this.activeIndex = -1
            let currentArr = this.activeList.filter(x => !this.staffSalesList[x].customerList)
            if (currentArr.length > 0) {
                this.activeIndex = currentArr[0]
            }
            if (this.activeIndex === -1) {
                return
            }
            const activeObj = this.staffSalesList[this.activeIndex]

            // 显示加载更多按钮
            activeObj.isShowMoreBtn = true
            if (activeObj.customerList) return
            let params = this.$utils.deepCopy(this.params)
            params.projectId = this.projectId
            if (activeObj.userId) {
                params.userId = activeObj.userId
            }
            this.staffSalesList[this.activeIndex].loading = true
            let result = await this.getClientList(params)

            //重新筛选之后如果本身就有选中值，需要赋值
            if (this.checkList.length > 0 && type !== 'check') {
                activeObj.checkList = []
                result.map(() => {
                    if (this.checkList.indexOf(this.checkField) > -1) {
                        activeObj.checkList.push(this.checkField)
                    }
                })
            }
            activeObj.customerList = result
            this.$forceUpdate()
            this.staffSalesList[this.activeIndex].loading = false
            if (type === 'check') {
                if (activeObj.customerList && activeObj.customerList.length > 0) {
                    var array = []
                    activeObj.customerList.map(item => {
                        array.push(item[this.checkField])
                    })
                    this.changeCheckLits(array)
                }
            }
            if (activeObj.checkList && activeObj.checkList.length > 0) {
                this.changeCheckLits()
            }
        },
        // 加载更多客户
        async showMore() {
            const activeObj = this.staffSalesList[this.activeIndex]
            let params = this.$utils.deepCopy(this.params)
            params.projectId = this.projectId
            if (activeObj.userId) {
                params.userId = activeObj.userId
            }
            const list = await this.getClientList(params)
            activeObj.customerList = activeObj.customerList.concat(list)
            this.$forceUpdate()
        },
        changeTab() {
            this.checkTotal = 0
            this.staffSalesList = []
            this.checkList = []
            // 清空輸入框
            this.$nextTick(() => {
                this.$refs.searchBar[this.activeTab].clear()
                this.params.nameOrTel = ''
            })
            this.initConfig()
            this.handleResetFilter()
            this.initData()
        },
        // 获取内部客户列表
        async getClientList(params) {
            const activeObj = this.staffSalesList[this.activeIndex]
            activeObj.pageNum = activeObj.pageNum ? activeObj.pageNum + 1 : 1
            const reqParams = {
                ...this.params,
                userId: params.userId,
                projectId: this.projectId,
                pageSize: this.pageSize,
                pageNum: activeObj.pageNum
            }
            const apiArray = ['selfChannelAssignListByUserId', 'childBrokerGroupListByUserId']
            let result = await API[apiArray[this.activeTab]](reqParams)
            if (result.isLastPage || result.list.length === 0) {
                // 显示加载更多按钮
                activeObj.isShowMoreBtn = false
                this.$forceUpdate()
            }
            if(this.activeTab===1){
               result.list.map(item => (item.id = item.relationId))
            }
            const formatList = result.list.map(item => {
                return {
                    ...item,
                    dateName: this.statusMap[item.clueStatus],
                    codeType: this.codeArray[this.activeTab]
                }
            })
            // result.list.map(item => (item.codeType = item.clueStatus))
            return formatList
        },
        //外层数据
        async initOutterData() {
            let params = JSON.parse(JSON.stringify(this.params))
            params.projectId = this.projectId
            params.roleCode = this.currentRole.roleCode
            this.checkOuterList = []
            this.isFinished = false
            this.$utils.loading()
            const apiArray = ['selfChannelAssignGroupByUserId', 'childBrokerGroupList']
            let result = await API[apiArray[this.activeTab]](params)
            this.staffSalesList = result
            this.isFinished = true
            this.$toast.clear()
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('AssignCustomer') === -1) {
                array.push('AssignCustomer')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/extension/chooseConsultant')) {
                vm.refresh = true
            }
            if (vm.checkedCustomerList.length === 0) {
                vm.initData()
                vm.cancelAssignCustomer()
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/extension/chooseConsultant')) {
            array = array.filter(item => {
                return item !== 'AssignCustomer'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    }
}
</script>
<style scoped lang="less">
.common-page {
    .common-page-top {
        background: #ffffff;
        // padding: 0 15px;
        .action-list {
            width: 80px;
            position: absolute;
            right: 0;
            text-align: right;
        }

        .assign-customers {
            position: absolute;
            right: 0;
            font-size: 15px;
            color: #333333;
            font-weight: 500;
        }

        .assign-customers-action {
            min-width: 40px;
            font-size: 15px;
            color: @theme-color;
            font-weight: 500;

            &.action-all {
                // position: absolute;
                // right: 0;
            }
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
                display: flex;
                justify-content: space-between;

                .search-bar {
                    width: 100%;
                }

                /deep/ .van-search__content {
                    width: 100%;
                }
            }

            .main-section {
                height: 100%;
                overflow: auto;

                .van-loading {
                    text-align: center;
                }

                &.assign-container {
                    position: relative;
                    z-index: 21;
                }

                .title {
                    font-size: 16px;
                    height: 24px;
                    background: #ffffff;
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                    margin-left: 15px;
                }

                .list {
                    position: relative;
                }
                .list:last-child {
                    margin-bottom: 20px;
                }
                .mb-20 {
                    height: 20px;
                }
                /deep/ .van-checkbox .van-icon {
                    border-color: #db0826 !important;
                }

                /deep/ .list > .van-checkbox {
                    position: absolute;
                    top: 20px;
                    left: 16px;
                }

                .van-collapse-item {
                    margin-bottom: 6px;

                    /deep/ .van-cell__title {
                        padding-left: 15px;
                    }

                    /deep/ .van-cell::after {
                        left: 0;
                    }
                }

                /deep/ .van-checkbox__icon {
                    .common-flex-center();
                }
            }

            .customer-section {
                position: relative;
                height: calc(100% - @search-bar-height);

                &.assign-container {
                    ::v-deep .van-tabs__wrap:after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            /deep/ .van-tabs {
                height: 100%;

                .van-tabs__content {
                    height: calc(100% - 44px);

                    .van-tab__pane {
                        height: 100%;
                    }
                }
            }

            /deep/ .no-tab {
                .van-tabs__wrap {
                    display: none;
                }

                &.van-tabs {
                    .van-tabs__content {
                        height: 100%;
                    }
                }
            }
        }

        .active-filter {
            ::v-deep .van-dropdown-menu__title {
                color: @theme-color;
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

    .footer-bar {
        .common-flex-center();
        height: @tab-bar-height;
        padding: 0 15px;
    }
}

.iconfont.iconqueding {
    color: @theme-color;
    font-size: 18px;
}

.iconfont.iconweixuanzhong1 {
    background: #ffffff;
    font-size: 18px;
    color: #e5e5e5;
}
</style>
