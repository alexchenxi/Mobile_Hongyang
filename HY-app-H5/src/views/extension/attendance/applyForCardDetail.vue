<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="true" title="补卡记录"></top-bar>
        </div>
        <div class="common-page-container" :style="{height: pageContainerHeight}">
            <div class="main-container">
                <div class="task-section">
                    <div class="main-section">
                        <van-list ref="taskList" v-model="loading" :finished="finished" finished-text="没有更多了"
                                  @load="onLoad" :immediate-check="false">
                            <div class="card-list">
                                <div
                                    v-for="item in customerList"
                                    :key="item.id"
                                    class="card-item"
                                >
                                    <div class="title-wrap">
                                        <span class="title">{{ item.userName }}提交的补卡申请</span>
                                        <div class="target-item">
                                            <div
                                                :class="['tag-item', statusMap[item.status][1]]"
                                            >
                                                {{ item.statusName }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <label class="label">补卡班次：</label>
                                        {{ item.signDate }}
                                    </div>
                                    <div class="field">
                                        <label class="label">补卡类型：</label>
                                        {{ item.signType }}
                                    </div>
                                    <div class="field">
                                        <label class="label">申请时间：</label>
                                        {{ item.createDate }}
                                    </div>
                                    <div class="field">
                                        <label class="label">补卡理由：</label>
                                        {{ item.reason }}
                                    </div>
                                </div>
                            </div>
                        </van-list>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import API from '@/request/api/selfExtension/toDoCenter'
import { commonData } from '@/config/commonData'

export default {
    name: 'extensionTaskList',
    components: {
        TopBar
    },
    computed: {
        ...mapGetters(['projectId', 'taskStatus', 'menuActive', 'currentRole'])
    },
    data() {
        return {
            //列表加载
            loading: false,
            finished: false,
            customerList: [],
            statusMap: {
              0: ['审批中', 'tag-item-empty'],
              1: ['审批通过', 'tag-item-blue'],
              2: ['审批驳回', 'tag-item-grey'],
            },
            pageNum: 1,
            pageSize: 10
        }
    },
    created() {},
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.customerList = []
            this.pageNum = 1
            this.getCardDetail()
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getCardDetail()
        },
        //获取客户列表
        async getCardDetail() {
            let params = {
                projectId: this.projectId,
                pageSize: this.pageSize,
                pageNum: this.pageNum * 1,
                roleCode: this.currentRole.roleCode,
            }

            this.loading = true
            this.finished = false
            let result = await API.getMySignApplication(params)
            const newArray = result.list.map(item => {
                return {
                    ...item,
                    statusName: this.statusMap[item.status][0],
                    signType: item.signType === 1 ? '上班卡' : '下班卡',
                }
            })
            this.customerList = this.customerList.concat(newArray)
            this.loading = false
            if (result.list.length < this.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
        }
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

            .main-section {
                padding: 0 15px;
                overflow: hidden;
                .card-item {
                    position: relative;
                    padding: 11px 15px;

                    .title-wrap {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        .title {
                            font-size: 16px;
                            font-family: PingFangSC-Medium, PingFang SC;
                            font-weight: 600;
                            color: @header-text-color;
                            margin-bottom: 8px;
                        }
                    }

                    .tag-item {
                        display: inline-block;
                        border-radius: 2px;
                        font-size: 11px;
                        padding: 0 7px;
                        line-height: 18px;
                        text-align: center;
                        border-radius: 2px;
                        font-size: 11px;
                        color: #fff;

                        &.end {
                            margin-right: 6px;
                        }
                    }
                    .tag-item-empty {
                        border: 1px solid #5F95FA;
                        color: #5F95FA;
                    }
                    .tag-item-blue {
                        background: #5F95FA;
                    }
                    .tag-item-grey {
                        background: #eee;
                    }

                    & > .field {
                        font-size: 13px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        margin-bottom: 10px;

                        .label {
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #999999;
                        }
                    }

                    .recommend {
                        position: absolute;
                        bottom: 18px;
                        right: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 78px;
                        height: 30px;
                        font-size: 13px;
                        color: #db0826;
                        border: 1px solid #db0826;
                        border-radius: 6px;
                    }

                    .icon-user {
                        margin-right: 6px;
                        width: 18px;
                        height: 18px;
                        background: url("@{baseImgUrl}/extension/task/icon-user.png");
                        background-size: 100% 100%;
                    }

                    .icon-target {
                        margin-right: 6px;
                        width: 18px;
                        height: 18px;
                        background: url("@{baseImgUrl}/extension/task/icon-target.png");
                        background-size: 100% 100%;
                    }

                    .progress {
                        display: inline-block;
                        width: 89px;
                        height: 5px;
                        vertical-align: middle;
                    }
                }
            }

            .task-section {
                position: relative;
                height: 100%;
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
}
</style>
