<template>
    <div class="setting-tag-update">
        <div class="setting-tag-button" @click.stop="depictBtn">
            <img class="icon-tag" :src="$baseImgUrl + '/case/customer/icon-tag.png'" alt="">
            <span class="van-ellipsis">{{ depictTagName ? depictTagName : '客户标签' }}</span>
            <span class="iconfont iconiconrightarrow"></span>
        </div>
        <van-dialog :title="'设置客户描摹'" class="customer-depict-content" v-model="depictShow" show-cancel-button
                    :beforeClose="handleDepictClose" getContainer="body">
            <div class="tip" v-show="depictShowTip"><span class="iconfont icontishi2"></span> 最多可以维护15个标签，已经维护{{depictClientNumber}}个啦~
            </div>
            <p class="customer-depict-content-p">已维护标签</p>
            <div class="customer-depict-iconbox">
                <van-button :class="{'active':depictId== item.id}" class="customer-depict-icon"
                            v-for="(item,index) in tagList" :key="item.id" :title="item.tagName" plain hairline
                            type="info" @click.stop="depictClickTag(item.id)">{{item.tagName}}
                </van-button>
                <van-button v-show="showAddBtn" plain icon="plus" class="customer-depictadd-btn customer-depict-icon"
                            type="info" @click.stop="depictAddTag()">添加标签
                </van-button>
            </div>
            <van-dialog v-if="showSetting" class="setting-tag-dialog" :title="myTagTitle" v-model="showSetting"
                        show-cancel-button :beforeClose="handleClose" getContainer="body">
                <van-field v-model.trim="tagName" placeholder="请输入标签内容" show-word-limit maxlength="6" />
            </van-dialog>
        </van-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import API from '@/request/api/caseSystem/customer'
import MyAPI from '@/request/api/my'

export default {
    name: 'SettingTagUpdate',
    data() {
        return {
            // 标签设置
            depictShow: false,
            depictShowTip: true,
            showAddBtn: true,
            showSetting: false,
            depictClientNumber: '',
            depictTagList: [],
            tagList: [],
            depictId: '',
            tagName: '',
            tagId: '',
            depictTagName: '',
            depictTagListId: [],
            tagListids: [],
            baseInfo: {}
        }
    },
    props: {
        disabled: {
            type: Boolean
        },
        item: {
            type: Object
        },
        data: {
            type: String
        },
        dataType: {
            type: String
        }
        // 类型： 1: 案场, 2: 自渠
        // type: {
        //     type: Number,
        //     default: 1
        // }
    },
    watch: {
        data: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.depictTagName = newVal
                }
            },
            immediate: true
        }
    },
    methods: {
        // 为客户设置标签
        depictBtn() {
            if (this.disabled) return
            this.depictShow = true
            MyAPI.getMyTag().then(res => {
                this.tagList = res
                this.depictClientNumber = res.length
                let tagList = this.tagList
                for (let index in tagList) {
                    let tagListId = tagList[index].id
                    this.tagListId = tagListId
                }
                if (this.tagList.length >= 15) {
                    this.showAddBtn = false
                } else {
                    this.showAddBtn = true
                }
            })
            this.depictGetTagOnCustomer()
        },
        // 获取已经绑定的标签
        depictGetTagOnCustomer() {
            this.depictShow = true
            var params = {
                clientId: this.item.clientId
            }
            API.getTagOnCustomer(params).then(res => {
                let depictTagList = res
                for (let index in depictTagList) {
                    let depictTagListId = depictTagList[index].tagId
                    let depictTagName = depictTagList[index].tagName
                    this.depictTagName = depictTagName
                    this.depictId = depictTagListId
                    this.$emit('change', this.depictTagName)
                }
            })
        },
        // 点击选中标签
        depictClickTag(tagId) {
            this.tagId = tagId
            this.depictId = tagId
            if (this.tagList.length >= 15) {
                this.showAddBtn = false
            } else {
                this.showAddBtn = true
            }
        },
        // 设置标签确定
        async handleDepictClose(action, done) {
            if (action === 'cancel') {
                return done()
            } else if (action === 'confirm') {
                try {
                    let depictarr = []
                    depictarr.push(this.tagId || this.depictId)
                    let params = {
                        clientId: this.item.clientId,
                        tagList: depictarr
                    }
                    await API.bindTagOnCustomer(params).then(res => {
                        let depictBindTagList = res
                    })
                    this.depictGetTagOnCustomer()
                    return done()
                } catch (e) {
                    return done(false)
                }
            }
        },
        // 添加标签
        depictAddTag() {
            this.myTagTitle = '添加标签'
            this.showSetting = true
            this.depictShow = false
            if (this.disabled) return
            this.id = ''
        },
        async handleClose(action, done) {
            if (action === 'cancel') {
                this.tagName = ''
                this.depictShow = true
                return done()
            } else if (action === 'confirm') {
                if (!this.tagName) {
                    this.$toast('请输入标签内容')
                    return done(false)
                }
                try {
                    if (this.id == '') {
                        this.depictAddTag(this.tagName)
                        let params = {
                            tagName: this.tagName
                        }
                        await MyAPI.saveMyTag(params)
                        this.depictBtn()
                        this.tagName = ''
                        return done()
                    }
                    this.depictShow = false
                    return done()
                } catch (e) {
                    return done(false)
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
.setting-tag-update {
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

.customer-depict-content {
    .tip {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        line-height: 14px;
        height: 36px;
        line-height: 36px;
        background: rgba(250, 181, 95, 0.1);
        margin-bottom: 18px;

        .iconfont {
            margin: 0px 4px 0 15px;
            color: #DB0826;
        }

        .close {
            font-size: 16px;
            margin-right: 15px;
            float: right;
            width: 50px;
            text-align: right;
        }
    }

    .customer-depict-iconbox {
        margin: 5%;

        .customer-depict-icon {
            border-radius: 5px;
            margin: 2% 1.5%;
            width: 30%;
        }

        .customer-depict-icon.active {
            border-radius: 5px;
            margin: 2% 1.5%;
            background: #DB0826;
            color: #fff;
        }

        .customer-depictadd-btn {
            margin: 2% 1%;
        }
    }

    .customer-depict-content-p {
        margin: 4% 5%;
        font-size: 14px;
    }
}
</style>
