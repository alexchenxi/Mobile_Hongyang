<template>
    <div id="echart" class="echart"></div>
</template>

<script>
export default {
    props: {
        colors: Array,
        data: Object,
        yAxisUnit: {
            type: Array,
            default: () => {
                return ['亿元', '%']
            }
        }
    },
    data() {
        return {}
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
    },
    methods: {
        initMyChart() {
            if (Object.keys(this.data).length === 0) return
            if(this.chart) {
                this.chart.dispose()
                this.chart = null
            }
            this.chart = this.echarts.init(document.getElementById('echart'))
            let options = {
                grid: {
                    left: 50
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: (params, ticket, callback) => {
                        let str =
                            '<span style="font-size: 15px;line-height: 15px;color: #333333;font-weight: 500;font-family: PingFangSC-Medium, PingFang SC;margin-bottom: 12px;">' +
                            params[0].axisValue +
                            '</span>' +
                            '<br />'
                        params.forEach(item => {
                            let title = ''
                            let unit = ''
                            if (item.seriesName.indexOf('实际') > -1) {
                                title = '实际'
                                unit = this.yAxisUnit[0]
                            } else if (item.seriesName.indexOf('目标') > -1) {
                                title = '目标'
                                unit = this.yAxisUnit[0]
                            } else if (item.seriesName === '完成率') {
                                title = '完成率'
                                unit = this.yAxisUnit[1]
                            } else if (!item.seriesName) {
                                return
                            }
                            str +=
                                '<span style="font-size: 13px;line-height: 13px;color: #999999;font-weight: 400;font-family: PingFangSC-Regular, PingFang SC;margin-bottom: 12px;">' +
                                title +
                                '</span>' +
                                '：' +
                                '<span style="font-size: 13px;line-height: 13px;color: #333333;font-weight: bold;font-family: DINAlternate-Bold, DINAlternate;">' +
                                item.value +
                                '</span>' +
                                '<span style="font-size:10px;line-height: 10px;font-weight: 400;color: #333333;font-family: PingFangSC-Regular, PingFang SC;">' +
                                unit +
                                '</span>' +
                                '<br />'
                        })
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
                                let arr = value.split(',')
                                if (arr.length === 1) {
                                    if (arr[0].indexOf('年') > -1) {
                                        let str = arr[0].split('年')[1]
                                        return str
                                    } else {
                                        return arr[0]
                                    }
                                } else {
                                    let str = ''
                                    if (arr[0].indexOf('年') > -1) {
                                        let _str = arr[0].split('年')
                                        str = _str[_str.length - 1] + '\n' + arr[1]
                                    } else {
                                        str = arr[0] + '\n' + arr[1]
                                    }
                                    return str
                                }
                            }
                        }
                    }
                ],
                // 滚动条样式
                dataZoom: {
                    type: 'inside',
                    right: '4%',
                    endValue: 5,
                    zoomLock: true
                },
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
                        max: 100,
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
                            itemStyle: {
                                color: !Array.isArray(this.colors[0])
                                    ? this.colors[0]
                                    : new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                          { offset: 0, color: this.colors[0][0] }, // 0% 处的颜色
                                          { offset: 1, color: this.colors[0][1] } // 100% 处的颜色
                                      ]),
                                borderRadius: [50, 50, 0, 0] //圆角
                            },
                            barWidth: 10,
                            emphasis: {
                                itemStyle: {
                                    color: '#47CFAE'
                                }
                            }
                        }
                    } else if (index === 1) {
                        list[1] = {
                            name: item.name,
                            type: 'bar',
                            barGap: 0,
                            data: item.data,
                            itemStyle: {
                                color: !Array.isArray(this.colors[1])
                                    ? this.colors[1]
                                    : new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                          { offset: 0, color: this.colors[1][0] }, // 0% 处的颜色
                                          { offset: 1, color: this.colors[1][1] } // 100% 处的颜色
                                      ]), //渐变色
                                borderRadius: [50, 50, 0, 0] //圆角
                            },
                            barWidth: 10
                        }
                    } else if (index === 2) {
                        list[2] = {
                            name: item.name,
                            type: 'line',
                            smooth: true,
                            symbol: 'circle',
                            symbolSize: 11,
                            showSymbol: false,
                            yAxisIndex: 1,
                            data: item.data,
                            itemStyle: {
                                color: !Array.isArray(this.colors[2])
                                    ? this.colors[2]
                                    : new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                          { offset: 0, color: this.colors[2][0] }, // 0% 处的颜色
                                          { offset: 1, color: this.colors[2][1] } // 100% 处的颜色
                                      ]),
                                emphasis: {
                                    // 设置鼠标放在图上的圆点
                                    borderColor: '#ffffff', // 原点背景色
                                    borderWidth: 4 // 原点边框大小()
                                }
                            },
                            areaStyle: {
                                color: !Array.isArray(this.colors[3])
                                    ? this.colors[3]
                                    : new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                          { offset: 0, color: this.colors[3][0] }, // 0% 处的颜色
                                          { offset: 1, color: this.colors[3][1] } // 100% 处的颜色
                                      ])
                            }
                        }
                    }
                })
            }
            let customData = [].concat(this.data.xdata)
            customData.map((item, index) => {
                if (item.indexOf('年') > -1) {
                    let arr = item.split('年')
                    list.push({
                        name: '',
                        type: 'bar',
                        barGap: 0,
                        data: customData,
                        barWidth: data.length < 2 ? '-100%' : 25,
                        markLine: {
                            silent: true,
                            symbol: 'none',
                            label: {
                                show: true,
                                position: 'end',
                                formatter: arr[0] + ' | ' + (Number(arr[0]) + 1),
                                color: '#999999'
                            },
                            lineStyle: {
                                color: '#999999',
                                type: 'dashed'
                            },
                            data: [
                                {
                                    xAxis: index
                                }
                            ]
                        }
                    })
                    item = 0
                }
            })

            return list
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
