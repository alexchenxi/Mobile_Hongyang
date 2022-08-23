<template>
    <div class="peripheral-matching-map">
        <div id="projectMap" class="project-map"></div>
        <div class="tabs" @click="goUrl()">
            <span v-for="(x, y) in tabs" :key="y" class="tab">{{ y }}({{ x }})</span>
        </div>
        <!-- 配套信息 -->
        <div class="matching-info">
            <section v-for="(x, i) in matchingInfo" :key="x.name">
                <p v-if="i === 0 || isExpand" class="title">{{ x.name }}：</p>
                <article v-if="i === 0 || isExpand" class="info">{{ x.value }}</article>
            </section>
            <p v-if="showExpand" class="collapse" @click="isExpand = !isExpand">
                {{ isExpand ? '收起' : '展开' }}
                <van-icon class="icon-arrow" :name="isExpand ? 'arrow-up' : 'arrow-down'" />
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PeripheralMatchingMap',
    props: {
        mapData: {
            type: Object,
            default: () => {
                return {
                    lng: '',
                    lat: '',
                    name: '',
                    address: ''
                }
            }
        },
        matchingInfo: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            map: null,
            tabs: {
                公交: 0,
                教育: 0,
                医院: 0,
                银行: 0,
                健身: 0
            },
            showExpand: true,
            isExpand: false
        }
    },
    watch: {
        mapData: {
            handler(newVal) {
                if (newVal.lng) {
                    this.initMap(this.mapData)
                }
            },
            deep: true
        }
    },
    mounted() {},
    methods: {
        goUrl() {
            this.$router
                .push({
                    path: '/building/peripheralMatching',
                    query: this.mapData
                })
                .catch(() => {})
        },
        // 初始化地图
        initMap(data) {
            this.map = new BMap.Map('projectMap')
            this.map.disableDragging()
            let centerPoint = new BMap.Point(Number(data.lng), Number(data.lat))
            let myIcon = new BMap.Icon(process.env.VUE_APP_IMG_URL + '/extension/attendance/icon-marker.png', new BMap.Size(30, 32), {
                imageSize: new BMap.Size(30, 32)
            })
            let mk = new BMap.Marker(centerPoint, {
                icon: myIcon,
                offset: new BMap.Size(0, 10)
            })
            this.map.addOverlay(mk)
            const width = 4 * data.name.length * -1
            let opts = {
                position: centerPoint, // 指定文本标注所在的地理位置
                offset: new BMap.Size(width, -40) //设置文本偏移量
            }
            let label = new BMap.Label(data.name, opts) // 创建文本标注对象
            label.setStyle({
                color: '#fff',
                fontSize: '12px',
                height: '26px',
                marginLeft: '-30px',
                background: '#5F95FA',
                padding: '2px 17px',
                borderRadius: '20px',
                lineHeight: '26px',
                border: 'none',
                fontFamily: '微软雅黑'
            })
            this.map.addOverlay(label)
            this.map.centerAndZoom(centerPoint, 17)
            // 获取周边配套数量
            this.getMatchingNum(centerPoint)
        },
        // 获取周边配套数量
        getMatchingNum(centerPoint) {
            for (let x in this.tabs) {
                this.mapSearch(x, centerPoint)
            }
        },
        // 地图检索
        mapSearch(name, point) {
            let that = this
            let options = {
                onSearchComplete: function(results) {
                    // 判断状态是否正确
                    // eslint-disable-next-line no-undef
                    if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                        that.tabs[name] = results.getCurrentNumPois()
                    }
                }
            }
            let local = new BMap.LocalSearch(this.map, options)
            local.setPageCapacity(20)
            local.searchNearby(name, point)
        }
    }
}
</script>

<style lang="less" scoped>
.project-map {
    height: 180px;
}
.tabs {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #333333;
    padding: 18px 0;
    .tab {
        font-weight: 600;
    }
}
.matching-info {
    .title {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        position: relative;
        text-indent: 10px;
        &::before {
            position: absolute;
            left: 0;
            content: '';
            background: #333;
            left: 0;
            width: 2px;
            height: 13px;
            top: 4px;
        }
    }
    .info {
        padding-bottom: 10px;
        padding-top: 9px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
    }
    .collapse {
        padding-bottom: 15px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: @theme-color;
        text-align: right;
    }
}
</style>
