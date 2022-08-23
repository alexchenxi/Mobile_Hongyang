<template>
    <div class="container">
        <!-- 销售团队排行 -->
        <div class="team-rank">
            <div class="title-wrap">
                <span class="title">
                    <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                    销售团队排行
                </span>
                <FilterPopover container="body" v-model="salesSortSelect" :list="salesSortList" @change="salesSortChange" />
            </div>
            <van-empty v-if="groupFlag && achievementGroupSortList.length === 0" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
            <Team v-else :data="achievementGroupSortList"></Team>
        </div>
        <!-- 置业顾问排行 -->
        <div class="sales-rank">
            <div class="title-wrap">
                <span class="title">
                    <i class="iconfont iconjuxing common-report-vertical-bar"></i>
                    置业顾问排行
                </span>
                <FilterPopover container="body" v-model="salesStaffSelect" :list="staffsSortList" @change="salesStaffChange" />
            </div>
            <van-empty v-if="staffFlag && staffList.length === 0" :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
            <div v-else>
                <table class="table" cellspacing="10">
                    <thead>
                        <tr>
                            <th class="align-center">排行</th>
                            <th class="align-left">姓名</th>
                            <th class="align-center">认筹组数</th>
                            <th class="align-right">认购套数/金额</th>
                            <th class="align-right">签约套数/金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in staffList" :key="item.staffId">
                            <td class="align-center" v-if="i < 3">
                                <div class="ranking" :class="'icon-medal' + i">{{ i + 1 }}</div>
                            </td>
                            <td class="align-center index" v-else>{{ i + 1 }}.</td>
                            <td class="align-left">
                                <p class="name">{{ item.staffName }}</p>
                                <p class="team-name">{{ item.groupName }}</p>
                            </td>
                            <td class="align-center">
                                <span class="num" :class="{ select: salesStaffSelect === 1 }">{{ item.bookGroupNum }}</span>
                                <span class="unit" :class="{ select: salesStaffSelect === 1 }">组</span>
                            </td>
                            <td class="align-right">
                                <p>
                                    <span class="num" :class="{ select: salesStaffSelect === 2 }">{{ item.orderSetsNum }}</span>
                                    <span class="unit" :class="{ select: salesStaffSelect === 2 }">套</span>
                                </p>
                                <p>
                                    <span class="num" :class="{ select: salesStaffSelect === 3 }">{{ item.orderTotalMoney }}</span>
                                    <span class="unit" :class="{ select: salesStaffSelect === 3 }">万</span>
                                </p>
                            </td>
                            <td class="align-right">
                                <p>
                                    <span class="num" :class="{ select: salesStaffSelect === 4 }">{{ item.contractSetsNum }}</span>
                                    <span class="unit" :class="{ select: salesStaffSelect === 4 }">套</span>
                                </p>
                                <p>
                                    <span class="num" :class="{ select: salesStaffSelect === 5 }">{{ item.contractTotalMoney }}</span>
                                    <span class="unit" :class="{ select: salesStaffSelect === 5 }">万</span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="more-btn" v-if="isShowMoreBtn" @click="showMore">查看更多排行</div>
            </div>
        </div>
    </div>
</template>
<script>
import FilterPopover from '@/components/Report/FilterPopover'
import Team from '@/components/Report/Team'
import API from '@/request/api/caseSystem/report'
export default {
    components: {
        FilterPopover,
        Team
    },
    props: {
        filters: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            // 销售团队筛选
            salesSortSelect: 1,
            // 销售团队排行
            achievementGroupSortList: [],
            // 排序
            salesSortList: [
                {
                    text: '认筹组数',
                    value: 1,
                    field: 'bookGroupNum',
                    unit: '组'
                },
                {
                    text: '认购套数',
                    value: 2,
                    field: 'orderSetsNum',
                    unit: '套'
                },
                {
                    text: '认购金额',
                    value: 3,
                    field: 'orderTotalMoney',
                    unit: '万'
                },
                // {
                //     text: '签约套数',
                //     value: 4,
                //     field: 'contractSetsNum',
                //     unit: '套'
                // },
                {
                    text: '签约金额',
                    value: 5,
                    field: 'contractTotalMoney',
                    unit: '万'
                }
            ],
            staffsSortList: [
                {
                    text: '认筹组数',
                    value: 1,
                    field: 'bookGroupNum',
                    unit: '组'
                },
                {
                    text: '认购套数',
                    value: 2,
                    field: 'orderSetsNum',
                    unit: '套'
                },
                {
                    text: '认购金额',
                    value: 3,
                    field: 'orderTotalMoney',
                    unit: '万'
                },
                {
                    text: '签约套数',
                    value: 4,
                    field: 'contractSetsNum',
                    unit: '套'
                },
                {
                    text: '签约金额',
                    value: 5,
                    field: 'contractTotalMoney',
                    unit: '万'
                }
            ],
            isShowMoreBtn: false,
            // 置业顾问
            salesStaffSelect: 1,
            staffList: [],
            allStaffList: [],
            groupFlag: false,
            staffFlag: false,
            achievementTypeList: [
                {
                    text: '认筹组数',
                    value: 1,
                    field: 'bookGroupNum',
                    unit: '组'
                },
                {
                    text: '认购套数',
                    value: 2,
                    field: 'orderSetsNum',
                    unit: '套'
                },
                {
                    text: '认购金额',
                    value: 3,
                    field: 'orderTotalMoney',
                    unit: '万'
                },
                {
                    text: '签约金额',
                    value: 5,
                    field: 'contractTotalMoney',
                    unit: '万'
                }
            ],
        }
    },
    watch: {
        filters: {
            handler(newValue) {
                this.init()
            },
            deep: true
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.getAchievementGroupSort()
            this.getAchievementStaffSort()
        },
        salesSortChange(val) {
            this.salesSortSelect = val
            this.getAchievementGroupSort()
        },
        // 案场分析销售团队业绩排行
        getAchievementGroupSort() {
            let params = this.$utils.deepCopy(this.filters)
            params.sortBy = this.salesSortSelect
            this.groupFlag = false
            API.getAchievementGroupSort(params).then(res => {
                if(!res) {
                    this.achievementGroupSortList = []
                } else {
                    let selectList = this.achievementTypeList.filter(x => x.value === this.salesSortSelect)
                    for (let elem of res) {
                        elem.id = elem.groupId
                        elem.name = elem.groupName
                        elem.num = this.achievementTypeList
                        elem.add = elem[selectList[0].field]
                        elem.unit = selectList[0].unit
                    }
                    this.achievementGroupSortList = res
                }
                this.groupFlag = true
            })
        },
        salesStaffChange(val) {
            this.salesStaffSelect = val
            this.getAchievementStaffSort()
        },
        // 案场分析置业顾问团队业绩排行
        getAchievementStaffSort() {
            let params = this.$utils.deepCopy(this.filters)
            params.sortBy = this.salesStaffSelect
            this.staffFlag = false
            API.getAchievementStaffSort(params).then(res => {
                if(!res) {
                    res = []
                }
                if (res.length > 8) {
                    this.allStaffList = this.$utils.deepCopy(res)
                    this.staffList = res.splice(0,8)
                    this.isShowMoreBtn = true
                } else {
                    this.staffList = res
                    this.isShowMoreBtn = false
                }
                this.staffFlag = true
            })
        },
        // 展示更多
        showMore() {
            this.staffList = this.allStaffList
            this.isShowMoreBtn = false
        }
    }
}
</script>
<style lang="less" scoped>
.title-wrap {
    padding: 22px 0 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
    }
}
.sales-rank {
    padding: 0 15px;
    .title-wrap {
        padding: 22px 0;
    }
    .table {
        border-collapse: collapse;
        width: 100%;
        th,
        td {
            padding: 0 2px;
        }
        thead tr th {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #999999;
        }
        tbody tr {
            border-top: 1px solid #eee;
            &:first-child {
                border: none;
            }
        }
        tbody tr td {
            height: 66px;
            display: table-cell;
            vertical-align: middle;
            p {
                &:first-child {
                    margin-bottom: 6px;
                }
                &:last-child {
                    color: #999999;
                }
                .num {
                    font-size: 14px;
                }
            }
            .team-name {
                font-size: 12px;
            }
            .name {
                font-size: 15px;
            }
            .num {
                font-size: 16px;
                font-weight: bold;
                &.select {
                    color: @theme-color;
                }
            }
            .unit {
                font-size: 10px;
                margin-left: 2px;
                &.select {
                    color: @theme-color;
                }
            }
        }
        .index {
            font-weight: bold;
            font-size: 18px;
            font-family: YouSheBiaoTiHei, DINAlternate-Bold, DINAlternate;
        }
        .ranking {
            font-weight: bold;
            line-height: 30px;
            text-indent: 2px;
            color: #fff;
            font-family: YouSheBiaoTiHei, DINAlternate-Bold, DINAlternate;
            text-align: center;
            font-size: 12px;
            width: 22px;
            height: 25px;
        }
        .icon-medal0 {
            background: url('@{baseImgUrl}/report/icon-medal0.png') no-repeat;
            background-size: 100% 100%;
        }
        .icon-medal1 {
            background: url('@{baseImgUrl}/report/icon-medal1.png') no-repeat;
            background-size: 100% 100%;
        }
        .icon-medal2 {
            background: url('@{baseImgUrl}/report/icon-medal2.png') no-repeat;
            background-size: 100% 100%;
        }
    }
    .more-btn {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 45px;
        background: #f9fbff;
        color: @theme-color;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 500;
    }
}
.team-rank {
    padding: 0 15px;
}
.align-left {
    text-align: left;
}
.align-right {
    text-align: right;
}
.align-center {
    text-align: center;
}
</style>
