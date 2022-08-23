<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar title="线上预约">
                <template slot="append-suffix">
                    <div v-if="currentRole.roleCode !== 'ST_SALES'">
                        <FilterSection ref="filterSection" :filter-list="filterList" container=".common-page-top" @change="handleSave" />
                    </div>
                </template>
            </top-bar>
        </div>
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <van-tabs v-model="activeTab" animated @change="changeTab">
                <van-tab v-for="tab in tabList" :key="tab.value" :title="tab.name" :name="tab.value">
                    <div class="main-container">
                        <div class="search-section" v-if="currentRole.roleCode === 'ST_SALES'">
                            <!-- 筛选条件 -->
                            <div class="multiple-filter">
                                <div class="multiple-filter-left">
                                    <van-dropdown-menu :class="[activeFilter === 1 ? 'active-filter' : '']" active-color="#DB0826">
                                        <van-dropdown-item ref="sort" get-container=".common-page-container" v-model="sort" :options="order" @change="changeOrder" @open="highlightFilter(1)"></van-dropdown-item>
                                    </van-dropdown-menu>
                                </div>
                                <div class="multiple-filter-right">
                                    <FilterSection ref="filterSection" :filter-list="filterList" container=".common-page-container" @change="handleSave" />
                                </div>
                            </div>
                        </div>
                        <div class="main-section">
                            <div class="common-total-style">共<span class="num">{{total}}</span>客户</div>

                            <van-list ref="customerList" v-model="loading" :finished="finished" @load="onLoad" :finished-text="finishedText" :immediate-check="false" offset="20">
                                <div class="user-list"  v-if="!showCollapse">
                                    <div class="user-item" v-for="user in teamUserList" :key="user.id">
                                        <van-swipe-cell :ref="'swipeCell' + user.id" :before-close="beforeClose">
                                            <div class="item-section">
                                                <div class="item-middle">
                                                    <div class="name">
                                                        {{ user.customerName }}
                                                        <span class="tag-item common-tag-orange">{{ user.appointmentType === '1' ? '楼盘' : '特惠好房' }}</span>
                                                    </div>
                                                    <div class="field-content" @click="call(user.customerPhone)">
                                                        手机号码：
                                                        <span class="val">{{ user.customerPhone }}</span>
                                                        <i class="iconfont icondianhua"></i>
                                                    </div>
                                                    <div class="field-content">
                                                        预约时间：
                                                        <span class="val">{{ user.appointmentDate }}</span>
                                                    </div>
                                                     <div v-if="currentRole.roleCode === 'ST_SALES'" class="field-content">
                                                        分配时间：
                                                        <span class="val">{{ user.createDate }}</span>
                                                    </div>
                                                    <template v-if="activeTab === 1">
                                                        <div class="field-content">
                                                            沟通时间：
                                                            <span class="val">{{ user.callDate }}</span>
                                                        </div>
                                                        <div class="field-content">
                                                            备注：
                                                            <span class="val">{{ user.remark }}</span>
                                                        </div>
                                                    </template>
                                                </div>
                                                <div v-if="activeTab === 1" class="status-warp">
                                                    <img v-if="user.isValid === 1" :src="$baseImgUrl + '/case/customer/valid-icon.png'" alt="" />
                                                    <img v-else :src="$baseImgUrl + '/case/customer/invalid-icon.png'" alt="" />
                                                </div>
                                                <div v-if="activeTab === 0 && currentRole.roleCode === 'ST_SALES'" class="item-right" @click="openCell($event, user)">
                                                    <van-icon name="ellipsis" color="#D8D8D8" />
                                                </div>
                                            </div>
                                            <template #right v-if="activeTab === 0 && currentRole.roleCode === 'ST_SALES'">
                                                <van-button @click="changeStatus(user, 1)" style="width: 50%; height: 100%" square type="primary" text="有效" />
                                                <van-button @click="changeStatus(user, 2)" style="width: 50%; height: 100%" square type="danger" text="无效" />
                                            </template>
                                        </van-swipe-cell>
                                    </div>
                                </div>
                                <van-collapse  v-else v-model="activeNames" :border="false" @change="changeCollapse">
                                    <van-collapse-item v-for="(item,index) in subsalesList" :key="item.userId" :name="item.userId" :border="true">
                                        <template #title>
                                            <div class="common-collapse-title">{{ item.userName }}（{{ item.customerCount }}）</div>
                                        </template>
                                        <div class="user-list"  >
                                            <div class="user-item" v-for="user in item.customerList" :key="user.id">
                                                <van-swipe-cell :ref="'swipeCell' + user.id" :before-close="beforeClose">
                                                    <div class="item-section">
                                                        <div class="item-middle">
                                                            <div class="name">
                                                                {{ user.customerName }}
                                                                <span class="tag-item common-tag-orange">{{ user.appointmentType === '1' ? '楼盘' : '特惠好房' }}</span>
                                                            </div>
                                                            <div class="field-content">
                                                                手机号码：
                                                                <span class="val" >{{ user.customerPhone }}</span>
                                                                <i class="iconfont icondianhua"></i>
                                                            </div>
                                                            <div class="field-content">
                                                                预约时间：
                                                                <span class="val">{{ user.appointmentDate }}</span>
                                                            </div>
                                                            <div v-if="currentRole.roleCode === 'ST_SALES'" class="field-content">
                                                                分配时间：
                                                                <span class="val">{{ user.createDate }}</span>
                                                            </div>
                                                            <template v-if="activeTab === 1">
                                                                <div class="field-content">
                                                                    沟通时间：
                                                                    <span class="val">{{ user.callDate }}</span>
                                                                </div>
                                                                <div class="field-content">
                                                                    备注：
                                                                    <span class="val">{{ user.remark }}</span>
                                                                </div>
                                                            </template>
                                                        </div>
                                                        <div v-if="activeTab === 1" class="status-warp">
                                                            <img v-if="user.isValid === 1" :src="$baseImgUrl + '/case/customer/valid-icon.png'" alt="" />
                                                            <img v-else :src="$baseImgUrl + '/case/customer/invalid-icon.png'" alt="" />
                                                        </div>

                                                    </div>
                                                </van-swipe-cell>
                                            </div>
                                        </div>
                                        <div v-if="item.isShowMoreBtn" class="more-btn-wrap">
                                            <div class="more-btn" @click="showMoreClient(index,item.userId)">
                                                查看更多
                                                <van-icon class="icon-arrow" name="arrow-down" />
                                            </div>
                                        </div>
                                    </van-collapse-item>
                                </van-collapse>

                            </van-list>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <van-popup round class="pop-up" v-model="showPop" position="center" :before-close="beforeClose">
            <div class="pop-up-content">
                <p class="title">沟通内容</p>
                <van-field class="textarea-style" input-align="left" maxlength="20" show-word-limit v-model="remark" rows="2" autosize type="textarea" placeholder="请输入内容" />
                <van-button round block type="save" v-debounce="[() => confirmApproval()]">确定</van-button>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import FilterSection from '@c/FilterSection'
import CASECUSTOMERAPI from '@/request/api/caseSystem/customer'

export default {
    name: 'teamUser',
    components: {
        TopBar,
        FilterSection
    },
    computed: {
        ...mapGetters(['currentRole', 'device', 'projectId'])
    },
    data() {
        return {
            loading: false,
            finished: false,
            showPop: false,
            remark: '',
            isValid: 0,
            curUser: {},
            finishedText: '没有更多了',
            filterList: [
                {
                    name: '预约时间',
                    type: 'date',
                    field: 'dateTime',
                    dateName: ['startTime', 'endTime']
                }
            ],
            activeNames: [],
            teamUserList: [],
            activeTab: 0,
            pageNum: 1,
            pageSize: 10,
            tabList: [
                {
                    value: 0,
                    name: '待沟通'
                },
                {
                    value: 1,
                    name: '已沟通'
                }
            ],
            list: [],
            teamFilterData: {},
            filterValue: {},
            activeFilter: 1,
            //项目列表
            order: [
                {
                    value: '2',
                    text: '最近预约'
                },
                {
                    value: '1',
                    text: '最早预约'
                }
            ],
            sort: '1',
            refreshing: false,
            subsalesList:[],
            showCollapse:false,
            total:0
        }
    },
    watch: {
        showPop(val) {
            if (!val) {
                this.remark = ''
            }
        }
    },
    created() {
        if (this.currentRole.roleCode === 'ST_SALES') {
            this.filterList.unshift({
                name: '预约类型',
                type: 'check',
                field: 'appointmentType',
                list: [
                    {
                        label: '特惠好房',
                        value: 2
                    },
                    {
                        label: '楼盘',
                        value: 1
                    }
                ]
            })
        }
        this.init()
    },
    methods: {
        init() {
            this.pageNum = 1
            if (this.currentRole.roleCode !== 'ST_SALES') {
                this.showCollapse = true
                 this.getSubSalesList()
            }else{
                this.initTeamUserList()
            }

        },
        // 加载更多客户
        async showMoreClient(index,curUserId) {
            let pageNum=this.subsalesList[index].pageNum||1
            this.subsalesList[index].pageNum=pageNum+1
            if (this.$route.query.menuId === 'ST.HOME.FOLLOWALERT.YYKH') {
                 this.getMyAppointmentList(curUserId,this.subsalesList[index].pageNum)
            }else {
                this.getTeamUserList(curUserId,this.subsalesList[index].pageNum)
            }
        },
         changeCollapse(val,a) {
            if(val.length===0) return
            const curUserId = val[val.length - 1]
            const index = this.subsalesList.findIndex(item => item.userId === curUserId)
            //收起在展开不需要重新调用接口
            if (this.subsalesList[index]&&this.subsalesList[index].customerList) return
            this.getTeamUserList(curUserId)
            return

        },
        // 打电话
        call(tel) {
            this.$appMethods.SendPhone(this.device, tel)
        },
        initTeamUserList() {
            this.teamUserList = []
            this.activeId = ['']
            this.activeIndex = 0
            this.getTeamUserList()
        },
        //切换项目
        changeOrder() {
            this.teamUserList = []
            this.getTeamUserList()
        },
        highlightFilter(val) {
            this.activeFilter = val
        },
        //筛选确认
        handleSave(val) {
            this.filterValue = val
            this.teamUserList = []
            this.pageNum = 1
            if (this.currentRole.roleCode !== 'ST_SALES') {
                this.getSubSalesList()
            }else{
                this.initTeamUserList()
            }
        },
        changeTab(val) {
            this.activeTab = val
            this.init()
        },
         // 预约客户所有顾问列表
        async getSubSalesList() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                type: '4',
                isCall:this.activeTab
            }
            Object.assign(params, this.filterValue)
            this.$utils.loading()
            let result = await CASECUSTOMERAPI.getSubSalesList(params)
            this.subsalesList = result
            this.total = 0
            if (result?.length > 0) {
                this.subsalesList[0].pageNum=1
                this.total = this.$utils.getScore(result,'customerCount')
            }
            this.finishedText = '没有更多了'
            this.$toast.clear()
        },
        //获取客户列表
        async getTeamUserList(id,pageNum) {
            let params = {
                ...this.filterValue,
                sort: this.sort,
                projectId: this.projectId,
                roleCode: 'ST_SALES',
                isCall: this.activeTab,
                userId: id || '',
                pageSize: this.pageSize,
                pageNum: pageNum||this.pageNum
            }
            this.loading = true
            this.finished = true
            let result
            if(this.currentRole.roleCode !== 'ST_SALES'){
                result = await CASECUSTOMERAPI.getAppointmentListByStaffId(params)
            }else{
                result = await CASECUSTOMERAPI.getMyAppointmentList(params)
            }
            result.list &&
                result.list.map(item => {
                    item.appointmentDate = item.appointmentDate && item.appointmentDate.split(' ')[0]
                })
            if (id) {
                this.subsalesList.map(item => {
                    if (item.userId === id) {
                        item.customerList = item.customerList ? item.customerList.concat(result.list) : result.list
                        if (result.isLastPage || !result?.list.length) {
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
            this.teamUserList = this.teamUserList.concat(result.list)
            this.loading = false
             this.total=result.total
            setTimeout(() => {
                if (result.list.length < this.pageSize) {
                    this.finished = true
                } else {
                    this.finished = false
                }
            }, 100)
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getTeamUserList()
        },
        //手动滑出操作按钮
        openCell(event, user) {
            if (this.activeTab === 1) return
            event.stopPropagation()
            if (this.$refs['swipeCell' + user.id][0].offset) {
                this.$refs['swipeCell' + user.id][0].close()
                return
            }
            this.$refs['swipeCell' + user.id][0].open('right')
        },
        confirmApproval() {
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
                this.init()
            })
        },
        beforeClose() {},
        // 有效/无效
        changeStatus(user, status) {
            this.curUser = user
            this.isValid = status
            if (status === 1) {
                // 跳转登记客户页面
                if (this.isValid === 1) {
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
                    return
                }
            } else {
                this.showPop = true
            }
        },
        // 下拉刷新
        onRefresh() {
            // 清空列表数据
            this.refreshing = false
            this.loading = true
            this.pageNum = 1
            this.teamUserList = []
            this.getTeamUserList()
        }
    }
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
            height: 100vh;

            .search-section {
                padding: 0 15px;
                background: #ffffff;
            }

            .main-section {
                height: calc(100% - @search-bar-height - 44px);
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
            //margin-bottom: 20px;

            .user-item {
                background: #ffffff;
                margin-bottom: 10px;

                .item-section {
                    position: relative;
                    .common-flex();
                    align-items: flex-start;
                    padding: 15px;
                    .item-middle {
                        flex-grow: 1;
                        padding: 3px 20px 0 0px;

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

                        .field-content {
                            margin-top: 8px;
                            color: @info-color;
                            word-break: break-all;
                            font-size: 14px;
                            .val {
                                color: @header-text-color;
                            }
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
                    .status-warp {
                        position: absolute;
                        top: 15px;
                        right: 8px;
                        width: 70px;
                        img {
                            width: 100%;
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
    .iconfont {
        color: #db0826;
        font-size: 14px;
        margin-left: 6px;
    }
}
    /deep/ .van-collapse-item__content{
        padding:0
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
.pop-up {
    width: 90%;
    padding: 30px;
    box-sizing: border-box;
    .pop-up-content {
        .title {
            font-size: 18px;
        }
        .textarea-style {
            border: 1px solid #ccc;
            margin: 10px 0;
            border-radius: 5px;
        }
    }
}
/deep/ .van-button--danger {
    background: #eb6877;
}
/deep/ .van-button--primary {
    background: #62db31;
}
/deep/ .van-tree-select {
    .van-sidebar-item--select::before {
        display: none;
    }
}
</style>
<style scoped lang="less"></style>
