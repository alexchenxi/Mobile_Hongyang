<template>
    <div class="common-page">
        <!-- 筛选条件 -->
        <section class="filter-container">
            <div class="left-section">
                <van-dropdown-menu active-color="#DB0826" z-index="99">
                    <van-dropdown-item ref="filter" v-model="type" :options="typeList" @change="changeType" get-container="body"></van-dropdown-item>
                </van-dropdown-menu>
            </div>
            <div class="middle-section">
                <ReportFilter ref="filterSection" :checkList="checkList" dateType="date" :checkDefault="checkDefault" @change="handleFilter" title="本月" container="body" />
            </div>
            <div class="right-section">
                <van-dropdown-menu active-color="#DB0826" z-index="99">
                    <van-dropdown-item ref="filter" v-model="team" :options="teamList" @change="changeTeam" get-container="body"></van-dropdown-item>
                </van-dropdown-menu>
            </div>
        </section>
        <div class="content">
            <CasePerformanceReport ref="casePerformanceReport" v-if="type === 1 && teamFlag" :filters="params" />
            <CaseCustomerReport ref="caseCustomerReport" v-if="type === 0 && teamFlag" :filters="params" />
        </div>
    </div>
</template>
<script>
import ReportFilter from '@c/Report/ReportFilter'
import FunnelChart from '@c/Chart/Funnel.vue'
import CasePerformanceReport from './casePerformanceReport.vue'
import CaseCustomerReport from './caseCustomerReport.vue'
import API from '@/request/api/caseSystem/report'
import { mapGetters } from 'vuex'
export default {
    name: 'caseReport',
    components: {
        ReportFilter,
        FunnelChart,
        CaseCustomerReport,
        CasePerformanceReport
    },
    data() {
        return {
            params: {
                dateType: 2
            },
            activeFilter: 1,
            //   日期筛选
            checkList: [
                {
                    label: '本年',
                    value: 1
                },
                {
                    label: '本月',
                    value: 2
                },
                {
                    label: '本周',
                    value: 3
                }
            ],
            checkDefault: 2,
            //  客户/业绩
            type: 1,
            //   团队
            team: '',
            teamList: [],
            typeList: [
                {
                    text: '客户',
                    value: 0
                },
                {
                    text: '业绩',
                    value: 1
                }
            ],
            teamFlag: false
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole']) },
    created() {
        this.params.projectId = this.projectId
        this.getTeamData()
    },
    methods: {
        changeType() {},
        changeTeam() {
            this.params.groupIds = !this.team ? [] : this.team.split(',')
            if(this.type === 1) {
                this.$refs.casePerformanceReport.init()
            } else {
                this.$refs.caseCustomerReport.init()
            }
        },
        // 日期筛选
        handleFilter(val) {
            if (val.date.length) {
                this.params.beginDate = val.date[0]
                this.params.endDate = val.date[1]
                this.params.dateType = 4
            } else {
                this.params.beginDate = ''
                this.params.endDate = ''
                this.params.dateType = val.dateType
            }
            this.getTeamData()
        },
        // 获取团队
        async getTeamData() {
            let params = {
                projectId: this.projectId,
                dateType: this.params.dateType,
                beginDate: this.params.beginDate ? this.params.beginDate : '',
                endDate: this.params.endDate ? this.params.endDate : '',
                roleCode: this.currentRole.roleCode
            }
            this.teamFlag = false
            const result = await API.getTeam(params)
            let allGroup = result
                .map(item => {
                    return item.groupId
                })
                .join(',')
            this.team = allGroup
            this.teamList = result.map(item => {
                return {
                    value: item.groupId,
                    text: item.groupName
                }
            })
            this.teamList.unshift({
                value: allGroup,
                text: '全部团队'
            })
            this.params.groupIds = !this.team ? [] : allGroup.split(',')
            this.teamFlag = true
        }
    }
}
</script>

<style lang="less" scoped>
.common-page {
    overflow: auto;
}
/deep/ .filter-container {
    position: fixed;
    .common-flex-between();
    width: calc(100% - 30px);
    z-index: 100;
    padding: 0 18px;
    background: #fff;
    height: 44px;
    margin-top: -2px;
}

.content {
    position: relative;
    overflow: auto;
    margin-top: 44px;
    .title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        /deep/ .van-dropdown-menu {
            margin-right: 3px;
        }
    }
}
</style>
