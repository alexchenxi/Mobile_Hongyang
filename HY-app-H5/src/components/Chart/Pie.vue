<template>
    <div class="echart-wrap">
        <div class="echart" :id="chartData.id" :ref="chartData.id"></div>
        <div class="right-content" style="position: absolute">
            <template v-for="item in formatChartData">
                <div class="item" @click="handerChange(item.code)">
                    <div class="name">
                        <span class="icon" :style="{ background: item.color }" />
                        {{ item.name }}：
                    </div>
                    <div class="bottom">
                        <div class="num">{{ item.value }}<span class="unit">{{ item.unit }},</span>
                        </div>
                        <div class="percent">{{ item.percent }}<span class="unit">%</span></div>
                    </div>
                </div>
            </template>
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
    computed: {
        formatChartData() {
            const newChartData = this.chartData.data.map((item) => {
                return {
                    ...item,
                    value: this.numFormat(item.value),
                    color: this.chartData.colorObj.find((k) => k.name === item.name) ? this.chartData.colorObj.find((k) => k.name === item.name).color : '#677AFD',
                }
            })
            return newChartData
        },
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
        const that = this
        this.initEchart(this.chartData)
        const myChart = this.echarts.init(document.getElementById(this.chartData.id))

        myChart.on('click', function (param) {
            that.handerChange(param.data.code)
        })
    },
    methods: {
        initEchart(chartData) {
            let legendData = chartData.data.map((x) => x.name)
            let arr = []
            for (var i = 0; i < legendData.length; i += 3) {
                arr.push(legendData.slice(i, i + 3))
            }
            chartData.data.map((item) => {
                item.itemStyle = {
                    color: chartData.colorObj.find((k) => k.name === item.name) ? chartData.colorObj.find((k) => k.name === item.name).color : '#677AFD',
                }
            })
            this.$nextTick(() => {
                this.chart = this.echarts.init(this.$refs[chartData.id])
                let option = {
                    color: chartData.color,
                    // legend: legendArr,
                    series: [
                        {
                            name: chartData.title,
                            type: 'pie',
                            center: ['17%', '50%'],
                            radius: ['35%', '55%'],
                            avoidLabelOverlap: true,
                            label: {
                                show: false,
                                position: 'outside',
                                formatter: function (params) {
                                    return [`{a|${params.percent}%}`, `{b|${params.value}组}`, `{c|${params.name}}`].join('\n')
                                },
                                rich: {
                                    a: {
                                        color: '#333333',
                                        fontSize: 13,
                                        fontWeight: 'bold',
                                        lineHeight: 16,
                                    },
                                    b: {
                                        color: '#333333',
                                        fontSize: 11,
                                        fontWeight: 'bold',
                                        lineHeight: 20,
                                    },
                                    c: {
                                        color: '#999999',
                                        fontSize: 11,
                                    },
                                },
                            },
                            labelLine: {
                                show: true,
                                lineStyle: {
                                    color: '#E5E5E5',
                                },
                            },
                            itemStyle: {},
                            emphasis: {},
                            data: chartData.data,
                        },
                    ],
                }
                option && this.chart.setOption(option)
            })
        },
        handerChange(name) {
            this.$emit('handerChange', name)
        },
        // 千分位
        numFormat(val) {
            if (!val) return '0'
            if (val === '--') return val
            val = val.toString()
            let reg = val.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g
            return val.replace(reg, '$1,')
        },
    },
}
</script>
<style lang="less" scoped>
.echart-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    .right-content {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 60%;
        .item {
            display: flex;
            line-height: 20px;
            flex-wrap: wrap;
            margin-bottom: 2px;
            .bottom {
                display: flex;
            }
            .name {
                font-size: 11px;
                color: #999;
                .icon {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    margin-right: 4px;
                    border-radius: 50%;
                }
            }
            .num,
            .percent {
                font-size: 14px;
                font-weight: bold;
                .unit {
                    margin: 0 2px;
                    font-size: 11px;
                }
            }
        }
    }
}
.echart {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
