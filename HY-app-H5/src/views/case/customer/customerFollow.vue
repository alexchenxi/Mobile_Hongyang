<template>
	<div class="common-page">
		<top-bar class="tab-bar" :back="true" title="客户跟进"> </top-bar>
		<div class="top-img-container">
			<div class="customer-info">
				<div class="customer-name">{{customerData.customerName}}
					<!-- <span v-if="!!customerData.customerLevel" class="customer-level">{{customerData.customerLevel}}</span> -->
					<van-popover v-if="!!isLoaded" v-model="isShow" trigger="click" placement="left-start" theme="light">
						<div class="common-pop-style">
							<div><img class="lvl" :src="$baseImgUrl + '/case/customer/client-level-A.png'" alt="">认购/签约客户
							</div>
							<div><img class="lvl" :src="$baseImgUrl + '/case/customer/client-level-B.png'" alt="">高意向客户
							</div>
							<div><img class="lvl" :src="$baseImgUrl + '/case/customer/client-level-C.png'" alt="">想买房，有抗性可挽回
							</div>
							<div><img class="lvl" :src="$baseImgUrl + '/case/customer/client-level-D.png'"
									alt="">有买房想法，跟项目不匹配</div>
							<div><img class="lvl" :src="$baseImgUrl + '/case/customer/client-level-E.png'" alt="">活动客户</div>
						</div>
						<template #reference>
							<div class="customer-level-container">
								<van-icon name="question-o" class="wenhao"/>
								<img :src="$baseImgUrl + '/case/customer/client-level-'+ (customerData.customerLevel || 'default') +'.png'"
									alt="">
							</div>
						</template>
					</van-popover>
				</div>
				<div class="customer-phone" v-if="customerData.customerPhone"><i class="iconfont icondianhua icon-phone"></i>{{customerData.customerPhone}}</div>
				<div v-if="customerData.lastFollowingTime" class="customer-time"><span class="customer-text">最近跟进时间：</span>{{customerData.lastFollowingTime}}</div>
				<div v-if="customerData.lastFollowingStaffName" class="customer-agent"><span class="customer-text">最近跟进人：</span>{{customerData.lastFollowingStaffName}}</div>
			</div>
		</div>
		<div class="form-wrap">
			<van-form @submit="onSubmit" validate-trigger="onSubmit" @failed="onFailed" :show-error-message="false">
				<van-field is-link :rules="[{ required: true, message: '请选择跟进方式' }]" input-align="right" v-model="data.tunnelname"
				 required readonly clickable label="跟进方式" placeholder="请选择跟进方式" @click="showPicker = true" />
				<van-field is-link :rules="[{ required: true, message: '请选择计划跟进时间' }]" input-align="right" v-model="data.appointment"
				 required readonly clickable label="计划跟进时间" placeholder="请选择计划跟进时间" @click="showTimePicker = true" />
				<van-field class="common-textarea-label"  required readonly  label="跟进内容"  />
				<van-field input-align="left"  :rules="[{ required: true, message: '请输入跟进内容' }]"
				 maxlength="100" show-word-limit v-model="data.content" rows="1" autosize type="textarea" placeholder="请输入跟进内容..."
				/>
				<van-field class="common-field-label"  :required="followRules.isNeedAttachmentInVisit"  readonly  label="附件内容"  />
				<!--需要改善-->
				<!--<div class="upload-list">
					<van-uploader :show-upload="attachFileList.length<=2" :after-read="afterRead" v-model="attachFileList"></van-uploader>
				</div>-->
				<!--手写上传-->
				<div class="upload-list">
					<div class="img-container" v-if="attachFileList.length<=2" @click="uploadPic"> <i class="iconfont iconjiahao"></i> </div>
					<div class="img-container" v-for='(item,index) in attachFileList' :key="item">
					<i class="iconfont iconshanchu" @click="deleteAttach(index)"></i> <img @click="preview(index)" :src="item"
						 alt="" /> </div>
				</div>
				<div class="common-footer-bar">
					<van-button round block type="save" native-type="submit">保存</van-button>
				</div>
			</van-form>

		</div>
		<van-popup v-model="showPicker" round position="bottom">
			<van-picker show-toolbar :columns="followList" value-key="label" @cancel="showPicker = false" @confirm="onConfirm"
			/> </van-popup>
		<van-popup v-model="showTimePicker" round position="bottom">
			<van-datetime-picker @cancel="showTimePicker = false" show-toolbar type="date" title="选择年月日" :min-date="currentDate"
			 @confirm="onConfirmDate" /> </van-popup>
	</div>
</template>
<script>
	import API from '@/request/api/caseSystem/customer'
	import APICOMMON from '@/request/api/commonApi'
	import { Uploader } from 'vant';
	import { mapGetters } from 'vuex'
	import TopBar from '@c/TopBar'
	import { commonMethods } from 'movit-utils'
	import { getCustomLevel } from '@/config/commonData'
    let dateTime= new Date();
    dateTime = dateTime.setDate(dateTime.getDate()+1);
	export default {
		name: 'customerFollow',
		components: {
			TopBar,
			[Uploader.name]: Uploader
		},
		computed: { ...mapGetters(['tabData', 'projectId', 'user', 'device', 'currentRole']),
		},
		data() {
			return {
				attachFileList: [],
				currentDate: new Date(dateTime),
				showTimePicker: false,
				showPicker: false,
				data: {
					'content': null
				},
				followList: [],
				customerData: {},
				// 跟进规则
				followRules: {},
				isShow: false,
				isLoaded: false
			}
		},
		created() {
			this.getFollowRule()
		},
		mounted() {
			this.getFollowType()
			this.getFollowInfo()
		},
		methods: {
			//预览图片
			preview(index) {
				this.$utils.previewImageList(this.attachFileList, index)
			},
			//删除图片
			deleteAttach(index) {
				let attachArray = this.$utils.deepCopy(this.attachFileList)
				attachArray.splice(index, 1)
				this.attachFileList = attachArray
			},
			//上传图片
			uploadPic() {
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
						this.attachFileList.push(_res.data)
						this.$forceUpdate()
					} catch(e) {
						this.$toast('图片上传失败')
					}
				})
			},
			//获取上次跟进信息
			getFollowInfo() {
				var p = {}
				if (!!this.$route.query.oppId) {
					p = {
						'oppId': this.$route.query.oppId
					}
				} else if (!!this.$route.query.clueId) {
					p = {
						'clueId': this.$route.query.clueId
					}
				}
                p.roleCode = this.currentRole.roleCode
				API.customerInfoApi(p).then((res) => {
					// res.customerLevel = getCustomLevel(res.customerLevel)
					this.customerData = res
					this.isLoaded = true
				})
			},
			//获取跟进方式
			getFollowType() {
				let p = {
					type: 'follow_type'
				}
				APICOMMON.dictList(p).then((res) => {
					this.followList = res
				})
			},
			// 获取跟进规则
			getFollowRule() {
				API.getCaseFollowRule(this.projectId).then((res) => {
					if(res){
						this.followRules = res
					}
				})
			},
			onFailed(errorInfo) {
				this.$toast(errorInfo.errors[0].message)
			},
			afterRead(val) {
				//获取图片信息后，执行上传操作
				let p = {
					'srcFile': val.file,
					'needWechat': '0'
				}
				APICOMMON.commonUpload(p).then((res) => {
					console.log(res)
				})
			},
			validator(val) {
				return /1\d{10}/.test(val)
			},
			//保存
			onSubmit(values) {
				// 跟进规则中附件必填
				if(this.followRules.isNeedAttachmentInVisit && !this.attachFileList.length){
					this.$toast('请上传附件内容')
					return false
				}
				let p = {
					'oppId': this.$route.query.oppId,
					'clueId': this.$route.query.clueId,
					'projectId': this.projectId,
					'images': this.attachFileList,
					'content': this.data.content,
					'followSource': 0, //跟进来源，0-案场跟进；1-登记客户跟进；2-自渠跟进；
					'followType': this.data.tunnelid,
					'nextFollowTime': this.data.nextFollowTime
				}
                this.$toast.loading({
                    message: '保存中...',
                    forbidClick: true
                })
				API.followRecordAdd(p).then((res) => {
					//成功
                    this.$toast.clear()
					this.$toast('跟进成功')
					this.$router.go(-1)
				})
			},
			//确定方式
			onConfirm(value) {
				this.data.tunnelname = value.label
				this.data.tunnelid = value.value
				this.showPicker = false
			},
			//确定日期
			onConfirmDate(value) {
				this.data.appointment = commonMethods.DateToString(value)
				this.data.nextFollowTime = this.$utils.spliceTime(commonMethods.DateToString(value))
				this.showTimePicker = false
			},
		},
	}
</script>
<style scoped lang="less">
	.iconjiahao {
		font-size: 2rem;
		color: #D8D8D8;
	}

	/deep/ .van-uploader__upload {
		margin-bottom: 0;
	}
	.tab-bar {
		position: absolute;
		width: calc(100% - 30px);
		top: 0;
		z-index: 3;
	}
	.common-page {
		overflow: hidden;
		/deep/ .van-field__label{
			width: 120px;
		}
		.top-img-container {
			position: absolute;
			top: 0;
			z-index: 2;
			background: url("@{baseImgUrl}/bg_grey.png");
			background-size: 100% 100%;
			img {
				height: 100%;
				width: 100%;
			}
			height: 250px;
			width: 100%;
			.customer-level-container {
				margin-left: 40px;
				position: relative;
				width: 40px;
				height: 40px;
				// margin-right: 23px;
				// margin-top: 4px;

				>img {
					width: 100%;
					height: 100%;
				}

				.wenhao {
					color: #999 !important;
					position: absolute;
					top: 0px;
					right: -4px;
				}
			}
			.customer-info {
				color: #333;
				position: absolute;
				bottom: 25px;
				left: 15px;
				width: calc( 100% - 30px);
				.customer-name {
					.common-flex();
					font-size: 1.2rem;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					margin-bottom: 15px;
					justify-content: space-between;
					.customer-level {
						margin-left: 0.53rem;
						width: 3.67rem;
						height: 1.067rem;
                        color: @theme-color;
						background: rgba(219, 8, 38, 0.1);
						border-radius: 1px;
						font-size: 0.73rem;
						line-height: 1.067rem;
						text-align: center;
					}
				}
				.customer-phone {
					font-size: 1.2rem;
					font-family: DINAlternate-Bold, DINAlternate;
					font-weight: bold;
					margin-bottom: 15px;
                    .iconfont {
                        color: @theme-color;
                    }
				}
				.customer-time, .customer-agent {
					font-size: 0.93rem;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					.customer-text {
						opacity: 0.7;
					}
				}
				.customer-agent {
					margin-bottom: 0;
					margin-top: 10px;
				}
			}
		}
		background: #ffffff;
		.form-wrap {
			background: @bg-color;
			margin-top: 250px;
			height: calc(100% - 250px);
			overflow: auto;
			.van-form {
				background: #FFF;
				margin-bottom: 15px;
				.cell-title {
					font-size: 1rem;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					line-height: 1rem;
					padding: 18px 0 15px 15px;
				}
			}
			.common-footer-bar {
				padding-top: 25px;
				background: @bg-color;
				margin-bottom: 40px;
			}
		}
		.upload-list {
			.common-flex();
			margin: 0 15px 0;
			padding-bottom: 10px;
			.img-container {
				position: relative;
				width: 80px;
				height: 80px;
				border-radius: 4px;
				border: 1px solid #E5E5E5;
				margin-right: 8px;
				overflow: hidden;
				.common-flex-center();
				.iconshanchu {
					padding: 5px;
					position: absolute;
					top: 0;
					right: 0;
					color: #D8D8D8;
				}
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			.img-container:last-child {
				margin-right: 0;
			}
			.uploaded-img {
				width: 80px;
				height: 80px;
				border-radius: 4px;
				border: 1px solid #E5E5E5;
				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.icon-phone {
	 margin-right: 4px;
	}

	.common-pop-style {
		>div {
			margin-bottom: 2px;
		}

		.lvl {
			width: 20px;
			height: 20px;
			margin-right: 7px;
		}
	}
</style>
