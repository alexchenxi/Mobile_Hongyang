<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="true" title="考勤详情"></top-bar>
        </div>
        <div class="common-page-container" :style="{height: pageContainerHeight }">
            <header class="header">
                <div class="top">
                    <img v-if="infoData.avatar" class="avatar" :src="infoData.avatar" />
                    <img v-if="!infoData.avatar" class="avatar" :src="$baseImgUrl + '/default-avatar.png'" />
                    <p class="name">
                        {{infoData.userName}}
                        <span class="date">{{$route.query.queryDate}}</span>
                    </p>
                </div>
                <div class="right-info">
                    <div class="time-wrap">
                        <div class="time-tag-row">
                            <div class="time-tag">
                                <van-icon size="18" class="to-work" name="checked" />
                                上班：<span class="time">{{infoData.detail[0].signAt}}</span>
                            </div>
                            <span class="btn-status">{{ signStatusMap[infoData.detail[0].type] }}</span>
                            <span class="task-title common-ellipsis">{{ infoData.detail[0].taskName }}</span>
                        </div>
                        <div class="time-tag-row" v-if="infoData.detail.length > 1">
                            <div class="time-tag">
                                <van-icon size="18" :class="infoData.detail.length > 1 ? 'to-work': 'off-work'"
                                          name="checked" />
                                下班：<span class="time" >{{infoData.detail[1].signAt}}</span>
                            </div>
                            <span class="btn-status">{{ signStatusMap[infoData.detail[1].type] }}</span>
                            <span class="task-title common-ellipsis">{{ infoData.detail[1].taskName }}</span>
                        </div>
                    </div>
                </div>
            </header>
            <van-tabs class="tab" v-model="active">
                <van-tab title="上班打卡" :name="1">
                    <ClockDetail id="mapBox1" :info="infoData.detail[0]" />
                </van-tab>
                <van-tab title="下班打卡" :name="2" v-if="infoData.detail.length > 1">
                    <ClockDetail id="mapBox2" :info="infoData.detail[1]" />
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import ClockDetail from '@c/ClockDetail'

import API from '@/request/api/selfExtension/attendance'

export default {
    name: 'AttendanceDetail',
    components: {
        TopBar,
        ClockDetail
    },
    computed: { ...mapGetters(['projectId']) },
    data() {
        return {
            active: 1,
            signStatusMap: {
                '0': '考勤',
                '1': '任务',
                '2': '补卡',
            },
            infoData: {
                detail: [{}]
            }
        }
    },
    created() {
        this.getDetail()
    },
    mounted() {
    },
    methods: {
        getDetail() {
            API.getMemberSignDetail(this.$route.query.userId, {
                queryDate: this.$route.query.queryDate,
                projectId: this.projectId
            }).then(res => {
                this.infoData = res
                this.infoData.detail.sort(function(a, b) {
                    return a.signType - b.signType
                })
            })
        }
    }
}
</script>
<style scoped lang="less">
.common-page-container {
    background: @bg-color;
    padding: 0 15px;

    .header {
        margin-bottom: 15px;
        margin-top: 15px;
        padding: 15px;
        background: #fff;
        //height: 50px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        .top {
            display: flex;
            align-items: center;
        }
        .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }

        .name {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: @header-text-color;
            margin-left: 5px;

            .date {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
            }
        }

        .time-wrap {
            display: flex;
            flex-direction: column;
            margin-top: 8px;
            .time-tag-row {
                display: flex;
                align-items: center;
            }
            .time-tag-row:last-child {
                margin-top: 10px;
            }

            .time-tag {
                //margin-right: 6px;
                display: flex;
                flex: none;
                align-items: center;
                background: #f5f6f7;
                border-radius: 4px;
                color: #999;
                padding: 4px 6px;
                font-size: 13px;
                width: 97px;

                .time {
                    color: @header-text-color;
                }
            }
        }

        .to-work {
            margin-right: 2px;
            color: @theme-color;
        }

        .off-work {
            margin-right: 2px;
            color: #cccccc;
        }
    }
}
.btn-status {
    display: inline-block;
    flex: none;
    text-align: center;
    margin-left: 7px;
    width: 47px;
    height: 19px;
    line-height: 19px;
    border: 1px solid @theme-color;
    border-radius: 10px;
    font-size: 12px;
    color: @theme-color;
}
.task-title {
    margin-left: 8px;
}
.van-tabs--line .van-tabs__wrap {
    border-radius: 8px 8px 0 0;
}

.van-tabs {
    margin-bottom: 15px;
}
</style>
