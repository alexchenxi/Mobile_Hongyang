<template>
    <div class="common-page">
        <top-bar :back="true" title="完成预销控"></top-bar>
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <van-form validate-trigger="onSubmit" :show-error-message="false" @submit="onSubmit">
                <van-field
                    required
                    v-model="form.salasControlDate"
                    is-link
                    input-align="right"
                    readonly
                    clickable
                    label="预销控结束时间"
                    placeholder="请选择预销控结束时间"
                    @click="showPicker = true"
                />
                <div class="cell-title">预销控原因</div>
                <van-field
                    v-model="form.salesControlReason"
                    maxlength="100"
                    show-word-limit
                    rows="4"
                    autosize
                    type="textarea"
                    placeholder="请输入备注信息..."
                />
                <div class="save-button-div">
                    <van-button round block type="save" native-type="submit">保存</van-button>
                </div>
            </van-form>
        </div>
        <van-popup v-model="showPicker" round position="bottom">
            <van-datetime-picker
                show-toolbar
                type="date"
                title="选择年月日"
                :min-date="currentDate"
                :max-date="maxDate"
                @cancel="showPicker = false"
                @confirm="onConfirmDate"
            />
        </van-popup>
    </div>
</template>
<script>
    import TopBar from '@c/TopBar'
    import { mapGetters } from 'vuex'
    import { commonMethods } from 'movit-utils'
    import API from '@/request/api/caseSystem/housing'
    import moment from 'moment'

    export default {
        name: 'FinishSale',
        components: {
            TopBar
        },
        data() {
            return {
                currentDate: new Date(),
                maxDate: null,
                form: {
                    salesControlReason: '',
                    salasControlDate: ''
                },
                showPicker: false,
                columns: []
            }
        },
        computed: {
            ...mapGetters(['projectId', 'saleRoomIds'])
        },
        created() {
            this.maxDate = new Date(this.addDate(new Date(), 31, '天'))
        },
        mounted() {

        },
        methods: {
            onSubmit() {
                if (!this.form.salasControlDate) {
                    this.$toast('请选择预销控结束时间')
                    return
                }
                this.$utils.loading()
                API.saveSalesControl({
                    ...this.form,
                    projectId: this.projectId,
                    houseIdList: this.saleRoomIds,
                    salesControl: this.$route.query.type === '1'
                }).then(res => {
                    if (!res) return
                    this.$toast('操作成功')
                    this.form.salasControlDate = ''
                    this.form.salesControlReason = ''
                    setTimeout(() => {
                        this.$toast.clear()
                        this.$router.replace({
                            path: '/case/housingDetail',
                            query: {
                                name: this.$route.query.name,
                                stageCode: this.$route.query.stageCode,
                                buildCode: this.$route.query.buildCode
                            },
                        })
                    },1000)
                }).catch(() => {})
            },
            onConfirmDate(value) {
                this.form.salasControlDate = commonMethods.DateToString(value)
                this.showPicker = false
            },
            // 计算增加后的日期
            addDate(date, day, type) {
                let str = ''
                switch (type) {
                    case '天':
                        str = 'days'
                        break
                    case '月':
                        str = 'months'
                        break
                    case '周':
                        str = 'weeks'
                        break
                }
                return moment(date)
                    .add(day, str)
                    .format('YYYY/MM/DD')
            },
        }
    }
</script>
<style scoped lang="less">
    .common-page {
        background: #FFFFFF;

        .common-page-container {
            background: @bg-color;

            .van-form {
                .save-button-div {
                    padding: 40px 23px 0px;
                    background: @bg-color;
                }

                /deep/ .van-field__label {
                    width: 100px;

                    span{
                        font-size: 14px;
                    }
                }

                background: #FFFFFF;

                .cell-title {
                    font-size: 14px;
                    font-weight: 400;
                    color: #333333;
                    line-height: 15px;
                    padding: 18px 15px 0;
                }
            }
        }
    }
</style>
