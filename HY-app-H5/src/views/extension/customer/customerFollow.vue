<template>
    <div class="common-page">
        <top-bar :back="true" title="客户跟进"></top-bar>
        <div class="common-page-container" :style="{height: pageContainerHeight}">
            <van-form
                @submit="onSubmit"
                validate-trigger="onSubmit"
                @failed="onFailed"
                :show-error-message="false"
            >
                <van-field
                    is-link
                    :rules="[{ required: true, message: '请选择跟进方式' }]"
                    input-align="right"
                    v-model="data.tunnelName"
                    required
                    readonly
                    clickable
                    label="跟进方式"
                    placeholder="请选择跟进方式"
                    @click="showPicker = true"
                />
                <van-field
                    v-if="isShowFollwTime"
                    :rules="[{ required: true, message: '请选择预约看房时间' }]"
                    label-width="150"
                    input-align="right"
                    label="预约看房时间"
                    placeholder="请选择预约看房时间"
                    v-model="data.reserveVisitDate"
                    @click="showTimePicker = true"
                    is-link
                    required
                    readonly
                    clickable
                />
                <van-field class="common-textarea-label" required readonly label="跟进内容" />
                <van-field
                    input-align="left"
                    :rules="[{ required: true, message: '请输入跟进内容' }]"
                    maxlength="50"
                    show-word-limit
                    v-model="data.content"
                    rows="1"
                    autosize
                    type="textarea"
                    placeholder="请输入跟进内容..."
                />
                <van-field class="common-field-label" readonly label="附件内容" />
                <div class="upload-list">
                    <div class="img-container" v-if="attachFileList.length<=2" @click="uploadPic">
                        <i class="iconfont iconjiahao"></i>
                    </div>
                    <div class="img-container" v-for="(item,index) in attachFileList" :key="item">
                        <i class="iconfont iconshanchu" @click="deleteAttach(index)"></i>
                        <img @click="preview(index)" :src="item" alt />
                    </div>
                </div>
                <div class="save-button-div">
                    <van-button round block type="save" native-type="submit">确定</van-button>
                </div>
            </van-form>
        </div>
        <van-popup v-model="showPicker" round position="bottom">
            <van-picker
                show-toolbar
                :columns="followList"
                value-key="label"
                @cancel="showPicker = false"
                @confirm="onConfirm"
            />
        </van-popup>
        <van-popup v-model="showTimePicker" round position="bottom">
            <van-datetime-picker show-toolbar type="date" title="选择年月日" :min-date="currentDate" @cancel="showTimePicker = false" @confirm="onConfirmDate" />
        </van-popup>
    </div>
</template>
<script>
import API from '@/request/api/caseSystem/customer'
import APICOMMON from '@/request/api/commonApi'
import { Uploader } from 'vant'
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import { commonMethods } from 'movit-utils'

export default {
    name: 'customerFollow',
    components: {
        TopBar,
        [Uploader.name]: Uploader
    },
    computed: { ...mapGetters(['tabData', 'projectId', 'user', 'device']) },
    data() {
        return {
            currentDate: new Date(),
            attachFileList: [],
            showPicker: false,
            showTimePicker: false,
            isShowFollwTime: false,
            data: {
                content: null,
                tunnelId: '',
                tunnelName: '',
                reserveVisitDate: null
            },
            followList: [],
            flag: false
        }
    },
    created() {
    },
    mounted() {
        if (this.$route.query.channel1Name === '销售登记') {
            this.isShowFollwTime = true
            this.data.reserveVisitDate = this.$route.query.reserveVisitDate || ''
        }
        this.getFollowType()
    },
    methods: {
        //预览图片
        preview(index) {
            this.$utils.previewImageList(this.attachFileList, index)
        },
        //删除图片
        deleteAttach(index) {
            let attachArray = this.$utils.deepCopy(this.attachFileList)
            attachArray.splice(index, 1)
            this.attachFileList = attachArray
        },
        //上传图片
        uploadPic() {
            let p = {
                token: localStorage.token,
                url: APICOMMON.commonUpload(),
                base: APICOMMON.apiBase()
            }
            if (this.isSAAS) {
                p.companyNo = localStorage.companyNo
            }
            this.$appMethods.UploadImage(this.device, p).then(res => {
                try {
                    let _res = JSON.parse(res)
                    this.attachFileList.push(_res.data)
                    this.$forceUpdate()
                } catch (e) {
                    this.$toast('图片上传失败')
                }
            })
        },
        onConfirmDate(value) {
            this.data.reserveVisitDate = commonMethods.DateToString(value)
            this.showTimePicker = false
        },
        //获取跟进方式
        getFollowType() {
            let p = {
                type: 'follow_type'
            }
            APICOMMON.dictList(p).then(res => {
                this.followList = res
            })
        },
        onFailed(errorInfo) {
            this.$toast(errorInfo.errors[0].message)
        },
        //保存
        onSubmit(values) {
            let p = {
                clueId: this.$route.query.clueId,
                oppId: this.$route.query.oppId,
                projectId: this.projectId,
                images: this.attachFileList,
                content: this.data.content,
                followSource: this.$route.query.followSource ? 1 : 2, //跟进来源，0-案场跟进；1-登记客户跟进；2-自渠跟进；
                followType: this.data.tunnelId
            }
            if (this.data.reserveVisitDate) {
                p.reserveVisitDate = this.data.reserveVisitDate
            }
            if (this.flag) {
                return
            }
            this.flag = true
            API.followRecordAdd(p).then(res => {
                //成功
                this.flag = false
                this.$toast('跟进成功')
                this.$router.go(-1)
            }).catch(err => {
                this.flag = false
            })
        },
        //确定方式
        onConfirm(value) {
            this.data.tunnelName = value.label
            this.data.tunnelId = value.value
            this.showPicker = false
        }
    }
}
</script>
<style scoped lang="less">
.iconjiahao {
    font-size: 2rem;
    color: #d8d8d8;
}

/deep/ .van-uploader__upload {
    margin-bottom: 0;
}

.common-page {
    .common-page-container {
        background: @bg-color;

        .van-form {
            background: #fff;

            .cell-title {
                font-size: 1rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 1rem;
                padding: 18px 0 15px 15px;
            }
        }

        .save-button-div {
            padding: 40px 23px 15px;
            background: @bg-color;
        }
    }

    .upload-list {
        .common-flex();
        margin: 0 15px 0;
        padding-bottom: 10px;

        .img-container {
            position: relative;
            width: 80px;
            height: 80px;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
            margin-right: 8px;
            overflow: hidden;
            .common-flex-center();

            .iconshanchu {
                padding: 5px;
                position: absolute;
                top: 0;
                right: 0;
                color: #d8d8d8;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .img-container:last-child {
            margin-right: 0;
        }

        .uploaded-img {
            width: 80px;
            height: 80px;
            border-radius: 4px;
            border: 1px solid #e5e5e5;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}

.icon-phone {
    margin-right: 4px;
}
</style>
