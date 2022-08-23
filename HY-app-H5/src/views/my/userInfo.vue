<template>
	<div class="common-page">
		<top-bar title="个人资料" />
		<div class="common-page-container" :style="{height: pageContainerHeight}">
			<div class="nav-section">
				<van-cell class="avatar-cell" title="头像">
					<!--调用app方法上传-->
					<template #right-icon>
						<div class="img-container"><img v-if="!!user.avatar" @click="appMethod" class="avatar-img" :src="user.avatar" alt="" /><img
							 v-else @click="appMethod" class="avatar-img" :src="$baseImgUrl + '/default-avatar.png'" alt=""
							/></div>
						<van-icon name="arrow" color="#ccc" /> </template>
					<!--input file上传-->
					<!--<template #right-icon>
						<div class="img-container"><img class="avatar-img" src="https://hwcloud-obs.jinke.com/2020%2F12%2F24%2F9b5db793-2910-41fd-a136-bf5a839241f2.JPG"
							 alt="" /><input @change="fileChange" class="file-input" type="file" accept="image/jpeg, image/jpg, image/png"/></div>
						<van-icon name="arrow" /> </template>-->
				</van-cell>
				<van-cell title="用户名称" :value="user.name"></van-cell>
				<van-cell title="账号" :value="user.account"></van-cell>
				<van-cell title="用户手机号" :value="user.tel"></van-cell>
				<!--<van-button @click='modify'>修改(测试用)</van-button>-->
			</div>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import API from '@/request/api/my'
	import APICOMMON from '@/request/api/commonApi'
	import { Uploader } from 'vant';
	import TopBar from '@c/TopBar'
	export default {
		name: 'userInfo',
		components: {
			TopBar,
			[Uploader.name]: Uploader
		},
		computed: { ...mapGetters(['user', 'device']),
		},
		data() {
			return {}
		},
		created() {},
		mounted() {},
		methods: {
			//修改我的头像
			modify() {
				let p = {
					'avatarUrl': 'https://hwcloud-obs.jinke.com/2020%2F12%2F24%2F9b5db793-2910-41fd-a136-bf5a839241f2.JPG'
				}
				API.avatarUpdate(p).then((res) => {
					this.$toast('头像更新成功')
					//更新store user 的头像
					this.user.avatar =
						'https://hwcloud-obs.jinke.com/2020%2F12%2F24%2F9b5db793-2910-41fd-a136-bf5a839241f2.JPG'
					this.$store.dispatch('user/setUserInfo', this.user)
				})
			},
			//APP方法上传
			appMethod() {
				let p = {
					'token': localStorage.token,
					'url':  APICOMMON.commonUpload(),
					'base': APICOMMON.apiBase()
				}
				if(this.isSAAS) {
					p.companyNo = localStorage.companyNo
				}
				this.$appMethods.UploadImage(this.device, p).then((res) => {
					try {
						let _res = JSON.parse(res)
						let p = {
							'avatarUrl': _res.data
						}
						API.avatarUpdate(p).then((res) => {
							this.$toast('头像更新成功')
							//更新store user 的头像
							this.user.avatar = _res.data
							this.$store.dispatch('user/setUserInfo', this.user)
						})
					} catch(e) {
						this.$toast('图片上传失败')
        			}
				})
			},
		},
	}
</script>
<style scoped lang="less">
	.common-page-container {
		background-color: @bg-color;
		.nav-section {
			font-size: 15px;
			margin-top: 10px;
			.avatar-cell {
				align-items: center;
			}
			.van-cell__value {
				color: @header-text-color;
			}
			.img-container {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				margin-right: 10px;
				overflow: hidden;
				position: relative;
			}
			.avatar-img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			.file-input {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 0;
			}
		}
	}
</style>
