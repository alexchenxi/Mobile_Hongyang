<template>
	<van-calendar v-model="showPicker" :formatter="formatter" allow-same-day :show-mark="false"
	 :show-subtitle="false" :min-date="new Date()" :max-date="endMaxFun()" :default-date="defaultDate" type="range"
	 @confirm="onConfirm" @select="onSelect" @open="onOpen" @closed="onClose" get-container="body">
		<div slot="title">
			<div class="calendar-title">日期选择</div>
			<div class="calendar-content">
				<van-row gutter="20">
					<van-col span="9" class="date-left">
						<div class="filter-date-title">开始时间</div>
						<div class="filter-date-content">{{ currentSelectDate[0] ? currentSelectDate[0] : '请选择时间' }}</div>
					</van-col>
					<van-col span="6" class="date-middle">
						<van-divider :hairline="false" class="date-divider" /> </van-col>
					<van-col span="9" class="date-right">
						<div class="filter-date-title">结束时间</div>
						<div class="filter-date-content">{{ currentSelectDate[1] ? currentSelectDate[1] : '请选择时间' }}</div>
					</van-col>
				</van-row>
			</div>
		</div>
	</van-calendar>
	</div>
</template>
<script>
	import { mapState } from 'vuex'
	import { commonMethods } from 'movit-utils'
	export default {
		name: 'Calendar',
		data() {
			return {
				currentSelectDate: [],
				defaultDate: [],
				date: [],
				currentVal: [],
				showPicker: true,
                lastMonth: ''
			}
		},
		props: {},
		mounted() {
            // this.lastMonth = this.$utils.curLastMonth()
        },
		methods: {
			// 去除日期底部文字
			formatter(day) {
				let d = day.date.setHours(0, 0, 0, 0);
				let today = new Date().setHours(0, 0, 0, 0);
				day.bottomInfo = ''
				if (d-today==0) {
					day.topInfo = '今天'
				}
				return day
			},
			//日期选择
			onSelect(val) {
				this.currentSelectDate = this.formatDate(val)
			},
			//手动设置时间
			setData(data) {
				this.currentSelectDate = data
				let _defaultDate = data.map(item => {
					return item.replace(/-/g, '/')
				})
				this.defaultDate = [new Date(_defaultDate[0]), new Date(_defaultDate[1])]
			},
            endMaxFun() {
                return new Date(
                    Number(new Date().getFullYear()),
                    Number(new Date().getMonth() + 1),
                    0
                );
            },
			//日期选择确认
			onConfirm(val) {
				this.defaultDate = val
				this.date = this.formatDate(val)
				this.currentVal = val
				let date = [commonMethods.DateToString(val[0]), commonMethods.DateToString(
					val[1])]
				this.$emit('input', date)
			},
			formatDate(val) {
				let start = val[0] ? new Date(val[0]).getMonth() + 1 + '月' + new Date(val[0])
					.getDate() + '日' : null
				let end = val[1] ? new Date(val[1]).getMonth() + 1 + '月' + new Date(val[1])
					.getDate() + '日' : null
				return [start, end]
			},
			// 设置默认日期
			onOpen() {
				if (this.date && this.date.length > 0) {
					this.currentSelectDate = this.date
				} else {
					let date = new Date()
					let defaultDate = this.$utils.spliceTime([commonMethods.DateToString(date),
						commonMethods.DateToString(date)
					])
					let _defaultDate = defaultDate.map(item => {
						return item.replace(/-/g, '/')
					})
					this.defaultDate = [new Date(_defaultDate[0]), new Date(_defaultDate[1])]
					this.currentSelectDate = this.formatDate(_defaultDate)
				}
				this.$emit('toggle', true)
			},
			onClose() {
				this.$emit('toggle', false)
			}
		},
	}
</script>
<style scoped lang="less">

</style>
