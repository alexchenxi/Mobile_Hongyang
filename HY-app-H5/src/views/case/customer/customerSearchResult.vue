<template>
    <div class="common-page">
        <div class="common-page-middle">
            <div class="main-container">
                <div
                    class="search-section"
                    :style="{ paddingTop: topSafe }"
                >
                    <!-- <div class="back" @click="goBack"><i class="iconfont iconfanhui"></i></div> -->
                    <div class="search-wrap">
                        <search-bar
                            placeholder="请输入客户姓名或手机号"
                            :data="searchValue"
                            readonly
                            back
                            @focus="goBack"
                        />
                    </div>
                </div>
                <div
                    class="main-section"
                    :style="{ height: pageContainerHeight }"
                >
                    <van-empty
                        v-if="customerList.length === 0 && isFinished"
                        class="custom-image"
                        :image="$baseImgUrl + '/no-data.png'"
                        description="暂无您想找的客户~"
                    />
                    <van-list
                        v-else
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        offset="20"
                        :immediate-check="false"
                        @load="onLoad"
                    >
                        <CaseCustomer
                            :list="customerList"
                            @collect="handleCollect"
                            @goDetail="goDetail"
                            @reception="reception"
                            @changeStatus="changeStatus"
                            @call="call"
                        />
                    </van-list>
                    <ClientTypeSetting :showSetting="showSetting" :item="curItem" @handleClose="handleClose" />
                    <van-popup round class="pop-up" v-model="showPop" position="center">
                        <div class="pop-up-content">
                            <p class="title">沟通内容</p>
                            <van-field class="textarea-style" input-align="left" maxlength="20" show-word-limit v-model="remark" rows="2" autosize type="textarea" placeholder="请输入内容" />
                            <van-button round block type="save" v-debounce="[() => changeStatusAjax()]">确定</van-button>
                        </div>
                    </van-popup>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/caseSystem/customer'
import CaseCustomer from '@c/CaseCustomer'
import ClientTypeSetting from '@c/ClientTypeSetting'
import { getCodeType } from '@/config/caseCustomerConfig'
import WHITEBOARDAPI from '@/request/api/caseSystem/whiteboard'
import CASECUSTOMERAPI from '@/request/api/caseSystem/customer'

export default {
    name: 'Customer',
    components: {
        SearchBar,
        CaseCustomer,
        ClientTypeSetting
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'currentRole', 'device', 'searchCustomerType', 'searchCustomerListType'])
    },
    data() {
        return {
            loading: false,
            finished: false,
            searchValue: '',
            pageNum: 1,
            pageSize: 10,
            customerList: [],
            curItem: {},
            isFinished: false,
            isFocus: false,
            showSetting: false,
            showPop: false,
            isValid: false,
            curUser: {},
            remark: ''
        }
    },
    created() {
    },
    mounted() {
        this.searchValue = this.$route.query.searchKey
        this.getClientList()
    },
    methods: {
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getClientList()
        },
        onFocus() {
            this.isFocus = true
        },
        goBack() {
            this.$router.go(-1)
        },
        // 打电话
        call(tel) {
            if (this.$route.query.dataType === 'ST.HOME.FOLLOWALERT.YYKH') {
                this.$appMethods.SendPhone(this.device, tel)
            }
        },
        // 有效/无效
        changeStatus(user, status) {
            if (this.$route.query.dataType !== 'ST.HOME.FOLLOWALERT.YYKH') return
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
        //客户详情
        goDetail(item) {
            if (this.$route.query.dataType === 'ST.HOME.FOLLOWALERT.YYKH') return
            //   销售登记客户
            if (item.menuId === 'ST.CUSTOMER.INPUT' || item.menuId === 'ST.HOME.FOLLOWALERT.TOARRIVE') {
                this.$router.push({
                    path: '/case/customerCaseRegisterDetail',
                    query: {
                        oppId: item.oppId,
                        clueId: item.clueId,
                        status: item.status,
                        customerId: item.customerId,
                        canEdit: item.canEdit,
                        menuId: item.menuId,
                        clientId: item.clientId,
                        noVisit: item.customerStep === 1
                    }
                }).catch(() => {
                })
                return
            }
            this.$router.push({
                path: '/case/customerDetail',
                query: {
                    oppId: item.oppId,
                    clueId: item.clueId,
                    status: item.status,
                    customerId: item.customerId,
                    canEdit: item.canEdit,
                    menuId: item.menuId,
                    clientId: item.clientId,
                    noVisit: item.customerStep === 1
                }
            }).catch(() => {
            })
        },
        //收藏
        async handleCollect(data) {
            let params = {
                doFav: !data.isFav
            }
            const apiName = ''
            if (data.menuId === 'ST.CUSTOMER.INPUT') {
                params.clueId = data.clueId
                apiName = 'favInputCustomer'
            } else {
                params.clientId = data.clientId
                apiName = 'changeClientFav'
            }
            let result = await API[apiName](params)
            if (result) {
                data.isFav = !data.isFav
                let message = data.isFav ? '标记成功' : '取消标记'
                this.$toast(message)
            }
        },
        // 完成接待
        async reception(item) {
            this.showSetting = true
            this.curItem = item
            return

        },
        // 关闭弹窗
        handleClose(val) {
            if (val.status === '无效') {
                this.getData()
            }
            this.showSetting = val.flag
        },
        async getClientList() {
            let params = {
                menuId: this.searchCustomerType,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                sortingStrategy: 1
            }
            this.loading = true
            let result = {}
            this.isFinished = false
            this.finished = false
            if (this.searchCustomerListType === 'index') {
                params.customerParam = this.searchValue
                params.currentRoleCode = this.currentRole.roleCode
                this.clientList(params, 'clientListByMenu')
            } else if (this.searchCustomerListType === 'registerCustomer') {//问询客户
                params.customerNameOrTel = this.searchValue
                this.clientList(params, 'getInputCustomerList')
            }else if(this.$route.query.dataType === 'ST.HOME.FOLLOWALERT.YYKH') {
                this.getMyAppointmentList()
            }else {
                params.customerNameOrTel = this.searchValue
                this.searchCustomerList(params)
            }
        },
        async getMyAppointmentList() {
            let params = {
                isCall: 0,
                customerNameOrTel: this.searchValue,
                isFromHomePage: 1,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                sort: 1
            }
            Object.assign(params, this.filterValue)
            let result = await API.getMyAppointmentList(params)
            result.list.map(item => {
                item.codeType = 'ST.HOME.FOLLOWALERT.YYKH'
                 item.appointmentDate=item.appointmentDate&&item.appointmentDate.split(' ')[0]
            })

            this.customerList = this.customerList.concat(result.list)
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },

        clientList(params, name) {
            API[name](params).then(result => {
                result.list.map(item => {
                    /**
                     * 此处添加对应的codeType，用来在caseCustomerConfig.js下查找对应配置
                     **/
                    if (item.menuId === 'ST.CUSTOMER.FOLLOWING') {
                        item.codeType = item.status
                    }else if(this.$route.query.dataType === 'ST.HOME.FOLLOWALERT.TOARRIVE'){
                        item.codeType = 'ST.HOME.FOLLOWALERT.TOARRIVE'
                    }else if (item.menuId === 'ST.CUSTOMER.INPUT') {
                        item.codeType = getCodeType(item.menuId, item.status)
                    } else {
                        item.codeType = item.menuId
                    }
                })
                this.customerList = this.customerList.concat(result.list)
                if (result.list.length < this.pageSize) {
                    this.finished = true
                } else {
                    this.finished = false
                }
                this.loading = false
                this.isFinished = true
            })
        },
        searchCustomerList(params) {
            API.searchCustomerList(params).then(result => {
                result.map(item => {
                    /**
                     * 此处添加对应的codeType，用来在caseCustomerConfig.js下查找对应配置
                     **/
                    if (item.menuId === 'ST.CUSTOMER.FOLLOWING') {
                        item.codeType = item.status
                    } else if (item.menuId === 'ST.CUSTOMER.INPUT') {
                        item.codeType = getCodeType(item.menuId, item.status)
                    } else {
                        item.codeType = item.menuId
                    }
                })
                this.customerList = result

                this.finished = true
                this.loading = false
                this.isFinished = true
            })
        }
    }
}
</script>

<style scoped lang="less">
.common-page {
    height: 100%;
    /deep/ .pop-up {
        width: 90%;
        padding: 2rem;
        box-sizing: border-box;
    }
    .search-section {
        .search-bar {
            height: @search-bar-height !important;
        }

        .common-flex();

        .back {
            margin-right: 7px;
        }

        .search-wrap {
            flex-shrink: 0;
            flex-grow: 1;
        }

        .search-text {
            font-size: 15px;
            line-height: 15px;
            color: #999999;
            font-weight: 400;
        }

        .search-focused {
            color: @theme-color;
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
                height: calc(100% - 86px);
                // padding: 0 15px;
                overflow: auto;
            }
        }

        .custom-image {
            margin-top: 150px;

            /deep/ .van-empty__description {
                margin-top: -13px;
            }
        }
    }
}
</style>

<style scoped lang="less"></style>
