<template>
    <div>
        <div class="container">
            <div>
                <div class="row" @click="goReportList('ZT.REPORT.TJ','今日报备')">
                    <p>{{todayReportAndVisitCount.reportGroupNum||0}}</p>
                    <p>今日报备（组）</p>
                </div>
                <div class="row" @click="goReportList('ZT.REPORT.RG','')">
                    <p>{{todayReportAndVisitCount.orderSetsNum||0}}</p>
                    <p>今日认购（套）</p>
                </div>
            </div>
            <span class="split">|</span>
            <div>
                <div class="row"  @click="goReportList('ZT.REPORT.DF','今日到访')">
                    <p>{{todayReportAndVisitCount.visitGroupNum||0}}</p>
                    <p>今日到访（组）</p>
                </div>
<!--                <span class="split">|</span>-->
                <div class="row" @click="goReportList('ZT.REPORT.QY','')">
                    <p>{{todayReportAndVisitCount.contractSetsNum||0}}</p>
                    <p>今日签约（套）</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/request/api/selfExtension/home'

export default {
    name: 'DateStatistics',
    props: {
        todayReportAndVisitCount: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            data: {
                reportNum: 0,
                visitNum: 0
            }
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole']) },
    mounted() {
    },
    methods: {
        goReportList(menuId,title){
            if(!menuId) return
            const form={
                projectId:this.projectId,
                roleCode:this.currentRole.roleCode,
                menuId:menuId,
                dateType:1
            }
            if (['ZT.REPORT.RG','ZT.REPORT.QY'].includes(form.menuId)) {
                this.$router
                    .push({
                        path: '/extension/customerOrderOrSign',
                        query: form
                    })
                    .catch(() => {
                    })
            }else {
                form.title = title
                this.$router.push({
                    path: '/extension/customerHome',
                    query:form
                }).catch(()=>{})
            }
        },
    }
}
</script>

<style scoped lang="less">
.container {
    padding: 24px 28px;
    background-image: url("@{baseImgUrl}/case/home/red.png");
    // background-position: left -15px bottom -20px;
    background-repeat: no-repeat;
    border-radius: 4px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    height: 137px;
    position: relative;
    width: calc(100% + 30px);
    box-sizing: border-box;
    background-image: url("@{baseImgUrl}/case/home/red.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-left: -15px;

    .row {
        text-align: center;

        > p:first-child {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 2px;
        }

        > p:last-child {
            font-size: 13px;
            opacity: 0.43;
        }
    }

    .split {
        opacity: 0.43;
    }
}
</style>
