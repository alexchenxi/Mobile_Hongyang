<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="true" title="周边配套"></top-bar>
        </div>
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <div id="searchMap" class="map"></div>
            <div class="content" :class="isExpand ? 'is-expand' : ''" @touchstart.stop="touchStart" @touchmove.stop="touchMove">
                <div class="arrow" @click="isExpand = !isExpand"></div>
                <van-image class="icon-area" width="64px" height="64px" fit="contain" :src="$baseImgUrl + '/onlineMarketing/go-area.png'" @click="toLocation" />
                <p class="project-name">{{ $route.query.name }}</p>
                <div class="address-wrap">
                    <p class="address">{{ $route.query.address }}</p>
                    <van-tag color="#E0E0E0" text-color="#333" plain @click="copy">复制</van-tag>
                </div>
                <van-tabs v-model="active">
                    <van-tab v-for="(x, key) in tabs" :key="key" :title="key + '(' + x.count + ')'" :name="key">
                        <van-cell v-for="(item, i) in x.data" :key="key + item.title" class="address-list" @click="clickAddress(item, i)">
                            <section class="info van-ellipsis">
                                <p class="title van-ellipsis">{{ item.title }}</p>
                                <span class="address">{{ item.address }}</span>
                            </section>
                            <span class="distance">{{ item.distance }}m</span>
                        </van-cell>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import TopBar from '@c/TopBar'
import { mapGetters } from 'vuex'
export default {
    name: 'PeripheralMatching',
    components: {
        TopBar
    },

    data() {
        return {
            map: null,
            tabs: {
                公交: {
                    count: 0,
                    data: []
                },
                教育: {
                    count: 0,
                    data: []
                },
                医院: {
                    count: 0,
                    data: []
                },
                银行: {
                    count: 0,
                    data: []
                },
                健身: {
                    count: 0,
                    data: []
                }
            },
            active: '公交',
            centerPoint: null,
            isExpand: false,
            startX: 0,
            startY: 0,
            label: null
        }
    },
    computed: { ...mapGetters(['projectId']) },
    created() {},
    mounted() {
        this.initMap()
    },
    methods: {
        // 初始化地图
        async initMap() {
            this.map = new BMap.Map('searchMap')
            this.centerPoint = new BMap.Point(this.$route.query.lng, this.$route.query.lat)

            let myIcon = new BMap.Icon(process.env.VUE_APP_IMG_URL + '/extension/attendance/icon-marker.png', new BMap.Size(30, 32), {
                imageSize: new BMap.Size(30, 32)
            })
            let mk = new BMap.Marker(this.centerPoint, {
                icon: myIcon,
                offset: new BMap.Size(0, 10)
            })
            this.map.addOverlay(mk)
            this.map.centerAndZoom(this.centerPoint, 15)
            this.map.setMinZoom(10)
            for (let x in this.tabs) {
                this.mapSearch(x)
            }
        },
        // 地图检索
        mapSearch(name) {
            let that = this
            let options = {
                onSearchComplete: function(results) {
                    // 判断状态是否正确
                    // eslint-disable-next-line no-undef
                    if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                        that.tabs[name].count = results.getCurrentNumPois()
                        let s = []
                        for (var i = 0; i < results.getCurrentNumPois(); i++) {
                            let item = results.getPoi(i)
                            let point = new BMap.Point(item.point.lng, item.point.lat)
                            item.distance = parseInt(that.map.getDistance(that.centerPoint, point))
                            s.push(item)
                        }

                        that.tabs[name].data = s.sort(that.compare('distance'))
                    }
                }
            }
            let local = new BMap.LocalSearch(this.map, options)
            local.setPageCapacity(20)
            local.searchNearby(name, this.centerPoint)
        },
        compare(property) {
            return function(a, b) {
                var value1 = a[property]
                var value2 = b[property]
                return value1 - value2
            }
        },
        // 点击搜索出的某一项
        clickAddress(item, i) {
            this.map.removeOverlay(this.label)
            const point = new BMap.Point(item.point.lng, item.point.lat)
            const num = i + 1
            const text = num < 10 ? '0' + num : num
            this.label = this.drawLabel(point, text)
            this.map.addOverlay(this.label)
            this.map.centerAndZoom(point, 15)
        },
        // 打开项目定位
        toLocation() {
            this.$router
                .push({
                    path: '/buildingLocation',
                    query: {
                        name: '智慧城',
                        address: '上海市青浦区秀泽路515弄',
                        lng: 116.4035,
                        lat: 39.915
                    }
                })
                .catch(() => {})
        },
        // 绘制标签
        drawLabel(point, text) {
            let opts = {
                position: point, // 指定文本标注所在的地理位置
                offset: new BMap.Size(-25, -100) //设置文本偏移量
            }
            let label = new BMap.Label(text, opts) // 创建文本标注对象
            label.setStyle({
                color: '#fff',
                fontSize: '12px',
                height: '20px',
                marginLeft: '0px',
                background: '#5F95FA',
                padding: '2px 10px',
                borderRadius: '20px',
                lineHeight: '20px',
                border: 'none',
                fontFamily: '微软雅黑'
            })
            return label
        },
        // 复制
        copy() {
            const el = document.createElement('textarea')
            el.value = this.$route.query.address
            el.setAttribute('readonly', '')
            el.style.position = 'absolute'
            el.style.left = '-9999px'
            document.body.appendChild(el)
            const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            if (selected) {
                document.getSelection().removeAllRanges()
                document.getSelection().addRange(selected)
            }
            this.$toast('复制成功')
        },
        touchStart(evt) {
            try {
                var touch = evt.touches[0], //获取第一个触点
                    x = Number(touch.pageX), //页面触点X坐标
                    y = Number(touch.pageY) //页面触点Y坐标
                //记录触点初始位置
                this.startX = x
                this.startY = y
            } catch (e) {
                console.log(e.message)
            }
        },
        touchMove(evt) {
            try {
                var touch = evt.touches[0], //获取第一个触点
                    // x = Number(touch.pageX), //页面触点X坐标
                    y = Number(touch.pageY) //页面触点Y坐标
                //判断滑动方向
                if (y - this.startY < 0) {
                    console.log('上滑了！')
                    if (!this.isExpand) {
                        this.isExpand = true
                    }
                }
                //判断滑动方向
                if (y - this.startY > 0) {
                    console.log('下滑了！')
                    if (this.isExpand) {
                        this.isExpand = false
                    }
                }
            } catch (e) {
                console.log(e.message)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.map {
    width: 100%;
    height: calc(100% - 148px);
}
.common-page-container {
    position: relative;
}
.content {
    position: fixed;
    z-index: 2;
    width: 100%;
    bottom: 0;
    height: 148px;
    background: #ffffff;
    border-radius: 8px 8px 0px 0px;
    &.is-expand {
        height: 443px;
        .arrow {
            background: url('@{baseImgUrl}/onlineMarketing/arrow-down.png') center center no-repeat;
            background-size: 31px 6px;
        }
    }
    .icon-area {
        position: absolute;
        top: -32px;
        right: 20px;
    }
    .arrow {
        margin: 4px 0;
        padding: 2px;
        height: 6px;
        background: url('@{baseImgUrl}/onlineMarketing/arrow-up.png') center center no-repeat;
        background-size: 31px 6px;
    }
    .project-name {
        padding-left: 15px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
    }
    .address-wrap {
        padding: 15px 15px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .address {
            flex: 1;
            flex-wrap: wrap;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
        }
        /deep/ .van-tag {
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 4px;
        }
    }
    /deep/ .van-cell__value {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    /deep/ .van-cell {
        padding: 9px 15px;
    }
    /deep/ .van-tabs__content {
        height: 300px;
        overflow: auto;
    }
    .address-list {
        .distance {
            font-size: 15px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #333333;
            line-height: 15px;
        }
        .info {
            margin-right: 15px;
            flex: 1;
        }
        .title {
            font-size: 15px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #333333;
        }
        .address {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
        }
    }
}
</style>
