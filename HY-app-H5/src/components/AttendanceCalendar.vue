<template>
    <div class="calendar_body" ref="calendarBody">
        <div class="calendar_week" ref="weekTitle">
            <div :key="item" class="calendar_item" v-for="item in calendarWeek">
                <p class="calendar_week_day">{{ item }}</p>
            </div>
        </div>
        <div :style="{ height: `${calendarGroupHeight}px` }" @touchend="touchEnd" @touchmove.stop.prevent="touchMove"
             @touchstart="touchStart" class="calendar_group" ref="calendar">
            <ul :style="{ transform: `translate3d(${-translateIndex * 100}%, 0, 0)` }">
                <li
                    :key="i"
                    :style="{ transform: `translate3d(${(i - 1 + translateIndex + (isTouching ? touch.x : 0)) * 100}%, 0, 0)`, transitionDuration: `${isTouching ? 0 : transitionDuration}s` }"
                    class="calendar_group_li"
                    v-for="(item, i) in calendarOfMonthShow"
                >
                    <div
                        :style="{ transform: `translate3d(0, ${calendarY}px, 0)`, transitionDuration: `${isTouching || isWeekSwitch ? 0 : transitionDuration}s` }"
                        class="calendar_group_li__content">
                        <div :key="i + j" @click="clickCalendarDay(date)" class="calendar_item" ref="calendarItem"
                             v-for="(date, j) in item">
                            <p
                                :class="{
                                    calendar_day_checked: isCheckedDay(date),
                                    calendar_day_today: isToday(date),
                                    calendar_day_not: !isShowWeek && !isToday(date) && isNotCurrentMonthDay(date, i),
                                }"
                                class="calendar_day"
                                ref="calendarDay"
                            >
                                <span class="solar">{{ date.day }}</span>
                                <span :style="{'background': markDateColor(date)}" class="calendar_dot"></span>
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- ???????????? -->
        <div class="drop-arrow">
            <van-divider :style="{ borderColor: '#F0F2F5' }">
                <van-image width="30" height="7" :src="$baseImgUrl + '/extension/attendance/icon-open.png'"
                           v-if="isShowWeek" @click="showMonth" />
                <van-image width="30" height="7" :src="$baseImgUrl + '/extension/attendance/icon-close.png'"
                           @click="showWeek" v-else />
            </van-divider>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Calendar',
    props: {
        defaultDate: {
            type: Date,
            default() {
                return new Date()
            }
        },
        weekStart: {
            type: String,
            default: 'Monday'
        },
        //?????????????????????
        isShowWeekView: {
            type: Boolean,
            default: true
        },
        //?????????????????????
        markDate: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            yearOfCurrentShow: new Date().getFullYear(), //???????????????????????????
            monthOfCurrentShow: new Date().getMonth(), //???????????????????????????
            yearOfToday: new Date().getFullYear(), //?????????????????????
            monthOfToday: new Date().getMonth(), //?????????????????????
            dayOfToday: new Date().getDate(), //?????????????????????
            weekArray: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], //????????????
            calendarWeek: ['???', '???', '???', '???', '???', '???', '???'], //?????????????????????
            calendarOfMonth: [], //????????????????????????
            calendarOfMonthShow: [], //????????????????????????
            calendarDaysTotalLength: 42, //???????????????????????????  6???7???
            lastMonthYear: null, //??????????????????
            lastMonth: null, //??????????????????
            nextMonthYear: null, //??????????????????
            nextMonth: null, //??????????????????
            checkedDate: {}, //??????????????????
            weekStartIndex: 0, //??????????????????????????????index
            translateIndex: 0, //?????????????????????????????????
            transitionDuration: 0.3, //??????????????????
            touch: {
                x: 0,
                y: 0
            }, //??????touch???????????????????????????????????????
            isTouching: false, //??????????????????
            isWeekSwitch: false, //??????????????????
            calendarGroupHeight: 0,
            calendarWeekTitleHeight: 0,
            calendarBarHeight: 0,
            calendarItemHeight: 0,
            touchStartPositionX: null, //????????????x?????????
            touchStartPositionY: null, //???????????????y?????????
            isShowWeek: false, //???????????????????????????????????????
            calendarY: 0, //???????????????Y????????????
            selectedDayIndex: 0, //????????????????????????????????????????????????
            lastWeek: [], //??????????????????
            nextWeek: [], //??????????????????
            isLastWeekInCurrentMonth: false, //?????????????????????????????????
            isNextWeekInCurrentMonth: false, //?????????????????????????????????
            markDateColorObj: [] // ??????????????????????????????????????????
        }
    },
    mounted() {
        this.weekStartIndex = this.weekArray.indexOf(this.weekStart.toLowerCase())
    },
    watch: {
        weekStartIndex() {
            this.calculateCalendarOfThreeMonth(this.checkedDate.year, this.checkedDate.month)
        },
        defaultDate: {
            handler(val) {
                if (!(val instanceof Date)) {
                    throw new Error(`The calendar component's defaultDate must be date type!`)
                }
                this.$set(this.checkedDate, 'day', val.getDate())
                this.calculateCalendarOfThreeMonth(val.getFullYear(), val.getMonth())
                this.initDom()
            },
            immediate: true
        },
        checkedDate: {
            handler(val) {
                let date = {
                    month: val.month + 1,
                    date: val.year + '-' + this.fillNumber(val.month + 1) + '-' + this.fillNumber(val.day)
                }
                this.$emit('confirm', date)
            },
            deep: true,
            immediate: true
        },
        markDate: {
            handler(val) {
                this.markDateColorObj = []
                if (val) {
                    val.forEach((item) => {
                        if (item.num >= 2) {
                            item.color = '#47cfae'
                            this.$set(this.markDateColorObj, this.formatDate(item.signDate, 'yyyy/mm/dd'), item.color)
                        } else {
                            item.color = '#ff6034'
                            this.$set(this.markDateColorObj, this.formatDate(item.signDate, 'yyyy/mm/dd'), item.color)
                        }
                    })
                }
            },
            deep: true,
            immediate: true
        },
        isShowWeekView: {
            handler(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.showWeek()
                    })
                } else {
                    this.$nextTick(() => {
                        this.showMonth()
                    })
                }
            },
            immediate: true
        },
        calendarGroupHeight(val) {
            this.$emit('height', val + this.calendarWeekTitleHeight + this.calendarBarHeight)
        },
        currentMonthRange: {
            handler(val, oldVal) {
                if (val && JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    this.$emit('currentmonthrange', val)
                }
            },
            immediate: true
        }
    },
    computed: {
        showTodayButton: function() {
            return !this.isToday(this.checkedDate)
        },
        checkedDateStr: function() {
            if (this.yearOfToday === this.checkedDate.year) {
                return this.formatDate(new Date(this.checkedDate.year, this.checkedDate.month, this.checkedDate.day), 'mm???dd??? ???D')
            } else {
                return this.formatDate(new Date(this.checkedDate.year, this.checkedDate.month, this.checkedDate.day), 'yyyy???mm???dd??? ???D')
            }
        },
        currentMonthRange: function() {
            let temp = this.calendarOfMonth[1][0]
            let from = new Date(temp.year, temp.month, temp.day)
            let to = new Date(from)
            to.setDate(to.getDate() + 42)
            return { from, to }
        }
    },
    methods: {
        initDom() {
            //???????????????dom
            this.$nextTick(() => {
                this.calendarItemHeight = this.$refs.calendarItem && this.$refs.calendarItem[0].offsetHeight
                this.calendarWeekTitleHeight = this.$refs.weekTitle.offsetHeight

                let calendarItemGroup = this.$refs.calendarItem
                calendarItemGroup.forEach((item) => {
                    item.style.height = `${ this.calendarItemHeight }px`
                })
                this.calendarGroupHeight = this.calendarItemHeight * 6
            })
        },
        today() {
            //??????
            this.$set(this.checkedDate, 'day', new Date().getDate())
            this.yearOfCurrentShow = this.yearOfToday
            this.monthOfCurrentShow = this.monthOfToday
            this.calculateCalendarOfThreeMonth()

            if (this.isShowWeek) {
                this.isWeekSwitch = true
                this.showWeek()
            }
        },
        //??????????????????????????????????????????????????? flag  -1:???????????????????????????   0:??????????????????????????????????????????  1:???????????????????????????
        calculateCalendarOfThreeMonth(year = new Date().getFullYear(), month = new Date().getMonth()) {
            let day = this.checkedDate.day
            if (day > 30 || (day > 28 && month === 1)) {
                this.$set(this.checkedDate, 'day', this.daysOfMonth(year)[month])
            }
            this.$set(this.checkedDate, 'year', year)
            this.$set(this.checkedDate, 'month', month)

            this.lastMonthYear = month === 0 ? year - 1 : year //??????????????????
            this.lastMonth = month === 0 ? 11 : month - 1 //??????????????????
            this.nextMonthYear = month === 11 ? year + 1 : year //??????????????????
            this.nextMonth = month === 11 ? 0 : month + 1 //??????????????????

            let firstMonth = this.calculateCalendarOfMonth(this.lastMonthYear, this.lastMonth)
            let secondMonth = this.calculateCalendarOfMonth(year, month)
            let thirdMonth = this.calculateCalendarOfMonth(this.nextMonthYear, this.nextMonth)
            this.calendarOfMonth = []
            this.calendarOfMonth.push(firstMonth, secondMonth, thirdMonth)
            this.calendarOfMonthShow = JSON.parse(JSON.stringify(this.calendarOfMonth))
        },
        calculateCalendarOfMonth(year = new Date().getFullYear(), month = new Date().getMonth()) {
            //????????????????????????
            let calendarOfCurrentMonth = []

            let lastMonthYear = month === 0 ? year - 1 : year //??????????????????
            let lastMonth = month === 0 ? 11 : month - 1 //??????????????????
            let nextMonthYear = month === 11 ? year + 1 : year //??????????????????
            let nextMonth = month === 11 ? 0 : month + 1 //??????????????????

            //?????????????????????????????????????????????????????????????????????????????????????????????
            let dayOfWeek = this.getDayOfWeek(year, month)
            let lastMonthDays = this.daysOfMonth(year)[lastMonth] //?????????????????????
            if (dayOfWeek < this.weekStartIndex) {
                dayOfWeek = 7 - this.weekStartIndex + dayOfWeek
            } else {
                dayOfWeek -= this.weekStartIndex
            }
            for (let i = 0; i < dayOfWeek; i++) {
                calendarOfCurrentMonth.push({
                    year: lastMonthYear,
                    month: lastMonth,
                    day: lastMonthDays - (dayOfWeek - 1 - i)
                })
            }

            //????????????
            for (let i = 0; i < this.daysOfMonth(year)[month]; i++) {
                calendarOfCurrentMonth.push({
                    year: year,
                    month: month,
                    day: i + 1
                })
            }

            //????????????????????????????????????????????????6???7???
            let fillDays = this.calendarDaysTotalLength - calendarOfCurrentMonth.length
            for (let i = 0; i < fillDays; i++) {
                calendarOfCurrentMonth.push({
                    year: nextMonthYear,
                    month: nextMonth,
                    day: i + 1
                })
            }

            return calendarOfCurrentMonth
        },
        daysOfMonth(year) {
            return [31, 28 + this.isLeap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        },
        isLeap(year) {
            //?????????????????????
            return year % 4 == 0 ? (year % 100 != 0 ? 1 : year % 400 == 0 ? 1 : 0) : 0
        },
        getDayOfWeek(year = new Date().getFullYear(), month = new Date().getMonth(), day = 1) {
            //?????????????????????????????????
            let dayOfMonth = new Date(year, month, day) //??????????????????day???
            let dayOfWeek = dayOfMonth.getDay() //?????????day???????????????(??????[0-6]???????????????0??????????????????1???????????????)
            return dayOfWeek
        },
        clickCalendarDay(date) {
            //????????????????????????
            if (!date) return

            this.$set(this.checkedDate, 'year', date.year)
            this.$set(this.checkedDate, 'month', date.month)
            this.$set(this.checkedDate, 'day', date.day)

            if (date.month === this.lastMonth && date.year === this.lastMonthYear) {
                this.getLastMonth()
            }
            if (date.month === this.nextMonth && date.year === this.nextMonthYear) {
                this.getNextMonth()
            }

            if (this.isShowWeek) {
                this.isTouching = true
                this.showWeek()
            }
        },
        isToday(date) {
            //????????????????????????
            return this.yearOfToday === date.year && this.monthOfToday === date.month && this.dayOfToday === date.day
        },
        isCheckedDay(date) {
            //?????????????????????????????????
            return this.checkedDate.year === date.year && this.checkedDate.month === date.month && this.checkedDate.day === date.day
        },
        isNotCurrentMonthDay(date, index) {
            //???????????????
            let dateOfCurrentShow = this.calendarOfMonth[index][15] //????????????????????????????????????
            return date.year !== dateOfCurrentShow.year || date.month !== dateOfCurrentShow.month
        },
        touchStart(event) {
            //??????????????????????????????
            this.touchStartPositionX = event.touches[0].clientX
            this.touchStartPositionY = event.touches[0].clientY
            this.touch = {
                x: 0
            }
            this.isTouching = true
        },
        touchMove(event) {
            //????????????????????????
            let moveX = event.touches[0].clientX - this.touchStartPositionX
            let moveY = event.touches[0].clientY - this.touchStartPositionY
            if (Math.abs(moveX) > Math.abs(moveY)) {
                this.touch = {
                    x: moveX / this.$refs.calendar.offsetWidth,
                    y: 0
                }
            } else {
                this.touch = {
                    x: 0,
                    y: moveY / this.$refs.calendar.offsetHeight
                }
            }
        },
        touchEnd() {
            //??????touch????????????
            this.isTouching = false
            this.isWeekSwitch = false
            if (Math.abs(this.touch.x) > Math.abs(this.touch.y) && Math.abs(this.touch.x) > 0.2) {
                if (this.touch.x > 0) {
                    this.getLastMonth()
                    if (this.isShowWeek) {
                        this.isWeekSwitch = true
                        this.getLastWeek()
                    }
                } else if (this.touch.x < 0) {
                    this.getNextMonth()
                    if (this.isShowWeek) {
                        this.isWeekSwitch = true
                        this.getNextWeek()
                    }
                }
            }
            if (Math.abs(this.touch.y) > Math.abs(this.touch.x) && Math.abs(this.touch.y * this.$refs.calendar.offsetHeight) > 50) {
                // if (this.touch.y > 0 && this.isShowWeek) {
                //     this.showMonth();
                // } else if (this.touch.y < 0 && !this.isShowWeek) {
                //     this.showWeek();
                // }
            } else {
                this.touch = {
                    x: 0,
                    y: 0
                }
            }
        },
        showMonth() {
            //???????????????????????????
            this.isShowWeek = false
            this.calendarY = 0
            this.calendarGroupHeight = this.calendarItemHeight * 6

            this.isLastWeekInCurrentMonth = false
            this.isNextWeekInCurrentMonth = false

            this.calculateCalendarOfThreeMonth(this.checkedDate.year, this.checkedDate.month)
        },
        showWeek() {
            //???????????????????????????
            this.isShowWeek = true
            let daysArr = []
            this.calendarOfMonth[1].forEach((item) => {
                daysArr.push(item.day)
            })
            let dayIndexOfMonth = daysArr.indexOf(this.checkedDate.day)
            if (this.checkedDate.day > 15) {
                dayIndexOfMonth = daysArr.lastIndexOf(this.checkedDate.day)
            }
            let indexOfLine = Math.ceil((dayIndexOfMonth + 1) / 7)
            let lastLine = indexOfLine - 1
            this.calendarY = -(this.calendarItemHeight * lastLine)

            this.calendarGroupHeight = this.calendarItemHeight

            let currentWeek = []
            let sliceStart = lastLine * 7
            let sliceEnd = sliceStart + 7
            this.isLastWeekInCurrentMonth = false
            currentWeek = this.calendarOfMonth[1].slice(sliceStart, sliceEnd)
            for (let i in currentWeek) {
                if (currentWeek[i].day === this.checkedDate.day) {
                    this.selectedDayIndex = i
                }
            }

            let firstDayOfCurrentWeek = currentWeek[0]
            let lastDayOfCurrentWeek = currentWeek[6]
            if (lastDayOfCurrentWeek.day < firstDayOfCurrentWeek.day && lastDayOfCurrentWeek.month === this.checkedDate.month) {
                this.lastWeek = this.calendarOfMonth[0].slice(21, 28)
            } else {
                if (firstDayOfCurrentWeek.day === 1) {
                    this.lastWeek = this.calendarOfMonth[0].slice(28, 35)
                } else {
                    this.lastWeek = this.calendarOfMonth[1].slice(sliceStart - 7, sliceEnd - 7)
                    if (this.lastWeek[this.selectedDayIndex].month === this.checkedDate.month) {
                        this.isLastWeekInCurrentMonth = true
                    }
                }
            }

            this.isNextWeekInCurrentMonth = false
            if (lastDayOfCurrentWeek.day < firstDayOfCurrentWeek.day && lastDayOfCurrentWeek.month !== this.checkedDate.month) {
                this.nextWeek = this.calendarOfMonth[2].slice(7, 14)
            } else {
                if (lastDayOfCurrentWeek.day === this.daysOfMonth(lastDayOfCurrentWeek.year)[lastDayOfCurrentWeek.month]) {
                    this.nextWeek = this.calendarOfMonth[2].slice(0, 7)
                } else {
                    this.nextWeek = this.calendarOfMonth[1].slice(sliceStart + 7, sliceEnd + 7)
                    if (this.nextWeek[this.selectedDayIndex].month === this.checkedDate.month) {
                        this.isNextWeekInCurrentMonth = true
                    }
                }
            }
            this.calendarOfMonthShow[0].splice(sliceStart, 7, ...this.lastWeek)
            this.calendarOfMonthShow[2].splice(sliceStart, 7, ...this.nextWeek)
        },
        getLastWeek() {
            //???????????????
            this.checkedDate = this.lastWeek[this.selectedDayIndex]
            this.showWeek()
        },
        getNextWeek() {
            //???????????????
            this.checkedDate = this.nextWeek[this.selectedDayIndex]
            this.showWeek()
        },
        getLastMonth() {
            //?????????????????????
            this.translateIndex += 1

            if (!this.isLastWeekInCurrentMonth) {
                this.yearOfCurrentShow = this.lastMonthYear
                this.monthOfCurrentShow = this.lastMonth
                this.calculateCalendarOfThreeMonth(this.yearOfCurrentShow, this.monthOfCurrentShow)
            }
        },
        getNextMonth() {
            //?????????????????????
            this.translateIndex -= 1

            if (!this.isNextWeekInCurrentMonth) {
                this.yearOfCurrentShow = this.nextMonthYear
                this.monthOfCurrentShow = this.nextMonth
                this.calculateCalendarOfThreeMonth(this.yearOfCurrentShow, this.monthOfCurrentShow)
            }
        },
        markDateColor(date) {
            //??????????????????????????????
            let dateString = `${ date.year }/${ this.fillNumber(date.month + 1) }/${ this.fillNumber(date.day) }`
            let color = this.markDateColorObj[dateString]
            if (color) {
                return color
            } else {
                return undefined
            }
        },
        fillNumber(val) {
            //??????10???????????????0
            return val > 9 ? val : '0' + val
        },
        dateFormat(dateArr) {
            // ??????????????????
            dateArr.forEach((date, index) => {
                dateArr[index] = this.formatDate(date, 'yyyy/mm/dd')
            })
            return dateArr
        },
        formatDate(time, format = 'yyyy???mm???dd??? ???D') {
            let date = time ? new Date(time) : new Date()
            let year = date.getFullYear(),
                month = date.getMonth() + 1, //????????????0?????????
                day = date.getDate(),
                week = date.getDay()
            let preArr = Array.apply(null, Array(10)).map(function(elem, index) {
                return '0' + index
            }) ////???????????????10????????? ????????? 00 01 02 03

            let newTime = format
                .replace(/yyyy/g, year)
                .replace(/mm/g, preArr[month] || month)
                .replace(/dd/g, preArr[day] || day)
                .replace(/D/g, this.calendarWeek[week])
            return newTime
        }
    }
}
</script>

<style lang="less" scoped>
.blue {
    width: 4px;
    height: 4px;
    background: #47cfae;
    border-radius: 50%;
}

.red {
    width: 4px;
    height: 4px;
    background: #db0826;
    border-radius: 50%;
}

.calendar_body {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.calendar_body p,
.calendar_body span {
    letter-spacing: 1px;
}

.calendar_week {
    width: 100%;
    .common-flex();
    background: #ffffff;
    color: #979797;
    z-index: 2;
}

.calendar_week_day {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 500;
    .common-flex-center();
}

.calendar_group {
    overflow: hidden;
    transition: height .3s;
    -webkit-transition: height .3s;
    background: white;
}

.calendar_group ul {
    height: 100%;
}

.calendar_group_li {
    list-style: none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 100%;
}

.calendar_group_li__content {
    height: 100%;
    width: 100%;
    .common-flex();
    flex-wrap: wrap;
    will-change: transform;
}

.calendar_item {
    width: 14.13333335%;
    .common-flex-center();
    flex-direction: column;
    z-index: 1;
}

.calendar_day {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    .common-flex-center();
    flex-direction: column;
}

.calendar_day_today {
    color: @header-text-color;
    background-color: rgba(95, 149, 250, 0.1);
}

.calendar_day_checked {
    background-color: #4586FE;
}

.solar {
    font-size: 14px;
    font-weight: 500;
    color: @header-text-color;
	margin-top: 3px;
}

.calendar_day_checked .solar {
    color: white;
}

.calendar_day_not .solar {
    color: #E2E4E5;
}

.calendar_dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin: 2px;
	margin-top: 0;
	background: #FFF;
}

.checkedDate {
    margin: auto;
}

</style>
