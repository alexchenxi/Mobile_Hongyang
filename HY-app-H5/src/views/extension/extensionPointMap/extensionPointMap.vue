<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="false" title="拓客点位图"></top-bar>
        </div>
        <div class="common-page-middle" :style="{ height: pageMiddleHeight }">
            <div class="map" id="extension-map"></div>
        </div>
        <tab-bar active="/extension/extensionPointMap" :tabData="tabData" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import TabBar from '@c/TabBar'
import API from '@/request/api/selfExtension/pointMap'
import { commonMethods } from 'movit-utils'

export default {
    components: {
        TopBar,
        TabBar
    },
    data() {
        return {
            lng: '',
            lat: '',
            markerClusterer: null
        }
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'keepAliveList', 'currentRole', 'device'])
    },
    mounted() {
        // this.getLocation().then(() => {
        this.getPointList()
        // },(err) => {
        //
        // })
    },
    methods: {
        initMap(data) {
            let map = new BMap.Map('extension-map',
                {
                    minZoom: 1,
                    maxZoom: 18
                })
            // map.centerAndZoom(new BMap.Point(120.591981, 31.30628), 10)
            map.centerAndZoom(new BMap.Point(this.lng || 120.591981, this.lat || 31.30628), 10)
            map.enableScrollWheelZoom()

            let markers = []
            let currMarkers = {}
            let pt = null
            for (let i = 0; i < data.length; i++) {
                pt = new BMap.Point(data[i].lng, data[i].lat)
                markers.push(new BMap.Marker(pt))
                if (i < 50) {//初始显示200个点（可自定义自己能容忍卡顿时间的极限点数）
                    map.addOverlay(markers[i])//绘制到地图上
                    currMarkers['markers' + i] = markers[i]//添加到已显示的点内
                }
            }
            this.markerClusterer = new BMapLib.MarkerClusterer(map, { markers: markers })
            console.log('>>',this.markerClusterer)
            // this.getAllData()
        },
        // 获取坐标点数据
        async getPointList() {
            let data = []
            let params = {
                projectIds: [this.projectId],
                roleCode: this.currentRole.roleCode
            }
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true
            })
            const result = await API.getPointList(params)
            data = result.map(item => {
                return {
                    lng: parseFloat(item.longitude),
                    lat: parseFloat(item.latitude)
                }
            })
            this.$toast.clear()
            this.initMap(data)
        },
        //   获取定位
        getLocation() {
            return new Promise((resolve, reject) => {
                this.$appMethods.startLocation(this.device).then(res => {
                    if (res.lon) {
                        this.lng = res.lon
                        this.lat = res.lat
                        resolve()
                    } else {
                        reject()
                    }
                }, (() => {
                    reject()
                }))
            })
        }
    }
}
</script>

<style lang="less" scoped>
.map {
    width: 100%;
    height: 100%;
}
</style>
