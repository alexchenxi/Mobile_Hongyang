<template>
    <div class="common-page">
        <TopBar :back="false">
            <div slot="append-prefix">
                <ProjectSelection :data="projetcArray"></ProjectSelection>
            </div>
            <!--<span slot="append-suffix">-->
            <!--<span-->
            <!--v-code="['ZT.HOME.BUTTON','ZT.HOME.BUTTON.SCAN']"-->
            <!--@click="scanCode"-->
            <!--class="iconfont iconsaoyisao"-->
            <!--&gt;</span>-->
            <!--&lt;!&ndash;<span&ndash;&gt;-->
            <!--&lt;!&ndash;v-code="['ZT.HOME.BUTTON','ZT.HOME.BUTTON.SIGN']"&ndash;&gt;-->
            <!--&lt;!&ndash;@click="sign"&ndash;&gt;-->
            <!--&lt;!&ndash;class="iconfont iconqiandao"&ndash;&gt;-->
            <!--&lt;!&ndash;&gt;</span>&ndash;&gt;-->
            <!--</span>-->
        </TopBar>
        <main class="common-page-middle" :style="{ height: pageMiddleHeight}">
            <template>
                <section class="manage-section">
                    <DateStatistics :todayReportAndVisitCount="todayReportAndVisitCount" />
                </section>
            </template>
            <!--        <div v-if="dealCount" class="manage-section billing-tip">-->
            <!--            <img-->
            <!--                class="tip-icon"-->
            <!--                :src="$baseImgUrl + '/case/home/notification-icon.png'"-->
            <!--                alt=""-->
            <!--            >成交喜报 {{ dealCount }} 套-->
            <!--        </div>-->
            <template>
                <section class="manage-section">
                    <AttendanceReporting :toDoCount="toDoCount"/>
                </section>
            </template>
            <template v-for="(item,index) in menuActive.childrenList">
                <section class="content" v-if="item.code === 'ZT.HOME.TASK'" :key="item.code">
                    <div class="common-title">
                        <div class="left">
                            <img class="icon"
                                 :src="$baseImgUrl + '/extension/home/' + item.checkedIconName" />{{item.name}}
                        </div>
                        <div class="right">
                  <span v-code="['ZT.HOME.BUTTON','ZT.HOME.BUTTON.CREATETASK']"
                        class="assign-task" style="font-size: 15px;" @click="$router.push('taskAdd')">创建任务</span>
                        </div>
                    </div>
                    <template v-for="item in taskData">
                        <DataOverview :key="item.code" :info="item" @clickInfo="toTaskPage" />
                    </template>
                </section>
                <section class="manage-section" v-if="item.code === 'ZT.HOME.ATTENDANCE'" :key="item.code">
                    <AttendanceManage :index="index" :infoData="infoData" />
                </section>
                <section class="manage-section" v-if="item.code === 'ZT.HOME.OVERDUE'" :key="item.code">
                    <RemindStatistics :title="item.name" :needbg="true" :icon="item.checkedIconName"
                                      :data="item.childrenList"></RemindStatistics>
                </section>
                <section class="manage-section" v-if="item.code === 'ZT.HOME.TOKER'" :key="item.code">
                    <MarketingExtension code="ZT" />
                </section>
            </template>
            <!--<img-->
            <!--v-code="['ZT.HOME.BUTTON','ZT.HOME.BUTTON.RECOMMEND']"-->
            <!--@click="toRecommend"-->
            <!--:style="{paddingBottom: bottomSafe}"-->
            <!--class="recommend-img"-->
            <!--:src="$baseImgUrl + '/extension/home/icon-recommend.png'"-->
            <!--alt-->
            <!--/>-->
            <div style="height: 40px"></div>
        </main>
        <tab-bar active="/extension/home" :tabData="tabData" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ProjectSelection from '@/components/ProjectSelection'
import DataOverview from '@v/extension/home/components/DataOverview'
import AttendanceManage from '@v/extension/home/components/AttendanceManage'
import DateStatistics from '@v/extension/home/components/DateStatistics'
import AttendanceReporting from '@v/extension/home/components/AttendanceReporting'
import MarketingExtension from '@/views/common/onlineMarketing/components/MarketingExtension'
import RemindStatistics from '@/views/case/home/components/RemindStatistics'
import TopBar from '@c/TopBar'
import TabBar from '@c/TabBar'
import API from '@/request/api/selfExtension/home'
import APIREPORT from '@/request/api/selfExtension/report'
import MESSAGEAPI from '@/request/api/my'
import CommonApi from '@/request/api/commonApi'
import { commonData } from '@/config/commonData'

export default {
    name: 'index',
    components: {
        ProjectSelection,
        DataOverview,
        AttendanceManage,
        TabBar,
        TopBar,
        MarketingExtension,
        DateStatistics,
        AttendanceReporting,
        RemindStatistics
    },
    data() {
        return {
            projetcArray: [],
            taskData: [],
            infoData: {},
            dealCount: 0,
            toDoCount: 0,
            todayReportAndVisitCount: {}
        }
    },
    computed: { ...mapGetters(['tabData', 'menuActive', 'projectId', 'user', 'device', 'currentRole']) },
    created() {
        if (!this.projectId) return
        this.getData()
        this.getInfoList()
    },
    methods: {
        goUrl(url) {
            this.$router.push(url).catch(() => {
            })
        },
        async getData() {
            // 获取任务的统计数据
            let data
            if (this.menuActive.code === 'ZT.HOME') {
                let taskManager = this.menuActive.childrenList.filter(x => x.code === 'ZT.HOME.TASK')[0]
                let qcCode = ['ZT.HOME.TASK.UNFINISHED', 'ZT.HOME.TASK.FINISHED']
                taskManager.childrenList.forEach(item => {
                    item.show = qcCode.indexOf(item.code) < 0 ? true : false
                })
                let codes = taskManager ? taskManager.childrenList.map(x => x.code) : []
                data = await this.projectTaskApi(codes)
                this.infoData = this.menuActive.childrenList.filter(x => x.code === 'ZT.HOME.ATTENDANCE')[0]
                this.taskData = this.$utils.deepCopy(taskManager ? taskManager.childrenList : [])
            }
            // 数据与菜单关联
            for (let elem of this.taskData) {
                Object.assign(elem, elem, data[elem.code])
                // 进行中
                if (elem.code === 'ZT.HOME.TASK.UNDERGOING') {
                    elem.type = 3
                    // elem.bgImg = 'processing-bg'
                    // elem.class = 'processing'
                }
                // 未开始
                if (elem.code === 'ZT.HOME.TASK.TOSTARTED') {
                    elem.type = 1
                    // elem.bgImg = 'not-start-bg'
                    // elem.class = 'not-start'
                }
                // 结束未完成
                // if (elem.code === 'ZT.HOME.TASK.UNFINISHED') {
                //   elem.type = 3
                //   // elem.bgImg = 'not-complete-bg'
                //   // elem.class = 'not-complete'
                // }
                // 结束已完成
                // if (elem.code === 'ZT.HOME.TASK.FINISHED') {
                //   elem.type = 4
                //   // elem.bgImg = 'end-complete-bg'
                //   // elem.class = 'complete'
                // }
                //已结束
                if (elem.code === 'ZT.HOME.TASK.OVER') {
                    elem.type = 4
                    // elem.completeNum = this.taskData[2].completeNum
                    // elem.targetNum = this.taskData[3].completeNum
                    // elem.taskNum = elem.completeNum + elem.targetNum
                }
            }
            this.statistics()
            this.statisticsTotal()
            this.getToDoCount()
        },
        getToDoCount() {
            MESSAGEAPI.selfChannelMyUnbindApplicationCount({
                projectId: this.projectId
            }).then(res => {
                this.toDoCount = res.total
            })
        },
        statisticsTotal() {
            let params = {
                dateType: 1,
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                // noCache: 1
            }

            APIREPORT.statisticHomesTotal(params).then(res => {
                this.todayReportAndVisitCount = res
            })
        },
        async statistics() {
            let result = await API.todayReportAndVisitAndProtectDateOverdueCount({
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode
            })
            this.menuActive.childrenList.forEach(item => {
                if (item.code === 'ZT.HOME.OVERDUE') {
                    item.childrenList.forEach(itemchild => {
                        if (itemchild.code === 'ZT.HOME.OVERDUE.3') {
                            this.$set(itemchild, 'today', result.protectDateOverdueCountLt3)
                            // itemchild.history = result.protectDateOverdueCountLt3
                        } else {
                            this.$set(itemchild, 'today', result.protectDateOverdueCountLt1)
                            // itemchild.history = result.protectDateOverdueCountLt1
                        }
                    })
                }
            })
        },
        getInfoList() {
            MESSAGEAPI.selfChannelMessageList({ roleCode: this.currentRole.roleCode }).then((res) => {
                this.dealCount = res?.dealTime
            })
        },
        // 获取任务统计数据
        async projectTaskApi(menuIds) {
            this.$utils.loading()
            return API.projectTaskApi({
                projectId: this.projectId,
                menuIds: menuIds,
                roleCode: this.currentRole.roleCode
            }).then(res => {
                this.$toast.clear()
                return res
            })
        },
        // 扫码
        scanCode() {
            this.$appMethods.ScanCode(this.device).then(res => {
                if (res.includes('http') && (this.user.roleCode === 'ZT_BEEMAN' || this.user.roleCode === 'ZT_KEYMAN')) {
                    // 小蜜蜂改变上级
                    this.beeRebind(res)
                    return
                }
                // 加入任务
                this.addTask(res)
            })
        },
        // 加入任务
        addTask(res) {
            CommonApi.qrcodeApi({
                qrcode: res,
                projectId: this.projectId
            }).then(() => {
                this.$toast('加入成功')
                setTimeout(() => {
                    this.getData()
                }, 500)
            })
        },
        // 小蜜蜂改变上级
        async beeRebind(res) {
            let obj = this.$utils.getUrlQuery(res)
            let params = {
                registerType: 1,
                leaderId: obj.leaderId,
                leaderRoleCode: obj.leaderRoleCode,
                userType: Number(obj.userType)
            }
            // 判断是否已有上级
            let info = await API.getBeeRebindInfo(params)
            this.$dialog.confirm({
                title: '',
                message: info.message
            }).then(() => {
                API.beeRebind(params).then(res => {
                    this.$toast('绑定成功')
                })
            })
        },
        // 跳转报备页面
        toRecommend() {
            this.$router.push('/extension/customer/recommend').catch(() => {
            })
        },
        // 跳转任务列表
        toTaskPage(info) {
            this.$router.push({
                path: '/extension/taskList',
                query: {
                    code: info.code === 'ZT.HOME.TASK.OVER' ? 'ZT.HOME.TASK.UNFINISHED' : info.code
                }
            }).catch(() => {
            })
        },
        // 签到
        sign() {
            this.$router.push('/extension/attendanceSign').catch(() => {
            })
        }
    },
    watch: {
        projectId() {
            if (!this.projectId) return
            this.getData()
        }
    },
    beforeRouteLeave(to, from, next) {
        // 选择任务列表中tab
        if (to.path.includes('/extension/taskList')) {
            let taskList = [...commonData.taskStatus]
            let status
            if (to.query.code === 'ZT.HOME.TASK.UNFINISHED') {
                status = taskList[taskList.length - 1]
            } else {
                status = taskList.find(x => x[1].code === to.query.code)
            }
            this.$store.dispatch('other/setTaskStatus', status[0])
        }
        next()
    }
}
</script>
<style scoped lang="less">
.common-page {
    .top-img {
        position: fixed;
        top: 0;
        width: 100%;
        height: 202px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .iconsaoyisao,
        .iconqiandao {
            padding: 8px;
            font-size: 18px;
            color: @header-text-color;
        }

        .iconqiandao {
            padding-right: 0;
            margin-left: 14px;
        }
    }

    .recommend-img {
        width: 72px;
        height: 72px;
        position: fixed;
        right: 15px;
        bottom: @tab-bar-height + 10px;
    }

    .common-page-middle {
        background: linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 42%, #F6F8FA 100%);
        padding: 0 15px;

        .content {
            position: relative;
            margin-top: 15px;

            .box {
                margin-bottom: 15px;
            }

            .common-title {
                padding: 15px 0;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left {
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 700;
                }

                .icon {
                    width: 18px;
                    height: 18px;
                    margin-right: 6px;
                }
            }
        }

        .manage-section {
            margin-top: 15px;
        }

        .billing-tip {
            margin: 10px 0 20px;
            color: #ff7575;
            display: flex;
            align-items: center;

            .tip-icon {
                height: 16px;
                margin-right: 7px;
            }
        }
    }
}
</style>
