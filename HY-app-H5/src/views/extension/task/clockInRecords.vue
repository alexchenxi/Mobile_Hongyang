<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar title="任务签到记录"></top-bar>
        </div>
        <div class="common-page-container" :style="{height: pageContainerHeight}">
            <div class="main-container">
                <van-tabs v-model="active" @change="changeTab"
                          :class="codes.includes('ZT.HOME.BUTTON.MEMBERCLOCK') ? '' : 'hide-tab-wrap'">
                    <van-tab title="我的打卡" :name="0" v-if="currentRole.roleCode !== 'ZT_MANAGER'">
                        <!--                    <van-tab title="我的打卡">-->
                        <div class="records-container">
                            <div class="title">
                                每日记录
                                <span>({{ currentMonth }}月)</span>
                            </div>
                            <div class="calendar-container">
                                <AttendanceCalendar v-if="active === 0" @confirm="handleDateChange" />
                            </div>
                            <div class="records-details">
                                <van-empty v-if="taskClockInList.length === 0" class="custom-image"
                                           :image="$baseImgUrl + '/no-data.png'" description="当天没有任务签到记录~" />
                                <van-collapse v-model="activeName" accordion>
                                    <template v-for="(row, index) in taskClockInList">
                                        <van-collapse-item :title="row.taskName" :name="index">
                                            <div class="list task-list">
                                                <div class="timeline-section">
                                                    <template v-for="(child, childIndex) in row.list">
                                                        <div :key="childIndex" class="timeline-item">
                                                            <div class="timeline-item-line" />
                                                            <div class="timeline-item-dot" />
                                                            <div class="timeline-item-time">
                                                                <span class="date">签到</span>
                                                            </div>
                                                            <div class="timeline-item-wrapper">
                                                                <div class="timeline-item-title">
                                                                    <span class="time-item">{{ child.clockAt }}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </van-collapse-item>
                                    </template>
                                </van-collapse>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="成员打卡" :name="1" v-if="codes.includes('ZT.HOME.BUTTON.MEMBERCLOCK')">
                        <div class="records-container">
                            <div class="title">
                                每日记录
                                <span>({{ currentMonth }}月)</span>
                            </div>
                            <div class="calendar-container">
                                <AttendanceCalendar v-if="active === 1" @confirm="handleDateChange" />
                            </div>
                            <div class="records-details">
                                <div class="detail-header">
                                    <div class="list-title">成员列表</div>
                                    <div class="task-list">
                                        <van-dropdown-menu active-color="#DB0826">
                                            <van-dropdown-item ref="filter" v-model="taskId" :options="taskOption"
                                                               @change="changeTask"
                                                               :get-container="getContainer"></van-dropdown-item>
                                        </van-dropdown-menu>
                                    </div>
                                </div>
                                <van-empty v-if="memberList.length === 0" class="custom-image"
                                           :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                                <van-collapse v-model="activeName" v-else accordion>
                                    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
                                              @load="onLoad" :immediate-check="false">
                                        <template v-for="(row, index) in memberList">
                                            <van-collapse-item :title="row.groupName" :name="index">
                                                <div class="list">
                                                    <div class="list-item" v-for="item in row.list"
                                                         :key="item.clockAt+item.userId" @click="goDetail(item)">
                                                        <div class="avatar">
                                                            <van-image round width="44" height="44"
                                                                       :src="item.img || $baseImgUrl + '/no-data.png'" />
                                                        </div>
                                                        <div class="desc">
                                                            <div class="desc-name">
                                                                <div class="member-name">{{ item.userName }}</div>
                                                                <span
                                                                    class="common-tag-blue tag-item">{{item.userTypeDesc}}</span>
                                                            </div>
                                                            <div class="desc-time" v-for="col in item.detail">
                                                                <div class="time-item ">{{ col.taskName }}</div>
                                                                <div class="time-item">
                                                                    <span>打卡时间：</span>
                                                                    {{ col.clockAt }}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </van-collapse-item>
                                        </template>
                                    </van-list>
                                </van-collapse>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import AttendanceCalendar from '@c/AttendanceCalendar'
import API from '@/request/api/selfExtension/attendance'

export default {
    name: 'clockInRecords',
    components: {
        TopBar,
        AttendanceCalendar
    },
    computed: {
        ...mapGetters(['currentRole', 'keepAliveList', 'projectId', 'codes', 'user'])
    },
    data() {
        return {
            active: 0,
            activeName: 0,
            currentMonth: '',
            loading: false,
            finished: false,
            selectDate: '',
            taskClockInList: [],
            memberList: [],
            taskOption: [],
            taskId: '',
            pageNum: 1,
            pageSize: 10
        }
    },
    created() {
        if (this.currentRole.roleCode === 'ZT_MANAGER') {
            this.active = 1
            this.attendanceTaskList()
        }

    },
    methods: {
        formatIndex(index) {
            let _index = index < 9 ? '0' + (index + 1) : index + 1
            return _index
        },
        handleDateChange(val) {
            this.currentMonth = val.month
            this.selectDate = val.date
            if (this.active === 0) {
                this.getTaskClockInList()
            } else {
                this.pageNum = 1
                this.memberList = []
                this.getClockInMembers()
            }
        },
        changeTab(val) {
            this.currentMonth = ''
            if (val === 1) {
                this.attendanceTaskList()
            }
        },
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getClockInMembers()
        },
        goDetail(item) {
            this.$router.push({
                path: '/extension/taskSignDetail',
                query: {
                    date: this.selectDate,
                    id: item.clockId
                }
            }).catch(() => {
            })
        },
        changeTask() {
            this.memberList = []
            this.pageNum = 1
            this.getClockInMembers()
        },
        //筛选挂载节点
        getContainer() {
            return document.querySelector('.detail-header')
        },
        async getTaskClockInList() {
            let params = {
                userId: '',
                queryDate: this.selectDate,
                projectId: this.projectId
            }
            this.taskClockInList = await API.clockInQuery(params)
        },
        async getClockInMembers() {
            let params = {
                queryDate: this.selectDate,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                taskId: this.taskId
            }
            this.finished = false
            this.loading = true
            let result = await API.clockInMembers(params)
            this.memberList = result
            this.finished = false
            this.loading = false
        },
        async attendanceTaskList() {
            let params = {
                projectId: this.projectId,
                queryDate: this.selectDate,
                taskStatus: ''
            }
            let result = await API.attendanceTaskList(params)
            result.unshift({
                taskId: '',
                taskName: '全部任务'
            })
            this.taskId = ''
            this.taskOption = result.map((item) => {
                item.text = item.taskName
                item.value = item.taskId
                return item
            })
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('clockInRecords') === -1) {
                array.push('clockInRecords')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/extension/taskSignDetail')) {
                vm.refresh = true
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/extension/taskSignDetail')) {
            array = array.filter((item) => {
                return item !== 'clockInRecords'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    }
}
</script>
<style scoped lang="less">
.common-page-container {
    overflow: hidden;

    .main-container {
        height: 100%;

        .van-tabs {
            height: 100%;
        }

        /deep/ .van-tabs__wrap {
            .van-tab__text--ellipsis {
                font-size: 15px;
                color: #303030;
                font-weight: 400;
            }

            .van-tabs__line {
                width: 18px;
            }
        }

        /deep/ .van-tabs__content {
            height: calc(100% - @search-bar-height - 15px);
            background: @bg-color;
            padding: 15px;
            overflow: auto;

            .records-container {
                background: #ffffff;
                padding: 24px 0;
                margin-bottom: 15px;
                border-radius: 8px;

                .title {
                    font-size: 18px;
                    color: @header-text-color;
                    font-weight: 500;
                    padding: 0 15px 12px;

                    span {
                        font-size: 15px;
                        color: #999999;
                        padding-left: 10px;
                    }
                }

                .calendar-container {
                    padding: 0 3px;
                }

                .records-details {
                    .detail-header {
                        padding-right: 15px;
                        .common-flex-between();

                        .van-dropdown-item {
                            margin: 0 15px;
                        }
                    }

                    /deep/ .van-steps {
                        padding: 0 15px 0 32px;

                        .van-step__circle {
                            width: 6px;
                            height: 6px;
                            color: #999999;
                        }

                        .van-step--vertical:not(:last-child)::after {
                            display: none;
                        }

                        .van-step__title {
                            .record-title {
                                font-size: 15px;
                                color: @header-text-color;
                                font-weight: 400;
                                padding-bottom: 8px;
                            }

                            .record-address {
                                .common-flex();
                                font-size: 12px;
                                color: #999999;
                                font-weight: 400;
                                padding-bottom: 12px;
                            }
                        }
                    }

                    .list-title {
                        padding: 18px 15px 15px;
                        font-size: 18px;
                        font-weight: 500;
                        color: @header-text-color;
                    }

                    .list {
                        padding: 0 15px;

                        .list-item {
                            .common-flex();
                            padding: 15px 0;
                            border-bottom: 1px solid #eeeeee;

                            &:last-child {
                                border-bottom: none;
                            }

                            .avatar {
                                flex-shrink: 0;
                                margin-right: 12px;
                            }

                            .desc {
                                flex-grow: 1;

                                .desc-name {
                                    margin-bottom: 15px;
                                    display: flex;
                                    align-items: center;

                                    .member-name {
                                        margin-right: 4px;
                                        font-size: 16px;
                                        font-weight: 500;
                                        color: @header-text-color;
                                        line-height: 16px;
                                    }

                                }

                                .desc-time {
                                    &:first-child {
                                        margin-top: 0;
                                    }

                                    margin-top: 10px;
                                    .common-flex-between();

                                    .time-item {
                                        font-size: 13px;
                                        color: @header-text-color;
                                        font-weight: 400;
                                        line-height: 13px;

                                        span {
                                            color: #999999;
                                        }
                                    }

                                    .time-item:first-child {
                                        max-width: 150px;
                                    }
                                }
                            }
                        }

                        .timeline-section {
                            margin-bottom: 7px;

                            .section-title {
                                font-size: 19px;
                                font-family: PingFangSC-Medium, PingFang SC;
                                font-weight: 500;
                                color: #333333;
                                line-height: 19px;
                                margin-bottom: 17px;
                                width: 63px;
                                text-align: right;
                            }
                        }

                        .timeline-item {
                            position: relative;
                            //padding-bottom: 16px;
                            min-height: 50px;

                            .timeline-item-line {
                                position: absolute;
                                left: 50px;
                                height: 100%;
                                border-left: 3px solid #eeeff0;
                            }

                            &:last-child {
                                .timeline-item-line {
                                    height: 26px;
                                }
                            }

                            .timeline-item-dot {
                                position: absolute;
                                left: 47px;
                                width: 9px;
                                height: 9px;
                                border-radius: 50%;
                                background: @theme-color;
                            }

                            .timeline-item-time {
                                position: absolute;
                                left: 0;
                                top: -4px;
                                display: inline-flex;
                                flex-direction: column;
                                //align-items: flex-end;
                                width: 73px;

                                .date {
                                    font-weight: 500;
                                    color: @header-text-color;
                                    margin-bottom: 5px;
                                    white-space: nowrap;
                                }

                                .time {
                                    font-weight: 400;
                                    color: @info-color;
                                }
                            }

                            .timeline-item-wrapper {
                                position: relative;
                                padding-left: 74px;
                                top: -4px;

                                .timeline-item-title {
                                    display: inline-flex;
                                    align-items: center;
                                    font-size: 16px;
                                    font-weight: 500;
                                    color: @header-text-color;
                                    line-height: 16px;
                                    margin-bottom: 16px;
                                }
                            }
                        }

                        &.task-list .list-item {
                            border-bottom: none;
                            justify-content: space-between;
                            //padding: 12px 0;

                            .item-left {
                                font-size: 15px;
                                line-height: 15px;

                                .serial {
                                    color: @theme-color;
                                    font-weight: bold;
                                    margin-right: 6px;
                                }

                                .task-name {
                                    color: @header-text-color;
                                    font-weight: 500;
                                    max-width: 176px;
                                    display: inline-block;
                                    vertical-align: middle;
                                }
                            }

                            .item-right {
                                font-size: 13px;
                                line-height: 13px;
                                font-weight: 400;
                                color: @header-text-color;

                                span {
                                    color: #999999;
                                }
                            }
                        }
                    }
                }
            }
        }

        /deep/ .hide-tab-wrap .van-tabs__wrap {
            display: none;
        }
    }

    .collapse {
        color: @theme-color;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-arrow {
            margin-left: 3px;
        }
    }

    .tag-item {
        margin-left: 4px;
        display: inline-flex;
        align-items: center;
        min-width: 45px;
        font-size: 10px;
        font-weight: 500;
        height: 18px;
        padding: 0 5px;
    }
}
</style>
