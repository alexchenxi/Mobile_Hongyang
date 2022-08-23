<template>
    <div class="common-page">
        <top-bar title="编辑名片" />
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <van-form validate-trigger="onSubmit" :show-error-message="false" @submit="onSubmit" @failed="onFailed">
                <div class="nav-section">
                    <van-cell title="头像" class="avatar-cell">
                        <!--调用app方法上传-->
                        <template #right-icon>
                            <div class="img-container">
                                <img v-if="info.avatar" alt="" :src="info.avatar" class="avatar-img" crossorigin="anonymous" @click="updateAvatar" />
                                <img v-else alt="" :src="$baseImgUrl + '/default-avatar.png'" class="avatar-img" @click="updateAvatar" />
                            </div>
                            <van-icon name="arrow" color="#ccc" />
                        </template>
                    </van-cell>
                    <van-cell title="姓名" :value="info.name" />
                    <van-cell title="手机号" :value="info.phone" />
                    <div class="cell-title">服务宣言</div>
                    <van-field
                        v-model="info.motto"
                        maxlength="15"
                        :rules="[{ required: true, message: '请输入服务宣言' }]"
                        show-word-limit
                        rows="4"
                        autosize
                        type="textarea"
                        placeholder="请输入服务宣言..."
                    />
                </div>
                <div class="save-button">
                    <van-button round block type="save" native-type="submit">发布</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import API from '@/request/api/onlineMarketing'
import APICOMMON from '@/request/api/commonApi'
import TopBar from '@c/TopBar'
export default {
    name: 'EditCard',
    components: {
        TopBar
    },
    data() {
        return {
            info: {
                avatar: '',
                motto: ''
            },
            // 名片id
            id: ''
        }
    },
    computed: { ...mapGetters(['device', 'projectId', 'user']) },
    created() {
        this.id = this.$route.query.id
        this.getCardDetail()
    },
    mounted() {},
    methods: {
        //修改头像
        updateAvatar() {
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
                    this.$toast('头像上传成功')
                    this.info.avatar = _res.data
                } catch (e) {
                    this.$toast('图片上传失败')
                }
            })
        },
        // 获取名片详情
        getCardDetail() {
            if (!this.id) {
                this.info.phone = this.user.tel
                this.info.name = this.user.name
                this.info.motto = '全心全意为您服务！'
                return
            }
            API.getAICardDetail(this.id).then(res => {
                this.info = res
            })
        },
        onFailed(errorInfo) {
            this.$toast(errorInfo.errors[0].message)
        },
        // 发布
        onSubmit() {
            let { avatar, phone, name, motto } = this.info
            if (!avatar) {
                this.$toast('请上传头像')
                return false
            }
            const params = {
                avatar,
                phone,
                name,
                motto,
                projectId: this.projectId,
                agencyId: this.user.id
            }
            if (this.id) {
                params.cardId = this.id
            }
            API.saveAICard(params).then(res => {
                this.$toast('保存成功')
                setTimeout(() => {
                    this.$router
                        .push({
                            path: '/AICard',
                            query: {
                                id: res
                            }
                        })
                        .catch(() => {})
                }, 500)
            })
        }
    }
}
</script>
<style scoped lang="less">
.common-page-container {
    background-color: #f6f8fa;
    .nav-section {
        font-size: 15px;
        margin-top: 10px;
        /deep/ .van-cell__title span {
            font-size: 15px;
        }
        .avatar-cell {
            align-items: center;
        }
        .van-cell__value {
            color: @header-text-color;
        }
        .img-container {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 10px;
            overflow: hidden;
            position: relative;
        }
        .avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .cell-title {
            font-size: 15px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 15px;
            padding: 18px 15px 0;
            background: #fff;
        }
    }
    .save-button {
        margin: 40px 18px 0;
    }
    /deep/ .van-field__right-icon {
        display: flex;
        align-items: center;
    }
}
</style>
