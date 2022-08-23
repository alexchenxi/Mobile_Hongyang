<template>
    <div class="common-page">
        <top-bar :back="true" :title="title"></top-bar>
        <main class="common-page-container common-form-style" :style="{height: pageContainerHeight}">
            <div class="title">基本信息</div>
            <van-form @submit="onSubmit" @failed="onFailed" validate-trigger="onSubmit" :show-error-message="false">
                <van-field :disabled="isDisable" input-align="right" :rules="[{ required: true, message: '请输入任务标题' }]"
                           maxlength="15" v-model="form.name" required label="任务标题" placeholder="请输入任务标题"
                />
                <van-field input-align="right" required :rules="[{ required: true, message: '请选择任务周期' }]"
                           is-link readonly clickable name="picker" :value="timeRange.join('~')" label="任务周期"
                           placeholder="请选择任务周期" @click="showCalendar" />
                <van-field name="isEnableScope" input-align="right" label-width="120" required
                           label="是否有范围要求">
                    <template #input>
                        <van-switch v-model="form.isEnableScope" size="22" />
                    </template>
                </van-field>
                <van-field :disabled="isDisable" input-align="right" type="number" maxlength="4" name="pattern" :rules="[{ required: true, message: '请输入任务指标' },
				           { pattern, message: '任务指标请输入正整数' }]"
                           v-model="form.targetNum" required label="任务指标" placeholder="请输入任务指标" />
                <van-field @click="chooseAddress" :rules="[{ required: true, message: '请选择任务地址' }]"
                           input-align="right" maxlength="20" required v-model="form.location" label="任务地址"
                           readonly is-link placeholder="请选择任务地址" />
                <van-field input-align="right" required v-if="form.isEnableScope"
                           :rules="[{ required: true, message: '请填写任务半径' }]"
                           type="number" maxlength="20" v-model="form.radius" :formatter="formatter" label="任务半径(km)"
                           placeholder="请填写任务半径" />
                <van-field :disabled="isDisable" input-align="right" is-link required readonly clickable name="picker" :value="channelName"
                           label="拓客方式" placeholder="请选择拓客方式" :rules="[{ required: true, message: '请选择拓客方式' }]"
                           @click="tokerPicker= !isDisable ? true : false " />
                <van-field class="textarea-style" input-align="left" label="任务说明" maxlength="100"
                           show-word-limit v-model="form.remark" rows="2" autosize type="textarea" placeholder="请输入任务说明"
                />
                <div class="title">参与人员</div>
                <div class="person-list">
                    <div class="add li" v-if="!isDisable" @click="$router.push('/extension/taskChooseMember')"><span>＋</span></div>
                    <div class="li" v-for="(item,index) in involveUserIdsArray" :key="index">
                        <img :src="item.avatar|| $baseImgUrl + '/default-avatar.png'"></img>
                        <div class="name van-ellipsis">{{item.name}}</div>
                        <div class="delete" v-if="!isDisable" @click="deletePerson(index)"><span></span></div>
                    </div>
                </div>
                <div class="split"></div>
                <div style="height: 60px;width: 100%;"></div>
                <div class="common-footer-bar" :style="{marginBottom: bottomSafe}">
                    <van-button round block type="save" native-type="submit">{{this.$route.query.id ? '保存' : '创建任务'}}
                    </van-button>
                </div>
            </van-form>
        </main>
        <!--  编辑任务时日历组件 (只能修改结束时间 )  -->
        <template v-if="timePicker && $route.query.id">
            <SingleCalendarPicker ref="calendarPicker" @input="confirmTimePicker" @toggle="changeTimePicker" />
        </template>

        <!--  创建任务时日历组件  -->
        <template v-if="timePicker && !$route.query.id">
            <CalendarPicker ref="calendarPicker" @input="confirmTimePicker" @toggle="changeTimePicker"/>
        </template>

        <van-popup v-model="tokerPicker" position="bottom">
            <van-picker show-toolbar title="请选择拓客方式" value-key="channelName" :columns="channelTypeList"
                        @confirm="confirmPicker" :date="timeRange" @cancel="tokerPicker = false" />
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import API from '@/request/api/selfExtension/task'
import commonApi from '@/request/api/commonApi'
import CalendarPicker from '@/components/CalendarPicker'
import SingleCalendarPicker from '@/components/SingleCalendarPicker'

export default {
    name: 'extensionTaskAdd',
    components: {
        TopBar,
        CalendarPicker,
        SingleCalendarPicker
    },
    computed: {
        ...mapGetters(['projectName', 'projectId', 'involveUserIdsArray',
            'keepAliveList', 'addTaskAddress', 'currentRole'
        ])
    },
    data() {
        return {
            tokerPicker: false,
            timePicker: false,
            isDisable: false,
            flag: false,
            form: {
                isEnableScope: true
            },
            channelTypeList: [],
            timeRange: [],
            channelName: '',
            title: '任务创建',
            pattern: /^[1-9]\d*$/
        }
    },
    methods: {
        onFailed(errorInfo) {
            this.$toast(errorInfo.errors[0].message)
        },
        //半径只可输入2位整数 1位小数
        formatter(value) {
            // 过滤输入的数字
            if (value) {
                const str = value.split('.')
                if (str[0].length > 2) {

                    value = str[0].substr(0, 2) + point + str[1]
                }
                const point = str[1] ? '.' : ''
                if (str[1] && str[1].length > 1) {
                    value = str[0] + '.' + str[1].substr(0, 1)
                }

            }
            return value
        },
        confirmPicker(e) {
            this.channelName = e.channelName
            this.form.channelType = e.channelCode
            this.tokerPicker = false
        },
        changeTimePicker(e) {
            this.timePicker = e
        },
        showCalendar() {
            this.timePicker = true
            this.$nextTick(() => {
                this.$refs.calendarPicker.setData(this.timeRange)
            })
        },
        //确认选择时间
        confirmTimePicker(e) {
            this.timePicker = false
            this.timeRange = e
            const data = this.$utils.spliceTime(e)
            this.form.beginTime = data[0]
            this.form.endTime = data[1]
        },
        //删除成员
        deletePerson(index) {
            this.involveUserIdsArray.splice(index, 1)
            this.$store.dispatch('other/setInvolveUserIdsArray', this.involveUserIdsArray)
        },
        getChannelType() {
            commonApi.channelTypeListApi().then((res) => {
                this.channelTypeList = res
            })
        },
        //选择地址
        chooseAddress() {
            this.$router.push('/extension/taskChooseAddress').catch(() => {
            })
        },
        //保存
        onSubmit(result) {
            if (result.errors) {
                this.$toast('请将表单信息填写完整')
            } else {
                this.form.projectId = this.projectId
                this.form.userList = []
                this.involveUserIdsArray.map((item) => {
                    this.form.userList.push(item.userId)
                })
                if (!this.form.userList?.length) {
                    this.$toast('请选择参与人员')
                    return
                }
                if (this.form.userList.length > 99) {
                    this.$toast('参与成员最多99人')
                    return
                }
                let form = JSON.parse(JSON.stringify(this.form))
                form.radius = form.radius * 1000

                if (this.flag) {
                    return
                }
                this.flag = true
                this.$utils.loading()
                API.saveTask(form).then((res) => {
                    this.$store.dispatch('other/setInvolveUserIdsArray', [])
                    this.$toast.clear()
                    //成功
                    this.$toast('保存成功')
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 500)
                }).finally(() => {
                    this.$toast.clear()
                    this.flag = false
                })
            }
        }
    },
    created() {
        this.getChannelType()
        if (this.$route.query.id) {
            this.title = '编辑任务'
            this.isDisable = true
            API.getTaskDetail({
                taskId: this.$route.query.id,
                roleCode: this.currentRole.roleCode
            }).then((res) => {
                this.form = res
                this.timeRange = [res.beginTime.split(' ')[0], res.endTime.split(' ')[0]]
                this.channelName = res.channelTypeName
                this.form.radius = this.form.radius / 1000
                this.$store.dispatch('other/setInvolveUserIdsArray', res.userList || [])
                this.$store.dispatch('other/setAddTaskAddress', {
                    address: this.form.locationName,
                    lon: this.form.longitude,
                    lat: this.form.latitude,
                    name: this.form.location
                })
            })
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('extensionTaskAdd') === -1) {
                array.push('extensionTaskAdd')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.name === 'extensionTaskChooseAddress') {
                if (vm.addTaskAddress.address) {
                    vm.form.location = vm.addTaskAddress.name
                    vm.form.longitude = vm.addTaskAddress.lon
                    vm.form.latitude = vm.addTaskAddress.lat
                    vm.form.locationName = vm.addTaskAddress.address
                }
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList || []
        if (!to.path.includes('/extension/taskChooseMember') && !to.path.includes('/extension/taskChooseAddress')) {
            this.$store.dispatch('other/setInvolveUserIdsArray', [])
            array = array.filter((item) => {
                return item !== 'extensionTaskAdd'
            })
            this.$store.dispatch('other/setAddTaskAddress', {})
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    }
}
</script>
<style scoped lang="less">
.title {
    padding: 15px;
    font-size: 15px;
    color: #999999;
    background: #F0F4FA;
}

.person-list {
    display: flex;
    margin: 15px 3px;
    flex-wrap: wrap;

    .li {
        position: relative;
        margin: 11.5px;

        &.add {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #F8FAFF;
            border: 1px dashed @theme-color;
            font-size: 28px;
            color: @theme-color;
        }

        img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }

        .name {
            font-size: 13px;
            margin-top: 6px;
            text-align: center;
            max-width: 50px;
        }

        .delete {
            position: absolute;
            right: -2px;
            top: 0;
            width: 18px;
            height: 18px;
            text-align: center;
            line-height: 18px;
            background: #eb6877;
            border-radius: 50%;
            color: #fff;
            font-size: 19px;
            display: flex;
            align-items: center;
            justify-content: center;

            span {
                width: 8px;
                height: 1px;
                background: #fff;
                border-radius: 1px;
            }
        }
    }
}

.split {
    width: 100%;
    height: 1px;
    background: #F0F4FA;
}

.common-footer-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 20px;


}
</style>
