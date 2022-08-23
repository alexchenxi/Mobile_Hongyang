<template>
    <div class="container">
        <!-- <div class="tab"><span @click="changeType(index)" :class="selectTab===index?'li active':'li'" v-for="(item,index) in tabList"
			 :key="item.text">{{item.text}}</span></div>
		<div class="count">
			<div class="li" :key="index" v-for="(item,index) in countArray">
				<div class="num">{{item.value}}</div>
				<div>{{item.text}}</div>
			</div>
		</div> -->
        <div class="right-top-tip" @click="filterChange">
            <FilterSection ref="filterSection" :filter-list="filterList" :isShowMaxDate="true" container="body" @change="handleFilterDate" />
        </div>
        <van-tabs v-model="selectTab" @change="changeType" background="none" animated swipeable title-active-color="#ffffff" title-inactive-color="#ffffff" line-width="16px" line-height="3px">
            <van-tab v-for="tab in tabList" :key="tab.value" :title="tab.text">
                <div class="count">
                    <div class="li" @click="goList(item.menuId, item.value)" :key="index" v-for="(item, index) in countArray">
                        <div class="num spantext">{{ item.value | numFormat(item.value) }}</div>
                        <div class="text">{{ item.text }}</div>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
        <div class="tip">
            <van-popover v-model="isShow" trigger="click" placement="bottom-end" theme="light">
                <div class="common-pop-style">
                    <div v-for="(item, index) in formatActions" :key="index">{{ item.text }}</div>
                </div>
                <template #reference>
                    <van-icon name="question-o" @click.stop="isShow = true" />
                </template>
            </van-popover>
        </div>
    </div>
</template>
<script>
import FilterSection from '@c/FilterSection'
import { mapGetters } from 'vuex'
import API from '@/request/api/caseSystem/home'
export default {
    name: 'DataStatistics',
    components: {
        FilterSection
    },
    props: {},
    data() {
        return {
            filterList: [
                {
                    name: '自定义时间',
                    type: 'date',
                    field: 'dateTime',
                    dateName: ['beginDate', 'endDate'],
                }
            ],
            tabList: [
                {
                    text: '日',
                    value: 1
                },
                {
                    text: '周',
                    value: 2
                },
                {
                    text: '月',
                    value: 3
                },
                {
                    text: '',
                    value: 4
                }
            ],
            selectTab: 0,
            countArray: [
                {
                    text: '已跟进客户',
                    value: 0,
                    type: 'followUpCount',
                    menuId: 'AC.STAT.YGJ'
                },
                {
                    text: '已接访客户',
                    value: 0,
                    type: 'visitedCount',
                    menuId: 'AC.STAT.YJF'
                },
                {
                    text: '已认购',
                    value: 0,
                    type: 'subscribeCount',
                    menuId: 'STATISTICS.TRADE.RG'
                },
                {
                    text: '已签约',
                    value: 0,
                    type: 'signCount',
                    menuId: 'STATISTICS.TRADE.QY'
                }
            ],
            activeTab: 1,
            isShow: false
        }
    },
    methods: {
        filterChange() {
            this.selectTab = 3
        },
        handleFilterDate(val) {
            if (val?.beginDate || val?.endDate) {
                this.beginDate = val?.beginDate.substring(0,10)
                this.endDate = val?.endDate.substring(0,10)
                this.selectTab = 3
            } else {
                this.selectTab = 0
            }
            this.getData()
        },
        changeType(index) {
            this.$refs.filterSection.resetFilter()
            this.selectTab = index
            if (this.filterList[0].defaultValue !== 3) {
                delete this.filterList[0].defaultValue
            }
            this.getData()
        },
        getData() {
            const params = {
                projectId: this.projectId,
                dateType: this.selectTab + 1,
                roleCode: this.currentRole.roleCode
            }
            if (this.beginDate && this.endDate) {
                params.beginDate = this.beginDate
                params.endDate = this.endDate
            }
            API.statisticsDealApi(params).then(data => {
                this.countArray.map(item => {
                    item.value = item.type === 'signCount' || item.type === 'subscribeCount'
                        ? data[item.type] && data[item.type].toFixed()
                        : data[item.type]
                })
            })
        },
        goList(menuId, num) {
            if (!menuId) return
            const menuIdList = ['STATISTICS.TRADE.RG','STATISTICS.TRADE.QY']
            const form = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                menuId: menuId,
                dateType: this.selectTab*1+1,
                beginDate: this.beginDate,
                endDate: this.endDate
            }

            // 认购签约详情
            if (menuIdList.includes(menuId)) {
                this.$router.push({
                    path: '/case/storageOrderOrSignDetail',
                    query: form,
                }).catch(()=>{})
            }else {
                this.$router
                    .push({
                        path: '/case/customerMemberHome',
                        query: form
                    })
                    .catch(() => {})
            }
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole']),
        formatActions() {
            let actions = []
            if (this.currentRole.roleCode === 'ST_SALES') {
                actions = [
                    { text: '已跟进客户：展示当日/当周/当月跟进的客户组数' },
                    { text: '已接访客户：展示当日/当周/当月接访的客户组数' },
                    { text: '已认购：展示当日/当周/当月签订的认购单数' },
                    { text: '已签约：展示当日/当周/当月签订的签约单数' }
                ]
                return actions
            } else {
            }
        }
    },
    created() {
        if (!this.projectId) return
        this.getData()
    },
    watch: {
        projectId() {
            if (!this.projectId) return
            this.getData()
        }
    }
}
</script>
<style scoped lang="less">
.container {
    // position: relative;
    // width: 100%;
    // box-sizing: border-box;
    // padding: 21px 15px 14px;
    // /*background: linear-gradient(#FF576F, #F1213F);*/
    //       background-image: url("@{baseImgUrl}/case/home/red_manage.png");
    //       background-position: -15px -20px;
    //       background-repeat: no-repeat;
    //       // background-size: 375px 176px;
    // background-size: 375px 245px;
    // border-radius: 4px;
    // // margin-bottom: 15px;
    height: 180px;
    position: relative;
    width: calc(100% + 2rem);
    box-sizing: border-box;
    padding: 1.4rem 1rem 0rem;
    /* background: linear-gradient(#FF576F, #F1213F); */
    background-image: url("@{baseImgUrl}/case/home/red.png");
    /* background-position: -1rem -1.33333rem; */
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 0.26667rem;
    margin-left: -15px;
    margin-top: -15px;
    margin-bottom: -15px;
    .right-top-tip {
        position: absolute;
        top: 36px;
        right: 132px;
        color: #fff;
        z-index: 99;
        /deep/ .van-dropdown-menu .van-dropdown-menu__bar .van-dropdown-menu__title {
            color: #fff;
        }
        /deep/ .van-dropdown-menu__title--active {
            color: #fff !important;
        }
        /deep/ .van-dropdown-item {
            left: 14px !important;
            right: 14px !important;
        }
    }
    /deep/.van-ellipsis{
        color: #fff;
    }
    .tip {
        color: #fff;
        font-size: 19px;
        position: absolute;
        top: 32px;
        right: 33px;
    }
    .tip-text {
        font-size: 12px;
        lin-height: 14px;
    }
    .img-style {
        // width: 160px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
    }
    .tab {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        margin-bottom: 24px;
        .li {
            padding-bottom: 4px;
            margin-right: 45px;
            &.active {
                border-bottom: 3px solid #fff;
            }
        }
    }
    .count {
        display: flex;
        align-items: center;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #fff;
        flex-wrap: wrap;
        padding-top: 27px;
        .li {
            text-align: center;
            width: 25%;
            flex-shrink: 0;
            margin-bottom: 10px;
            .num {
                font-size: 21px;
                line-height: 21px;
                margin-bottom: 8px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
            }
            .text {
                font-size: 13px;
                line-height: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                opacity: 0.7;
            }
        }
    }
    /deep/ .van-tabs {
        margin-top: 18px;
        .van-tabs__wrap {
            // margin-left: -22px;
            height: 25px;
        }
        .van-tab {
            flex-grow: 0;
            padding: 0 22px;
            font-size: 16px;
            line-height: 16px;
            height: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
        }
        .van-tabs__line {
            background: #ffffff;
        }
    }
}
.common-pop-style {
    padding: 10px 10px;
    font-size: 12px;
    :last-child {
        margin-bottom: 0;
    }
    > div {
        font-size: 13px;
        margin-bottom: 6px;
    }
}
</style>
