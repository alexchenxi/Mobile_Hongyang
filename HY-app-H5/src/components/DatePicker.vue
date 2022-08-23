<template>
    <div class="tab-bar">
        <van-row gutter="20">
            <van-col span="9" class="date-left" @click="openPicker(0)">
                <div class="filter-date-title">开始时间</div>
                <div class="filter-date-content">{{ dateContent[0] ? dateContent[0] : '请选择时间' }}</div>
            </van-col>
            <van-col span="6" class="date-middle">
                <van-divider :hairline="false" class="date-divider" />
            </van-col>
            <van-col span="9" class="date-right" @click="openPicker(1)">
                <div class="filter-date-title">结束时间</div>
                <div class="filter-date-content">{{ dateContent[1] ? dateContent[1] : '请选择时间' }}</div>
            </van-col>
        </van-row>
        <van-popup v-model="showPop" position="bottom" get-container="body">
            <van-datetime-picker v-model="currentDate" :type="type" title="选择年月" :min-date="minDate" :max-date="maxDate" :formatter="formatter" @cancel="cancel" @confirm="confirm" />
        </van-popup>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { commonMethods } from 'movit-utils'
export default {
    name: 'Calendar',
    data() {
        return {
            showPop: false,
            dateContent: [],
            currentDate: new Date(),
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentIndex: 0,
            date: []
        }
    },
    props: {
        type: {
            type: String,
            default: 'date'
        },
        value: {
            type: Array
        }
    },
    mounted() {},
    methods: {
        openPicker(index) {
            this.showPop = true
            this.$emit('toggle', true)
            this.currentIndex = index
        },
        formatter(type, val) {
            if (type === 'year') {
                return `${val}年`
            } else if (type === 'month') {
                return `${val}月`
            }
            return val
        },
        cancel() {
            this.showPop = false
            this.$emit('toggle', true)
        },
        confirm(val) {
            this.showPop = false
            this.$emit('toggle', true)
            let date = this.formatDate(val)
            this.dateContent[this.currentIndex] = date
            switch(this.type) {
                case 'date':
                    this.date[this.currentIndex] = commonMethods.DateToString(val)
                    break
                case 'year-month':
                    this.date[this.currentIndex] = this.dateToMonth(val)
            }
            this.$emit('input', this.date)
            this.$emit('change', this.date)
        },
        formatDate(val) {
            let date = new Date(val).getFullYear() + '年' + (new Date(val).getMonth() + 1) + '月'
            return date
        },
        dateToMonth(date) {
            // 日期对象 转 日期字符串 -- Date => 2020-01
            const year = date.getFullYear()
            const month = date.getMonth() + 1

            const formatNumber = n => {
                n = n.toString()
                return n[1] ? n : '0' + n
            }
            let str = [year, month].map(formatNumber).join('-')
            return str
        },
        resetDate() {
            this.date = []
            this.currentIndex = 0
            this.dateContent = []
            this.currentDate = new Date()
            this.$emit('input', this.date)
        }
    }
}
</script>
<style scoped lang="less"></style>
