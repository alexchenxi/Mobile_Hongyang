<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar v-if="checkTotal == 0" :back="true" title="分配客户"></top-bar>
            <top-bar v-else :back="false" :title="'已选择' + checkTotal + '人'">
                <div slot="append-suffix" class="assign-customers-action assign-customers"
                     @click="cancelAssignCustomer">取消
                </div>
            </top-bar>
        </div>
        <div class="common-page-container"
             :style="{ height: checkList.length > 0 ? pageMiddleWithButtonHeight : '' }">
            <div class="main-container">
                <div class="search-section">
                    <search-bar ref="searchBar" :placeholder="placeholder" @returnSearch="searchData"></search-bar>
                    <!--                    <div class="filter-section">-->
                    <!--                        <FilterSection ref="filterSection" :filter-list="currentConfig.filterList" :checkType="'radio'"-->
                    <!--                                       container=".main-container" @change="handleFilter" @reset="handleResetFilter" />-->
                    <!--                    </div>-->
                </div>
                <van-tabs v-model="activeTab" animated @change="changeTab">
                    <van-tab v-for="tab in tabList" :key="tab.value" :title="tab.name" :name="tab.value">
                        <template>
                            <van-tabs v-model="subActiveTab" animated :before-change="beforeChangeTabs"
                                      @change="subChangeTab">
                                <template slot="nav-left" v-if="subActiveTab === '1'">
                                    <van-checkbox v-model="checkGuest" @change="changeCheckGuestList"
                                                  style="position: absolute;top: 50%; z-index: 100;transform: translateY(-50%);left: 14px;">
                                        <template #icon="props">
                                                    <span class="iconfont"
                                                          :class="props.checked ? 'iconqueding' : 'iconweixuanzhong1'"></span>
                                        </template>
                                    </van-checkbox>
                                </template>
                                <van-tab v-for="subTab in subTabList[activeTab]" :key="subTab.value"
                                         :title="subTab.name" :name="subTab.value">
                                    <div class="customer-section">
                                        <div class="main-section">
                                            <van-empty
                                                v-if="(!subCustomerList.length && !staffSalesList.length) && isFinished"
                                                class="custom-image"
                                                :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                                            <template v-if="subActiveTab === '1'">
                                                <CaseCustomer
                                                    :ref="subTab.value + 'cusList'"
                                                    :list="subCustomerList"
                                                    :check-box="true"
                                                    :check-field="checkField"
                                                    :clientTabType="subTab.value"
                                                    @change="subCheckInnerChange"
                                                />
                                                <div v-if="subIsShowMoreBtn" class="more-btn-wrap">
                                                    <div class="more-btn" @click="showMore">
                                                        查看更多
                                                        <van-icon class="icon-arrow" name="arrow-down" />
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <van-checkbox-group ref="checkboxGroup" v-model="checkOuterList">
                                                    <van-collapse v-model="activeList" :border="false"
                                                                  @change="changeCollapse">
                                                        <div v-for="(item, index) in staffSalesList" :key="item.userId"
                                                             class="list"
                                                             @click="activeIndex = index">
                                                            <van-collapse-item :name="index">
                                                                <template #title>
                                                                    <div class="title">{{ item.userName }}
                                                                        ({{ item.customerCount }})
                                                                    </div>
                                                                </template>
                                                                <van-loading v-if="item.loading" type="spinner" />
                                                                <CaseCustomer
                                                                    v-else
                                                                    :ref="subTab.value + 'cusList' + index"
                                                                    :list="item.customerList"
                                                                    :check-box="true"
                                                                    :check-field="checkField"
                                                                    :clientTabType="subTab.value"
                                                                    @change="checkInnerChange"
                                                                    @goDetail="goDetail"
                                                                />
                                                                <div v-if="item.isShowMoreBtn" class="more-btn-wrap">
                                                                    <div class="more-btn" @click="showMore">
                                                                        查看更多
                                                                        <van-icon class="icon-arrow"
                                                                                  name="arrow-down" />
                                                                    </div>
                                                                </div>
                                                            </van-collapse-item>
                                                            <van-checkbox
                                                                :name="index"
                                                                @click="checkOuterChange(index,item)">
                                                                <template #icon="props">
                                                                    <span class="iconfont"
                                                                          :class="props.checked ? 'iconqueding' : 'iconweixuanzhong1'"></span>
                                                                </template>
                                                            </van-checkbox>
                                                        </div>
                                                    </van-collapse>
                                                </van-checkbox-group>
                                            </template>
                                        </div>
                                        <div style="width: 100%; height: 60px"></div>
                                    </div>
                                </van-tab>
                            </van-tabs>
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
import API from '@/request/api/caseSystem/customer'
import FilterSection from '@c/FilterSection'
import { getConfig, getTabList, getCodeType } from '@/config/caseCustomerConfig'
import CaseCustomer from '@c/CaseCustomer'
import { getAssignCustomerStatus } from '@/config/commonData'

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
            checkGuest: false,
            placeholder: '请输入客户姓名或手机号',
            params: {
                customerNameOrTel: ''
            },
            guestIsAll: false,
            // 客户列表
            closeOutside: false,
            // 分配客户
            checkList: [],
            // 公客池单个选择
            singleCheckList: [],
            checkAll: false,
            isShowMoreBtn: true,
            subIsShowMoreBtn: false,
            currentConfig: {},
            activeList: [],
            staffSalesList: [],
            subCustomerList: [],
            searchKey: '',
            activeIndex: 0,
            isFinished: false,
            activeTab: '1',
            subActiveTab: '1',
            tabList: [],
            userCount: [],
            subTabList: {
                '1': [
                    {
                        value: '1',
                        name: '公客池'
                    },
                    {
                        value: '2',
                        name: '跟进中'
                    }
                ],
                '2': [
                    {
                        value: '3',
                        name: '销售登记'
                    },
                    {
                        value: '4',
                        name: '线上预约'
                    }
                ]

            },
            isLastPage: true,
            checkField: 'clientId',
            guestObj: {},
            userNameMap: {
                '公客池': 1,
                '弃客池': 2
            }
        }
    },
    computed: { ...mapGetters(['projectId', 'keepAliveList', 'device', 'currentRole', 'checkedCustomerList', 'codes']) },
    created() {
        const tabData = getTabList('ST.CUSTOMER.ASSIGN')
        this.tabList = tabData.tabList
    },
    mounted() {
        this.activeTab = localStorage.getItem('assignCustomerActiveTab') || this.tabList[0].value
        this.subActiveTab = localStorage.getItem('assignCustomerSubActiveTab') || 1
        if (this.subActiveTab == 1 && this.activeTab == 1) {
            this.getGuestPoolCustomerList()
        } else {
            this.getStaffSales()
        }
        this.initConfig()
    },
    methods: {
        searchData(e) {
            this.params.customerNameOrTel = e
            this.initData()
        },
        initConfig() {
            this.activeList = []
            this.activeIndex = -1
            this.currentConfig = getConfig(this.activeTab)
        },
        //筛选确认
        handleFilter(value) {
            this.params = { ...this.params, ...value }
            this.initData()
        },
        //筛选重置
        handleResetFilter() {
            this.params = {}
        },
        initData() {
            this.activeList = []
            this.pageNum = 1
            if (this.subActiveTab == 1) {
                this.subCustomerList = []
                this.getGuestPoolCustomerList()
            } else {
                this.getStaffSales()
            }

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
            this.$refs[this.subActiveTab + 'cusList' + this.activeIndex][0].checkList = activeObj.checkList
            this.checkList = []
            this.staffSalesList.map((item) => {
                if (item.checkList && item.checkList.length > 0) {
                    this.checkList.concat(item.checkList)
                }
                item.loading = false
            })
            this.$forceUpdate()
        },
        //取消
        cancelAssignCustomer() {
            this.checkList = []
            this.activeList = []
            this.checkOuterList = []
            this.checkGuest = false
            this.checkTotal = 0
            // 公客池客户取消
            if (this.subActiveTab === '1') {
                this.$refs[this.subActiveTab + 'cusList'][0].checkList = []
                return
            }
            this.staffSalesList.map((item) => {
                item.checked = false
                item.checkList = []
                if (this.$refs[this.subActiveTab + 'cusList' + this.activeIndex][0]) {
                    this.$refs[this.subActiveTab + 'cusList' + this.activeIndex][0].checkList = this.checkList
                }
            })
        },
        //外层选择
        checkOuterChange(index, item) {
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
                activeObj.customerList.map((item) => {
                    array.push(item[this.checkField])
                })
                setTimeout(() => {
                    this.changeCheckLits(array)
                }, 100)
                // todo 暂时注释 单个选择只能一次性选择500个
                /*if (array.length >= 500) {
                    const maxArray = array.slice(0, 500)
                    setTimeout(() => {
                        this.changeCheckLits(maxArray)
                    }, 100)
                } else {
                    setTimeout(() => {
                        this.changeCheckLits(array)
                    }, 100)
                }*/
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

            this.staffSalesList.map((item) => {
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
        goDetail(item) {
            if (this.subActiveTab == 2 && item.receptionStatus === 0) {
                this.$toast('接待中客户不能进行分配！')
            }
        },
        // 公客池二级tab内层
        subCheckInnerChange(e) {

            if (e.length < this.checkList.length) {
                this.checkGuest = false
                this.guestIsAll = true
                this.singleCheckList = e
                this.checkTotal = e.length
                return
            }
            if (e.length === this.subCustomerList.length) {
                this.checkGuest = true
                this.guestIsAll = false
            }

            if (!this.checkGuest) {
                this.checkTotal = e.length
                this.guestIsAll = false
                this.checkGuest = false
            }
            this.checkList = e
            this.$forceUpdate()
        },
        // 确定分配
        handleDistribute() {
            if (this.checkList.length === 0) {
                this.$toast('请选择客户')
            } else {
                let isAll, formatArr, allName = []
                if (this.subActiveTab == 1) {
                    // 0 为全部转移 1 为批量转移
                    isAll = this.checkTotal === this.total ? 0 : 1
                } else {
                    formatArr = this.staffSalesList
                        .filter(item => item.checked || item.checkList)
                        .map(item => {
                            if (item.checked) {
                                allName.push(item.userName)
                            }
                            return {
                                type: item.checked ? 0 : 1,   // 0 为全部转移 1 为批量转移
                                userId: item.userId,
                                ids: item.checked ? [] : item.checkList
                            }
                        })
                }

                if (isAll === 0 || allName.length) {
                    this.confirmTip(allName,isAll, formatArr)
                    return
                }
                this.$store.dispatch('other/setCheckedCustomer', this.checkList)
                this.$router.push({
                    path: '/customer/chooseConsultant',
                    query: {
                        isAll,
                        type: this.subActiveTab,
                        searchKey: this.params.customerNameOrTel,
                        transferList: formatArr
                    }
                })
            }
        },
        confirmTip(name,isAll,formatArr) {
            this.$dialog.confirm({
                    title: '确认分配',
                    message: `您确定分配${name.length ? name.join(',') + '名下的所有客户吗？': '所有客户吗'}`,
                })
                .then(() => {
                    this.$store.dispatch('other/setCheckedCustomer', this.checkList)
                    this.$router.push({
                        path: '/customer/chooseConsultant',
                        query: {
                            isAll,
                            type: this.subActiveTab,
                            searchKey: this.params.customerNameOrTel,
                            transferList: formatArr
                        }
                    })
                })
                .catch(() => {
                    // on cancel
                });
        },
        // 获取置业顾问
        getStaffSales() {
            this.getSubSalesList()
        },
        //获取客户列表
        async getCustomerList(type) {
            this.pageNum = 1
            this.activeIndex = -1
            let currentArr = this.activeList.filter((x) => !this.staffSalesList[x].customerList)
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
            // 针对于公客池和弃客池userid做单独处理
            if (!activeObj.userId) {
                params.userId = this.userNameMap[activeObj.userName]
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

            if (type === 'check') {
                if (activeObj.customerList && activeObj.customerList.length > 0) {
                    var array = []
                    activeObj.customerList.map((item) => {
                        array.push(item[this.checkField])
                    })
                    setTimeout(() => {
                        this.changeCheckLits(array)
                    }, 100)
                }
            }
            if (activeObj.checkList && activeObj.checkList.length > 0) {
                setTimeout(() => {
                    this.changeCheckLits()
                }, 100)
            }
            this.$forceUpdate()
            this.staffSalesList[this.activeIndex].loading = false
        },
        //获取公客池客户列表
        async getGuestPoolCustomerList() {
            let params = this.$utils.deepCopy(this.params)
            params.projectId = this.projectId
            params.userId = 1
            let clientParams = {
                ...this.params,
                userId: params.userId,
                type: this.subActiveTab === '2' ? '1' : this.subActiveTab,
                projectId: this.projectId,
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }

            let clientResult = await API.getClientListBySubSale(clientParams).finally(err => {
                // activeObj.loading = false
            })
            this.subIsShowMoreBtn = true
            this.isFinished = true
            this.total = clientResult.total

            // 显示查看更多按钮
            if (clientResult.isLastPage || !clientResult?.list.length) {
                this.subIsShowMoreBtn = false
            }

            // 处理返回数据
            const formatArr = clientResult.list.map(item => {
                return {
                    ...item,
                    codeType: '1',
                    canEdit: true
                }
            })
            this.subCustomerList = this.subCustomerList.concat(formatArr)

            // 去重数据
            let obj = {}
            let result = this.subCustomerList.reduce((cur, next) => {
                obj[next.clientId] ? '' : obj[next.clientId] = true && cur.push(next)
                return cur
            }, [])
            this.subCustomerList = result
            this.$forceUpdate()
        },
        // 加载更多客户
        async showMore() {
            if (this.subActiveTab == 1) {
                this.pageNum++
                this.getGuestPoolCustomerList()
                return
            }

            const activeObj = this.staffSalesList[this.activeIndex]
            let params = this.$utils.deepCopy(this.params)
            params.projectId = this.projectId
            if (activeObj.userId) {
                params.userId = activeObj.userId
            }

            // 针对于公客池和弃客池userid做单独处理
            if (!activeObj.userId) {
                params.userId = this.userNameMap[activeObj.userName]
            }
            this.pageNum++
            const list = await this.getClientList(params)
            activeObj.customerList = activeObj.customerList.concat(list)
            this.$forceUpdate()
        },
        // 获取不同客户列表
        async getClientList(params) {
            const activeObj = this.staffSalesList[this.activeIndex]
            // 针对于销售登记未分配的userid做单独处理
            if (this.subActiveTab == 3 && activeObj.userId == 1) {
                params.userId = ''
            }
            switch (this.subActiveTab) {
                case '1':
                case '2':
                case '3':
                    this.checkField = 'clientId'
                    let clientParams = {
                        ...this.params,
                        userId: params.userId,
                        type: this.subActiveTab === '2' ? '1' : this.subActiveTab,
                        projectId: this.projectId,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }

                    let clientResult = await API.getClientListBySubSale(clientParams).finally(err => {
                        activeObj.loading = false
                    })

                    if (clientResult.isLastPage || !clientResult?.list.length) {
                        // 显示加载更多按钮
                        activeObj.isShowMoreBtn = false
                        this.$forceUpdate()
                    }

                    clientResult.list.map((item) => {
                        item.codeType = this.subActiveTab
                        item.canEdit = true
                    })
                    return clientResult.list
                case '4':
                    this.checkField = 'id'

                    const reqParams = {
                        ...this.params,
                        isCall: 0,
                        userId: params.userId,
                        projectId: this.projectId,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }

                    let result = this.getMyAppointmentList(reqParams)
                    if (result?.isLastPage || !result?.list?.length) {
                        // 显示加载更多按钮
                        activeObj.isShowMoreBtn = false
                        this.$forceUpdate()
                    }

                    return result
            }
        },
        // 预约客户
        async getMyAppointmentList(params) {
            let result = await API.getAppointmentListByStaffId(params)
            result.list.map((item) => {
                item.codeType = '4'
                item.canEdit = true
                item.appointmentDate = item.appointmentDate && item.appointmentDate.split(' ')[0]
            })
            return result.list
        },
        changeTab() {
            this.checkTotal = 0
            this.staffSalesList = []
            this.subCustomerList = []
            this.checkList = []
            // 清空輸入框
            this.$refs.searchBar.clear()

            this.initConfig()
            this.handleResetFilter()
        },
        // 公客池全选
        changeCheckGuestList(val) {
            this.checkList = []
            if (val) {
                this.subCustomerList.map(item => {
                    this.checkList.push(item.clientId)
                })
                this.checkTotal = this.total
            } else if (this.guestIsAll) {
                this.checkTotal = this.singleCheckList.length
                this.checkList = this.singleCheckList
                this.guestIsAll = false
            } else {
                this.checkTotal = 0
                this.checkList = []
            }

            const oldSubCustomerList = this.checkList
            if (oldSubCustomerList.length >= 500) {
                const maxArray = oldSubCustomerList.slice(0, 500)
                this.$refs[this.subActiveTab + 'cusList'][0].checkList = maxArray
            } else {
                this.$refs[this.subActiveTab + 'cusList'][0].checkList = oldSubCustomerList
            }
        },
        subChangeTab(val) {
            this.checkTotal = 0
            this.checkOuterList = []
            this.checkList = []
            this.checkGuest = false
            this.$refs.searchBar.clear()
            this.params.customerNameOrTel = ''
            if (this.subActiveTab === '1') {
                this.pageNum = 1
                if (this.subCustomerList.length) return
                this.getGuestPoolCustomerList()
            } else {
                this.staffSalesList = []
                this.initConfig()
                this.getStaffSales()
                this.handleResetFilter()
            }
        },
        beforeChangeTabs() {
            // if (this.checkList.length) {
            //     return false
            // }
            // if (!this.isFinished) {
            //     return false
            // } else {
            //     return true
            // }
            return true
        },
        //置业顾问列表
        async getStaffSalesList() {
            this.checkField = 'clientId'
            let params = this.$utils.deepCopy(this.params)
            params.projectId = this.projectId
            params.roleCode = this.currentRole.roleCode
            params.needToAssign = 1
            this.checkOuterList = []
            this.isFinished = false
            this.$utils.loading()
            let result = await API.staffSubsalesList(params)
            this.staffSalesList = result
            this.isFinished = true
            this.$toast.clear()
        },
        //问询客户维度所有下级置业顾问列表
        async inputCustomerSubsalesList() {
            this.checkField = 'clueId'
            let params = this.$utils.deepCopy(this.params)
            params.roleCode = this.currentRole.roleCode
            params.projectId = this.projectId
            this.isFinished = true
            this.staffSalesList = []
            const result = await API.inputCustomerSubsalesList(params)
            this.staffSalesList = result
        },
        //分配客户维度除预约客户外所有下级置业顾问列表
        async getSubSalesList() {
            this.checkField = 'clientId'
            let params = this.$utils.deepCopy(this.params)
            params.roleCode = this.currentRole.roleCode
            params.projectId = this.projectId
            params.isCall = 0
            params.type = this.subActiveTab === '2' ? '1' : this.subActiveTab
            this.isFinished = true
            this.staffSalesList = []
            this.$utils.loading()
            const result = await API.getSubSalesList(params)
            this.staffSalesList = (result || []).map(item => {
                return {
                    ...item,
                    userId: item.userName === '销售登记待分配' ? 1 : item.userId
                }
            })
            this.$toast.clear()
        }
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/customer/chooseConsultant')) {
            array = array.filter((item) => {
                return item !== 'assignCustomer'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }

        // 存储当前tab索引
        if (to.path === '/customer/chooseConsultant') {
            localStorage.setItem('assignCustomerActiveTab', this.activeTab)
            localStorage.setItem('assignCustomerSubActiveTab', this.subActiveTab)
        } else {
            localStorage.setItem('assignCustomerActiveTab', '')
            localStorage.setItem('assignCustomerSubActiveTab', '')
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

                /deep/ .van-checkbox .van-icon {
                    border-color: #DB0826 !important;
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
