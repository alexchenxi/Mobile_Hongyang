<template>
    <div :id="id" class="echart"></div>
</template>

<script>
import { commonMethods } from 'movit-utils'
export default {
    name:'ELineAndBar',
    props: {
        colors: Array,
        id: String,
        data: Object,
        yAxisUnit: {
            type: Array,
            default: () => {
                return ['组', '组']
            }
        },
        lengData:Array,
    },
    data() {
        return {
            diff:0
        }
    },
    watch: {
        data: {
            handler(newVal, oldVal) {
                this.initMyChart()
            },
            deep: true
        }
    },
    mounted() {

        this.initMyChart()
         this.$nextTick(() => {
                const chartEle = document.getElementById(this.id)
                chartEle.removeEventListener('touchstart', this.touchStart)
                chartEle.removeEventListener('touchend', this.touchEnd)
                chartEle.addEventListener('touchstart', this.touchStart)
                chartEle.addEventListener('touchend', this.touchEnd)
        })
    },
    methods: {
        initMyChart() {
            if (Object.keys(this.data).length === 0) return
            if(this.chart) {
                this.chart.dispose()
                this.chart = null
            }
            const that=this
            this.chart = this.echarts.init(document.getElementById(this.id))
            let options = {
                grid: {
                    left: 50,
                    right:50
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: (params) => {
                        let str =
                            '<span style="font-size: 15px;line-height: 15px;color: #333333;font-weight: 500;font-family: PingFangSC-Medium, PingFang SC;margin-bottom: 12px;">' +
                            params[0].axisValue +
                            '</span>' +
                            '<br />'
                        params.forEach((item,index) => {
                            str +=
                                '<span style="font-size: 13px;line-height: 13px;color: #999999;font-weight: 400;font-family: PingFangSC-Regular, PingFang SC;margin-bottom: 12px;">' +
                                item.seriesName +
                                '</span>' +
                                '：' +
                                '<span style="font-size: 13px;line-height: 13px;color: #333333;font-weight: bold;font-family: DINAlternate-Bold, DINAlternate;">' +
                                commonMethods.NumFormat(item.value) +
                                '</span>' +
                                '<span style="font-size:10px;line-height: 10px;font-weight: 400;color: #333333;font-family: PingFangSC-Regular, PingFang SC;">' +
                                that.yAxisUnit[index] +
                                '</span>' +
                                '<br />'
                        })

                        if (that.lengData && that.lengData[params[0].dataIndex]) {
                            str +=
                                '<span style="font-size: 13px;line-height: 13px;color: #999999;font-weight: 400;font-family: PingFangSC-Regular, PingFang SC;margin-bottom: 12px;">' +
                                '复访量' +
                                '</span>' +
                                '：' +
                                '<span style="font-size: 13px;line-height: 13px;color: #333333;font-weight: bold;font-family: DINAlternate-Bold, DINAlternate;">' +
                                commonMethods.NumFormat(that.lengData[params[0].dataIndex]) +
                                '</span>' +
                                '<span style="font-size:10px;line-height: 10px;font-weight: 400;color: #333333;font-family: PingFangSC-Regular, PingFang SC;">' +
                                that.yAxisUnit[1] +
                                '</span>' +
                                '<br />'
                        }

                        return str
                    }
                },
                legend: {
                    bottom: 10,
                    data: this.data.data.map(item => item.name),
                    textStyle: {
                        color: '#333',
                        fontWeight: 400,
                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                        fontSize: 12
                    },
                    itemWidth: 8,
                    itemHeight: 8,
                    itemGap: 24,
                    icon: 'circle'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.data.xdata,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisPointer: {
                            show: true,
                            type: 'line'
                        },
                        axisLabel: {
                            interval: 0,
                            formatter: (value, index) => {
                                if(value.indexOf('年')>-1){
                                     let arr = value.split('年')
                                if (arr.length === 1) {
                                    return arr[0]+'年'
                                } else {
                                    let str
                                    str = arr[0] + '年\n' + arr[1]
                                    return str
                                }
                                }else{
                                     let arr = value.split('-')
                                if (arr.length === 1) {
                                    return arr[0]
                                } else {
                                    let str
                                    str = arr[0] + '\n' + arr[1]
                                    return str
                                }
                                }

                            }
                        }
                    }
                ],

                yAxis: [
                    {
                        type: 'value',
                        name: '单位：' + this.yAxisUnit[0],
                        min: 0,
                        // max: function(value) {
                        //     return value.max + 20
                        // },
                        axisLabel: {
                            formatter: '{value}'
                        },
                        splitLine: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#999999',
                            fontFamily: 'PingFangSC-Regular, PingFang SC',
                            align: 'center',
                            padding: [0, 0, 10, 10],
                            fontSize: 12
                        },
                    },
                    {
                        type: 'value',
                        name: '单位：' + this.yAxisUnit[1],
                        min: 0,
                        axisLabel: {
                            formatter: '{value}'
                        },
                        splitLine: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#999999',
                            fontFamily: 'PingFangSC-Regular, PingFang SC',
                            align: 'center',
                            padding: [0, -10, 10, 0],
                            fontSize: 12
                        }
                    }
                ]
            }
            options.series = this.formatSeriesData(this.data.data)
            this.chart.setOption(options)
        },
        formatSeriesData(data) {
            let list = []
            if (data && data.length > 0) {
                data.map((item, index) => {
                    if (index === 0) {
                        list[0] = {
                            name: item.name,
                            type: 'bar',
                            data: item.data,
                            showSymbol: item.name === '成交套数' ? true : false,
                            label: {
                                show: item.name === '成交套数' ? true : false,
                                position: 'top'
                            },
                            itemStyle: {
                                color: !Array.isArray(this.colors[0])
                                    ? this.colors[0]
                                    : new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                          { offset: 0, color: this.colors[0][0] }, // 0% 处的颜色
                                          { offset: 1, color: this.colors[0][1] } // 100% 处的颜色
                                      ]),

                            },
                            barWidth: 10
                        }
                    } else if (index === 1) {
                        list[1] = {
                            name: item.name,
                            type: 'line',
                            smooth: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            showSymbol: item.name === '首访量' || item.name === '成交单价' ? true : false,
                            yAxisIndex: 1,
                            data: item.data,
                            label: {
                                show: item.name === '首访量' ? true : false,
                                position: 'top'
                            },
                            itemStyle: {
                                color:this.colors[1],
                                emphasis: {
                                    // 设置鼠标放在图上的圆点
                                    borderColor: '#ffffff', // 原点背景色
                                    borderWidth: 2 // 原点边框大小()
                                }
                            }
                        }
                    }
                })
            }

            return list
        },
        touchStart(res) {
                const touche = res.touches[0]
                this.startX = touche.clientX
            },
            touchEnd(res) {
                this.$nextTick(() => {
                    let diff = this.diff
                    const clientX = res.changedTouches[0].clientX
                    const cha = clientX - this.startX

                    this.startX = 0
                    if (Math.abs(cha) < 30) return

                    cha > 0 ? diff-- : diff++
                    if (diff > 0) return
                    const direction=this.diff>diff?'right':'left'
                    this.diff = diff
                    this.$emit('getEchartData',direction)
                })
            }
    }
}
</script>

<style lang="less" scoped>
.echart {
    width: 100%;
    height: 303px;
}
</style>
