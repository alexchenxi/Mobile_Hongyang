<template>
    <div class="common-page">
        <TopBar title="客户来访问卷" />
        <main class="common-page-container">
            <div class="tip" v-if="isShow">
                <i class="iconfont icontishi2" />
                <span>请如实填写问卷信息，如不填写，无法完成接待！</span>
                <i class="iconfont icondel" @click="hideTip" />
            </div>
            <section class="customer-container">
                <van-form ref="form" validate-trigger="onSubmit" input-align="right" :show-error-message="false"
                          @submit="onSubmit" @failed="onFailed">
                    <div v-for="(item, index) in baseInfoData" :key="item.id" class="form-item">
<!--                        <van-field-->
<!--                            v-if="item.type === 'TEXT'"-->
<!--                            v-model="item.itemValues[0].code"-->
<!--                            :required="item.required"-->
<!--                            maxlength="18"-->
<!--                            input-align="right"-->
<!--                            :name="item.key"-->
<!--                            readonly-->
<!--                            :label="(index +1)+ '、' + item.name + '?'"-->
<!--                            :placeholder="'请输入' + item.name"-->
<!--                            :rules="item.required ? [{ required: true, message: '请输入' + item.name }] : []"-->
<!--                        />-->
                        <!-- 单选框 -->
                        <van-field
                            label-width="260px"
                            v-if="item.type === 'RADIO'"
                            :required="item.required"
                            :rules="item.required ? [{ required: true, message: '请选择' + item.name }] : []"
                            name="radio"
                            :label="(index +1)+ '、' + item.name + '?'"
                            @click="selectIndex = index"
                        >
                            <template #input>
                                <van-radio-group v-model="item.itemValues[0].code" direction="horizontal"
                                                 :name="item.key" @change="changeRadio">
                                    <van-radio v-for="(subItem, subIndex) in item.optionalValueSet" :key="subIndex"
                                               :name="subItem.code">
                                        {{ subItem.name }}
                                    </van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                    </div>
                </van-form>
                <div style="height: 80px"></div>
            </section>
        </main>
        <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" native-type="submit" v-debounce="[()=>saveInfo()]">提交</van-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import API from '@/request/api/caseSystem/home'

export default {
    name: 'questionnaire',
    components: {
        TopBar
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList']) },
    mounted() {
        this.type = this.$route.query.type
        this.customerId = this.$route.query.customerId
        this.oppId = this.$route.query?.oppId
        this.whiteBoardId = this.$route.query?.whiteBoardId
        this.getQuestionnaire(this.oppId)
    },
    data() {
        return {
            selectIndex: 0,
            customerId: '',
            oppId: '',
            whiteBoardId: '',
            isShow: true,
            item: {},
            problemTypeMap: {
                '0': 'RADIO',
                '1': '',
                '2': 'TEXT'
            },
            baseInfoData: []
        }
    },
    methods: {
        saveInfo() {
            this.$refs['form'].submit()
            const records = []
            this.baseInfoData.forEach(item => {
                if (item.type !== 'TEXT') {
                    records.push(...item.submitValues)
                }
            })

            let flag = false
            records.forEach(item => {
                if (!item.optionId) {
                    flag = true
                    return
                }
            })
            if (flag) {
                this.$toast('请填写完整问卷')
                return
            }

            const params = {
                projectId: this.projectId,
                records
            }

            // 首访/复访客户接待
            if (this.oppId) {
                params.oppId = this.oppId
                API.saveQuestionnaire(params).then(res => {
                    this.$toast(res || '接待成功')
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 2000)
                })
            } else {
                // 白板客户接待
                params.whiteboardId = this.whiteBoardId
                API.submitWhiteboardQuestionnaire(params).then(res => {
                    this.$toast(res || '接待成功')
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 1000)
                })
            }
        },
        hideTip() {
            this.isShow = false
        },
        getQuestionnaire(oppId) {
            API.getQuestionnaire({ oppId }).then(res => {
                // 过滤来访次数
                let result = (res || []).filter(item => item.problemDescription !== '来访次数')
                // 处理返回数据
                this.baseInfoData = result.map((item,index) => {
                    const formatChild = (item.moppQuestionnaireOptionsDTOList || []).map(col => {
                        return {
                            ...col,
                            id: col.id,
                            code: col.id,
                            name: col.optionValue
                        }
                    })
                    return {
                        itemId: item.id,
                        isDefault: true,
                        itemValues: [{ code: item.visitTimes || '', name: null }],
                        submitValues: [{ questionnaireGroupId: '', questionnaireId: '', optionId: '' }],
                        key: item.id,
                        name: item.problemDescription,
                        optionalValueSet: formatChild,
                        required: true,
                        type: this.problemTypeMap[item.problemType]
                    }
                })
            })
        },
        //单选改变赋值
        changeRadio(value) {
            //设置selectIndex之后才能获取到当前数据源加了延迟
            setTimeout(() => {
                var selectData = this.baseInfoData[this.selectIndex]
                selectData.optionalValueSet.map(item => {
                    if (item.code === value) {
                        selectData.itemValues[0].code = item.code
                        selectData.itemValues[0].name = item.name
                        selectData.submitValues[0].questionnaireGroupId = item.questionnaireGroupId
                        selectData.submitValues[0].questionnaireId = item.questionnaireId
                        selectData.submitValues[0].optionId = item.id
                    }
                })
                this.$forceUpdate()
            }, 0)
        },
        onSubmit(result) {
        },
        onFailed(errorInfo) {
            this.$toast(errorInfo.errors[0].message)
        }
    },
    watch: {}
}
</script>
<style scoped lang="less">
.common-page-container {
    background: #F6F8FA;
}

.tip {
    display: flex;
    align-items: center;
    height: 36px;
    background: rgba(250, 181, 95, 0.10);
    font-size: 14px;
    color: #FAB55F;

    .icontishi2 {
        margin: 0 6px 0 15px;
        font-size: 14px;
    }

    .icondel {
        font-size: 24px;
    }
}

.customer-container {
    margin: 15px;
    border-radius: 7px;
    overflow: hidden;

    /deep/ .van-cell {
        flex-direction: column;
    }

    /deep/ .van-radio-group--horizontal {
        width: 100%;
        flex-wrap: nowrap;
    }

    /deep/ .van-field__control--right {
        text-align: left;
    }

    /deep/ .van-field__value {
        margin-top: 20px;
    }

    /deep/ .van-radio--horizontal {
        width: 50%;
    }
}

/deep/ .head-container {
    .head-c {
        position: absolute;
        width: 100%;
        z-index: 1;
    }

    .head-l,
    .head-r {
        position: relative;
        z-index: 2;
    }
}

/deep/ .common-fix-bottom {
    padding: 0 18px;
}
</style>
