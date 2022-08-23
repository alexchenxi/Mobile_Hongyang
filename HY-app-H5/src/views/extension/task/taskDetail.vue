<template>
    <div class="common-page">
        <top-bar :needWhite="true" :back="true" title="任务详情">
      <span
          v-if="taskList[taskIndex].isOwner && taskList[taskIndex].status === 0"
          v-code="[`ZT.HOME.BUTTON`,`ZT.HOME.BUTTON.TASKCLOCK`]"
          slot="append-suffix"
          @click="toSign"
          class="iconfont icondaka"
      ></span>
        </top-bar>
        <div class="common-page-container" :style="{height: pageContainerHeight}">
            <div class="swiper-container swipe-box">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in taskList" :key="item.id">
                        <!--            <img-->
                        <!--              v-if="item.status === 1 || item.status === 0"-->
                        <!--              class="icon-qrcode"-->
                        <!--              @click="toQrcode(item)"-->
                        <!--              :src="$baseImgUrl+ '/icon-qrcode.png'"-->
                        <!--            />-->
                        <div class="title-wrap">
                            <span class="title">{{item.name}}</span>
                        </div>
                        <div class="field">
                            <label class="label">创建人：</label>
                            {{item.createName}}
                        </div>
                        <div class="field">
                            <label class="label">任务周期：</label>
                            {{item.beginTime}}~{{item.endTime}}
                        </div>
                        <div class="task-target">
                            <div class="target-item">
                                <div class="tag-item" :class="getColor(item)">{{getText(item)}}</div>
                            </div>
                            <div class="target-item">
                                <div class="target-number">
                                    <i class="icon-user"></i>
                                    <span><span class="num">{{item.userList && item.userList.length}}</span>人</span>
                                </div>
                                <div class="target-number">
                                    <i class="icon-target"></i>
                                    <span><span class="num">{{item.finishedNum}}</span>
                  /{{item.targetNum}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="split">
                            <div class="split-line"></div>
                            <div class="left-radius"></div>
                            <div class="right-radius"></div>
                        </div>
                        <div class="field">
                            <label class="label">是否有范围要求：</label>
                            {{item.isEnableScope ? '是' : '否'}}
                        </div>
                        <div class="field" v-if="item.location">
                            <label class="label">任务地址：</label>
                            {{item.location}}
                        </div>
                        <div class="field" v-if="item.isEnableScope">
                            <label class="label">任务范围：</label>
                            {{item.radius / 1000}}Km
                        </div>
                        <div class="field" v-if="item.channelTypeName">
                            <label class="label">拓客方式：</label>
                            {{item.channelTypeName}}
                        </div>
                        <div class="field" v-if="item.remark">
                            <label class="label">任务说明：</label>
                        </div>
                        <div class="field" v-if="item.remark">{{item.remark}}</div>
                        <div class="split">
                            <div class="split-line"></div>
                        </div>
                        <div class="field" v-if="item.participantsList && item.participantsList.length">
                            <label class="label">任务成员：</label>
                        </div>
                        <div class="members" v-if="item.participantsList && item.participantsList.length">
                            <div class="member" v-for="x in item.participantsList" :key="x.userId">
                                <img
                                    class="avatar"
                                    :src="x.avatar ? x.avatar : $baseImgUrl + '/default-avatar.png'"
                                />
                                {{x.name}}
                            </div>
                            <div
                                class="member"
                                v-if="item.userList && item.userList.length > 5"
                                @click="showPopup = true"
                            >
                                <div class="more">
                                    <span class="dots"></span>
                                    <span class="dots"></span>
                                    <span class="dots"></span>
                                </div>
                                更多
                            </div>
                        </div>
                        <div class="total">
                            <i class="iconfanhui iconfont" @click="prevPage(index)"></i>
                            <span class="current">{{taskIndex + 1}}</span>
                            /{{taskIds.length}}
                            <i class="iconiconrightarrow iconfont" @click="nextPage(index)"></i>
                            <div v-if="item.isShowReportButton === 1 && currentRole.roleCode === 'ZT_DIRECTOR'"
                                 class="recommend-circle" @click.stop="recommend(item)">
                                <div class="title">
                                    <van-icon size="22" name="good-job-o" class="icon-recommend" />
                                    立即报备
                                </div>
                            </div>
                        </div>

                        <div class="btn-wrap">
                            <van-button
                                v-if="item.hasAuth && item.status === 0"
                                class="btn"
                                block
                                @click="changeAutoStatus(item)"
                            >任务终止
                            </van-button>
                            <van-button
                                v-if="item.hasAuth && (item.status === 1 || item.status === 0)"
                                class="btn"
                                block
                                @click="toEdit(item)"
                            >任务修改
                            </van-button>
                        </div>
                        <template v-if="getText(item) === '进行中'">
                            <div v-if="item.isShowReportButton === 1 && currentRole.roleCode === 'ZT_MEMBER'"
                                 class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
                                <van-button round block type="save" native-type="submit" @click="recommend(item)">立即报备
                                </van-button>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <van-popup
                overlay-class="member-overlay"
                v-model="showPopup"
                position="bottom"
                round
                closeable
                :safe-area-inset-bottom="true"
            >
                <p class="popup-title">任务成员</p>
                <div class="members popup-members" v-if="taskList[taskIndex]">
                    <div class="member" v-for="x in taskList[taskIndex].userList" :key="x.userId">
                        <img
                            class="avatar"
                            :src="x.avatar ? x.avatar : $baseImgUrl + '/default-avatar.png'"
                        />
                        {{x.name}}
                    </div>
                </div>
            </van-popup>
        </div>
    </div>
</template>
<script>
import API from '@/request/api/selfExtension/task'
import { getTaskStatus } from '@/config/commonData'
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import Swiper from 'swiper'

export default {
    name: 'extensionTaskDetail',
    components: {
        TopBar
    },
    data() {
        return {
            showPopup: false,
            taskIds: [],
            taskIndex: 0,
            currentTaskId: '',
            taskList: [{}]
        }
    },
    created() {
        this.currentTaskId = this.$route.query.id
        this.init()
    },
    computed: { ...mapGetters(['projectId', 'currentRole']) },
    mounted() {
    },
    methods: {
        //   初始化
        async init() {
            let that = this
            this.taskIds = await this.getAllTaskId()
            // 默认任务下标
            this.taskIndex = this.taskIds.findIndex(id => {
                return this.currentTaskId === id
            })
            this.taskList = new Array(this.taskIds.length).fill({})
            this.setTaskDetail(this.taskIndex)
            setTimeout(() => {
                let mySwiper = new Swiper('.swiper-container', {
                    initialSlide: this.taskIndex,
                    onSlideChangeStart: function(swiper) {
                        that.taskIndex = swiper.activeIndex
                        that.setTaskDetail(swiper.activeIndex)
                    }
                })
            }, 0)
        },
        prevPage(index) {
            const that = this
            const prevIndex = index - 1
            if (prevIndex < 0) return
            setTimeout(() => {
                let mySwiper = new Swiper('.swiper-container', {
                    initialSlide: index,
                    preventClicksPropagation: true
                })
                mySwiper.slideTo(prevIndex, 1000, false)
                that.taskIndex = prevIndex
                that.setTaskDetail(prevIndex)
            }, 0)
        },
        nextPage(index) {
            const that = this
            const nextIndex = index + 1

            if (nextIndex > this.taskIds.length - 1) return
            setTimeout(() => {
                let mySwiper = new Swiper('.swiper-container', {
                    initialSlide: index,
                    preventClicksPropagation: true
                })
                mySwiper.slideTo(nextIndex, 1000, false)
                that.taskIndex = nextIndex
                that.setTaskDetail(nextIndex)
            }, 0)
        },
        // 设置任务详情数据
        async setTaskDetail(index) {
            if (Object.keys(this.taskList[index]).length) {
                return
            }
            this.$utils.loading()
            this.currentTaskId = this.taskIds[index]
            let detail = await this.getTaskDetail()
            this.$toast.clear()
            detail.statusStr = getTaskStatus(detail.status)
            detail.percentStr = parseInt((detail.finishedNum / detail.targetNum) * 100)
            detail.percent = detail.percentStr
            if (detail.percent > 100) {
                detail.percent = 100
            }
            detail.participantsList = detail.userList
            detail.beginTime = detail.beginTime.split(' ')[0]
            detail.endTime = detail.endTime.split(' ')[0]

            if (detail.userList && detail.userList.length > 5) {
                detail.participantsList = detail.userList.slice(0, 4)
            }
            this.$set(this.taskList, index, detail)
        },
        //   获取所有任务id
        async getAllTaskId() {
            return API.getAllTaskId({
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode
            }).then(res => {
                return res
            })
        },
        // 获取任务详情
        async getTaskDetail() {
            return API.getTaskDetail({
                taskId: this.currentTaskId,
                roleCode: this.currentRole.roleCode
            }).then(res => {
                return res
            })
        },
        // 跳转二维码页面
        toQrcode(item) {
            this.$router.push({
                path: '/extension/taskQrcode',
                query: {
                    taskId: item.id,
                    name: item.name
                }
            }).catch(() => {
            })
        },
        // 跳转编辑页面
        toEdit(item) {
            this.$router.push({
                path: '/extension/taskAdd',
                query: {
                    id: item.id
                }
            }).catch(() => {
            })
        },
        // 终止状态
        changeAutoStatus(item) {
            this.$dialog
                .confirm({
                    title: '',
                    message: '确认终止当前任务'
                })
                .then(() => {
                    API.changeAutoStatus({
                        taskId: item.id
                    }).then(res => {
                        this.$toast('终止成功')
                        setTimeout(() => {
                            this.taskList[this.taskIndex] = {}
                            this.setTaskDetail(this.taskIndex)
                        }, 500)
                    })
                })
                .catch(() => {
                })
        },
        // 立即报备
        recommend(item) {
            this.$router.push({
                path: '/extension/customer/recommend',
                query: {
                    channelType: item.channelType,
                    taskName: item.name
                }
            }).catch(() => {
            })
        },
        // 跳转签到页面
        toSign() {
            this.$router.push({
                path: '/extension/taskClockIn',
                query: {
                    id: this.taskList[this.taskIndex].id
                }
            }).catch(() => {
            })
        },
        getColor(item) {
            return getTaskStatus(item.status).tagClass
        },
        getText(item) {
            return getTaskStatus(item.status).name
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    background: linear-gradient(360deg, #F6F8FA 0%, #F6F8FA 68%, #F53852 85%, #F2304B 100%);

    .common-page-container {
        .swipe-box {
            height: calc(100vh - 100px);
            margin: 10px 15px 0 15px;
            box-sizing: border-box;
            border-radius: 4px;

            .swiper-slide {
                background: #fff;
                padding: 24px 0;
                box-sizing: border-box;
            }
        }

        .icon-qrcode {
            position: absolute;
            top: 24px;
            right: 22px;
            width: 22px;
            height: 22px;
        }

        .title-wrap {
            margin: 0 10px 5px 15px;
            display: flex;
            align-items: center;

            .title {
                margin-right: 10px;
                font-size: 18px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: @header-text-color;
            }
        }

        .tag-item {
            display: inline-block;
            padding: 1px 11px;
            border-radius: 2px;
            font-size: 11px;
        }

        .field {
            margin-left: 15px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 26px;

            .label {
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 13px;
            }
        }

        .task-target {
            margin-top: 4px;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            border-radius: 4px;
            justify-content: space-between;
            display: flex;
            align-items: center;

            .field {
                .label {
                    color: #999;
                }
            }

            .target-item {
                display: flex;
            }

            .target-number {
                display: flex;
                align-items: center;
                font-size: 13px;
                color: @header-text-color;
                margin-right: 25px;

                &:last-child {
                    margin-right: 0;
                }

                .num {
                    font-weight: bold;
                    font-size: 18px;
                    background: transparent !important;
                }
            }
        }

        .icon-user {
            margin-right: 6px;
            width: 18px;
            height: 18px;
            background: url('@{baseImgUrl}/extension/task/icon-user.png');
            background-size: 100% 100%;
        }

        .icon-target {
            margin-right: 6px;
            width: 18px;
            height: 18px;
            background: url('@{baseImgUrl}/extension/task/icon-target.png');
            background-size: 100% 100%;
        }

        .progress {
            display: inline-block;
            width: 89px;
            height: 5px;
            vertical-align: middle;
        }

        .split {
            position: relative;

            .split-line {
                margin: 25px 15px 10px;
                border-bottom: 1px dashed #e5e4e4;
            }

            .left-radius,
            .right-radius {
                position: absolute;
                width: 8px;
                height: 16px;
                top: -20px;
                background: #F6D7DD;
                position: absolute;
            }

            .left-radius {
                left: 0px;
                border-radius: 0 16px 16px 0;
            }

            .right-radius {
                right: 0px;
                border-radius: 16px 0 0 16px;
            }
        }

        .avatar {
            margin-bottom: 6px;
            width: 50px;
            height: 50px;
            border-radius: 50px;
            object-fit: cover;
        }

        .more {
            margin-bottom: 6px;
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50px;
            background: rgba(255, 114, 130, .3);

            .dots {
                display: inline-block;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                margin: 0 3px;
                background: @theme-color;
            }
        }

        .members {
            display: flex;
            margin: 10px 15px 0;

            .member {
                margin-right: 17px;
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 13px;
            }
        }

        .btn-wrap {
            display: flex;
            margin: 0px 15px 0;
            border-radius: 30px;
            overflow: hidden;

            .btn {
                color: #fff;
                width: 100%;
                border: unset;
            }

            .btn:first-child {
                background: #F1AE59;
            }

            .btn:last-child {
                background: @theme-color;
            }
        }

        .recommend-circle {
            position: absolute;
            right: 12px;
            bottom: 10px;
            z-index: 999;
            width: 60px;
            height: 60px;
            line-height: 60px;
            border-radius: 50%;
            background: #DB0826;
            color: #fff;

            .title {
                position: relative;
                margin-top: 8px;

                .icon-recommend {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                }

                height: 40px;
                font-size: 12px;
            }
        }

        .popup-members {
            flex-wrap: wrap;
            max-height: 400px;
            overflow-y: auto;

            .member {
                margin-right: 0;
                min-width: 20%;
                margin: 12px 0;
            }
        }

        .popup-title {
            text-align: center;
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: @header-text-color;
            line-height: 55px;
            border-bottom: 1px solid @bg-color;
        }

        .total {
            position: relative;
            text-align: center;
            color: @header-text-color;
            font-size: 14px;
            line-height: 80px;

            .current {
                font-size: 18px;
                color: @theme-color;
            }
        }
    }

    .icondaka {
        color: #fff;
        font-size: 20px;
    }

    .iconfanhui,
    .iconiconrightarrow {
        font-size: 12px;
        margin-right: 14px;
    }

    .iconiconrightarrow {
        margin-left: 12px;
    }
}
</style>
