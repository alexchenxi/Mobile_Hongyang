<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :title="title" />
        </div>
        <div class="common-page-container" :style="{ height: activeTab === 0 ? pageMiddleWithButtonHeight : '' }">
            <div class="main-container">
                <van-tabs
                    v-model="activeTab"
                    animated
                    sticky
                    :offset-top="64"
                    @change="changeTab"
                >
                    <van-tab
                        v-for="tab in tabList"
                        :key="tab.value"
                        :title="tab.name"
                        :name="tab.value"
                    >
                        <div class="search-section">
                            <search-bar
                                :placeholder="placeholder"
                                :data="searchValue"
                                @returnSearch="handleSearch"
                            />
                        </div>
                        <div class="main-section">
                            <van-list
                            v-model="loading"
                            :finished="finished"
                            :finished-text="finishedText"
                            offset="20"
                            :immediate-check="false"
                            @load="onLoad"
                        >
                            <div
                                class="list-content"
                                :style="activeTab === 0 ? 'padding-bottom: 70px': 'padding-bottom: 0'"
                            >
                                <CaseCustomer
                                    check-field="id"
                                    components-name="van-radio-group"
                                    :check-box="activeTab === 0"
                                    :list="customerList"
                                    @change="checkChange"
                                />
                            </div>
                        </van-list>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <div
            v-if="activeTab === 0 && customerList.length"
            class="fix-bottom common-fix-bottom"
        >
            <div
                class="btn"
                @click="approval"
            >
                同意
            </div>
            <div
                class="btn save"
                @click="disapproval"
            >
                不同意
            </div>
        </div>
        <van-popup
            v-model="showPop"
            round
            class="pop-up"
            position="center"
        >
            <div class="pop-up-content">
                <p class="title">
                    {{ status ? '确认同意该审批？' : '确认拒绝该审批？' }}
                </p>
                <van-field
                    v-model="remark"
                    class="textarea-style"
                    input-align="left"
                    maxlength="100"
                    show-word-limit
                    rows="2"
                    autosize
                    type="textarea"
                    placeholder="请输入审批意见"
                />
                <van-button
                    round
                    block
                    type="save"
                    @click="confirmApproval"
                >
                    确定
                </van-button>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import SearchBar from '@c/SearchBar'
import CaseCustomer from '@c/CaseCustomer'
import API from '@/request/api/selfExtension/toDoCenter'

export default {
    name: 'ToDoCenter',
    components: {
        TopBar,
        SearchBar,
        CaseCustomer
    },
    computed: {
        ...mapGetters(['currentRole', 'projectId', 'projectName'])
    },
    data() {
        return {
            loading: false,
            finished: false,
            title: '',
            placeholder: '',
            finishedText: '没有更多了',
            activeTab: 0,
            pageNum: 1,
            pageSize: 10,
            tabList: [
                {
                    value: 0,
                    name: '待审核'
                },
                {
                    value: 1,
                    name: '已审核'
                }
            ],
            searchValue: '',
            customerList: [],
            showPop: false,
            remark: '',
            checkId: '',
            parentName: '',
            childName: '',
            childPhone: '',
            status: ''
        }
    },
    created() {
        if (this.$route.query.id === '1') {
            this.title = '解绑申请'
            this.placeholder = '请输入自渠下线经纪人姓名或者手机号'
        }else {
            this.title = '补卡申请'
            this.placeholder = '请输入自渠人员姓名'
        }
        this.getList()
    },
    methods: {
        async getList() {
            if (this.$route.query.id === '1') {
                this.getToDoList()
            }else {
                this.getMySignList()
            }
        },
        async getToDoList() {
            let params = {
                projectId: this.projectId,
                status: this.activeTab,
                nameOrTel: this.searchValue,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            this.loading = true
            let result = await API.getToDoList(params)
            this.loading = false
            const newArray = result.list.map(item => {
                if (this.activeTab == 0) {
                    delete item.auditStatus
                }
                return {
                    ...item,
                    codeType: 'TO-DO-CENTER',
                    canEdit: true
                }
            })
            this.customerList = this.customerList.concat(newArray)

            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
        },
        async getMySignList() {
            let params = {
                projectId: this.projectId,
                status: this.activeTab,
                param: this.searchValue,
                roleCode: this.currentRole.roleCode,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            this.loading = true
            let result = await API.getMySignApplication(params)
            this.loading = false
            const newArray = result.list.map(item => {
                if (this.activeTab == 0) {
                    delete item.auditStatus
                    delete item.status
                }
                return {
                    ...item,
                    userName: `${item.userName}提交的补卡申请`,
                    signType: item.signType === 1 ? '上班卡' : '下班卡',
                    codeType: 'SUPPLEMENTARY-CARD',
                    canEdit: true
                }
            })
            this.customerList = this.customerList.concat(newArray)

            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
        },
        changeTab(val) {
            this.activeTab = val
            this.initParams()
            this.getList()
        },
        initParams() {
            this.pageNum = 1
            this.customerList = []
            this.loading = true
            this.finished = false
        },
        handleSearch(val) {
            this.searchValue = val
            this.initParams()
            this.getList()
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getList()
        },
        approval() {
            if (!this.checkId) {
                this.$toast('请先勾选客户')
                return
            }
            this.status = 1
            if (this.$route.query.id === '1') {
                this.showPop = true
            }else {
                this.approveCard()
            }
        },
        approveCard() {

            API.auditApplication({
                id: this.checkId,
                status: this.status,
            }).then(res => {
                this.$toast('操作成功')
                this.initParams()
                this.getList()
            })
            // this.$dialog
            //     .confirm({
            //         title: '',
            //         message: '是否同意审批'
            //     })
            //     .then(() => {
            //
            //     })
            //     .catch(() => {
            //     })
        },
        disapproval() {
            if (!this.checkId) {
                this.$toast('请先勾选客户')
                return
            }

            if (this.$route.query.id === '1') {
                this.status = 0
                this.showPop = true
            }else {
                this.status = 2
                this.approveCard()
            }
        },
        checkChange(val) {
            const item = this.customerList.find(item => item.id === val)
            this.checkId = val
            this.parentName = item.parentName
            this.childName = item.userName
            this.childPhone = item.tel
        },
        async confirmApproval() {
            let params = {
                id: this.checkId,
                auditStatus: this.status,
                auditAdvice: this.remark,
                projectName: this.projectName,
                parentName: this.parentName,
                childName: this.childName,
                childPhone: this.childPhone
            }
            await API.updateUnbindApplicationList(params)
            this.$toast('操作成功')
            this.showPop = false
            this.remark = ''
            this.initParams()
            this.getList()
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
        height: calc(100% - @top-bar-height - 20px);

        .main-container {
            height: 100%;
            .main-section {
                overflow: auto;
                height: 100%;
            }
            /deep/ .van-tabs {
                height: 100%;

                .van-tabs__content {
                    height: calc(100% - 44px);

                    .van-tab__pane {
                        height: 100%;
                        .search-section {
                            padding: 0 15px;
                            background: #ffffff;
                        }
                        .van-list {
                            //height: 100%;
                            //overflow: auto;

                            .list-content {
                                padding-top: 10px;
                                box-sizing: border-box;
                            }

                            ::v-deep .list-content .customer-list .van-checkbox-group .customer-item {
                                padding: 15px;
                            }
                        }
                    }
                }
            }
        }
    }

    .fix-bottom {
        position: fixed;
        bottom: 0;
        background: #ffffff;
        box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.04);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 15px 30px 15px;
        height: unset;
        /*border-radius: 22px;*/
        overflow: hidden;

        .btn {
            flex: 1;
            padding: 12px 0;
            background: #F1AE59;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
            border-radius: 22px 0 0 22px;

            &.save {
                border-radius: 0 22px 22px 0;
                background: @theme-color;
            }
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
}
</style>
