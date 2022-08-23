<template>
    <div class="register">
        <nav class="common-page-top">
            <top-bar :back="true" @back="back" backPath="-" title="注册"></top-bar>
        </nav>
        <section class="register-form">
            <div class="field-wrap">
                <i class="iconfont iconuser" />
                <van-field v-model="userName" placeholder="请输入账号" />
            </div>
            <div class="field-wrap">
                <i class="iconfont iconpassword" />
                <van-field
                    v-model="password"
                    placeholder="请输入密码"
                    :type="showPassword ? 'text' : 'password'"
                    :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
                    @click-right-icon="toggleShowPassword"
                />
            </div>
            <div class="field-wrap">
                <i class="iconfont iconiconpassword2" />
                <van-field
                    v-model="rePassword"
                    placeholder="请再次输入密码"
                    :type="showRePassword ? 'text' : 'password'"
                    :right-icon="showRePassword ? 'eye-o' : 'closed-eye'"
                    @click-right-icon="toggleShowRePassword"
                />
            </div>
        </section>
        <div class="btn-wrap option">
            <van-button round block type="save" @click="register">
                注册
            </van-button>
            <div class="link-btn">
                <span @click="login">已有账号，去登陆</span>
            </div>
        </div>
    </div>
</template>

<script>
import topBar from '@/components/TopBar'
import { roleMixin } from '@/views/mixin/role.js'
import { mapGetters } from 'vuex'
export default {
    name: 'Register',
    components: {
        topBar
    },
    mixins: [roleMixin],
    data() {
        return {
            userName: '',
            password: '',
            rePassword: '',
            // 是否显示密码
            showPassword: false,
            showRePassword: false
        }
    },
    computed: { ...mapGetters(['device']) },
    created() {},
    methods: {
        async register() {
            if (!this.userName) {
                this.$toast('请填写账号')
                return
            }
            if (!this.password) {
                this.$toast('请填写密码')
                return
            }
            if (this.password != this.rePassword) {
                this.$toast('两次密码必须相同')
                return
            }
            this.$toast('您已提交注册内容，请耐心等待审核结果')
            setTimeout(() => {
                this.$router.replace({
                    path: '/login'
                })
            }, 2000)
        },
        toggleShowPassword() {
            this.showPassword = !this.showPassword
        },
        toggleShowRePassword() {
            this.showRePassword = !this.showRePassword
        },
        // 登陆
        login() {
            this.$router.replace({
                path: '/login'
            })
        },
        back() {
            this.$router.replace({
                path: '/login'
            })
        }
    }
}
</script>

<style scoped lang="less">
.register {
    position: fixed;
    width: 100%;

    .common-page-top {
        background: #ffffff;
        .header {
            .give-up {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #030303;
                position: absolute;
                right: 0;
            }
        }
    }
    .register-form {
        margin-top: 50px;
        font-size: 15px;
        color: @header-text-color;
        .field-wrap {
            padding: 0 36px;
            position: relative;
            .common-flex();
        }
        .iconfont {
            position: absolute;
            z-index: 2;
            font-size: 20px;
        }
    }
    .btn-wrap {
        padding: 50px 18px 0;
        .check-wrap {
            padding: 0 20px 10px 20px;
            display: block;
            .common-flex-between();
            .iconfont {
                font-size: 12px;
            }
        }
    }
}
.iconfont.iconxuanzhong {
    color: @theme-color;
}
.iconfont.iconweixuanzhong {
    color: #d8d8d8;
    background: #f5f7f9;
}
/deep/ .van-cell {
    border-bottom: 1px solid @main-bg;
}
/deep/ .van-field__control {
    text-indent: 20px;
}
/deep/ .van-checkbox__icon .van-icon {
    font-size: 12px;
}
/deep/ .van-checkbox {
    display: inline-block;
}
/deep/ .van-checkbox__icon {
    line-height: 25px;
    height: 25px;
    display: inline-block;
}
/deep/ .van-checkbox__label {
    font-size: 12px;
    color: @theme-color;
    line-height: 20px;
}
.link-btn {
  font-size: 12px;
  text-align: right;
  padding: 15px 20px;
  color: @theme-color;
}
</style>
