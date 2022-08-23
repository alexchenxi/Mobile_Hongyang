<template>
    <div class="common-page">
        <TopBar :back="false" title="房源">
            <!--<div v-if="currentRole.roleCode === 'ST_MANAGER'" slot="append-suffix" class="assign-customers-action assign-customers" @click="goUrl">推盘</div>-->
        </TopBar>
        <main class="common-page-middle" :style="{ height: pageMiddleHeight }">
            <template v-if="currentRole.roleCode === 'ST_MANAGER'">
                <div class="main-title">房源统计</div>
                <div class="echart-contain" :class="currentRole.roleCode === 'ST_MANAGER' ? '' : 'split'">
                    <div id="echart" class="echart"></div>
                    <div v-if="currentRole.roleCode === 'ST_MANAGER'" class="tip">
                        <div v-for="(item, index) in echartData" :key="item.name" :class="echartIndex === index ? 'li active' : 'li'" @click="clickData(index)">
                            <span class="dot" :style="getStyle(item)"></span>
                            <span class="label">{{ item.name }}</span>
                            <span class="num">{{ dealNum(index) }}</span>
                        </div>
                    </div>
                    <div v-else class="tip special">
                        <div v-for="(item, index) in echartData" :key="item.name" :class="echartIndex === index ? '  li active' : 'li'" @click="clickData(index)">
                            <span class="dot" :style="getStyle(item)"></span>
                            <span class="label">{{ item.name }}</span>
                            <span class="num">{{ dealNum(index) }}</span>
                        </div>
                        <div class="small-style">
                            <div v-for="item in echartData" :key="item.name" class="li-data">
                                <div class="value">{{ NumFormat(item.value) }}</div>
                                <div class="name">{{ item.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="data-contain">
                    <div class="big-style">
                        <div v-for="(item, index) in echartData" :key="item.name" class="li">
                            <template>
                                <div class="value">{{ NumFormat(item.value) }}</div>
                                <div class="name">{{ item.name }}</div>
                            </template>
                        </div>
                    </div>
                    <!--<div class="small-style">-->
                    <!--<div v-for="(item, index) in echartData" :key="item.name" class="li">-->
                    <!--<template v-if="index > 1">-->
                    <!--<div class="value">{{ NumFormat(item.value) }}</div>-->
                    <!--<div class="name">{{ item.name }}</div>-->
                    <!--</template>-->
                    <!--</div>-->
                    <!--</div>-->
                </div>
            </template>
            <div class="main-title">楼盘列表</div>
            <van-collapse v-model="activeList" :border="false" @change="getBuildingList">
                <div v-for="(item, index) in buildingOuterList" :key="item.id" class="list" @click="activeIndex = index">
                    <van-collapse-item :name="index">
                        <template #title>
                            <div class="title" style="flex-wrap: wrap;">
                                <span class="name van-ellipsis" style="width: 100%;">{{ item.name }}</span>
                                <div style="width: 100%;display: flex; justify-content: flex-end">
                                    <span class="right" v-if="currentRole.roleCode === 'ST_MANAGER'">
                                    <span v-for="subItem in item.summary" :key="subItem.status" class="li">
                                        <span class="sale" :style="getHousingStatus(subItem.status)">{{ subItem.statusName }}</span>
                                        {{ subItem.count }}
                                    </span>
                                </span>
                                </div>
                            </div>
                        </template>
                        <van-loading v-if="item.loading" type="spinner" />
                        <div v-for="subItem in item.list" :key="subItem.id" @click="goDetail(item, subItem)">
                            <div class="sub-title">
                                <span class="name van-ellipsis">{{ subItem.name }}</span>
                                <span :class="currentRole.roleCode !== 'ST_MANAGER' ? 'right flex-end' : 'right'">
                                    <template v-if="currentRole.roleCode === 'ST_MANAGER'">
                                        <span v-for="childItem in subItem.summary" :key="childItem.status" class="li">
                                            <span class="sale" :style="getHousingStatus(childItem.status)">{{ childItem.statusName }}</span>
                                            {{ childItem.count }}
                                        </span>
                                    </template>
                                    <template v-else>
                                        <span class="sale" style="color: #db0826; display: flex; align-items: center">
                                            查看详情
                                            <van-icon name="arrow" />
                                        </span>
                                    </template>
                                </span>
                            </div>
                        </div>
                    </van-collapse-item>
                </div>
            </van-collapse>
            <!--  todo 经理角色去除交易单据模块  -->
            <!--<div class="main-title title">交易单据</div>
            <div class="bill-wrap">
                <div v-for="item in billTypes" :key="item.name" class="bill-item" @click="goBill(item)">
                    <i class="iconfont" :class="item.icon"></i>
                    {{ item.name }}
                </div>
            </div>-->
            <!-- <div style="width:100%;height: 200px;"></div> -->
        </main>
        <tab-bar active="/case/housing" :tab-data="tabData" />
        <canvas width="375" height="600" id="housingWatermarkCanvas" class="watermark-canvas"></canvas>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TabBar from '@c/TabBar'
import TopBar from '@c/TopBar'

import { getHousingStatus } from '@/config/commonData'
import API from '@/request/api/caseSystem/housing'
import { commonMethods } from 'movit-utils'
export default {
    name: 'CaseHousing',
    components: {
        TabBar,
        TopBar,
    },
    data() {
        return {
            echartIndex: 0,
            echartData: [],
            activeList: [],
            activeIndex: 0,
            total: 0,
            buildingOuterList: [],
            color1: {
                0: {
                    color: '#ABB3BD',
                    color1: '#ABB3BD',
                },
                1: {
                    color: '#DB0826',
                    color1: '#DB0826',
                },
                2: {
                    color: '#CC00FF',
                    color1: '#CC00FF',
                },
                3: {
                    color: '#FD5357',
                    color1: '#EB6877',
                },
                4: {
                    color: '#FFD486',
                    color1: '#FFD486',
                },
                5: {
                    color: '#6294F3',
                    color1: '#4183FF',
                },
                99: {
                    color: '#EEE',
                    color1: '#EEE',
                },
            },
            billTypes: [
                {
                    name: '认筹订单',
                    icon: 'iconrenchoudingdan',
                    type: 0,
                },
                {
                    name: '认购订单',
                    icon: 'iconrengoudingdan',
                    type: 1,
                },
                {
                    name: '签约订单',
                    icon: 'iconqianyuedingdan',
                    type: 2,
                },
            ],
        }
    },
    computed: { ...mapGetters(['tabData', 'currentRole', 'user', 'menuActive', 'projectId']) },
    created() {
        this.NumFormat = commonMethods.NumFormat
        this.getStatic()
    },
    mounted() {
        if (this.currentRole.roleCode === 'ST_MANAGER') {
            this.drawLine()
        }
        let text = `弘客云-${this.user.name}-${localStorage.getItem('userName')} ${commonMethods.DateToTime(new Date())}`
        this.$utils.drawWatermark('housingWatermarkCanvas', text)
    },
    methods: {
        //处理为2位数
        dealNum(index) {
            let array = []
            this.echartData.map((item) => {
                array.push(item.value)
            })

            return commonMethods.getPercentWithPrecision(array, index, 2) + '%'
        },
        getHousingStatus(status) {
            return `color: ${this.color1[status].color1}`
            // return getHousingStatus(status).tagClass
        },
        getStyle(item) {
            const colorArray = item.itemStyle.color.colorStops
            return `background: linear-gradient(180deg, ${colorArray[0].color} 0%,${colorArray[1].color} 100%)`
        },
        //获取数据
        getStatic() {
            const params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
            }
            this.$utils.loading()
            API.summaryListApi(params).then((res) => {
                this.$toast.clear()
                var echartData = []
                var total = 0
                let otherItem = {
                    value: 0,
                    name: '其它',
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: this.color1[4].color, // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: this.color1[4].color1, // 100% 处的颜色
                                },
                            ],
                        },
                    },
                }
                res.summary.map((item) => {
                    total = total + item.count
                    echartData.push({
                        value: item.count,
                        name: item.statusName,
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: this.color1[item.status].color, // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: this.color1[item.status].color1, // 100% 处的颜色
                                    },
                                ],
                            },
                        },
                    })
                    // let other = [3, 4]
                    // if( other.indexOf(item.status) < 0 ) {
                    //     echartData.push({
                    //         value: item.count,
                    //         name: item.statusName,
                    //         itemStyle: {
                    //             color: {
                    //                 type: 'linear',
                    //                 x: 0,
                    //                 y: 0,
                    //                 x2: 0,
                    //                 y2: 1,
                    //                 colorStops: [
                    //                     {
                    //                         offset: 0,
                    //                         color: this.color1[item.status].color, // 0% 处的颜色
                    //                     },
                    //                     {
                    //                         offset: 1,
                    //                         color: this.color1[item.status].color1, // 100% 处的颜色
                    //                     },
                    //                 ],
                    //             },
                    //         },
                    //     })
                    // }else{
                    //     otherItem.value += item.count
                    // }
                })
                // console.log('触发',echartData,otherItem)
                // echartData.push(otherItem)
                this.echartData = echartData
                this.total = total
                this.buildingOuterList = res.childList
                if (this.currentRole.roleCode === 'ST_MANAGER') {
                    this.drawLine()
                }
            })
        },
        //点击图例
        clickData(index) {
            const that = this
            this.myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: that.echartIndex,
            })
            that.echartIndex = index
            this.myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: index,
            })
        },
        drawLine() {
            var that = this
            // 基于准备好的dom，初始化echarts实例
            this.myChart = this.echarts.init(document.getElementById('echart'))
            // 绘制图表
            that.myChart.setOption({
                series: [
                    {
                        type: 'pie',
                        radius: [30, 55],
                        center: ['65', '65'],
                        label: {
                            show: false,
                            position: 'center',
                        },
                        data: this.echartData,
                        emphasis: {
                            scale: true,
                            scaleSize: 6,
                        },
                    },
                ],
            })
            that.myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: 0,
            })
            this.myChart.on('click', function (params) {
                that.myChart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: that.echartIndex,
                })
                that.echartIndex = params.dataIndex
                that.myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: that.echartIndex,
                })
            })
        },
        scrollAnimation(currentY, targetY) {
            if (document.querySelector('.common-page-middle').scrollTop > 330) return
            // 获取当前位置方法
            // const currentY = document.documentElement.scrollTop || document.body.scrollTop
            // 计算需要移动的距离
            let needScrollTop = targetY - currentY
            let _currentY = currentY
            setTimeout(() => {
                // 一次调用滑动帧数，每次调用会不一样
                const dist = Math.ceil(needScrollTop / 10)
                _currentY += dist
                document.querySelector('.common-page-middle').scrollTo(_currentY, currentY)
                // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
                if (needScrollTop > 10 || needScrollTop < -10) {
                    this.scrollAnimation(_currentY, targetY)
                } else {
                    document.querySelector('.common-page-middle').scrollTo(_currentY, targetY)
                }
            }, 1)
        },
        //获取内层列表
        async getBuildingList(type) {
            // const scrollHeight = this.currentRole.roleCode === 'ST_MANAGER' ? 350 : 200
            if (type.length < this.activeList.length) return
            let array = [...type].filter((x) => [...this.activeList].every((y) => y !== x))
            this.activeIndex = array[0]
            const activeObj = this.buildingOuterList[this.activeIndex]
            if (activeObj.list) {
                // setTimeout(() => {
                // 	if (type.length == 1) {
                // 		this.scrollAnimation(0, scrollHeight)
                // 	}
                // }, 200)
                return
            }
            const params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                stage: activeObj.code,
            }
            activeObj.loading = true
            let result = await API.summaryByStageListApi(params)
            activeObj.list = result
            this.$forceUpdate()
            activeObj.loading = false
            // setTimeout(() => {
            // 	if (type.length == 1) {
            // 		this.scrollAnimation(0, scrollHeight)
            // 	}
            // }, 200)
        },
        goUrl() {
            this.$router
                .push({
                    path: '/case/housingOperation',
                })
                .catch(() => {})
        },
        //goDetail
        goDetail(item, subItem) {
            this.$router
                .push({
                    path: '/case/housingDetail',
                    query: {
                        stageCode: item.code,
                        buildCode: subItem.code,
                        name: item.name,
                    },
                })
                .catch(() => {})
        },
        // 跳转单据页面
        goBill(item) {
            let { name, type } = item
            this.$router
                .push({
                    path: '/case/bill',
                    query: {
                        name,
                        type,
                    },
                })
                .catch(() => {})
        },
    },
}
</script>
<style scoped lang="less">
.watermark-canvas {
    width: 100%;
    height: 92%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
}
.common-page-middle {
    background: #f6f8fa;
    .main-title {
        background: #fff;
        padding: 24px 15px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        &.title {
            margin-top: 10px;
        }
    }
    .echart-contain {
        background: #fff;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &.split {
            margin-bottom: 10px;
            padding-bottom: 20px;
        }
        .echart {
            flex-shrink: 0;
            width: 130px;
            height: 130px;
        }
        .tip {
            display: flex;
            flex-wrap: wrap;
            .li {
                margin-left: 10px;
                color: #999999;
                font-size: 13px;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                &.active {
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333;
                }
                //&:first-child {
                //    margin-right: 100px;
                //}
                .dot {
                    display: inline-block;
                    border-radius: 50%;
                    width: 8px;
                    height: 8px;
                    margin-right: 6px;
                }
                .label {
                    margin-right: 6px;
                }
            }
            &.special {
                .li {
                    margin-right: 0;
                }
                .small-style {
                    display: flex;
                    margin-left: 12px;
                    margin-top: 24px;
                    width: 100%;
                    .li-data {
                        width: 50%;
                        .value {
                            font-size: 24px;
                            font-weight: bold;
                            font-family: DINAlternate-Bold, DINAlternate;
                        }
                        .name {
                            color: #999;
                            font-size: 13px;
                        }
                    }
                }
            }
        }
    }
    .data-contain {
        padding: 0 15px 18px;
        background: #fff;
        margin-bottom: 10px;
        .big-style,
        .small-style {
            width: 100%;
            padding-top: 18px;
            padding-bottom: 0;
            display: flex;
            justify-content: space-between;
            .li {
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                flex: 1;
                text-align: center;
                .value {
                    font-size: 13px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #333333;
                    margin-bottom: 6px;
                }
            }
        }
        .big-style .li .value {
            font-size: 24px;
        }
    }
    .list {
        /deep/ .van-collapse-item__content {
            background: #fbfbfc;
            padding: 0 15px;
        }
        .title,
        .sub-title {
            font-family: PingFangSC-Medium, PingFang SC;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name {
                flex-shrink: 0;
                width: 140px;
                font-weight: bold;
            }
            .right {
                flex-shrink: 0;
                display: flex;
                width: 190px;
                .li {
                    flex: 1;
                    justify-content: center;
                    font-size: 15px;
                    font-weight: bold;
                    color: #333333;
                    white-space: nowrap;
                    .sale {
                        font-size: 13px;
                        font-weight: normal;
                        margin-right: 4px;
                        background-color: transparent !important;
                    }
                }
            }
            .flex-end {
                justify-content: flex-end;
            }
        }
        .title {
            color: #333333;
            font-size: 15px;
            font-weight: 600;
        }
        .sub-title {
            padding-right: 18px;
            color: #666;
            height: 56px;
        }
    }
    .bill-wrap {
        padding: 0 15px 15px 15px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        .bill-item {
            margin-right: 8px;
            display: flex;
            align-items: center;
            flex: 1;
            height: 50px;
            background: #f8f9fb;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            &:last-child {
                margin-right: 0;
            }
            .iconfont {
                margin: 0 8px 0 12px;
                &.iconrenchoudingdan {
                    color: @warning-color;
                }
                &.iconrengoudingdan {
                    color: @light-green;
                }
                &.iconqianyuedingdan {
                    color: @success-color;
                }
            }
        }
    }
}
.assign-customers {
    position: absolute;
    right: 0;
}
</style>
