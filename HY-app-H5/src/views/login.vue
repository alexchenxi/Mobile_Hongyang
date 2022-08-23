<template>
    <div class="login">
        <div class="logo">
            <img class="img" src="@/assets/logo.png" />
            <div class="describe"><span style="margin-right: 20px;">在&nbsp;商 言 人</span>诚 者 致 远</div>
        </div>
        <section class="login-form">
            <div class="field-wrap">
                <i class="iconfont iconuser"></i>
                <van-field v-model="userName" placeholder="请输入账号" />
            </div>
            <div class="field-wrap">
                <i class="iconfont iconpassword"></i>
                <van-field
                    v-model="password"
                    placeholder="请输入密码"
                    :type="showPassword ? 'text' : 'password'"
                    :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
                    @click-right-icon="toggleShowPassword"
                />
            </div>
        </section>
        <div class="btn-wrap option">
            <div class="check-wrap">
                <van-checkbox v-model="isRememberPassword">
                    记住密码
                    <template #icon="props">
                        <span class="iconfont" :class="props.checked ? 'iconxuanzhong' : 'iconweixuanzhong'"></span>
                    </template>
                </van-checkbox>
                <van-checkbox v-model="isAutoLogin">
                    自动登录
                    <template #icon="props">
                        <span class="iconfont" :class="props.checked ? 'iconxuanzhong' : 'iconweixuanzhong'"></span>
                    </template>
                </van-checkbox>
            </div>
            <van-button round block type="save" @click="useVerify">登录</van-button>
            <!--<div class="link-btn">-->
                <!--<span @click="register">立即注册</span>-->
            <!--</div>-->
        </div>
        <Verify ref="verify" mode="pop" captcha-type="blockPuzzle" :img-size="{ width: '279px', height: '139px' }" explain="向右拖动滑块填充拼图" @success="success"></Verify>
    </div>
</template>

<script>
import API from '@/request/api/commonApi'
import { roleMixin } from '@/views/mixin/role.js'
import Verify from '@/components/verifition/Verify'
import TopBar from '@c/TopBar'
export default {
    name: 'Login',
    components: {
        Verify,
        TopBar
    },
    mixins: [roleMixin],
    data() {
        return {
            userName: '',
            password: '',
            // 是否记住密码
            isRememberPassword: false,
            // 是否自动登录
            isAutoLogin: false,
            // 是否显示密码
            showPassword: false
        }
    },
    created() {
        this.isRememberPassword = localStorage.isRememberPassword === 'true' ? true : false
        this.isAutoLogin = localStorage.isAutoLogin === 'true' ? true : false
        // 记住密码
        if (this.isRememberPassword || this.isAutoLogin) {
            this.userName = localStorage.userName
            this.password = localStorage.password
        }
        this.$store.dispatch('user/setCurrentRole', {})
    },
    mounted() {
        // 退出时清空首页项目索引
        this.$store.dispatch('other/setProjectListIndex', [])
    },
    methods: {
        // 获取安全区域
        getSafeArea() {
            this.$appMethods.getSafeArea(this.$utils.getDevice()).then(res => {
                this.$store.dispatch('user/setSafeArea', res)
            })
        },
        success(params) {
            this.login(params.captchaVerification)
        },
        useVerify() {
            if (!this.userName) {
                this.$toast('请填写账号')
                return
            }
            if (!this.password) {
                this.$toast('请填写密码')
                return
            }
            // todo 暂时关闭图形验证码
            // this.$refs.verify.show()
            this.login('')
        },
        async login(captchaVerification) {
            this.getSafeArea()
            this.$utils.loading()
            let params = {
                captchaVerification,
                userName: this.userName,
                password: this.$utils.md5(this.password),
                oaPassword: this.password
            }
            let loginInfo = await this.getLoginInfo(params)
            this.$toast.clear()
            this.setStorage(loginInfo)
            this.handleRole()
        },
        // 手动登录
        getLoginInfo(params) {
            return API.login(params).then(res => {
                return res
            })
        },
        toggleShowPassword() {
            this.showPassword = !this.showPassword
        },
        // 注册
        register() {
            this.$router.push({
                path: '/register'
            })
        }
    }
}
</script>

<style scoped lang="less">
.login {
    position: fixed;
    width: 100%;

    .logo {
        width: 100%;
        .common-flex-center();
        flex-direction: column;
        padding-top: 83px;
        margin-bottom: 0.8rem;
        .img {
            width: 174px;
        }
        .describe {
            font-size: 12px;
            word-spacing: 4px;
            color: #afafaf;
        }
    }
    .login-form {
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
        padding: 30px 18px 0;
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
