<template>
	<div class="common-page">
		<top-bar :title="'修改密码'" :backPath="backPath" @back="goBack"/>
		<div class="common-page-container" :style="{height: pageContainerHeight}">
			<van-form @submit="onSubmit" validate-trigger="onSubmit" @failed="onFailed" :show-error-message="false">
				<van-field type="password" :rules="[{required: true, message: '请输入原始密码'}]"
				 input-align="right" v-model="data.oldPassword" required label="原始密码" placeholder="请输入原始密码" />
				<van-field type="password" :rules="[{ required: true, message: '请输入6-16位新密码' },{ validator: validatorLength, message: '密码长度应为6-16个字符'}]"
				 input-align="right" v-model="data.newPassword" required label="设置新密码" placeholder="请输入新密码" />
				<van-field type="password" :rules="[{ required: true, message: '请再次输入新密码' },{ validator: validatorLength, message: '密码长度应为6-16个字符'}]"
				 input-align="right" v-model="data.rePassword" required label="确认新密码" placeholder="请再次输入新密码" />
                <van-field type="tel" readonly :rules="[{required: true, message: '请输入手机号'}]"
                           input-align="right" v-model="tel" required label="手机号" placeholder="请输入手机号" />
                <van-field
                    v-model="data.verificationCode"
                    required
                    :rules="[{required: true, message: '请输入验证码'}]"
                    center
                    clearable
                    label="验证码"
                    placeholder="请输入验证码"
                >
                    <template #button>
                        <van-button v-if="alreadySend" native-type="button" size="small" round color="#DB0826" plain style="font-size: 12px; width: 84px">{{second}}s</van-button>
                        <van-button v-else native-type="button" @click="getMsgCode" size="small" round color="#DB0826" plain style="font-size: 12px; width: 84px">发送验证码</van-button>
                    </template>
                </van-field>
				<div class="save-button-div">
					<van-button round block type="save" native-type="submit">保存</van-button>
				</div>
			</van-form>
		</div>
	</div>
</template>
<script>
	import API from '@/request/api/my'
	import TopBar from '@c/TopBar'
    import commonApi from '@/request/api/commonApi'
    import { mapGetters } from 'vuex'
	export default {
		name: 'modifyPassword',
		components: {
			TopBar
		},
		computed: {
            ...mapGetters(['user'])
        },
		data() {
			return {
				data: {
					'oldPassword': null,
					'newPassword': null,
					'rePassword': null,
					'verificationCode': null
				},
                alreadySend: false,
                send: true,
				backPath: '',
                validateMessage: '',
                second: 60,
                tel: null
			}
		},
		created() {
			this.backPath = this.$route.query.backPath || ''
            this.tel = this.user.tel
		},
		mounted() {},
		methods: {
			goBack() {
				this.$router.replace({
					path: this.backPath
				}).catch(()=>{})
			},
			onFailed(errorInfo) {
				this.$toast(errorInfo.errors[0].message)
			},
            validatorLength(val) {
                return /^.{6,16}$/.test(val)
            },
            validatorWord(val) {
                return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*~])/.test(val)
            },
            getMsgCode() {
                if (!this.tel || this.tel.length !== 11) {
                    this.$toast('请输入正确的手机号码')
                    return
                }
                commonApi.sendCaptcha({ tel: this.tel }).then(() => {
                    this.alreadySend = true
                    this.send = true
                    this.timer()
                })
            },
            timer() {
                let promise = new Promise((resolve, reject) => {
                    let setTimer = setInterval(
                        () => {
                            this.second = this.second - 1
                            if (this.second <= 0) {
                                this.second = 60
                                this.alreadySend = false
                                this.send = true
                                resolve(setTimer)
                            }
                        }, 1000)
                })
                promise.then((setTimer) => {
                    clearInterval(setTimer)
                })
            },
			onSubmit(values) {
                if(this.data.newPassword === this.data.oldPassword) {
                    this.$toast('新密码不能与旧密码一致，请重新输入')
                    return
                }
				if (this.data.newPassword !== this.data.rePassword) {
					this.$toast('两次输入密码不一致，请重新输入')
					return
				}
				let p = JSON.parse(JSON.stringify(this.data))
				API.passwordUpdate({
					newPassword: this.$utils.md5(p.newPassword),
					oldPassword: this.$utils.md5(p.oldPassword),
                    tel: this.tel,
                    verificationCode: this.data.verificationCode
				}).then((res) => {
					this.$toast('密码修改成功')
					this.$router.push('/login')
				})
			},
		},
	}
</script>
<style scoped lang="less">
	.common-page-container {
		background: @bg-color;
		.van-form {
			.save-button-div {
				padding: 40px 23px 0px;
				background: @bg-color;
			}
			background: #FFF;
		}
	}
</style>
