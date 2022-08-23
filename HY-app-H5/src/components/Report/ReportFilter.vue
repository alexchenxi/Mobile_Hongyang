<template>
    <van-dropdown-menu active-color="#DB0826" :close-on-click-outside="!closeOutside">
        <van-dropdown-item ref="filter" :title="filterTitle" :get-container="getContainer" @open="open">
            <div class="filter-container-top">
                <div class="filter-section">
                    <div class="filter-title">时间选择</div>
                    <div class="filter-content">
                        <CheckButton
                            ref="dateCheckButton"
                            v-model="filterValue.dateType"
                            :default-value="checkDefault"
                            :list="checkList"
                            checkType="radio"
                            :needCheckAll="false"
                            @change="dateCheckChange"
                            fixedWidth
                        />
                    </div>
                </div>
                <div class="filter-section" v-if="dateType === 'month'">
                    <div class="filter-content">
                        <DatePicker ref="datePicker" v-model="filterValue.date" type="year-month" @toggle="toggleShowCalendar" @change="getPickerDate($event)" />
                    </div>
                </div>
                <div class="filter-section" v-if="dateType === 'date'">
                    <div class="filter-content">
                        <Calendar ref="calendar" v-model="filterValue.date" @toggle="toggleShowCalendar" @change="getDate($event)" />
                    </div>
                </div>
            </div>
            <div class="filter-container-bottom">
                <van-button block type="cancel" @click="resetFilter">重置</van-button>
                <van-button block type="filter" native-type="submit" @click="handleFilter">确认</van-button>
            </div>
        </van-dropdown-item>
    </van-dropdown-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import CheckButton from '@/components/CheckButton'
import Calendar from '@/components/Calendar'
import DatePicker from '@/components/DatePicker'
export default {
    props: {
        beforeClose: Function,
        container: String,
        title: {
            type: String,
            default: '筛选'
        },
        range: Number,
        dateType: String,
        checkList: Array,
        checkDefault: Array | Number | String
    },
    components: {
        CheckButton,
        Calendar,
        DatePicker
    },
    name: 'FilterSection',
    data() {
        return {
            filterValue: {
                dateType: null,
                date: []
            },
            closeOutside: false,
            filterTitle: ''
        }
    },
    computed: {
        ...mapGetters(['currentRole'])
    },
    mounted() {
        this.filterTitle = this.title
        this.filterValue.dateType = this.checkDefault
    },
    methods: {
        //重置
        resetFilter() {
            this.filterValue = this.$options.data().filterValue
            if (this.$refs.calendar) {
                this.$refs.calendar.resetDate()
            }
            if (this.$refs.datePicker) {
                this.$refs.datePicker.resetDate()
            }
            if (this.$refs.dateCheckButton) {
                this.$refs.dateCheckButton.resetData()
            }
            this.filterValue.dateType = this.checkDefault
            this.$emit('change', this.filterValue)
        },
        hide() {
            this.$refs.filter.toggle(false)
        },
        //筛选
        handleFilter() {
            if (this.dateType === 'month' && !this.filterValue.dateType) {
                if (this.filterValue.date.length === 0) {
                    this.$toast('请选择或填写时间')
                    return false
                } else if (!this.filterValue.date[0]) {
                    this.$toast('请填写开始时间')
                    return false
                } else if (!this.filterValue.date[1]) {
                    this.$toast('请填写结束时间')
                    return false
                } else if (this.filterValue.date.length === 2) {
                    let date = this.$utils.deepCopy(this.filterValue.date)
                    let _date = date.map(item => {
                        item = item.replace(/-/g, '/')
                        return item = new Date(item).getTime()
                    })
                    if(_date[0] > _date[1]) {
                        this.$toast('开始时间不能大于结束时间')
                        return false
                    } else {
                        this.confirm()
                    }
                }
            } else {
                this.confirm()
            }
        },
        confirm() {
            if(this.range&&this.filterValue.date.length===2){
                if((new Date( this.filterValue.date[1].split(' ')[0]).getTime()-new Date( this.filterValue.date[0].split(' ')[0]).getTime())>(this.range-1)*24*60*60*1000){
                      this.$toast('时间范围筛选超过31天')
                      return
                }
            }
          
            this.$emit('change', this.filterValue)
            if (typeof this.beforeClose === 'function') {
                this.beforeClose(this.hide)
            } else {
                this.hide()
            }
            if (this.filterValue.date && this.filterValue.date.length > 0) {
                if (this.dateType === 'month') {
                    this.filterTitle = this.formatDate(this.filterValue.date[0]) + '-' + this.formatDate(this.filterValue.date[1])
                } else if (this.dateType === 'date') {
                    this.filterTitle = this.formatDate(this.filterValue.date[0].split(' ')[0]) + '-' + this.formatDate(this.filterValue.date[1].split(' ')[0])
                }
            }
        },
        getContainer() {
            return document.querySelector(this.container)
        },
        getPickerDate(e) {
            this.filterValue.date = e
            // 填写自定义时间，清除日期类型选择
            if (this.$refs.dateCheckButton) {
                this.$refs.dateCheckButton.clearData()
            }
            this.filterTitle = this.title
        },
        open() {
            this.$nextTick(() => {
                let element = document.querySelector('.filter-container-top')
                element.scrollTop = 0
            })
        },
        //选择日期类型，清除自定义时间
        dateCheckChange(val) {
            if (val) {
                if (this.$refs.datePicker) {
                    this.$refs.datePicker.resetDate()
                }
                if (this.$refs.calendar) {
                    this.$refs.calendar.resetDate()
                }
                this.filterTitle = val.label
            }
        },
        formatDate(date) {
            let res = date.replace(/-/, '.')
            return res
        },
        //关闭日历时不触发下拉菜单的关闭
        toggleShowCalendar(val) {
            this.closeOutside = val
        },
        getDate(e) {
            if (e.length > 0) {
                let date = this.$utils.spliceTime(e)
                this.filterValue.date = date
                // 选择日期类型，清除自定义时间
                if (this.$refs.dateCheckButton) {
                    this.$refs.dateCheckButton.clearData()
                }
            } else {
                // this.filterValue.date = []
                // if (this.$refs.dateCheckButton) {
                //     this.$refs.dateCheckButton.resetData()
                // }
            }
            this.filterTitle = this.title
        }
    }
}
</script>

<style lang="less" scoped></style>
