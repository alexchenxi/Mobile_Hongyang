<template>
	<div class="common-page">
		<top-bar :title="title" />
		<div class="common-page-container" :style="{height: pageContainerHeight}">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
				<van-list v-model="loading" offset="10" :finished="finished" finished-text="没有更多了" @load="getInfoList">
					<div class="info-box" v-for="(item,index) in infoList" :key="index">
						<div class="info-title" v-if="item.title">{{item.title}}</div>
						<div class="info-content">{{item.content}}</div>
						<div class="info-time">{{item.createAt}}</div>
						<button class="tag-item common-tag-0" @click="copyShaneUrl(item.content)">点击复制</button>
					</div>
				</van-list>
			</van-pull-refresh>
		</div>
	</div>
</template>
<script>
	import API from '@/request/api/my'
	import { mapGetters } from 'vuex'
	import TopBar from '@c/TopBar'
	export default {
		name: 'infoList',
		components: {
			TopBar
		},
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				refreshing: false,
				loading: false,
				finished: false,
				infoList: [],
                title: '消息中心'
			}
		},
		created() {
		    this.title = this.$route.query.title || '消息中心'
        },
		mounted() {},
		methods: {
			 copyShaneUrl(shareLink){
				var input = document.createElement("input");   // 直接构建input
				input.value = shareLink;  // 设置内容
				document.body.appendChild(input);    // 添加临时实例
				input.select();   // 选择实例内容
				document.execCommand("Copy");   // 执行复制
				document.body.removeChild(input); // 删除临时实例
				this.$toast('复制成功')
			},
			getInfoList() {
				let p = {}
				p.pageSize = this.pageSize
				p.pageNum = this.pageNum
				API.messageList(p).then((res) => {
					this.loading = false
					// 全部加载
					if (res.total <= this.pageSize * this.pageNum) {
						this.finished = true
					} else {
						this.pageNum++
					}
					// 刷新
					if (this.refreshing) {
						this.infoList = []
						this.refreshing = false
					}
					this.infoList = this.infoList.concat(res.list)
				})
			},
			onRefresh() {
				// 清空列表数据
				this.finished = false
				this.loading = true
				this.pageNum = 1
				this.getInfoList()
			},
		}
	}
</script>
<style scoped lang="less">
	.common-page-container {
		background: @bg-color;
		.info-box {
			border-radius: 5px;
			padding: 18px 15px;
			background: #FFFFFF;
			margin: 10px 15px;
			position: relative;
			.tag-item{
				position: absolute;
				bottom: 15px;
				right: 15px;
			}
			.info-title {
				font-size: 16px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				line-height: 16px;
				margin-bottom: 15px;
			}
			.info-content {
				font-size: 14px;
				color: #333333;
				line-height: 21px;
				margin-bottom: 12px;
			}
			.info-time {
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #ABABAB;
				line-height: 12px;
			}
		}
	}
</style>
