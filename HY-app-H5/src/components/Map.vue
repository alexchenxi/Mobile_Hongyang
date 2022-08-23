<template>
    <div :id="id" class="map"></div>
</template>
<script>
export default {
    name: 'Map',
    props: {
        isEnableOperate: {
            type: Boolean,
            default: true
        },
        isShowName: {
            type: Boolean,
            default: true
        },
        id: {
            type: String,
            default: 'baiduMap'
        }
    },
    data() {
        return {}
    },
    methods: {
        initMap(res) {
            let map = new BMap.Map(this.id)
            //					// 添加缩放按钮和比例尺
            //					map.addControl(new BMap.NavigationControl({
            //						anchor: BMap_ANCHOR_BOTTOM_RIGHT
            //					}));
            //					map.addControl(new BMap.ScaleControl({
            //						anchor: BMap_ANCHOR_BOTTOM_LEFT
            //					}));
            if (!this.isEnableOperate) {
                map.disableDragging()
            }
            try {
                var centerPoint = new BMap.Point(res.lon, res.lat)

                var myIcon = new BMap.Icon(process.env.VUE_APP_IMG_URL + '/extension/attendance/icon-marker.png', new BMap.Size(49, 51), {
                    imageSize: new BMap.Size(49, 51)
                })
                var mk = new BMap.Marker(centerPoint, {
                    icon: myIcon,
                    offset: new BMap.Size(0, 10)
                })
                map.addOverlay(mk)
                const width = 4 * res.address.length * -1
                var opts = {
                    position: centerPoint, // 指定文本标注所在的地理位置
                    offset: new BMap.Size(width, -40) //设置文本偏移量
                }
                var label = new BMap.Label(res.address, opts) // 创建文本标注对象
                label.setStyle({
                    color: '#333333',
                    fontSize: '12px',
                    height: '26px',
                    marginLeft: '-30px',
                    background: '#fffff',
                    padding: '2px 17px',
                    borderRadius: '20px',
                    lineHeight: '26px',
                    border: 'none',
                    fontFamily: '微软雅黑'
                })
            } catch (e) {
                console.log(e)
            }
            if (this.isShowName) {
                map.addOverlay(label)
            }

            setTimeout(function() {
                // map.panTo(centerPoint);
            }, 301)
            map.centerAndZoom(centerPoint, 17)
            // 优先用native定位，其次用百度api定位
        }
    }
}
</script>
<style scoped lang="less">
.map {
    width: 100%;
    height: 150px;
}
</style>
