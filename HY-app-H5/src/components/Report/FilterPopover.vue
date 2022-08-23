<template>
    <van-popover v-model="showPopover" trigger="click" placement="bottom-end" :get-container="getContainer" :actions="actionList" @select="onSelect">
        <template #reference>
            <div :class="['content', showPopover ? 'selected' : '']">
                <span class="content-text">{{ selectedValue }}</span>
            </div>
        </template>
    </van-popover>
</template>

<script>
export default {
    props: {
        container: String,
        list: Array,
        value: String | Number
    },
    data() {
        return {
            showPopover: false,
            selectedValue: '',
            actionList: []
        }
    },
    watch: {
        value(val) {
            this.selectedValue = this.list.find(item => item.value === this.value).text
        },
        list: {
            handler(newVal, oldVal) {
                this.actionList = this.list.filter(item => {
                    return !item.disabled
                })
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        this.selectedValue = this.list.find(item => item.value === this.value).text
    },
    methods: {
        onSelect(action) {
            this.selectedValue = action.text
            this.$emit('input', action.value)
            this.$emit('change', action.value)
        },
        getContainer() {
            return document.querySelector(this.container)
        }
    }
}
</script>

<style lang="less" scoped>
.content {
    position: relative;
    &::after {
        position: absolute;
        top: 50%;
        right: 2px;
        margin-top: -0.33333rem;
        border: 0.2rem solid;
        border-color: transparent transparent #dcdee0 #dcdee0;
        transform: rotate(-45deg);
        opacity: 0.8;
        content: '';
    }
    .content-text {
        padding-right: 10px;
        color: #303030;
        font-size: 14px;
        line-height: 14px;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
    }
    &.selected {
        .content-text {
            color: @theme-color;
        }
        &::after {
            margin-top: -0.06667rem;
            transform: rotate(135deg);
            border-color: transparent transparent @theme-color @theme-color;
        }
    }
    /deep/ .grid-item {
        height: 44px;
    }
}
</style>
