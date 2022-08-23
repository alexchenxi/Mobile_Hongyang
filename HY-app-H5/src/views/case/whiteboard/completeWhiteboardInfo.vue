<template>
  <div class="common-page">
    <top-bar :title="'客户信息'" />
    <div
      class="common-page-container"
      :style="{ height: pageContainerHeight }"
    >
      <div class="notice-container">
        <van-notice-bar
          color="@warning-color"
          background="rgba(250, 181, 95, 0.1)"
          mode="closeable"
          :scrollable="false"
          wrapable
        >
          <span
            slot="left-icon"
            class="iconfont icontishi2"
          />
          手机号完善后，请前往【首页-首访待完善客户】跟进客户！
        </van-notice-bar>
      </div>
      <van-form
        validate-trigger="onSubmit"
        :show-error-message="false"
        @submit="onSubmit"
        @failed="onFailed"
      >
        <van-field
          v-model="info.customerName"
          :readonly="!canEdit"
          label="姓名"
          placeholder="请输入姓名"
          input-align="right"
          maxlength="20"
          :rules="[{ required: true, message: '请输入姓名' }]"
          required
        />
        <van-field
          v-model="info.customerGender"
          label="性别"
          readonly
          placeholder="请选择性别"
          input-align="right"
          :is-link="canEdit"
          @click="changeGender"
        />
        <van-field
          v-model="info.customerPhone"
          :readonly="!canEdit"
          label="手机号"
          placeholder="请输入客户手机号"
          input-align="right"
          maxlength="11"
          required
          :rules="[{ required: true, message: '请输入手机号' },{ validator, message: '手机号码格式不正确' }]"
        />
        <van-field
          v-model="info.remark"
          class="remark-textarea"
          :readonly="!canEdit"
          type="textarea"
          label="备注"
          show-word-limit
          maxlength="20"
          placeholder="请输入备注信息..."
        />
        <div
          v-if="canEdit"
          class="submit-button"
        >
          <van-button
            round
            block
            type="save"
            native-type="submit"
          >
            提交信息
          </van-button>
        </div>
      </van-form>
      <!-- <div class="tip-message">
        <div class="title">
          【温馨提示】
        </div>
        <div class="content">
          * 只有填写了客户手机号后，白板任务状态才会变为【已完善】
        </div>
      </div> -->
      <van-popup
        v-model="showGenderPop"
        position="bottom"
        round
      >
        <van-picker
          title="性别"
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
import API from '@/request/api/caseSystem/whiteboard'
import TopBar from '@c/TopBar'
import { mapGetters } from 'vuex'
export default {
    name: 'CompleteWhiteboardInfo',
    components: {
        TopBar
    },
    props: {},
    data() {
        return {
            showTip: true,
            info: {
                customerName: '',
                customerGender: '',
                customerPhone: '',
                remark: ''
            },
            showGenderPop: false,
            columns: ['男', '女'],
            canEdit: false
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole'])
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.getInfo()
        },
        getInfo() {
            let params = {
                id: this.$route.query.id
            }
            API.getWhiteboardInfo(params).then(res => {
                if(res.status) {
                    this.canEdit = false
                } else {
                    this.canEdit = true
                }
                this.info.customerName = res.customerName
                this.info.customerGender = res.customerGender
                this.info.customerPhone = res.customerPhone
                this.info.remark = res.remark
                 localStorage.setItem('whiteboardStatus',this.info.customerPhone?1:'')
            })
        },
        // 校验手机号格式
        validator(val) {
            if (val) {
                return /^1[3-9]\d{9}$/.test(val)
            } else {
                return true
            }
        },
        // 保存
        onSubmit() {
            let params = this.info
            params.id = this.$route.query.id
            this.$utils.loading()
            API.saveWhiteboard(params).then(() => {
                this.$toast('保存成功')
                
                if (this.info.customerPhone) {
                    localStorage.setItem('whiteboardStatus', 1)
                    this.$router.go(-1)
                }
                this.$toast.clear()
            })
        },
        // 保存错误提示
        onFailed(errorInfo) {
            console.log(errorInfo)
            this.$toast(errorInfo.errors[0].message)
        },
        changeGender() {
            if (!this.canEdit) return
            this.showGenderPop = true
        },
        onConfirm(val) {
            this.info.customerGender = val
            this.showGenderPop = false
        },
        onCancel() {
            this.showGenderPop = false
        }
    }
}
</script>
<style scoped lang="less">
.common-page-container {
    background: @bg-color;
    .notice-container {
        background: #ffffff;
    }
    /deep/ .van-notice-bar {
        padding: 11px 15px;
        .iconfont {
            font-size: 15px;
        }
        .van-notice-bar__wrap {
            padding-left: 6px;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
        }
    }
    /deep/ .van-form {
        .van-field {
            padding: 14px 15px;
            background: #ffffff;
            &.van-cell--required::before {
                left: 7px;
            }
            .van-cell__right-icon {
                margin-top: 0;
            }
        }
        .remark-textarea {
            flex-direction: column;
            .van-field__label {
                margin-bottom: 7px;
            }
        }
        .submit-button {
            margin: 40px 18px 0;
        }
    }
    .tip-message {
        padding: 0 15px;
        font-size: 12px;
        color: #999999;
        margin-top: 40px;
        .title {
            margin-bottom: 15px;
        }
    }
    .van-popup {
        border-radius: 8px;
    }
}
</style>
