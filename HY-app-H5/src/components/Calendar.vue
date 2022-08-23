<template>
    <div class="tab-bar">
        <van-row gutter="20" @click="showCalendar = !disabled">
            <van-col span="9" class="date-left">
                <div class="filter-date-title">开始时间</div>
                <div class="filter-date-content">{{ date[0] ? date[0] : '请选择时间' }}</div>
            </van-col>
            <van-col span="6" class="date-middle">
                <van-divider :hairline="false" class="date-divider" />
            </van-col>
            <van-col span="9" class="date-right">
                <div class="filter-date-title">结束时间</div>
                <div class="filter-date-content">{{ date[1] ? date[1] : '请选择时间' }}</div>
            </van-col>
        </van-row>
        <van-calendar
            v-model="showCalendar"
            :formatter="formatter"
            allow-same-day
            class="custom-calendar"
            :show-mark="false"
            :show-subtitle="false"
            :min-date="new Date(2008, 0, 1)"
            :max-date="maxDate"
            :default-date="defaultDate"
            type="range"
            @confirm="onConfirm"
            @select="onSelect"
            @open="onOpen"
            @opened="calendarOpened"
            @closed="onClose"
            get-container="body"
        >
            <div slot="title">
                <div class="calendar-title">日期选择</div>
                <div class="calendar-clear" @click="handleClear">清空</div>
                <div class="calendar-content">
                    <van-row gutter="20">
                        <van-col span="9" class="date-left">
                            <div class="filter-date-title">开始时间</div>
                            <div class="filter-date-content">{{ currentSelectDate[0] ? currentSelectDate[0] : '请选择时间' }}</div>
                        </van-col>
                        <van-col span="6" class="date-middle">
                            <van-divider :hairline="false" class="date-divider" />
                        </van-col>
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
            showCalendar: false,
            currentSelectDate: [],
            defaultDate: [],
            date: [],
            currentVal: [],
            maxDate: null,
        }
    },
    props: {
        value: {
            type: Array
        },
        defaultValue: {
            type: Array
        },
        isShowMaxDate: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    created() {
        if(this.defaultValue&&this.defaultValue.length>0){
            this.defaultDate = [new Date(this.defaultValue[0]), new Date(this.defaultValue[1])]
            this.currentSelectDate = this.formatDate(this.defaultValue)
            this.date = this.formatDate(this.defaultDate)
            this.$forceUpdate()
        }
        this.maxDate = new Date()

    },
    watch: {
        showCalendar(val) {
            if (val) {
                this.maxDate = new Date()
            }
        }
    },
    methods: {
        // 去除日期底部文字
        formatter(day) {
            let d = day.date.setHours(0, 0, 0, 0)
            let today = new Date().setHours(0, 0, 0, 0)
            day.bottomInfo = ''
            if (d - today == 0) {
                day.topInfo = '今天'
            }
            return day
        },
        setDate(date){
             this.defaultDate = [new Date(date[0]), new Date(date[1])]
                this.currentSelectDate = this.formatDate(date)
                this.date = this.formatDate(date)
                this.$forceUpdate()
        },
        //日期选择
        onSelect(val) {
            this.currentSelectDate = this.formatDate(val)
            if (this.isShowMaxDate) {
                const min = commonMethods.DateToString(val[0])
                const max = this.getNextMonth(min)
                this.maxDate = new Date(max)
            }
        },
        getNextMonth(date) {
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中的月的天数
            var year2 = year;
            var month2 = parseInt(month) + 6;
            if (month2 >= 13) {
                year2 = parseInt(year2) + 1;
                month2 = month2 - 12;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }

            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        },
        //日期选择确认
        onConfirm(val) {
            this.defaultDate = val
            this.date = this.formatDate(val)
            this.currentVal = val
            let date = [commonMethods.DateToString(val[0]), commonMethods.DateToString(val[1])]
            this.$emit('input', date)
            this.$emit('change', date)
            this.showCalendar = false
        },
        formatDate(val) {
            let start = val[0] ? new Date(val[0]).getMonth() + 1 + '月' + new Date(val[0]).getDate() + '日' : null
            let end = val[1] ? new Date(val[1]).getMonth() + 1 + '月' + new Date(val[1]).getDate() + '日' : null
            return [start, end]
        },
        // 设置默认日期
        onOpen() {
            if (this.date.length > 0) {
                this.currentSelectDate = this.date
            } else {
                let date = new Date()
                let defaultDate = this.$utils.spliceTime([commonMethods.DateToString(date), commonMethods.DateToString(date)])
                let _defaultDate = defaultDate.map(item => {
                    return item.replace(/-/g, '/')
                })
                this.defaultDate = [new Date(_defaultDate[0]), new Date(_defaultDate[1])]
                this.currentSelectDate = this.formatDate(_defaultDate)
            }
            this.$emit('toggle', true)
        },
        calendarOpened() {
            const initTop = document.querySelector('.van-calendar__body').scrollTop
            document.querySelector('.van-calendar__body').scrollTop = initTop - 5
        },
        onClose() {
            this.$emit('toggle', false)
        },
        resetDate() {
            this.currentSelectDate = []
            this.defaultDate = null
            this.date = []
            this.$emit('input', this.date)
            this.$emit('change', this.date)
        },
        handleClear() {
            this.currentSelectDate = []
            this.defaultDate = null
            this.date = []
            this.$emit('input', this.date)
            this.$emit('change', this.date)
            this.showCalendar = false
        }
    },
    watch: {
        showCalendar(val) {
            if (val) {
                this.maxDate = new Date()
            }
        }
    }
}
</script>
<style scoped lang="less">
.van-popup--bottom.van-popup--round {
    border-radius: 0;
}

/deep/ .van-calendar__header {
    box-shadow: none;
}

/deep/ .van-popup__close-icon--top-right {
    right: auto;
    left: 16px;
}
.calendar-clear {
    position: absolute;
    top: 26px;
    right: 16px;
    font-size: 14px;
    line-height: 14px;
    color: #999999;
    font-weight: 400;
}
</style>
