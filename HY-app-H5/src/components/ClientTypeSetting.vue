<template>
    <div v-if="showSetting">
        <div class="close" @click="handleClose">
			<!-- <i class="iconfont icondel"></i> -->
			<img class="close_img" :src="$baseImgUrl + '/case/home/pop_close.png'">
		</div>
        <van-dialog  class="setting-tag-dialog" title="客户类型选择" v-model="showSetting"
                     :show-confirm-button="false" :beforeClose="handleClose" getContainer="body">
            <div class="top">
                <i class="iconfont icontishi2"></i>请谨慎选择，若选择为无效客户，客户将流 失到公客池
            </div>
            <div class="content">
                <div class="item" @click="handleValid">
                    <img class="status-img" :src="$baseImgUrl + '/case/home/valid-icon.png'" alt="">
                    <span class="status-text">有效客户</span>
                </div>
                <div class="item" @click="handleInValid">
                    <img class="status-img" :src="$baseImgUrl + '/case/home/invalid-icon.png'" alt="">
                    <span class="status-text">无效客户</span>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>

import API from '@/request/api/caseSystem/customer'
import { mapGetters } from 'vuex'

export default {
    name: 'ClientTypeSetting',
    data() {
        return {
        }
    },
    computed: { ...mapGetters(['projectId']) },
    props: {
        showSetting: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    methods: {
        // 有效客户
        handleValid() {
            this.$router.push({
                path: '/case/questionnaire',
                query: {
                    oppId: this.item.oppId,
                }
            }).catch(()=>{})
        },
        // 无效客户
        handleInValid() {
            this.$emit('handleClose', {flag: false, status: ''})
            this.$dialog.confirm({
                    title: '设置无效客户',
                    message:
                        '是否设置为无效客户',
                })
                .then(() => {
                    let params = {
                        clientIdList: [this.item.clientId],
                        abandonReasonCode: '21',
                        customerLevel: 'E',
                        projectId: this.projectId,
                        remark: '无效到访客户'
                    }
                    API.abandonQuestionnaire(params).then(data => {
                        this.$toast('操作成功')
                        this.$emit('handleClose', {flag: false, status: '无效'})
                    })
                })
                .catch(() => {
                    // on cancel
                });
        },
        // 关闭弹窗
        handleClose() {
            this.$emit('handleClose', {flag: false, status: ''})
        }
    }
}
</script>

<style scoped lang="less">
.close {
    position: fixed;
    top: 15%;
    right: 4%;
    z-index: 2008;
    .icondel {
        color: #fff;
        font-size: 30px;
    }
	.close_img {
		width: 26.5px;
		height: 26.5px;
	}
}
.top {
    color: @theme-color;
    font-size: 14px;
    margin: 15px;
    .icontishi2 {
        margin-right: 6px;
    }
}
.content {
    display: flex;
    justify-content: space-between;
    padding: 25px 27px;
    .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .status-img {
            width: 120px;
            height: 120px;
        }
        .status-text {
            margin-top: 12px;
        }
    }
}
</style>
