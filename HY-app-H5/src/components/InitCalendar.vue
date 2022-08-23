<template>
    <div class="tab-bar">
        <van-row gutter="20">
            <span>查询时间</span>
            <div class="filter-date-content">{{ date[0] ? date[0] : '请选择时间' }} 至 {{ date[1] ? date[1] : '请选择时间' }}</div>
        </van-row>
      
    </div>
</template>
<script>
export default {
    name: 'InitCalendar',
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
        

    },
    methods: {
        setDate(date){
             this.defaultDate = [new Date(date[0]), new Date(date[1])]
                this.currentSelectDate = this.formatDate(date)
                this.date = this.formatDate(date)
                this.$forceUpdate()
        },
        formatDate(val) {
            let start = val[0] ? new Date(val[0]).getFullYear()+'年'+(new Date(val[0]).getMonth() + 1) + '月' + new Date(val[0]).getDate() + '日' : null
            let end = val[1] ? new Date(val[0]).getFullYear()+'年'+(new Date(val[1]).getMonth() + 1) + '月' + new Date(val[1]).getDate() + '日' : null
            return [start, end]
        },
     
    }
}
</script>
<style scoped lang="less">
    .van-row{
        display: flex;
        font-size: 16px;
        color:@theme-color;
        align-items: center;
        .filter-date-content{
            margin-left: 10px;
            font-size: 16px;
            color:@theme-color;
        }
    }
</style>
