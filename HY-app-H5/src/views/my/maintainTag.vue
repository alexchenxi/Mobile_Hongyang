<template>
	<div class="common-page">
		<div class="common-page-top">
			<TopBar title="我的标签" />
		</div>
		<main class="common-page-group"  :style="{ height: pageContainerHeight }">
			<van-cell-group>
				<van-cell  v-for="item in tagList" :key="item.id" :title="item.tagName">
					<template #right-icon>
						<van-icon name="edit"  size="30" color="#1989fa" @click.stop="showDialog(item.id,item.tagName)" />
						<van-icon class="my-delete-icon" name="delete" size="30" color="#ee0a24" @click.stop="deleteDialogTag(item.id)"/>
					</template>
				</van-cell>
			</van-cell-group>
			<van-dialog v-if="show" class="setting-tag-dialog" v-model="show" :title="myTagTitle" show-cancel-button :beforeClose="handleClose" getContainer="body">
				<van-field  v-model.trim="tagName" placeholder="请输入标签内容" show-word-limit maxlength="6" />
			</van-dialog>
			<van-dialog v-if="showDelete" class="setting-tag-dialog" v-model="showDelete"  :title="'删除标签'"  show-cancel-button :beforeClose="handleDeletClose" getContainer="body">
					<p class="clientNumber-p" style="text-align: center;line-height: 40px;margin:5%;">{{tagNumber}}</p>
			</van-dialog>
			<van-button v-show="showAddBtn" plain icon="plus" class="my-add-btn" type="info" size="large"  @click.stop="showAddDialog()">添加标签</van-button>
		</main>
	</div>
</template>
<script>
import TopBar from '@c/TopBar'
import API from '@/request/api/my'
import { mapGetters } from 'vuex'
	export default {
		name: 'maintainTag',
		components: {
			TopBar
		},
		data() {
			return {
				show: false,
				showDelete: false,
				tagName: '',
				showAddBtn:true,
				id: '',
				tagList:[],
				tipFlag:false,
				tagNumber:'',
				flag:''
			}
		},
		created() {
			this.mainMyTag()
		},
		mounted() {
		},
		methods: {
			mainMyTag(){
				API.getMyTag().then(res => {
				  this.tagList = res
					if(this.tagList.length >=15){
							this.showAddBtn = false
					}else{
						this.showAddBtn = true
					}
				})
			},
			showAddDialog(){
				this.myTagTitle ='添加标签'
				this.show = true
				this.id = ''
			},
			showDialog(id,tagName) {
				this.myTagTitle ='修改标签'
				this.show = true
				this.id = id
				this.tagName = tagName
			},
			// 点击删除
		 async deleteDialogTag(id){
             let params = {
                 tagId: id,
                 tipFlag: false
             }
             this.id = id
			 let res = await API.checkDeleteMyTag(params)
             if(res.flag) {
                 this.showDelete = true
                 this.tipFlag = true
                 this.tagNumber = res.msg
             }else {
                 this.$dialog
                     .confirm({
                         title: '',
                         message: '确认删除？'
                     })
                     .then(() => {
                         API.deleteMyTag(params).then(res => {
                             this.showDelete = false
                             this.tipFlag = false
                             this.mainMyTag()
                         })
                     })
                     .catch(() => {
                         // on cancel
                     })
             }
			},
			// 确认删除
			async handleDeletClose(action, done){
				if (action === 'cancel') {
						this.tagName = ''
						return done()
					} else if (action === 'confirm') {
						this.tipFlag = true
						let params = {
							tagId: this.id,
							tipFlag: true
						}
				    await API.deleteMyTag(params)
						this.mainMyTag()
						return done()
					}
			},
			// 确认添加标签
			async handleClose(action, done) {
					if (action === 'cancel') {
							this.tagName = ''
							return done()
					} else if (action === 'confirm') {
							if(!this.tagName) {
									this.$toast('请输入标签内容')
									return done(false)
							}
							try {
								if(this.id != ''){
									this.showDialog(this.id,this.tagName)
									let params = {
										id: this.id,
										tagName: this.tagName
									}
									await API.saveMyTag(params)
										this.mainMyTag()
						  			this.tagName = ''
									}else{
										this.showAddDialog(this.tagName)
										let params = {
											tagName: this.tagName
										}
										await API.saveMyTag(params)
										this.mainMyTag()
										this.tagName = ''
									}
									return done()
							}catch(e) {
								return done(false)
						}
				}
			}
		}
	}
</script>
<style scoped lang="less">
.common-page{
	.common-page-group{
		overflow: auto;
		margin-bottom: 20px;
		.my-delete-icon{
			margin-left: 10px
		}
		.my-add-btn{
			width: 91%;
			margin-left: 4%;
			margin-bottom: 10%;
		}
	}
}

</style>
