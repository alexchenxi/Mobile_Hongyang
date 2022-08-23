<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="true" title="打卡"></top-bar>
        </div>
        <div class="common-page-container">
            <div class="contain">
                <div class="title"><span class="require">*</span>上传照片</div>
                <div @click="uploadPic" class="photo">
                    <img class="upload" v-if="data.img" :src="data.img" />
                    <img class="icon" v-else
                         :src="$baseImgUrl + '/extension/attendance/icon-photo.png'" />
                </div>
            </div>
            <div class="contain">
                <p class="tips">说明：每天可以多次签到，可在任务签到记录查看</p>
                <div class="timer" @click="signIn">
                    <div class="text">打卡时间</div>
                    <div class="time">{{currentTime}}</div>
                </div>
                <div class="location"><img
                    :src="$baseImgUrl + '/extension/attendance/icon-location.png'" />{{data.locationName}}
                </div>
                <div class="show-time"></div>
                <div class="address"> 考勤位置：{{address}}</div>
            </div>
            <Map ref="map"></Map>
            <div style="width: 100%;height: 40px;"></div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import commonApi from '@/request/api/commonApi'
import api from '@/request/api/selfExtension/task'
import Map from '@c/Map'

export default {
    name: 'extensionSign',
    components: {
        TopBar,
        Map
    },
    computed: {
        ...mapGetters(['projectId', 'device', 'user', 'currentRole'])
    },
    data() {
        return {
            data: {
                img: '',
                locationName: '',
                longitude: '',
                latitude: '',
                taskId: ''
            },
            currentTime: '',
            address: '',
            mapData: {},
            signAt: '',
            signOut: ''
        }
    },
    created() {
        this.data.taskId = this.$route.query.id
        commonApi.getCurrentTime(this.projectId).then((res) => {
            this.currentTime = res.time.split(' ')[1]
            this.address = res.locationName
            const time = res.time.replace(/\-/g, '/')
            this.timeDiff = new Date() - new Date(time)
            setInterval(this.getDate, 1000)
        })
    },
    mounted() {
        this.getAddress()
    },
    methods: {
        getAddress() {
            return new Promise((resolve, reject) => {
                this.$appMethods.startLocation(this.device).then((res) => {
                    this.data.locationName = res.address
                    this.data.longitude = res.lon
                    this.data.latitude = res.lat
                    this.$refs.map.initMap(res)
                    resolve()
                }, (e) => {
                    console.log(e)
                })
            })
        },
        getDate() {
            const time = new Date(new Date().getTime() - this.timeDiff)
            const hh = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
            const mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
            const ss = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
            this.currentTime = hh + ':' + mm + ':' + ss
        },
        uploadPic() {
            let p = {
                token: localStorage.token,
                url: commonApi.commonUpload(),
                base: commonApi.apiBase()
            }
            if (this.isSAAS) {
                p.companyNo = localStorage.companyNo
            }
            this.$appMethods.uploadCameraWithToken(this.device, p).then(res => {
                try {
                    this.data.img = JSON.parse(res).data
                } catch (e) {
                    this.$toast('图片上传失败')
                }
            }, () => {
                this.$toast('请在APP端操作')
            })
        },
        signIn() {
            if (!this.data.img) {
                this.$toast('现场照片不能为空')
                return
            }
            if (!this.data.locationName) {
                this.$toast('请授权定位功能')
                return
            }
            this.getAddress().then(() => {
                this.data.projectId = this.projectId

                this.$utils.loading()
                this.data.userRoleCode = this.user.roleCode || this.currentRole.roleCode
                api.saveClockApi(this.data).then(() => {
                    this.$toast('打卡成功')
                    this.$router.go(-1)
                })
            })
        }
    }
}
</script>
<style scoped lang="less">
.common-page-container {
    background: #F0F4FA;
    padding: 15px;

    .contain {
        background: #FFFFFF;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        .tips {
            color: #999;
            font-size: 10px;
            margin-top: 10px;
            text-align: center;
        }
        .require {
            color: #EB6877;
            font-size: 12px;
            margin-left: -6px;
        }

        .photo {
            margin-top: 15px;
            width: 90px;
            height: 90px;
            border-radius: 4px;
            border: 1px dotted #EEEEEE;
            display: flex;
            align-items: center;
            justify-content: center;

            .icon {
                width: 24px;
                height: 24px;
            }

            .upload {
                width: 90px;
                object-fit: cover;
            }
        }

        .timer {
            margin: 35px auto 0;
            width: 137px;
            height: 137px;
            background: linear-gradient(270deg, #5F95FA 0%, #4183FF 100%);
            box-shadow: 0px 4px 15px 0px rgba(65, 131, 255, 0.4);
            border-radius: 50%;
            font-size: 18px;
            color: #fff;
            font-weight: 600;
            text-align: center;

            &.disabled {
                background: linear-gradient(360deg, #CCCCCC 0%, #D1D1D1 100%);
                box-shadow: 0px 4px 15px 0px rgba(216, 216, 216, 0.5);
            }

            .text {
                padding-top: 42px;
                margin-bottom: 6px;
            }

            .time {
                font-size: 14px;
            }
        }

        .location {
            display: flex;
            align-items: center;
            margin-top: 20px;
            justify-content: center;

            img {
                width: 10px;
                height: 12px;
                margin-right: 4px;
            }

            color: #333333;
            font-size: 15px;
            padding-bottom: 45px;
            border-bottom: 1px solid #E4E4E4;
        }
        .address {
            display: flex;
            align-items: center;
            margin-top: 20px;
            justify-content: center;
            color: #666666;
            font-size: 12px;
        }
        .show-time {
            display: flex;
            justify-content: space-between;
            .single {
                width: 154px;
                height: 56px;
                background: #F5F6F7;
                border-radius: 4px;
                padding: 11px 0 0 6px;
                box-sizing: border-box;

                .text {
                    font-size: 15px;
                }

                .time {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: #999999;
                }
            }
        }
    }
}
</style>
