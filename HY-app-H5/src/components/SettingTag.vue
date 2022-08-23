<template>
    <div class="setting-tag">
        <div class="setting-tag-button" @click.stop="showDialog">
            <img class="icon-tag" :src="$baseImgUrl + '/case/customer/icon-tag.png'" alt="">
            <span class="van-ellipsis">{{ tagName ? tagName : '设置标签' }}</span>
            <span class="iconfont iconiconrightarrow"></span>
        </div>
        <van-dialog v-if="show" class="setting-tag-dialog" v-model="show" title="设置标签" show-cancel-button :beforeClose="handleClose" getContainer="body">
            <van-field v-model="tagValue" placeholder="请输入标签内容" show-word-limit maxlength="6" />
        </van-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import apiCase from '@/request/api/caseSystem/customer'
import apiExtension from '@/request/api/selfExtension/customer'
export default {
    name: 'SettingTag',
    data() {
        return {
            show: false,
            tagValue: '',
            tagName: '',
        }
    },
    props: {
        disabled: {
            type: Boolean,
        },
        item: {
            type: Object,
        },
        data: {
            type: String
        },
        dataType: {
            type: String
        },
        // 类型： 1: 案场, 2: 自渠
        type: {
            type: Number,
            default: 1
        }
    },
    watch: {
        data: {
            handler(newVal, oldVal) {
                if(newVal) {
                    this.tagName = newVal
                }
            },
            immediate: true
        }
    },
    methods: {
        showDialog() {
            if (this.disabled) return
            this.show = true
            this.tagValue = this.data ? this.data : ''
        },
        async handleClose(action, done) {
            if (action === 'cancel') {
                this.tagValue = ''
                return done()
            } else if (action === 'confirm') {
                if(!this.tagValue) {
                    this.$toast('请输入标签内容')
                    return done(false)
                }
                let params = {}
                try {
                    let result = null
                    if(this.type === 1) {
                        params = {
                            dataId: this.item.oppId ? this.item.oppId : this.item.clueId,
                            desc: this.tagValue,
                        }
                        result = await apiCase.customerTagSave(params)
                    } else if(this.type === 2) {
                        params = {
                            clueId: this.item.clueId,
                            label: this.tagValue,
                        }
                        result = await apiExtension.customerTagSave(params)
                    }
                    if (result) {
                        this.$emit('change', this.tagValue)
                        this.tagName = this.tagValue
                        return done()
                    }
                } catch(e) {
                    return done(false)
                }
            }
        },
    },
}
</script>

<style scoped lang="less">
.setting-tag {
    .setting-tag-button {
        .common-flex-center();
        font-size: 12px;
        line-height: 12px;
        color: @header-text-color;
        border-radius: 15px;
        padding: 9px 15px 9px 9px;
        background: #EFF9FD;
        .icon-tag {
            width: 12px;
            height: 12px;
            margin-right: 4px;
        }
        .iconiconrightarrow {
            font-size: 8px;
            margin-left: 5px;
        }
        .edit-icon {
            width: 12px;
            height: 12px;
            font-size: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background: @light-green;
            color: #fff;
            margin-right: 4px;
        }
    }
}
.setting-tag-dialog {
    background: none;
    ::v-deep .van-dialog__header {
        line-height: 1;
        padding: 24px 0;
        font-size: 18px;
        color: #333333;
        font-weight: 500;
        border-bottom: 1px solid #eeeeee;
        background: #ffffff;
    }
    ::v-deep .van-button--default {
        font-size: 16px;
    }
    ::v-deep .van-dialog__content {
        background: #ffffff;
        .van-field {
            padding: 30px 20px;
        }
        .van-field__control {
            height: 56px;
            background: #fafafa;
            padding: 0 15px;
        }
    }
}
</style>
