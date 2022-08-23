<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar title="考勤记录">
                <div v-if="currentRole.roleCode !== 'ZT_MANAGER'" slot="append-suffix" class="assign-customers-action assign-customers"
                     @click="goApplyForCardDetail">
                    <i class="iconfont icondaka"></i>
                    补卡记录
                </div>
            </top-bar>
        </div>
        <div class="common-page-container" :style="{height: pageContainerHeight}">
            <div class="main-container">
                <van-tabs v-model="active" @change="changeTab" :class="codes.includes('ZT.HOME.BUTTON.MEMBERATTEND') ? '' : 'hide-tab-wrap'">
                    <van-tab title="我的考勤" >
                        <div class="records-container">
                            <div class="title">
                                每日记录
                                <span>({{ currentMonth }}月)</span>
                                <span style="padding-left: 30px; font-size: 14px">本月已申请{{ curMonthSignCount }}次补卡</span>
                            </div>
                            <div class="calendar-container">
                                <AttendanceCalendar v-if="active === 0" :markDate="markDate" :defaultDate="defaultDate" @confirm="handleDateChange" />
                            </div>
                            <div class="records-details">
                                <van-empty v-if="attendanceList.length === 0 && isFinished" class="custom-image" :image="$baseImgUrl + '/no-data.png'" description="当天没有任务签到记录~" />
                                <van-steps v-else direction="vertical" :active="-1">
                                    <van-step v-for="(item, index) in attendanceList" :key="index">
                                        <template v-if="item.type !== 2">
                                            <div class="record-title">签到 {{ item.signAt }} <span class="btn-status">{{ item.type ? '任务' : '考勤' }}</span> </div>
                                            <div v-if="item.taskName" class="record-address record-task-title">
                                                任务名称：{{ item.taskName }}
                                            </div>
                                            <div class="record-address">
                                                <van-icon name="location-o" />
                                                {{ item.locationName }}
                                            </div>
                                            <van-image width="90" height="90" :src="item.img" />
                                        </template>

                                        <template v-else>
                                            <div class="record-title">补卡 {{ item.signAt }} <span class="btn-status">补卡</span> </div>
                                            <div class="record-address record-task-title">
                                                补卡类型：{{ item.signType === 1 ? '上班卡' : '下班卡' }}
                                            </div>
                                            <van-image v-if="item.img" width="90" height="90" :src="item.img" />
                                        </template>
                                    </van-step>
                                </van-steps>
                            </div>
                        </div>
                        <div class="common-footer-bar footer-btn" v-if="currentRole.roleCode !== 'ZT_MANAGER' && curDaySignCount < 2">
                            <van-button round block type="save" native-type="submit" @click="goApplyForCard">申请补卡</van-button>
                        </div>
                    </van-tab>
                    <van-tab title="成员考勤" v-if="codes.includes('ZT.HOME.BUTTON.MEMBERATTEND')">
                        <div class="records-container">
                            <div class="title">
                                每日记录
                                <span>({{ currentMonth }}月)</span>
                            </div>
                            <div class="calendar-container">
                                <AttendanceCalendar v-if="active === 1" @confirm="handleDateChange" />
                            </div>
                            <div class="records-details">
                                <div class="list-title">成员列表</div>
                                <van-empty v-if="memberList.length === 0 && isFinished" class="custom-image" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                                <van-collapse v-model="activeName" v-else accordion>
                                <van-list  v-model="loading" :finished="isFinished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                                    <template v-for="(row, index) in memberList">
                                        <van-collapse-item :title="row.groupName" :name="index">
                                            <div class="list">
                                                <div class="list-item" v-for="item in row.list" :key="item.userId" @click="goDetail(item)">
                                                    <div class="avatar">
                                                        <van-image round width="44" height="44" :src="item.avatar || $baseImgUrl + '/default-avatar.png'" />
                                                    </div>
                                                    <div class="desc">
                                                        <div class="desc-name">
                                                            <div class="member-name">{{ item.userName }}</div>
                                                            <span class="common-tag-blue tag-item">{{item.userTypeDesc}}</span>
                                                        </div>
                                                        <div class="desc-time" v-if="item.detail && item.detail.length">
                                                            <div class="time-item" >
                                                                <span class="time-col">上班时间：</span>
                                                                {{ item.detail[0].signAt }}
                                                                <span class="btn-status">{{ signStatusMap[item.detail[0].type] }}</span>
                                                            </div>
                                                            <div class="time-item"  v-if="item.detail.length >= 2">
                                                                <span class="time-col">下班时间：</span>
                                                                {{ item.detail[1].signAt }}
                                                                <span class="btn-status">{{ signStatusMap[item.detail[1].type] }}</span>
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
    name: 'attendanceRecords',
    components: {
        TopBar,
        AttendanceCalendar
    },
    computed: {
        ...mapGetters(['currentRole', 'keepAliveList', 'projectId','codes','user']),
    },
    data() {
        return {
            active: 0,
            activeName: 0,
            curMonthSignCount: 0,
            curDaySignCount: 0,
            defaultDate: new Date(),
            currentMonth: '',
            loading: false,
            finished: false,
            selectDate: '',
            attendanceList: [],
            memberList: [],
            markDate: [],
            signStatusMap: {
              '0': '考勤',
              '1': '任务',
              '2': '补卡',
            },
            isFinished: false
        }
    },
    created() {},
    mounted() {
        if (this.$route.query.date) {
            this.defaultDate = new Date(this.$route.query.date.replace(/-/g,'/'))
        }
    },
    methods: {
        handleDateChange(val) {
            this.currentMonth = val.month
            this.selectDate = val.date
            if(this.active === 0) {
                this.getAttendanceRecords()
                this.getApplicationNum()
                this.getSignDate()
            } else {
                this.getAttendanceMembers()
            }
        },
        changeTab(val) {
            this.currentMonth = ''
        },
        onLoad() {},
        goDetail(item) {
            this.$router.push({
                path: '/extension/attendanceDetail',
                query: {
                    userId: item.userId,
                    queryDate: this.selectDate
                },
            }).catch(()=>{})
        },
        goApplyForCard() {
            this.$router.push({
                path: '/extension/attendanceCard',
                query: {
                    queryDate: this.selectDate
                },
            }).catch(()=>{})
        },
        goApplyForCardDetail() {
            this.$router.push({
                path: '/extension/attendanceCardDetail',
                query: {
                    queryDate: this.selectDate
                },
            }).catch(()=>{})
        },
        async getAttendanceRecords() {
            let params = {
                queryDate: this.selectDate,
                projectId: this.projectId
            }
            this.$utils.loading()
            this.isFinished = false
            let result = await API.attendanceQuery(params)
            this.attendanceList = result
            this.$toast.clear()
            this.isFinished = true
        },
        async getApplicationNum() {
            let params = {
                date: this.selectDate,
                projectId: this.projectId
            }
            this.$utils.loading()
            this.isFinished = false
            let result = await API.getApplicationNum(params)
            this.curMonthSignCount = result.month
            this.curDaySignCount = result.day
            this.$toast.clear()
            this.isFinished = true
        },
        async getAttendanceMembers() {
            let params = {
                queryDate: this.selectDate,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode
            }
            this.$utils.loading()
            this.isFinished = false
            let result = await API.attendanceMemberList(params)
            this.memberList = result
            this.memberList.forEach(item => {
                (item.list || []).forEach(item => {
                    if (item.detail && item.detail.length >= 2) {
                        item.detail = [item.detail[0], item.detail[item.detail.length - 1]]
                    }else {
                        item.detail = [item.detail[0]]
                    }
                })
            })
            this.$toast.clear()
            this.isFinished = true
        },
        async getSignDate() {
            let dateObject = new Date(),
                year = dateObject.getFullYear(),
                month = dateObject.getMonth() + 1,
                date = dateObject.getDate(),
                today = year + '/' + this.zero(month) + '/' + this.zero(date)

            const { startDate, endDate } = this.getMouthTopOrFoot(today)
            let params = {
                startDate,
                endDate,
                projectId: this.projectId,
            }
            let result = await API.getSignDate(params)
            this.markDate = result
        },
        //补全0
        zero(i) {
            return i >= 10 ? i : '0' + i
        },
        getMouthTopOrFoot(date) {
            const dateObject = new Date(date)
            const toMonth = dateObject.getMonth() + 1
            const toDay = dateObject.getDate()
            // 获取本月一号的星期
            const toWeek = new Date(dateObject.getFullYear(), toMonth - 1, 1).getDay()

            dateObject.setDate(dateObject.getDate() - (toWeek + toDay - 1))
            let monthList = []

            for (let i = 0; i < 42; i++) {
                let current = this.getFormatDate(dateObject)

                monthList.push(`${current.year}-${this.zero(current.month)}-${this.zero(current.day)}`)
                dateObject.setDate(dateObject.getDate() + 1)
            }

            return {
                startDate: monthList[0],
                endDate: monthList[monthList.length - 1]
            }
        },
        // 时间格式化
        getFormatDate(date) {
            let year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate()
            let currentDate = year + '-' + this.zero(month) + '-' + this.zero(day)

            return {
                year: year,
                month: month,
                day: day,
                date: currentDate
            }
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('attendanceRecords') === -1) {
                array.push('attendanceRecords')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/extension/attendanceDetail')) {
            array = array.filter((item) => {
                return item !== 'attendanceRecords'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    },
}
</script>
<style scoped lang="less">
.common-page-container {
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
                    }
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
                    .record-task-title {
                        color: #333;
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
                            &:first-child {
                                padding: 3px 0;
                            }
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
                                    display: flex;
                                    flex-direction: column;
                                    padding-right: 23px;
                                    .time-item {
                                        font-size: 13px;
                                        color: @header-text-color;
                                        font-weight: 400;
                                        line-height: 13px;
                                        margin-bottom: 10px;
                                        .time-col {
                                            color: #999;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .footer-btn {
              position: fixed;
              bottom: 10px;
              width: 92%;
              padding: 0;
              background: transparent;
            }
        }
        /deep/ .hide-tab-wrap .van-tabs__wrap {
            display: none;
        }
    }
    /deep/ .van-button--save {
        background: #5F95FA;
    }
    .btn-status {
        display: inline-block;
        text-align: center;
        margin-left: 7px;
        width: 47px;
        height: 19px;
        line-height: 19px;
        border: 1px solid @blue-color;
        border-radius: 10px;
        font-size: 12px;
        color: @blue-color;
    }
    .tag-item {
        margin-left: 4px;
        display: inline-block;
        min-width: 45px;
        font-size: 10px;
        font-weight: 500;
        color: @blue-color;
        background: rgba(79,139,232,0.10);;
        height: 18px;
        padding: 0 5px;
        vertical-align: text-bottom;
		line-height: 18px;
		text-align: center;
    }
	/deep/ .van-empty__description {
		margin-top: 0px;
	}
}
</style>
