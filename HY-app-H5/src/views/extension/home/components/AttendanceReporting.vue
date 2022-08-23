<template>
    <div>
        <div class="customer-container">
            <div class="li" v-for="(item, index) in list" :key="index" v-code="item.code" @click="goHref(item.href)">
                <div>
                    <p class="title">{{item.title}}<span><span class="right-arrow"></span></span></p>
                    <p class="describe">{{item.tip}}</p>
                </div>
                <template v-if="item.title !== '待办中心'">
                    <img class="img" :src="$baseImgUrl + item.img">
                </template>
                <template v-else>
                    <van-badge :content="toDoCount" :show-zero="false" v-if="currentRole.roleCode === 'ZT_MANAGER' && item.title === '待办中心' && toDoCount">
                        <img class="img" :src="$baseImgUrl + item.img">
                    </van-badge>
                    <img v-else class="img" :src="$baseImgUrl + item.img">
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'AttendanceReporting',
        props: ['toDoCount'],
        computed: { ...mapGetters(['currentRole']) },
        data() {
            return {
                list: [
                    {
                        title: '考勤签到',
                        tip: '考勤签到',
                        href: '/extension/attendanceSign',
                        code: ['ZT.HOME.BUTTON','ZT.HOME.BUTTON.SIGN'],
                        img: '/extension/home/kaoqin.png'
                    },
                    {
                        title: '报备客户',
                        tip: '一键报备',
                        href: '/extension/customer/recommend',
                        code: ['ZT.HOME.BUTTON','ZT.HOME.BUTTON.RECOMMEND'],
                        img: '/extension/home/baobei.png'
                    },
                    {
                        title: '待办中心',
                        tip: '待办审批',
                        href: '/my/toDoCenterMiddlePage',
                        code: ['ZT.HOME.BUTTON','ZT.HOME.BUTTON.SIGN'],
                        img: '/extension/home/baobei.png'
                    }
                ]
            }
        },
        mounted() {
            if (this.currentRole.roleCode !== 'ZT_MANAGER') {
                this.list = [
                    {
                        title: '考勤签到',
                        tip: '考勤签到',
                        href: '/extension/attendanceSign',
                        code: ['ZT.HOME.BUTTON','ZT.HOME.BUTTON.SIGN'],
                        img: '/extension/home/kaoqin.png'
                    },
                    {
                        title: '报备客户',
                        tip: '一键报备',
                        href: '/extension/customer/recommend',
                        code: ['ZT.HOME.BUTTON','ZT.HOME.BUTTON.RECOMMEND'],
                        img: '/extension/home/baobei.png'
                    },
                ]
            }
        },
        methods: {
            goHref(val) {
                this.$router.push({
                    path: val,
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .customer-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .li {
            width: 168px;
            height: 95px;
            padding: 29px 7px 29px 15px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0px 3px 10px 0px rgba(49, 51, 54, 0.06);
            /deep/ .van-badge--fixed {
                right: 14px;
            }
            .img {
                width: 66px;
                height: 66px;
            }
            color: #333;
            .title {
                font-size: 15px;
                .right-arrow {
                    display: inline-block;
                    width: 0;
                    height: 0;
                    border: 4px solid transparent;
                    border-left: 4px solid #A7A7A7;
                    margin-left: 10px;
                }
            }
            .describe {
                color: #999;
                font-size: 11px;
                margin-top: 7px;
            }
        }
    }
</style>
