<template>
    <div class="common-page ">
        <main class="common-page-content" :style="{ height: pageContentHeight }">
            <div class="top-section" :style="{ paddingTop: topSafe }">
                <div class="project-section">
                    <ProjectSelection whiteColor></ProjectSelection>
                </div>
                <DataStatistics />
            </div>
            <div class="section">
                <SubscribeTrend />
            </div>
        </main>
        <tab-bar active="/manager/home" :tabData="tabData" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ProjectSelection from './components/ProjectSelection'
import TabBar from '@c/TabBar'
import DataStatistics from './components/DataStatistics'
import SubscribeTrend from './components/SubscribeTrend'
import CommonApi from '@/request/api/commonApi'
export default {
    name: 'index',
    components: {
        ProjectSelection,
        TabBar,
        DataStatistics,
        SubscribeTrend
    },
    data() {
        return {
            projetcArray: []
        }
    },
    computed: { ...mapGetters(['tabData', 'menuActive', 'projectId', 'user', 'device', 'currentRole']) },
    created() {
        if (!this.projectId) return
    },
    mounted() {
        this.$el.style.setProperty('@theme-color', 'red')
    },
    methods: {},
    watch: {
        projectId() {
            if (!this.projectId) return
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .common-page-content {
        .top-section {
            background: linear-gradient(180deg, #0f58f1 0%, #266eff 100%);
            .project-section {
                padding: 0 15px;
            }
        }
    }
}
</style>
