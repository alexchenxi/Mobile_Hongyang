<template>
    <div class="common-page">
        <top-bar :back="true" title="补卡申请" />
        <main class="common-page-middle common-form-style" :style="{ height: pageMiddleHeight }">
            <van-form ref="form" class="form" validate-trigger="onSubmit" @submit="onSubmit" @failed="onFailed">
                <van-field v-model="form.signDate" input-align="right" readonly required label="补卡班次" placeholder="请输入补卡班次" />
                <van-field input-align="right" name="radio" label="补卡类型" required :rules="[{ required: true, message: '请选择补卡类型' }]">
                    <template #input>
                        <van-radio-group v-model="form.signType" direction="horizontal" @change="changeRadio">
                            <van-radio name="1">上班卡</van-radio>
                            <van-radio name="2">下班卡</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-model="form.signAt" is-link input-align="right" readonly required clickable label="补卡时间" placeholder="请选择补卡时间" @click="showTimePicker = true" />
                <van-field
                    v-model="form.reason"
                    class="textarea-style"
                    input-align="left"
                    label="补卡理由"
                    maxlength="50"
                    show-word-limit
                    required
                    rows="2"
                    autosize
                    type="textarea"
                    placeholder="请输入补卡理由"
                />
            </van-form>
            <div class="contain">
                <div class="title">上传照片</div>
                <div @click="uploadPic" class="photo">
                    <img class="upload" v-if="form.img" :src="form.img" /> <img class="icon" v-else
                                                                                :src="$baseImgUrl + '/extension/attendance/icon-photo.png'" /> </div>
            </div>
            <van-popup v-model="showTimePicker" round position="bottom">
                <van-datetime-picker  v-model="currentTime" show-toolbar type="time" title="选择时间" :min-hour="0" :max-hour="23" @cancel="showTimePicker = false" @confirm="onConfirmDate" />
            </van-popup>
        </main>
        <div v-if="showFixedFooter" class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" @click="submitData">提交</van-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import commonApi from '@/request/api/commonApi'
import API from '@/request/api/selfExtension/attendance'
import { commonMethods } from 'movit-utils'
export default {
    name: 'applyForCard',
    components: {
        TopBar,
    },
    data() {
        return {
            tokerPicker: false,
            form: {
                signDate: '',
                signType: '1',
                img: null,
                reason: '',
                signAt: null,
            },
            currentTime: '09:00',
            // 表单禁用
            formDisabled: false,
            showTimePicker: false,
            flag: false
        }
    },
    computed: { ...mapGetters(['projectName', 'user', 'currentRole', 'projectId', 'device']) },
    created() {
        this.form.signDate = this.$route.query.queryDate
    },
    methods: {
        //   获取定位，报备截客
        getLocation() {
            return new Promise((resolve, reject) => {
                this.$appMethods.startLocation(this.device).then(
                    (res) => {
                        if (res.lon) {
                            this.form.x = res.lon
                            this.form.y = res.lat
                            resolve()
                        } else {
                            reject()
                        }
                    },
                    () => {
                        reject()
                    }
                )
            })
        },
        changeRadio(val) {
            if (val === '2') {
                this.currentTime = '18:00'
            }else {
                this.currentTime = '09:00'
            }
        },
        onConfirmDate(value) {
            console.log('时间', value)
            this.form.signAt = value
            this.showTimePicker = false
        },
        onFailed(err) {
            this.$toast(err.errors[0].message)
        },
        submitData() {
            this.$refs.form.submit()
        },
        onSubmit() {
            this.form.projectId = this.projectId
            if (this.flag) {
                return
            }
            if (!this.form.signAt) {
                this.$toast('请选择补卡时间')
                return
            }
            if (!this.form.reason) {
                this.$toast('请输入补卡理由')
                return
            }
            const params = {
                ...this.form,
                userRoleCode: this.currentRole.roleCode,
                signAt: `${this.form.signDate} ${this.form.signAt}:00`
            }
            this.$utils.loading()
            this.flag = true
            API.signApplication(params)
                .then(() => {
                    this.$toast('申请成功')
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 500)
                })
                .finally(() => {
                    this.flag = false
                })
        },
        uploadPic() {
            let p = {
                token: localStorage.token,
                url: commonApi.commonUpload(),
                base: commonApi.apiBase()
            }
            console.log(p)
            this.$appMethods.UploadImage(this.device, p).then(res => {
                try{
                    this.form.img = JSON.parse(res).data
                } catch(e) {
                    this.$toast('图片上传失败')
                }
            }, () => {
                this.$toast('请在APP端操作')
            })
        },
    },
}
</script>
<style scoped lang="less">
.common-page-middle {
    background: #f6f8fa;
    padding: 15px;
}
/deep/ .van-button--save {
    background: #5F95FA;
}
/deep/ .van-radio__icon--checked .van-icon {
    background: #5F95FA;
}
.contain {
    padding: 15px;
    margin-top: 15px;
    background: #FFFFFF;
    border-radius: 8px;
    .require {
        color: #EB6877;
        font-size: 12px;
        margin-left: -6px;
    }
    .photo {
        margin-top: 15px;
        width: 90px;
        height: 90px;
        border-radius: 4px;
        border: 1px dotted #EEEEEE;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
            width: 24px;
            height: 24px;
        }
        .upload {
            width: 90px;
            object-fit: cover;
        }
    }
}
.main-title {
    padding: 16px 15px 16px 15px;
    padding-bottom: 0;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333;
    display: flex;
    justify-content: space-between;
    .left {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        .tip {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ff7282;
            line-height: 12px;
        }
    }
}

.main-title .right {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #db0826;
    & > span {
        font-size: 22px;
        line-height: 1;
    }
}

.customer-list {
    margin: 10px 15px;
    background: #f8f8f8;
    border-radius: 4px;
    .main-title {
        border-bottom: 1px solid #eee;
        padding: 16px 15px;
    }
    .van-cell--required::before {
        left: 8px;
    }
    .van-cell {
        padding: 16px 15px;
        background: #f8f8f8;
    }
    /deep/ .van-field__error-message {
        text-align: right;
    }
}

.form {
    border-radius: 10px;
    margin-bottom: 10px;
    overflow: hidden;
}
</style>
