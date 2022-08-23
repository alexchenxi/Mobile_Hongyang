<template>
	<div class="common-page">
		<div class="common-page-top">
			<top-bar :back="true" title="考勤"></top-bar>
		</div>
		<div class="common-page-container">
			<div class="contain">
				<div class="title"><span class="require">*</span>上传照片</div>
				<div @click="uploadPic" class="photo">
				<img class="upload" v-if="data.img" :src="data.img" /> <img class="icon" v-else
					 :src="$baseImgUrl + '/extension/attendance/icon-photo.png'" /> </div>
			</div>
			<div class="contain">
                <div class="show-time">
                    <div class="single">
                        <div class="text">签到时间</div>
                        <div class="time">
                            <i v-if="data.signType>1" class="iconfont iconqueding"></i>{{data.signType>1?signAt:'未打卡'}}
                        </div>
                    </div>
                    <div class="single">
                        <div class="text">签到时间</div>
                        <div class="time">
                            <i v-if="data.signType>2" class="iconfont iconqueding"></i>{{data.signType>2?signOut:'未打卡'}}</div>
                    </div>
                </div>
                <p class="tips">说明：每天可以多次签到，记录最早一次和最晚一次的签到记录</p>
				<div :class="data.signType==4?'timer disabled':'timer' " @click="signIn">
					<div class="text">{{ data.signType == 4 ? '无法打卡' : '签到时间'}}</div>
					<div class="time">{{currentTime}}</div>
				</div>
				<div class="location"> <img :src="$baseImgUrl + '/extension/attendance/icon-location.png'" />{{data.locationName}}</div>
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
	import api from '@/request/api/selfExtension/attendance'
	import Map from '@c/Map'
	export default {
		name: 'extensionSign',
		components: {
			TopBar,
			Map
		},
		computed: { ...mapGetters(['projectId', 'device', 'user','currentRole']),
		},
		data() {
			return {
				data: {
					signType: 4,
					img: '',
					locationName: '',
					longitude: '',
					latitude: ''
				},
				currentTime: '',
                address: '',
				mapData: {},
				signAt: '',
				signOut: ''
			}
		},
		created() {
			this.getData()
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
            this.checkSign()
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
					})
				})
			},
            // 是否在考勤范围内
            checkSign() {
                this.getAddress().then(() => {
                    if (!this.data.longitude || !this.data.latitude) {
                        this.data.signType = 4
                        this.$toast('请检查手机是否开始定位！')
                        return
                    }
                    const params = {
                        longitude: this.data.longitude || '',
                        latitude: this.data.latitude || '',
                        projectId: this.projectId
                    }
                    api.checkSign(params).then(data => {
                        if (!data) {
                            this.data.signType = 4
                            this.$toast('超出考勤范围不允许打卡！')
                        }
                    })
                })

            },
			getData() {
				api.queryMySign(this.projectId).then((data) => {
					this.data.signType = data.length + 1
					this.signAt = data[0] && data[0].signAt
					this.signOut = data[1] && data[1].signAt
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
				console.log(p)
				if(this.isSAAS) {
					p.companyNo = localStorage.companyNo
				}
				this.$appMethods.uploadCameraWithToken(this.device, p).then(res => {
					try{
						this.data.img = JSON.parse(res).data
					} catch(e) {
						this.$toast('图片上传失败')
					}
				}, () => {
					this.$toast('请在APP端操作')
				})
			},
			signIn() {
				if (!this.data.signType || this.data.signType === 4) return
				if (!this.data.img) {
					this.$toast('现场照片不能为空')
					return
				}
				if (!this.data.locationName) {
					this.$toast('请授权定位功能')
					return
				}

				this.getAddress().then(() => {
					this.$utils.loading()
					this.data.userRoleCode = this.user.roleCode || this.currentRole.roleCode
					this.data.projectId = this.projectId
					api.signSaveApi(this.data).then((data) => {
						if (this.data.signType === 1) {
							this.$appMethods.startTrackWithUserId(this.device, this.user.id)
						} else {
							this.$appMethods.stopTrack(this.device, this.user.id)
						}
						this.$toast('签到成功')
						this.data.img = ""
						this.getData()
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
                display: flex;
                flex-direction: column;
                justify-content: center;
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
                border-bottom: 1px solid #E4E4E4;
				padding-bottom: 45px;
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
                        flex-wrap: nowrap;
						font-size: 12px;
						color: #999999;
					}
				}
			}
            .tips {
                color: #999;
                font-size: 10px;
                margin-top: 10px;
            }
		}
		.iconfont.iconqueding {
			margin-right: 4px;
			font-size: 12px;
			color: @theme-color;
			vertical-align: baseline;
		}
	}
</style>
