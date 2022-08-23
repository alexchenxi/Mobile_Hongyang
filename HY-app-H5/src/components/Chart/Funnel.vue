<template>
    <div class="echart-box">
        <div class="echart" :id="chartData.id" :ref="chartData.id"></div>
        <!-- 转化率 -->
        <div class="info">
            <div v-for="(x, i) in chartData.conversionRate" :key="i">
                <p class="precent">{{ x.percent === '0' ? '-' : x.percent + '%' }}</p>
                <p>
                    {{ x.names[0] }}
                    <i class="iconfont iconjiantou2"></i>
                    {{ x.names[1] }}
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { commonMethods } from 'movit-utils'

export default {
    props: {
        chartData: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            chart: null,
        }
    },
    watch: {
        chartData: {
            handler(newValue) {
                this.chartData = newValue
                this.initEchart(this.chartData)
            },
            deep: true,
        },
    },
    created() {},
    mounted() {
        this.initEchart(this.chartData)
    },
    methods: {
        initEchart(chartData) {
            const that = this
            let legendData = []
            let outData = []
            let count = 100
            chartData.data.forEach((x, i) => {
                legendData.push(x.name)
                count =  count - 20
                outData.push({
                    name: x.name,
                    value: count,
                })
                outData[i].label = {
                    formatter: function (params) {
                        const unit = ['认购', '签约'].includes(params.name) ? '套' : chartData.unit
                        return `{a| }{b|${params.name}：}{c|${that.numFormat(x.value)}}{d|${unit}}`
                    },
                    padding: [0, 0, 0, 6],
                    rich: {
                        verticalAlign: 'bottom',
                        a: {
                            width: 7,
                            height: 7,
                            borderRadius: 7,
                            backgroundColor: chartData.color[i],
                            shadowColor: chartData.color[i],
                            hadowBlur: 10,
                            opacity: 1,
                        },
                        b: {
                            fontSize: 13,
                            fontFamily: 'PingFangSC-Regular, PingFang SC',
                            color: '#999999',
                            padding: [0, 0, 0, 6],
                            opacity: 1,
                        },
                        c: {
                            fontSize: 16,
                            fontFamily: 'DINAlternate-Bold, DINAlternate',
                            color: '#333333',
                            fontWeight: 'bold',
                            opacity: 1,
                        },
                        d: {
                            fontSize: 10,
                            fontFamily: 'DINAlternate-Bold, DINAlternate',
                            color: '#333333',
                            padding: [0, 0, 0, 4],
                            opacity: 1,
                        },
                    },
                }
            })
            this.chart = this.echarts.init(document.getElementById(chartData.id))
            let option = {
                title: {
                    text: chartData.name,
                    left: 28,
                    top: 20,
                    textStyle: {
                        fontWeight: 'bold',
                    },
                },
                grid: {
                    top: 800,
                },
                color: chartData.color,
                legend: {
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    bottom: 24,
                    itemGap: 30,
                    data: legendData,
                    selectedMode: false,
                },
                series: [
                    {
                        top: 80,
                        name: '',
                        type: 'funnel',
                        left: 30,
                        min: 0,
                        width: '45%',
                        labelLine: {
                            length: 40,
                            show: true
                        },
                        itemStyle: {
                            opacity: 0.5,
                            borderWidth: 0,
                        },
                        data: outData,
                    },
                    {
                        name: '',
                        type: 'funnel',
                        min: 0,
                        top: 80,
                        left: 30,
                        width: '45%',
                        maxSize: '45%',
                        selectedMode: false,
                        label: {
                            show: false,
                            formatter: function () {
                                return ''
                            },
                        },
                        labelLine: {
                            length: 60,
                            show: false
                        },
                        itemStyle: {
                            opacity: 1,
                            borderWidth: 0
                        },
                        data: chartData.data,
                        z: 100
                    }
                ],
            }
            option && this.chart.setOption(option)
        },
        // 千分位
        numFormat(val) {
            if (!val) return '0'
            if (val === '--') return val
            val = val.toString()
            let reg = val.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g
            return val.replace(reg, '$1,')
        }
    }
}
</script>
<style lang="less" scoped>
.echart-box,
.echart {
    width: 100%;
    height: 344px;
    position: relative;
}
.info {
    display: flex;
    position: absolute;
    top: 60px;
    left: 30px;
    width: calc(100% - 30px);
    div {
        flex: 1;
        font-size: 12px;
        color: #999999;
        .precent {
            margin-bottom: 3px;
            color: #333333;
            font-size: 16px;
            font-weight: bold;
        }
        .iconjiantou2 {
            color: #ccc;
            font-size: 10px;
        }
    }
}
</style>
