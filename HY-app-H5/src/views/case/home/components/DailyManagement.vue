<template>
    <div class="box-wrap">
        <div
            class="box"
            @click="clickInfo(info)"
            v-for="info in list"
        >
            <img
                class="icon-data-status"
                :src="$baseImgUrl + '/case/home/'+ info.checkedIconName"
            >
            <div class="info">
                <p class="title">
                    {{ info.name }}
                </p>
                <p>
        <span class="font-size-12">
          {{ info.describe }}
        </span>
                </p>
            </div>
            <span class="iconfont iconiconrightarrow"></span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'DataOverview',
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {}
    },
    created() {
    },
    methods: {
        clickInfo(info) {
            this.$emit('clickInfo', info)
        }
    }
}
</script>
<style lang="less" scoped>
.box-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.box {
    position: relative;
    padding: 1rem 1.13333rem;
    box-sizing: border-box;
    width: 48%;
    margin-bottom: 0.53333rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    box-shadow: 0px 0px 20px 0px rgba(24,27,31,0.05);
    border-radius: 0.26667rem;
    background: #fff;

    .title {
        color: #333;
        font-size: 14px;
        margin-bottom: 8px;
    }

    .icon-data-status {
        width: 36px;
        height: 36px;
        margin-right: 9px;
    }

    .info {
        display: flex;
        flex-direction: column;
        color: #999;

        .font-size-12 {
            font-size: 12px;
        }

        .title {
            font-size: 16px;
            color: @header-text-color;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            flex: 1;
        }

        .real-count {
            color: #FD7A3F;
        }

        .count {
            display: inline-block;
            width: 78px;
            font-size: 16px;
            font-weight: bold;
            color: @header-text-color;
        }

        .count-org {
            color: #FD7A3F;
        }

        .target {
            margin: 0 4px;
            font-weight: bold;
            font-size: 18px;
            color: #333;
        }

        .complete-target {
            margin-right: 12px;
            font-size: 18px;
            font-weight: bold;
            color: @header-text-color;
        }

        .real-count {
            font-size: 18px;
            font-weight: bold;
        }
    }

    .iconfont {
        color: #A9A9A9;
        font-size: 12px;
        position: absolute;
        right: 16px;
    }

    .bg {
        position: absolute;
        width: 132px;
        height: 50px;
        right: 0;
        top: 0
    }
}

.progress {
    display: inline-block;
    width: 85px;
    height: 5px;
    vertical-align: middle;
}
</style>
