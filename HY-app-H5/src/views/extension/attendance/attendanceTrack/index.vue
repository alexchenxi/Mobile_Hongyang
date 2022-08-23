<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="true" title="考勤轨迹"></top-bar>
        </div>
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <div id="map" class="map"></div>
            <div class="count">在线：{{ onlineUser.length }}/{{ allUser.length }}</div>
            <div class="icon-track" :class="userId ? 'select' : ''" @click="showUser = true"></div>
            <div class="icon-task" :class="taskId ? 'select' : ''" @click="clickSelectTask"></div>
            <!-- 选中成员 -->
            <van-popup v-model="showUser" position="bottom">
                <div class="popup-content">
                    <ul class="list">
                        <li v-for="(item, index) in allUser" :key="index" class="list-li" :class="item.checked ? 'select' : ''" @click="selectUser(item, index)">
                            <span>
                                {{ item.userName }}
                                <span v-if="item.isOnline" class="tag-item common-tag-green">在线</span>
                                <span v-if="!item.isOnline" class="tag-item common-tag-gray">离线</span>
                            </span>
                            <van-icon v-if="item.checked" name="checked" size="18" />
                        </li>
                    </ul>
                </div>
                <div class="filter-container-bottom" :style="{ paddingBottom: bottomSafe }">
                    <van-button round block type="cancel" @click="showUser = false">取消</van-button>
                    <van-button round block type="save" native-type="submit" @click="selectUserSubmit">确定</van-button>
                </div>
            </van-popup>
            <!-- 选择任务 -->
            <van-popup v-model="showTask" position="bottom">
                <div class="popup-content">
                    <ul class="list">
                        <li v-for="(item, index) in allTask" :key="index" class="list-li" :class="item.checked ? 'select' : ''" @click="selectTask(item, index)">
                            <span>{{ item.taskName }}</span>
                            <van-icon v-if="item.checked" name="checked" size="18" />
                        </li>
                    </ul>
                </div>
                <div class="filter-container-bottom" :style="{ paddingBottom: bottomSafe }">
                    <van-button round block type="cancel" @click="showTask = false">取消</van-button>
                    <van-button round block type="save" native-type="submit" @click="selectTaskSubmit">确定</van-button>
                </div>
            </van-popup>
        </div>
    </div>
</template>
<script>
import TopBar from '@c/TopBar'
import { mapGetters } from 'vuex'
import { AvatarOverlay } from './overlay'
import API from '@/request/api/selfExtension/attendance'
export default {
    name: 'AttendanceTrack',
    components: {
        TopBar
    },
    data() {
        return {
            map: null,
            pointArr: [],
            labelArr: [],
            onlineUser: [],
            showUser: false,
            showTask: false,
            //   选中任务
            taskId: '',
            //   选中成员
            userId: '',
            allUser: [],
            allTask: [],
            // 轨迹覆盖物
            trackOverlay: {
                marker: null,
                label: null,
                point: null,
                line: []
            },
            interval: null
        }
    },
    computed: { ...mapGetters(['projectId']) },
    created() {
        this.getAllTask()
    },
    mounted() {
        this.initMap()
    },
    beforeDestroy() {
        this.interval && clearInterval(this.interval)
    },
    methods: {
        async initMap() {
            this.map = new BMap.Map('map')
            let centerPoint = new BMap.Point(116.404, 39.915)
            this.map.centerAndZoom(centerPoint, 15)
            this.map.disableDoubleClickZoom()
            this.map.setMinZoom(10)
            this.drawPoint()
        },
        // 绘制人员
        async drawPoint() {
            let users = await this.getAllPoint()
            for (let elem of users) {
                elem.checked = false
            }
            this.allUser = users
            this.hideOverlay()
            this.labelArr = []
            this.pointArr = []
            this.map.clearOverlays()
            this.onlineUser = this.allUser.filter(x => x.isOnline)
            for (let item of this.onlineUser) {
                // 添加自定义覆盖物
                let point = new BMap.Point(item.longitude, item.latitude)
                let overlay = new AvatarOverlay(this.map, point, item.avatar)
                this.pointArr.push(overlay)
                let label = this.drawLabel(point, item.userName)
                this.labelArr.push(label)
                label.setZIndex(1)
                this.map.addOverlay(label)
                this.map.addOverlay(overlay)
            }
            if (this.onlineUser.length) {
                this.setCenter(this.onlineUser[0])
            }
        },
        // 绘制标签
        drawLabel(point, text) {
            let opts = {
                position: point, // 指定文本标注所在的地理位置
                offset: new BMap.Size(-25, -100) //设置文本偏移量
            }
            let label = new BMap.Label(text, opts) // 创建文本标注对象
            label.setStyle({
                color: '#333333',
                fontSize: '12px',
                height: '26px',
                marginLeft: '0px',
                background: '#fffff',
                padding: '2px 17px',
                borderRadius: '20px',
                lineHeight: '26px',
                border: 'none',
                fontFamily: '微软雅黑'
            })
            return label
        },
        // 绘制轨迹
        async drawTrack(selectUser) {
            let path = await this.getTrackPath(this.userId)
            this.interval && clearInterval(this.interval)
            if (!path.length) {
                return false
            }
            let points = []
            for (var i = 0; i < path.length; i++) {
                points.push(new BMap.Point(path[i].longitude, path[i].latitude))
            }
            //   绘制终点
            let overlay = new AvatarOverlay(this.map, points[path.length - 1], selectUser.avatar)
            let label = this.drawLabel(points[path.length - 1], selectUser.userName)
            this.trackOverlay.point = overlay
            this.trackOverlay.label = label
            this.map.addOverlay(label)
            this.map.addOverlay(overlay)
            //   绘制起点
            let markerIcon = new BMap.Icon(process.env.VUE_APP_IMG_URL + '/extension/attendance/icon-marker.png', new BMap.Size(35, 45), {
                imageSize: new BMap.Size(35, 45)
            })
            var marker = new BMap.Marker(points[0], {
                icon: markerIcon,
                offset: new BMap.Size(0, -20)
            })
            this.map.addOverlay(marker)
            this.trackOverlay.marker = marker

            // 绘制轨迹
            let that = this
            let pointArr = []
            for (let i = 0; i < points.length; i++) {
                pointArr.push(new BMap.Point(points[i].lng, points[i].lat))
            }
            this.map.setViewport(pointArr)

            let idx = 0
            this.interval = setInterval(() => {
                if (idx >= points.length) {
                    clearInterval(that.interval)
                    return
                }
                //画线调用
                that.drowLine(that.map, pointArr[idx], pointArr[idx + 1])
                idx = idx + 1
            }, 300)
        },
        // 绘制线
        drowLine(map, pointArr, pointArrNext) {
            if (pointArrNext != undefined) {
                let polyline = new BMap.Polyline([pointArr, pointArrNext], {
                    strokeColor: '#5F95FA',
                    strokeOpacity: 1,
                    strokeWeight: 6
                }) //创建折线
                map.addOverlay(polyline)
                this.trackOverlay.line.push(polyline)
            }
        },
        // 选择成员
        selectUser(item) {
            // 离线人员不能选择
            if (!item.isOnline) {
                return
            }
            item.checked = !item.checked
            if (item.checked) {
                this.allUser.map(x => {
                    if (x.userId !== item.userId) {
                        x.checked = false
                    }
                })
            }
        },
        // 选择任务
        selectTask(item) {
            item.checked = true
            this.allTask.map(x => {
                if (x.taskId !== item.taskId) {
                    x.checked = false
                }
            })
        },
        // 点击任务筛选
        clickSelectTask() {
            // 当前显示轨迹时，任务不能筛选
            if (this.userId) {
                return
            }
            this.showTask = true
        },
        // 选择成员确定
        selectUserSubmit() {
            let selectUser = this.allUser.filter(x => x.checked)
            if (selectUser.length) {
                this.userId = selectUser[0].userId
                this.hideOverlay()
                this.clearTrack()
                // 绘制轨迹
                this.drawTrack(selectUser[0])
            } else {
                this.userId = ''
                this.clearTrack()
                // 绘制所有成员
                this.showOverlay()
                if (this.onlineUser.length) {
                    this.setCenter(this.onlineUser[0])
                }
            }
            this.showUser = false
        },
        // 选择任务确定
        selectTaskSubmit() {
            let selectTask = this.allTask.filter(x => x.checked)
            if (selectTask.length) {
                this.taskId = selectTask[0].taskId
            }
            this.drawPoint()
            this.showTask = false
        },
        // 获取所有人的位置
        async getAllPoint() {
            return API.getTrackLatestPoint({
                projectId: this.projectId,
                taskId: this.taskId
            }).then(res => {
                return res
            })
        },
        // 获取所有进行中任务
        getAllTask() {
            API.attendanceTaskList({
                projectId: this.projectId,
                taskStatus: 0
            }).then(res => {
                for (let elem of res) {
                    elem.checked = false
                }
                res.unshift({
                    taskId: '',
                    taskName: '全部任务',
                    checked: true
                })
                this.allTask = res
            })
        },
        // 获取人员轨迹
        async getTrackPath(userId) {
            return API.getTrackPath(userId).then(res => {
                return res
            })
        },
        // 显示覆盖物
        showOverlay() {
            for (let overlay of this.pointArr) {
                overlay.show()
            }
            for (let label of this.labelArr) {
                this.map.addOverlay(label)
            }
        },
        // 隐藏覆盖物
        hideOverlay() {
            for (let overlay of this.pointArr) {
                overlay.hide()
            }
            for (let label of this.labelArr) {
                this.map.removeOverlay(label)
            }
        },
        // 清除轨迹
        clearTrack() {
            this.map.removeOverlay(this.trackOverlay.marker)
            this.map.removeOverlay(this.trackOverlay.label)
            for (let item of this.trackOverlay.line) {
                this.map.removeOverlay(item)
            }
            if (this.trackOverlay.point) {
                this.trackOverlay.point.hide()
            }
        },
        // 设置中心点
        setCenter(data) {
            let point = new BMap.Point(data.longitude, data.latitude)
            this.map.centerAndZoom(point, 15)
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
.count {
    position: absolute;
    top: 15px;
    left: 15px;
    padding: 6px 10px;
    background: #ffffff;
    border-radius: 16px;
    font-size: 12px;
}
.icon-track {
    position: absolute;
    z-index: 100;
    top: 15px;
    right: 15px;
    width: 53px;
    height: 53px;
    background: url('@{baseImgUrl}/extension/attendance/arrow-up.png');
    background-size: 100% 100%;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    &.select {
        background: url('@{baseImgUrl}/extension/attendance/arrow-up-select.png');
        background-size: 100% 100%;
    }
}
.icon-task {
    position: absolute;
    z-index: 100;
    top: 92px;
    right: 15px;
    width: 53px;
    height: 53px;
    background: url('@{baseImgUrl}/extension/attendance/icon-task.png');
    background-size: 100% 100%;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    &.select {
        background: url('@{baseImgUrl}/extension/attendance/icon-task-select.png');
        background-size: 100% 100%;
    }
}
.popup-content {
    .list {
        max-height: 350px;
        overflow: auto;
        margin-bottom: 100px;
    }
    .list-li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 15px;
        font-size: 15px;
        &.select {
            color: @theme-color;
        }
    }
    .tag-item {
        margin-left: 30px;
        font-size: 11px;
        border-radius: 2px;
        padding: 2px 10px;
    }
}
.filter-container-bottom {
    position: fixed;
    bottom: 0;
    width: 92%;
    background: #fff;
    padding: 0 15px;
    height: 50px;
}
</style>
<style lang="less">
.avatar-image {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    position: relative;
    top: 4px;
}
.avatar-overlay {
    background: url('@{baseImgUrl}/extension/attendance/icon-marker-bg.png');
    background-size: 100% 100%;
    text-align: center;
}
</style>
