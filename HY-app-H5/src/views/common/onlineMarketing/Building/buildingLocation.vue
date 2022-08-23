<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="true" title="楼盘地址"></top-bar>
        </div>
        <div class="common-page-container" :style="{ height: pageMiddleWithButtonHeight }">
            <div id="locationMap" class="map"></div>
        </div>
        <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" native-type="submit" @click="openMap">到这去</van-button>
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
            map: null
        }
    },
    computed: { ...mapGetters(['projectId', 'device']) },
    created() {},
    mounted() {
        this.initMap()
    },
    methods: {
        // 初始化地图
        async initMap() {
            this.map = new BMap.Map('locationMap')
            const centerPoint = new BMap.Point(this.$route.query.lng, this.$route.query.lat)
            let myIcon = new BMap.Icon(process.env.VUE_APP_IMG_URL + '/extension/attendance/icon-marker.png', new BMap.Size(30, 32), {
                imageSize: new BMap.Size(30, 32)
            })
            let mk = new BMap.Marker(centerPoint, {
                icon: myIcon,
                offset: new BMap.Size(0, 10)
            })
            this.map.addOverlay(mk)
            this.map.centerAndZoom(centerPoint, 15)
            this.map.setMinZoom(10)

            const label = this.drawLabel(centerPoint, this.$route.query.name)
            this.map.addOverlay(label)
        },
        // 打开要调整的地图
        openMap() {
            let { lng, lat, address } = this.$route.query
            this.$appMethods.showNavigationSheet(this.device, {
                lng,
                lat, //地理纬度
                address //地址
            })
        },
        // 绘制标签
        drawLabel(point, text) {
            let opts = {
                position: point, // 指定文本标注所在的地理位置
                offset: new BMap.Size(-text.length * 6, -40) //设置文本偏移量
            }
            let label = new BMap.Label(text, opts) // 创建文本标注对象
            label.setStyle({
                color: '#333',
                fontSize: '12px',
                height: '20px',
                marginLeft: '0px',
                background: '#fff',
                padding: '2px 10px',
                borderRadius: '20px',
                lineHeight: '20px',
                border: 'none',
                fontFamily: '微软雅黑'
            })
            return label
        }
    }
}
</script>
<style lang="less" scoped>
.map {
    width: 100%;
    height: 100%;
}
.common-page-container {
    position: relative;
}
</style>
