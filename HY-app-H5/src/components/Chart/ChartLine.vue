<template>
  <div
    :id="id"
    class="echart"
  />
</template>
<script>
export default {
    name: 'ChartLine',
    props: {
        id: {
            type: String,
            default: 'echart'
        },
        title: {
            type: String,
            default: '趋势统计'
        },
        subTitle: {
            type: String,
            default: '单位：组'
        },
        chartData: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            myChart: null
        }
    },
    watch: {
        chartData: {
            handler(newValue) {
                this.drawLine(newValue)
            },
            deep: true
        }
    },
    mounted() {
        this.drawLine(this.chartData)
    },
    methods: {
        drawLine(data) {
            const that = this
            let colorData = []
            let dataData = []
            data.echartData.map((item, index) => {
                let color = data.colorArr[index]
                colorData.push(color.color1)
                dataData.push({
                    name: item.name,
                    type: 'line',
                    stack: item.name,
                    smooth: false,

                    symbol: 'circle',
                    showSymbol: data.xData.length === 1 ? true : false, //关闭线上默认的圆点
                    symbolSize: 12, //设置圆点的大小
                    itemStyle: {
                        color: color.color1, // 原点背景色（大小默认是  总大小-边框大小）
                        borderColor: '#ffffff', // 原点背景色
                        borderWidth: 4 // 原点边框大小()
                    },
                    data: item.data
                })
            })

            let customData = [].concat(data.xData)
            customData.map((item, index) => {
                if (item.indexOf('年') > -1) {
                    let arr = item.split('年')
                    dataData.push({
                        name: '',
                        type: 'bar',
                        barGap: 0,
                        data: customData,
                        barWidth: 25,
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

            if(this.myChart) {
                this.myChart.dispose()
                this.myChart = null
            }

            // 基于准备好的dom，初始化echarts实例
            this.myChart = this.echarts.init(document.getElementById(this.id))
            // 绘制图表
            let options = {
                color: colorData,
                legend: {
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    bottom: 24
                },
                title: {
                    text: that.title,
                    left: 13
                },
                dataZoom: {
                    type: 'inside',
                    right: '4%',
                    endValue: 5,
                    zoomLock: true
                },
                tooltip: {
                    trigger: 'axis',
                    type: 'shadow',
                    formatter: function(param) {
                        let str = '<div style="font-weight:bold;color:#333;font-size:15px;margin-bottom:6px;min-width:100px">' + param[0].name + '</div>'
                        param.map(item => {
                            str +=
                                '<div style="font-size:13px;color: #999999;">' +
                                item.seriesName +
                                '：<span style="font-weight:bold;font-family: DINAlternate, DINAlternate-Bold;color:#333;font-size:16px;margin:8px 4px 0">' +
                                item.value +
                                '</span><span class="font-size:10px;color:#333">组</span></div>'
                        })
                        return str
                    }
                },
                grid: {
                    left: '44',
                    right: '32',
                    bottom: '80'
                },
                xAxis: [
                    {
                        type: 'category',
                        nameLocation: 'start',
                        boundaryGap: false,
                        data: data.xData,
                        axisPointer: {
                            type: 'shadow',
                            shadowStyle:{
                                color:{
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: 'rgba(232,239,251,0)' // 0% 处的颜色
                                    },{
                                        offset: 0.5, color: 'rgba(255,245,233,0.5)' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: 'rgba(232,239,251,0)' // 100% 处的颜色
                                    }],
                                    global: false // 缺省为 false
                                }
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },

                        splitLine: {
                            show: false
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
                yAxis: [
                    {
                        type: 'value',
                        name: this.subTitle,
                        nameTextStyle: {
                            align: 'center',
                            padding: [0, 0, 0, 0]
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        minInterval: 1
                    }
                ],
                series: dataData
            }
            that.myChart.setOption(options)
        }
    }
}
</script>
<style scoped lang="less">
.echart {
    width: 100%;
    height: 100%;
}
</style>
