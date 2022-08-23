<template>
    <div class="common-page">
        <TopBar v-if="!isAssign" :title="currentConfig.name + '客户'">
<!--            <template v-if="$route.query.menuId === 'ST.CUSTOMER.LOST' || $route.query.menuId === 'ST.CUSTOMER.PUBLIC'">-->
<!--                <span slot="append-suffix" v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.ASSIGN']" class="iconfont iconfenpei" @click="toggleAssign(true)" />-->
<!--            </template>-->
            <span slot="append-suffix" class="iconfont iconsousuo" @click="handleSearch" />
        </TopBar>
        <TopBar v-else :back="false" :title="'已选择' + checkNums + '人'">
            <div slot="append-prefix" class="top-action" @click="toggleCheckALl">
                {{ checkAll ? '取消全选' : '全选' }}
            </div>
            <div slot="append-suffix" class="top-action" @click="toggleAssign(false)">
                取消
            </div>
        </TopBar>
        <main class="common-page-container" :style="{ height: isAssign ? pageMiddleWithButtonHeight : pageContainerHeight }">
            <section class="filter-container" v-if="$route.query.menuId === 'ST.CUSTOMER.TOTAL'">
                <div class="left-section">
                    <van-dropdown-menu active-color="#DB0826">
                        <van-dropdown-item ref="filter" v-model="orderBy" :options="sortOptions" @change="changeOrder" />
                    </van-dropdown-menu>
                </div>
                <div class="right-section">
                    <div
                        v-if="currentConfig.actions && currentConfig.actions.switch && $route.query.menuId !== 'ST.HOME.FOLLOWALERT.YYKH'"
                        v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.MODE']"
                        class="switch-button"
                        @click="switchCustomerType"
                    >
                        <span :class="['iconfont', showCollapse ? 'iconkehuqiehuan' : 'iconzhiyeguwenqiehuan']" />
                        {{ showCollapse ? '顾问' : '客户' }}
                    </div>
                    <div class="filter-section" v-if="$route.query.menuId === 'ST.CUSTOMER.TOTAL'">
                        <FilterSection :check-type="checkType" :filter-list="currentConfig.filterList" @change="handleFilter" @showMore="showMore" />
                    </div>
                </div>
            </section>
            <div v-if="$route.query.menuId === 'ST.CUSTOMER.TOTAL' || $route.query.menuId === 'ST.CUSTOMER.PUBLIC'" class="common-total-style">共<span class="num">{{total}}</span>客户</div>
            <section :style="$route.query.menuId === 'ST.CUSTOMER.TOTAL'&&currentRole.roleCode === 'ST_SALES'?' height: calc(100% - 80px)':''" class="customer-container">
                <van-list v-model="loading" :finished="finished" :finished-text="finishedText" offset="20" :immediate-check="false" @load="onLoad">
                    <CaseCustomer
                        v-if="!showCollapse"
                        :list="customerList"
                        :check-box="isAssign"
                        :check-all="checkAll"
                        @call="call"
                        @change="checkChange"
                        @collect="handleCollect"
                        @goDetail="goDetail"
                        @changeStatus="changeStatus"
                    />
                    <van-collapse v-else v-model="activeNames" :border="false" @change="changeCollapse">
                        <van-collapse-item v-for="(item,index) in subsalesList" :key="item.userId" :name="item.userId" :border="true">
                            <template #title>
                                <div class="common-collapse-title">{{ item.userName }}（{{ item.customerCount }}）</div>
                            </template>
                            <CaseCustomer :key="item.userId" :list="item.customerList" @collect="handleCollect" @goDetail="goDetail" />
                            <div v-if="item.isShowMoreBtn" class="more-btn-wrap">
                                <div class="more-btn" @click="showMoreClient(index,item.userId)">
                                    查看更多
                                    <van-icon class="icon-arrow" name="arrow-down" />
                                </div>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                </van-list>
            </section>
        </main>
        <van-popup round class="pop-up" v-model="showPop" position="center">
            <div class="pop-up-content">
                <p class="title">沟通内容</p>
                <van-field class="textarea-style" input-align="left" maxlength="20" show-word-limit v-model="remark" rows="2" autosize type="textarea" placeholder="请输入内容" />
                <van-button round block type="save" v-debounce="[() => changeStatusAjax()]">确定</van-button>
            </div>
        </van-popup>
        <div v-if="isAssign" class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" native-type="submit" @click="handleDistribute">
                确定选择
            </van-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import FilterSection from '@c/FilterSection'
import CaseCustomer from '@c/CaseCustomer'
import API from '@/request/api/caseSystem/customer'
import MyAPI from '@/request/api/my'
import { commonMethods } from 'movit-utils'
import CASECUSTOMERAPI from '@/request/api/caseSystem/customer'
import { getConfig, getSortOptions, getCodeType } from '@/config/caseCustomerConfig'
export default {
    name: 'CustomerWithoutTab',
    components: {
        TopBar,
        FilterSection,
        CaseCustomer
    },
    data() {
        return {
            codeType: 'ST.CUSTOMER.FAV',
            currentConfig: {},
            sortOptions: [],
            orderBy: 1,
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            activeNames: [],
            showCollapse: false,
            pageNum: 1,
            pageSize: 10,
            filterValue: {},
            customerList: [],
            subsalesList: [],
            refresh: false,
            //分配状态
            isAssign: false,
            checkNums: 0,
            checkList: [],
            checkAll: false,
            checkType: 'checkbox',
            showPop: false,
            curUser: {},
            isValid: false,
            remark: '',
            total:0
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList', 'device', 'user']) },
    watch: {},
    created() {
        this.initConfig()
        this.initParams()
        if ((this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.YYKH'||this.$route.query.menuId === 'ST.CUSTOMER.TOTAL')&&this.currentRole.roleCode !== 'ST_SALES') {
            this.showCollapse = true
        }
        this.getList()
        if (this.currentRole.roleCode !== 'ST_SALES') {
            // 只有置业顾问才有标签筛选
            this.currentConfig.filterList = this.currentConfig.filterList.filter(item => item.field !== 'tagNames')
        }
    },
    activated() {
        if (this.refresh) {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.customerList = []
            this.subsalesList = []
            this.activeNames = []
            this.getList()
            this.refresh = false
        }
    },
    methods: {
        initConfig() {
            this.currentConfig =JSON.parse(JSON.stringify(getConfig(this.$route.query.menuId)))
            if (this.$route.query.isFromHomePage === '1') {
                this.filterValue.isFromHomePage = 1
            }
            this.sortOptions = getSortOptions(this.$route.query.menuId)
            this.getTotalFilterData()
            // 只有置业顾问才有标签筛选
            if (this.currentRole.roleCode !== 'ST_SALES') {
                this.currentConfig.filterList = this.currentConfig.filterList.filter(item => item.field !== 'tagNames')
            }
        },
        getTotalFilterData() {
            if (this.$route.query.menuId === 'ST.CUSTOMER.TOTAL'&&this.currentRole.roleCode === 'ST_SALES') {
                // this.checkType = 'radio'
                let caseCustomerSearchHistory = localStorage.getItem('caseCustomerTagHistory') && JSON.parse(localStorage.getItem('caseCustomerTagHistory'))
                if (caseCustomerSearchHistory && caseCustomerSearchHistory.length) {
                    let history = []
                    caseCustomerSearchHistory.forEach(item => {
                        if (Array.isArray(item)) {
                            item.forEach(item => {
                                history.push({
                                    label: item,
                                    value: item,
                                    checked:false
                                })
                            })
                        } else {
                            history.push({
                                label: item,
                                value: item,
                                checked:false
                            })
                        }
                    })
                    if (history.length > 3) {
                        history = history.slice(0, 3)
                    }
                    history = [...new Set(history)]
                    this.filterValue.historyTagNames&&this.filterValue.historyTagNames.map(item => {
                        history.map(subItem => {
                            if (item === subItem.value) {
                                subItem.checked = true
                            }
                        })
                    })
                    this.currentConfig.filterList.map(item => {
                        if (item.field === 'historyTagNames') {
                            item.list = history
                        }
                    })
                    const filterArray = this.currentConfig.filterList.filter(item => item.field === 'historyTagNames')
                    if (filterArray.length === 0) {
                        this.currentConfig.filterList.unshift({
                            name: '历史搜索',
                            type: 'check',
                            field: 'historyTagNames',
                            list: history,
                            more: false
                        })
                    }
                }
            }
        },
        initParams() {
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.customerList = []
            this.subsalesList = []
            this.activeNames = []
        },
        changeOrder() {
            this.initParams()
            this.getList()
        },
        // 有效/无效
        changeStatus(user, status) {
            this.curUser = user
            this.isValid = status
            if (status === 1) {
                localStorage.setItem(
                    'reservationParams',
                    JSON.stringify({
                        id: this.curUser.id,
                        isCall: 1,
                        isValid: this.isValid,
                        remark: this.remark
                    })
                )
                this.$router.push({
                    path: '/case/callEnter',
                    query: {
                        fromType: 'reservation',
                        data: {
                            name: this.curUser.customerName,
                            tel: this.curUser.customerPhone,
                            time: this.curUser.appointmentDate
                        }
                    }
                })
            } else {
                this.showPop = true
            }
        },
        changeStatusAjax() {
            if (!this.remark) {
                this.$toast('请输入沟通内容')
                return
            }
            const params = {
                id: this.curUser.id,
                isCall: 1,
                isValid: this.isValid,
                remark: this.remark
            }
            CASECUSTOMERAPI.updateAppointment(params).then(() => {
                this.$toast('操作成功')
                this.showPop = false
                this.initParams()
                this.getList()
            })
        },
        //筛选
        handleFilter(val) {
            this.filterValue = val
            if (this.$route.query.isFromHomePage === '1') {
                this.filterValue.isFromHomePage = 1
            }
            this.initParams()
            this.getList()
            if (this.$route.query.menuId === 'ST.CUSTOMER.TOTAL'&&this.currentRole.roleCode === 'ST_SALES' && val.tagNames.length > 0) {
                if (localStorage.getItem('caseCustomerTagHistory')) {
                    let caseCustomerTagHistory = JSON.parse(localStorage.getItem('caseCustomerTagHistory'))
                    caseCustomerTagHistory = val.tagNames.concat(caseCustomerTagHistory)
                    localStorage.setItem('caseCustomerTagHistory', JSON.stringify([...new Set(caseCustomerTagHistory)]))
                } else {
                    let caseCustomerTagHistory = val.tagNames
                    localStorage.setItem('caseCustomerTagHistory', JSON.stringify(caseCustomerTagHistory))
                }
                this.getTotalFilterData()
            }
        },
        showMore() {
            this.currentConfig.filterList[0].more = false
        },
        async getTags() {
            let result = await MyAPI.getMyTag()
            let tagList = []
            result.forEach(item => {
                tagList.push({
                    label: item.tagName,
                    value: item.tagName
                })
            })
            this.currentConfig.filterList.push({
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: tagList
            })
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getList()
        },
        //收藏
        async handleCollect(data) {
            let result
            if (data.firstChannelCode === 'C04') {
                let params = {
                    clueId: data.clueId,
                    doFav: !data.isFav2
                }
                result = await API.favInputCustomer(params)
            } else {
                let params = {
                    clientId: data.clientId,
                    doFav: !data.isFav
                }
                result = await API.changeClientFav(params)
            }
            if (result) {
                if (data.firstChannelCode === 'C04') {
                    data.isFav2 = !data.isFav2
                } else {
                    data.isFav = !data.isFav
                }
                let message = data.isFav || data.isFav2 ? '标记成功' : '取消标记'
                this.$toast(message)
                if (this.$route.query.menuId === 'ST.CUSTOMER.FAV') {
                    this.initParams()
                    this.getList()
                }
            }
        },
        changeCollapse(val,a) {
            if(val.length===0) return
            const curUserId = val[val.length - 1]
            const index = this.subsalesList.findIndex(item => item.userId === curUserId)
            //收起在展开不需要重新调用接口
            if (this.subsalesList[index]&&this.subsalesList[index].customerList) return
            if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.YYKH') {
                this.getMyAppointmentList(curUserId)
                return
            }
            if (this.$route.query.menuId === 'ST.CUSTOMER.TOTAL') {
                this.getTotalClientList(curUserId)
                return
            }
            this.staffClientList(curUserId)

        },
        //切换客户列表展示形式
        switchCustomerType() {
            this.showCollapse = !this.showCollapse
            this.initParams()
            this.getList()
        },
        //客户详情
        goDetail(item) {
            if (this.isAssign) return

            // 预约看房不穿透详情
            if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.YYKH') return

            if (this.currentRole.roleCode !== 'ST_SALES') {
                if (item.oppId) {
                    this.$router
                        .push({
                            path: '/case/customerDetail',
                            query: {
                                oppId: item.oppId,
                                clientId: item.clientId,
                                clueId: item.clueId,
                                menuId: item.menuId
                            }
                        })
                        .catch(() => {})
                } else {
                    this.$router
                        .push({
                            path: '/case/customerCaseRegisterDetail',
                            query: {
                                oppId: item.oppId,
                                clientId: item.clientId,
                                clueId: item.clueId,
                                menuId: 'ST.CUSTOMER.INPUT'
                            }
                        })
                        .catch(() => {})
                }
            } else {
                if (this.user.id == item.staffId) {
                    if (item.oppId) {
                        this.$router
                            .push({
                                path: '/case/customerDetail',
                                query: {
                                    oppId: item.oppId,
                                    clientId: item.clientId,
                                    clueId: item.clueId,
                                    menuId: item.menuId
                                }
                            })
                            .catch(() => {})
                    } else {
                        this.$router
                            .push({
                                path: '/case/customerCaseRegisterDetail',
                                query: {
                                    oppId: item.oppId,
                                    clientId: item.clientId,
                                    clueId: item.clueId,
                                    menuId: 'ST.CUSTOMER.INPUT'
                                }
                            })
                            .catch(() => {})
                    }
                } else {
                    this.$router
                        .push({
                            path: '/case/customerCaseRegisterDetail',
                            query: {
                                oppId: item.oppId,
                                clientId: item.clientId,
                                clueId: item.clueId,
                                menuId: 'ST.CUSTOMER.INPUT'
                            }
                        })
                        .catch(() => {})
                }
            }
        },
        async getClientList() {
            let params = {
                menuId: this.$route.query.menuId,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                sortingStrategy: this.orderBy
            }
            Object.assign(params, this.filterValue)
            let result = await API.getClientList(params)
            result.list.map(item => {
                item.codeType = item.menuId
            })
            this.customerList = this.customerList.concat(result.list)
            this.total = result.total
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        //获取客户列表
        async getHomeMyAppointmentList() {
            let params = {
                ...this.filterValue,
                sort: this.orderBy,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                isCall: 0
            }
            this.loading = true
            this.finished = false
            let result = await API.getMyAppointmentList(params)
            result.list.map(item => {
                if (item.appointmentDate) {
                    item.appointmentDate = item.appointmentDate.substring(0,10)
                }
                item.codeType = 'ST.HOME.FOLLOWALERT.YYKH'
            })
            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        // 预约客户下级客户
        async getMyAppointmentList(id,pageNum) {
            let params = {
                ...this.filterValue,
                isCall: 0,
                userId: id || '',
                pageSize: this.pageSize,
                pageNum: pageNum||this.pageNum,
                projectId: this.projectId,
                roleCode: 'ST_SALES',
                sort: this.orderBy
            }
            let result = await API.getAppointmentListByStaffId(params)
            result.list.map(item => {
                item.codeType = 'ST.HOME.FOLLOWALERT.YYKH'
                item.canEdit = true
                item.appointmentDate = item.appointmentDate && item.appointmentDate.split(' ')[0]
            })
            if (id) {
                this.subsalesList.map(item => {
                    if (item.userId === id) {
                        item.customerList = item.customerList ? item.customerList.concat(result.list) : result.list
                        if (result.list.length < this.pageSize) {
                            item.isShowMoreBtn = false
                        } else {
                            item.isShowMoreBtn = true
                        }
                    }
                })
                this.$forceUpdate()
                this.$toast.clear()
                return
            }
            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        // 加载更多客户
        async showMoreClient(index,curUserId) {
            let pageNum=this.subsalesList[index].pageNum||1
            this.subsalesList[index].pageNum=pageNum+1
            if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.YYKH') {
                 this.getMyAppointmentList(curUserId,this.subsalesList[index].pageNum)
            }else {
                this.getTotalClientList(curUserId,this.subsalesList[index].pageNum)
            }
        },
        async getClientFavList() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                sortingStrategy: this.orderBy
            }
            Object.assign(params, this.filterValue)
            let result = await API.getClientFavList(params)
            result.list.map(item => {
                /**案场接待的客户下有细分状态
                 * 此处添加对应的codeType，用来在caseCustomerConfig.js下查找对应配置
                 **/
                if (item.menuId === 'ST.CUSTOMER.FOLLOWING') {
                    item.codeType = item.status
                } else {
                    item.codeType = item.menuId
                }
                item.menuType = this.$route.query.menuId
            })
            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        async getTotalClientList(id,pageNum) {
            let params = {
                pageSize: this.pageSize,
                pageNum:  pageNum||this.pageNum,
                projectId: this.projectId,
                sortingStrategy: this.orderBy,
                roleCode: 'ST_SALES',
                menuId: 'ST.CUSTOMER.TOTAL',
                currentUserId: id
            }
            const filterValue=JSON.parse(JSON.stringify(this.filterValue))
            if (filterValue.historyTagNames) {
               filterValue.tagNames = filterValue.historyTagNames.concat(filterValue.tagNames)
               filterValue.tagNames = [...new Set(filterValue.tagNames)]
            }
            delete filterValue.historyTagNames
            Object.assign(params, filterValue)
            let result = await API.getTotalClientList(params)
            result.list.map(item => {

                // this.$set(item, 'codeType', 'ST.CUSTOMER.TOTAL')
                if (item.menuId === 'ST.CUSTOMER.FOLLOWING') {
                    this.$set(item, 'codeType', item.status)
                } else if (item.menuId === 'ST.CUSTOMER.INPUT') {
                    item.codeType = getCodeType('ST.CUSTOMER.INPUT', item.status === 30 ? 20 : item.status)
                } else if (item.menuId === 'ST.CUSTOMER.NOVISIT') {
                    item.codeType = 'ST.CUSTOMER.NOVISIT'
                } else if (item.menuId === 'ST.CUSTOMER.NOVISITASSIGN') {
                    item.codeType = 'ST.CUSTOMER.NOVISITASSIGN'
                } else {
                    this.$set(item, 'codeType', item.status)
                }
                item.menuId='ST.CUSTOMER.TOTAL'
            })
            if (id) {
                this.subsalesList.map(item => {
                    if (item.userId === id) {
                        item.customerList = item.customerList ? item.customerList.concat(result.list) : result.list
                        if (result.list.length < this.pageSize) {
                            item.isShowMoreBtn = false
                        } else {
                            item.isShowMoreBtn = true
                        }
                    }
                })
                this.$forceUpdate()
                this.$toast.clear()
                return
            }
            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.total=result.total
            this.loading = false
        },
        getList() {
            if (this.$route.query.menuId === 'ST.CUSTOMER.FAV') {
                this.getClientFavList()
                return
            }
             if (this.showCollapse) {
                    this.loading = false
                    this.finished = true
                    this.finishedText = ''
                    // 预约客户获取顾问
                    if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.YYKH') {
                         this.getSubSalesList()
                    } else {
                        this.staffSubsalesList()
                    }
                } else if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.YYKH') {
                     this.getHomeMyAppointmentList()
                } else if (this.$route.query.menuId === 'ST.CUSTOMER.TOTAL') {
                     this.getTotalClientList()
                } else {
                    this.getClientList()
                }

        },
        handleSearch() {
            this.$store.dispatch('other/setSearchCustomerListType', 'customer')
            this.$store.dispatch('other/setSearchCustomerType', this.$route.query.menuId)
            this.$router
                .push({
                    path: '/searchHistory',
                    query: {
                        dataType: this.$route.query.menuId,
                        type: 0,
                        isFromHomePage: this.$route.query.isFromHomePage
                    }
                })
                .catch(() => {})
        },
        // 获取所有下级置业顾问列表
        async staffSubsalesList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                menuId: this.$route.query.menuId
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.staffSubsalesList(params)
            this.subsalesList = result
            this.total = 0
            if (result.length > 0) {
                this.total = this.$utils.getScore(result,'customerCount')
                this.subsalesList[0].pageNum = 1
            } else {
                this.finishedText = '没有更多了'
            }
            this.$toast.clear()
        },
        // 预约客户所有顾问列表
        async getSubSalesList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                type: '4',
                isCall:0
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.getSubSalesList(params)
            this.subsalesList = result
            if (result.length > 0) {
                this.activeNames = [result[0].userId]
                 this.subsalesList[0].pageNum=1
                 this.getMyAppointmentList(this.subsalesList[0].userId,this.subsalesList[0].pageNum)


            } else {
                this.finishedText = '没有更多了'
            }
            this.$toast.clear()
        },
        async staffClientList(id) {
            let params = {
                menuId: this.$route.query.menuId,
                staffId: id,
                projectId: this.projectId,
                sortingStrategy: this.orderBy
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await API.staffClientList(params)
            result.map(item => {
                /**案场接待的客户下有细分状态
                 * 此处添加对应的codeType，用来在caseCustomerConfig.js下查找对应配置
                 **/
                item.codeType = item.menuId
            })
            this.subsalesList.map(item => {
                if (item.userId === id) {
                    item.customerList = result
                }
            })
            this.$forceUpdate()
            this.$toast.clear()
        },
        //切换分配置业顾问模式
        toggleAssign(val) {
            this.isAssign = val
            if (!val) {
                this.checkList = []
                this.checkNums = 0
                this.checkAll = false
            }
        },
        // 打电话
        call(tel) {
            if (this.$route.query.menuId !== 'ST.HOME.FOLLOWALERT.YYKH') return
            this.$appMethods.SendPhone(this.device, tel)
        },
        //选择客户
        checkChange(val) {
            this.checkList = val
            this.checkNums = val.length
        },
        //全选
        toggleCheckALl() {
            this.checkAll = !this.checkAll
        },
        handleDistribute() {
            if (this.checkList.length === 0) {
                this.$toast('请选择客户')
            } else {
                this.$store.dispatch('other/setCheckedCustomer', this.checkList)
                this.$router
                    .push({
                        path: '/customer/chooseConsultant',
                        query: {
                            type: 'REGISTER'
                        }
                    })
                    .catch(() => {})
            }
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('CustomerWithoutTab') === -1) {
                array.push('CustomerWithoutTab')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/case/customerDetail')) {
                vm.refresh = true
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/case/customerDetail')) {
            array = array.filter(item => {
                return item !== 'CustomerWithoutTab'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
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
            .common-flex();
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
        height: calc(100% - 40px);
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
</style>
