<template>
    <div class="customer-list">
        <div class="customer-item"  v-for="(item, index) in list" :key="item.id" @click="goDetail(item)">
            <van-swipe-cell :disabled="true">
                <div class="item-content">
                    <section class="top-containe-wrap">
                        <div class="top-container">
                            <div class="section-header">
                                <div class="section-header-left">
                                  <div class="name">{{item.name}}</div>
                                </div>
                            </div>
                            <div class="section-body">
                                <template>
                                    <div class="field-section" style="margin-right: 0;">
                                        <div class="field-name field-name-tel" style="width: 56%">手机号码：<span class="field-content">{{item.tel}}</span></div>
                                        <div class="field-name field-name-talk" v-if="item.reportNum !== null">报备数：<span class="field-content">{{item.reportNum || 0}}</span></div>
                                        <div class="field-name field-name-talk" v-if="item.visitNum !== null" style="margin-left: 4px;">到访数：<span class="field-content">{{item.visitNum || 0}}</span></div>
                                        <div class="field-content"></div>
                                    </div>
                                    <div class="field-section">
                                        <div class="field-name">成为经纪人时间：<span class="field-content">{{item.bindDate}}</span></div>
                                        <div class="field-content"></div>
                                    </div>
                                    <div class="field-section" v-if="item.unbindDate && item.isUnbind === 1">
                                        <div class="field-name">解绑时间：<span class="field-content">{{item.unbindDate}}</span></div>
                                        <div class="field-content"></div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </section>
                    <div class="bottom-container">
                        <div class="action-list"></div>
                    </div>
                </div>
            </van-swipe-cell>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'CustomerSection',
    components: {
    },
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
        }
    },
    computed: {
       ...mapGetters(['projectId', 'currentRole'])
    },
    mounted() {
    },
    methods: {
        goDetail(item) {
            this.$emit('goDetail', item)
        }
    }
}
</script>

<style lang="less" scoped>
.customer-list {
    .customer-item {
        // padding: 15px;
        // .common-flex();
        background: #ffffff;
        margin-bottom: 9px;
        align-items: stretch;
        .van-checkbox {
            flex-shrink: 0;
            flex-grow: 0;
        }
        .item-content {
            flex-shrink: 1;
            width: 100%;
        }
        .item-right {
            position: absolute;
            right: 15px;
            top: 15px;
            text-align: right;
            width: 25px;
            height: 25px;
        }
        .action-item {
            .common-flex-center();
            width: 50px;
            height: 100%;
            color: #ffffff;
            border-radius: 0 4px 4px 0;
        }
        .top-container {
            padding: 15px;
            flex: 1;
            .section-header {
                .common-flex-between();
                margin-bottom: 2px;
                .section-header-left {
                    .common-flex();
                    .name {
                        font-size: 16px;
                        color: @header-text-color;
                        line-height: 16px;
                        font-weight: 500;
                        margin-right: 8px;
                    }
                    .tag-list {
                        .common-flex();
                        .tag-item {
                            .common-flex-center();
                            min-width: 45px;
                            height: 18px;
                            font-size: 11px;
                            color: @theme-color;
                            line-height: 11px;
                            font-weight: 500;
                            margin-right: 6px;
                            padding: 0 6px;
                            border-radius: 2px;
                        }
                        .common-tag-orange{
                          color: #DB0826 !important;
                          border: 1px solid #DB0826;
                          border-radius: 4px;
                        }
                    }
                }
                .section-header-right {
                    .collect-container {
                        align-self: start;
                        .icon-collect {
                            width: 18px;
                            height: 18px;
                        }
                    }
                }
            }
            .section-body {
                .common-flex();
                flex-wrap: wrap;
                .field-section {
                    .common-flex();
                    font-size: 13px;
                    line-height: 13px;
                    font-weight: 400;
                    margin-top: 12px;
                    margin-right: 48px;
                    width: 100%;
                    .field-name {
                        color: #999999;
                    }
                    .field-name-tel{
                      width: 60%;
                    }
                    .field-content {
                        color: @header-text-color;
                    }
                    &.no-wrap {
                        justify-content: space-between;
                        width: 100%;
                        margin-right: 0;
                    }
                    .sub-field-section {
                        display: flex;
                        &:last-child {
                            margin-right: 30px;
                        }
                    }
                }
            }
            .section-footer {
                .common-flex-between();
                .button-section {
                    margin-top: 12px;
                }
                .count-date {
                    margin-top: 12px;
                    width: 100%;
                    .common-flex();
                    align-items: flex-end;
                    justify-content: flex-end;
                    font-size: 13px;
                    color: #999999;
                    line-height: 20px;
                    font-weight: 400;
                    .date-strong {
                        font-size: 24px;
                        color: #ff7282;
                        line-height: 24px;
                        font-weight: bold;
                        padding: 0 4px;
                    }
                }
                .recommend-again {
                    margin-top: 12px;
                    .common-flex();
                    align-self: flex-end;
                    margin-bottom: 5px;
                    .iconfont {
                        margin-right: 4px;
                        font-size: 15px;
                        color: @header-text-color;
                    }
                    span {
                        font-size: 13px;
                        line-height: 13px;
                        color: @header-text-color;
                    }
                }
            }
        }
        .top-containe-wrap {
            display: flex;
            .avatar {
                margin: 15px 0 0 15px;
            }
            &.is-avatar {
                .top-container {
                    padding-left: 10px;
                    .section-body {
                        .sub-field-section {
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
        .bottom-container {
            .action-list {
                .common-flex-between();
                position: relative;
                .action-button {
                    .common-flex-center();
                    position: relative;
                    width: 100%;
                    height: 45px;
                    font-size: 13px;
                    color: @header-text-color;
                    line-height: 13px;
                    font-weight: 400;
                    border-top: 1px solid #f4f4f4;
                    .iconfont {
                        padding-right: 5px;
                    }
                    &::before {
                        position: absolute;
                        left: 0;
                        top: 16px;
                        content: '';
                        width: 1px;
                        height: 13px;
                        background: #eaeaea;
                    }
                    &:first-child {
                        &::before {
                            width: 0;
                        }
                    }
                }
            }
        }
        .took-info {
            padding: 0 10px;
            margin-bottom: 12px;
            margin-left: 15px;
            width: calc(100% - 50px);
            height: 32px;
            background: #f5f7f9;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .tag-item {
                .common-flex-center();
                min-width: 45px;
                height: 18px;
                font-size: 11px;
                color: @theme-color;
                line-height: 11px;
                font-weight: 500;
                margin-right: 6px;
                padding: 0 6px;
                border-radius: 2px;
            }
            .name {
                margin-right: 16px;
                flex: 1;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 13px;
            }
            .date {
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 13px;
            }
        }
    }
}
</style>
