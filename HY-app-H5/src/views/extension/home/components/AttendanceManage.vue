<template>
    <div class="container">
        <div class="common-title" v-if="index !== 0"><img class="icon"
                                                          :src="$baseImgUrl + '/extension/home/' + infoData.checkedIconName" />{{infoData.name}}
        </div>
        <div class="content">
            <div
                class="li"
                @click="toPage(item)"
                :key="index"
                v-for="(item,index) in infoData.childrenList"
            >
                <img class="img" :src="$baseImgUrl + `/extension/home/${item.checkedIconName}`" />
                <div>
                    <p class="name">{{item.name}}</p>
                    <p class="describe">{{ roleCodeMap[item.code] }}</p>
                </div>
                <span class="iconfont iconiconrightarrow"></span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AttendanceManage',
    props: {
        infoData: {
            type: Object,
            default: {}
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            roleCodeMap: {
                'ZT.HOME.ATTENDANCE.MONITOR': '实时监督任务完成情况',
                'ZT.HOME.ATTENDANCE.CLOCK': '任务完成/结束签到记录',
                'ZT.HOME.ATTENDANCE.SIGN': '有效加强全员效能监督管理'
            }
        }
    },
    methods: {
        toPage(item) {
            let path = ''
            switch (item.code) {
                case 'ZT.HOME.ATTENDANCE.MONITOR':
                    path = '/extension/attendanceTrack'
                    break
                case 'ZT.HOME.ATTENDANCE.CLOCK':
                    path = '/extension/clockInRecords'
                    break
                case 'ZT.HOME.ATTENDANCE.SIGN':
                    path = '/extension/attendanceRecords'
                    break
            }
            this.$router.push(path).catch(() => {
            })
        }
    }
}
</script>
<style scoped lang="less">
.container {
    margin-bottom: 15px;

    .common-title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        padding: 15px 0 12px 0;
        display: flex;
        align-items: center;

        .icon {
            width: 18px;
            height: 18px;
            margin-right: 6px;
        }
    }

    .content {
        .li {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.06);
            border-radius: 4px;
            position: relative;
            height: 70px;

            .name {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #333333;
            }

            .describe {
                color: #999;
                font-size: 12px;
                margin-top: 5px;
            }

            .img {
                width: 36px;
                height: 36px;
                margin-right: 19px;
                margin-left: 15px;
            }

            .iconfont {
                color: #A9A9A9;
                font-size: 12px;
                position: absolute;
                right: 16px;
            }
        }
    }
}
</style>
