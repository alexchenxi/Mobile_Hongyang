<template>
    <div class="card-list">
        <div
            v-for="item in list"
            :key="item.id"
            class="card-item"
            @click="goDetail(item)"
        >
            <div class="title-wrap">
                <span class="title">{{ item.name }}</span>
                <div class="target-item">
                    <div
                        v-if="item.autoStatus===0"
                        class="tag-item end common-tag-red"
                    >
                        手动终止
                    </div>
                    <div
                        class="tag-item"
                        :class="getColor(item)"
                    >
                        {{ getText(item) }}
                    </div>
                </div>
            </div>
            <div class="field">
                <label class="label">创建人：</label>
                {{ item.createBy }}
            </div>
            <div class="field">
                <label class="label">参与人数：</label>
                {{ item.userNum }} 人
            </div>
            <div class="field">
                <label class="label">任务周期：</label>
                {{ item.beginTime.split(' ')[0] }}~{{ item.endTime.split(' ')[0] }}
            </div>
            <div class="field">
                <label class="label">任务指标(实际/目标)：</label>
                {{ item.finishedNum }}/{{ item.targetNum }}
            </div>
            <div
                v-if="item.isShowReportButton === 1"
                class="recommend"
                @click.stop="recommend(item)"
            >
                立即报备
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTaskListStatus } from '@/config/commonData'

export default {
    name: 'TaskSection',
    props: {
        list: Array
    },
    computed: { ...mapGetters(['currentRole']) },
    mounted() {
    },
    methods: {
        goDetail(item) {
            this.$router.push({
                path: '/extension/taskDetail',
                query: {
                    id: item.id
                }
            }).catch(() => {
            })
        },
        // 立即报备
        recommend(item) {
            this.$router.push({
                path: '/extension/customer/recommend',
                query: {
                    channelType: item.channelType,
                    taskName: item.name
                }
            }).catch(() => {
            })
        },
        getColor(item) {
            return getTaskListStatus(item.status).tagClass
        },
        getText(item) {
            return getTaskListStatus(item.status).name
        }
    }
}
</script>
<style scoped lang="less">
.card-item {
    position: relative;
    padding: 11px 15px;

    .title-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: @header-text-color;
            margin-bottom: 8px;
        }
    }

    .tag-item {
        display: inline-block;
        border-radius: 2px;
        font-size: 11px;
        padding: 0 7px;
        line-height: 18px;
        text-align: center;
        border-radius: 2px;
        font-size: 11px;

        &.end {
            margin-right: 6px;
        }
    }

    & > .field {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        margin-bottom: 10px;

        .label {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
        }
    }

    .recommend {
        position: absolute;
        bottom: 18px;
        right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 78px;
        height: 30px;
        font-size: 13px;
        color: #db0826;
        border: 1px solid #db0826;
        border-radius: 6px;
    }

    .icon-user {
        margin-right: 6px;
        width: 18px;
        height: 18px;
        background: url("@{baseImgUrl}/extension/task/icon-user.png");
        background-size: 100% 100%;
    }

    .icon-target {
        margin-right: 6px;
        width: 18px;
        height: 18px;
        background: url("@{baseImgUrl}/extension/task/icon-target.png");
        background-size: 100% 100%;
    }

    .progress {
        display: inline-block;
        width: 89px;
        height: 5px;
        vertical-align: middle;
    }
}
</style>
