<template>
    <div id="header" class="header">
        <div class="head-container" :style="{ paddingTop: topSafe}">
            <div class="head-l">
                <div v-if="back" class="icon-container" @click="handleGoBack">
                    <i class="iconfanhui iconfont" :class="needWhite ? 'white-color' : ''"></i>
                </div>
                <div v-else>
                    <slot name="append-prefix"></slot>
                </div>
            </div>
            <div class="head-c" v-if="title"  :class="back ? 'has-back' : ''">
                <p :class="needWhite ? 'white-color' : ''" >{{ title }}</p>
            </div>
            <div class="head-r">
                <slot name="append-suffix"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TopBar',
    props: {
        needWhite: {
            type: Boolean,
        },
        title: {
            type: String,
            default: '',
        },
        back: {
            type: Boolean,
            default: true,
        },
        backPath: {
            type: String,
            default: '',
        },
    },
    computed: {
    },
    methods: {
        // 左侧返回按钮操作
        handleGoBack() {
            if (this.backPath) {
                this.$emit('back')
            } else {
                window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/login')
            }
        },
    }
}
</script>

<style scoped lang="less">
.white-color {
    color: #fff !important;
}
.header {
    padding: 0 15px 0 12px;
    .head-container {
    	width: 100%;
        position: relative;
        z-index: 1;
        height:@top-bar-height;
        color: @header-text-color;
        font-size: 18px;
        font-weight: 600;
        .common-flex-between();
    }
    .icon-container {
        width: 100%;
        height: 100%;
        .common-flex-center();
        i {
            font-size: 24px;
        }
    }

    .head-c {
        width: 100%;
        &.has-back {
            margin-right: 18px;
        }
        .white-color {
            color: #fff;
        }
        .common-flex-center();

        i {
            font-size: 10px;
            margin-left: 10px;
        }

        p {
            width: 200px;
            .common-ellipsis();
            text-align: center;
            font-size: 18px;
            color: #030303;
            font-weight: 500;
        }
    }

    .head-l,
    .head-r {
        // width: 80px;
        height: 100%;
        .common-flex-between();
    }

    .head-l {
        flex-shrink: 0;
        .icon-container {
            justify-content: flex-start;
            i {
                // margin-left: -8px;
                font-size: 18px;
                color: #030303;
            }
        }
    }

    .head-r {
        position: absolute;
        right: 0;
        z-index: 10;
        justify-content: flex-end;
        font-size: 15px;
    }
}
</style>
