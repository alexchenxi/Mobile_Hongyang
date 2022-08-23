<template>
    <van-dropdown-menu v-if="formatFilterList"  :class="isFilter?'is-active':''"  active-color="#DB0826" :close-on-click-outside="!closeOutside">
        <van-dropdown-item ref="filter" :title="title" :get-container="getContainer" @open="open">
            <div class="filter-container-top">
                <template v-for="(item, index) in formatFilterList">
                    <div v-if="item.type === 'check'" :key="index" class="filter-section">
                        <div class="filter-title">{{ item.name }}</div>
                        <div class="filter-content">
                            <CheckButton
                                v-model="filterValue[item.field]"
                                :list="item.list"
                                :type="item.checkType"
                                :check-type="checkType"
                                :need-check-all="needCheckAll"
                                :fixed-width="item.fixedWidth"
                                :defaultValue="checkButtonDefaultValue"
                                @change="checkChange"
                            />
                        </div>
                        <div v-if="item.more" class="filter-more" @click="showMore">查看更多</div>
                    </div>
                    <div v-if="item.type === 'date'&&!item.notShow" :key="index" class="filter-section">
                        <div class="filter-title">{{ item.name }}</div>
                        <div class="filter-content">
                            <Calendar ref="calendar" :defaultValue="item.defaultValue" :isShowMaxDate="isShowMaxDate"
                                      v-model="date" @toggle="toggleShowCalendar" @change="getDate($event, item)" />
                        </div>
                    </div>
                    <div v-if="item.type === 'range'" :key="index" class="filter-section">
                        <div class="filter-title">{{ item.name }}</div>
                        <div class="filter-content">
                            <van-row gutter="20">
                                <van-col span="9" class="date-left">
                                    <van-field v-model="filterValue[item.fieldName[0]]" type="number" />
                                </van-col>
                                <van-col span="6" class="date-middle">
                                    <van-divider :hairline="false" class="date-divider" />
                                </van-col>
                                <van-col span="9" class="date-right">
                                    <van-field v-model="filterValue[item.fieldName[1]]" input-align="right" type="number" />
                                </van-col>
                            </van-row>
                        </div>
                    </div>
                    <div v-if="item.type === 'input'" :key="index" class="filter-section">
                        <div class="filter-title">{{ item.name }}</div>
                        <div class="filter-content custom-field">
                            <van-field v-model="filterValue[item.field]" :placeholder="item.placeholder" label="" />
                        </div>
                    </div>
                </template>
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
import MyAPI from '@/request/api/my'
export default {
    name: 'FilterSection',
    components: {
        CheckButton,
        Calendar,
    },
    props: {
        filterList: Array,
        beforeClose: Function,
        container: String,
        title: {
            type: String,
            default: '筛选',
        },
        needCheckAll: {
            type: Boolean,
            default: true,
        },
        isShowMaxDate: {
            type: Boolean,
            default: false,
        },
        checkType: {
            type: String,
            default: 'checkbox',
        },
        checkButtonDefaultValue: {
            type: Number | String
        }
    },
    data() {
        return {
            filterValue: {},
            closeOutside: false,
            date: [],
            tagList: [],
            isFilter:false
        }
    },
    computed: {
        ...mapGetters(['currentRole']),
        formatFilterList() {
            if(this.filterList && this.filterList.length) {
                this.filterList.map((item)=>{
                    if(item.type==='date'&&item.defaultValue){
                        let date = this.$utils.spliceTime(item.defaultValue)
                        this.filterValue[item.dateName[0]] = date[0]
                        this.filterValue[item.dateName[1]] =date[1]
                    }
                })
                this.filterList.forEach(item => {
                    if(item.field === 'tagNames') {
                        item.list = this.tagList
                    }
                })
            }
            return this.filterList
        }
    },
    created(){},
    mounted() {
        if (this.currentRole.roleCode === 'ST_SALES') {
            this.getTags()
        }
    },
    methods: {
        //重置
        resetFilter() {
            this.filterValue = this.$options.data().filterValue
            if (this.$refs.calendar) {
                this.$refs.calendar.map((ele) => {
                    ele.resetDate()
                })
            }
            this.judgeIsFilter()
            this.$emit('reset', this.filterValue)
        },
        hide() {
            this.$refs.filter.toggle(false)
        },
        //判断是否有筛选条件
        judgeIsFilter(){
             this.isFilter=false
            //  先判断筛选条件是否展示有些是隐藏筛选
             let notJudgeArray=[]
             this.filterList.map((item)=>{
                 if(item.notShow){
                     if(item.dateName){
                        notJudgeArray=notJudgeArray.concat(item.dateName)
                     }else{
                         notJudgeArray.push(item.field)
                    }
                 }
             })
             for(var key in this.filterValue){
                 if(notJudgeArray.indexOf(key)===-1){
                     if(Array.isArray(this.filterValue[key])){
                        if(this.filterValue[key].length>0){
                            this.isFilter=true
                        }
                    }else{
                        if(this.filterValue[key]){
                            this.isFilter=true
                        }
                    }
                 }

            }
        },
        //筛选
        handleFilter() {
            this.judgeIsFilter()
            this.$emit('change', this.filterValue)
            if (typeof this.beforeClose === 'function') {
                this.beforeClose(this.hide)
            } else {
                this.hide()
            }
        },
        getContainer() {
            return document.querySelector(this.container)
        },
        async getTags() {
            let result = await MyAPI.getMyTag()
            this.tagList = result.map(item => {
                return {
                    label: item.tagName,
                    value: item.tagName
                }
            })
        },
        //关闭日历时不触发下拉菜单的关闭
        toggleShowCalendar(val) {
            this.closeOutside = val
        },
        getDate(e, item) {
            if (e.length > 0) {
                let date = this.$utils.spliceTime(e)
                this.filterValue[item.dateName[0]] = date[0]
                this.filterValue[item.dateName[1]] = date[1]
            } else {
                this.filterValue[item.dateName[0]] = ''
                this.filterValue[item.dateName[1]] = ''
            }
        },
        open() {
            this.$nextTick(() => {
                let element = document.querySelector('.filter-container-top')
                element.scrollTop = 0
                // this.filterList.forEach(async item => {
                //     if(item.field === 'tagNames'&&item.list.length===0) {
                //         item.list = await this.getTags()
                //     }
                // })
            })
        },
        checkChange(val) {
            this.$emit('checkChange', val)
        },
        showMore() {
            this.$emit('showMore')
        }
    }
}
</script>

<style lang="less" scoped>
    .filter-section {
        .filter-more {
            width: 100%;
            color: @theme-color;
            border: 1px dashed @theme-color;
            text-align: center;
            height: 30px;
            line-height: 30px;
        }

    }
      .is-active  /deep/ .van-ellipsis{
            color:#DB0826;
        }
</style>
