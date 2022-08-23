<template>
    <div class="common-page">
        <TopBar title="更多相册"></TopBar>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <div class="container">
                <template v-for="(group, index) in data">
                    <div v-if="group.list && group.list.length > 0" :key="index" class="section">
                        <div class="section-title">{{ group.type }}</div>
                        <div class="section-content">
                            <van-grid :column-num="4" :gutter="9" :border="false">
                                <van-grid-item v-for="(item, itemIndex) in group.list" :key="itemIndex">
                                    <van-image width="75" height="75" :src="item.uri" @click="previewImg(group.list, itemIndex)" />
                                </van-grid-item>
                            </van-grid>
                        </div>
                    </div>
                </template>
            </div>
        </main>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import { mapGetters } from 'vuex'
import API from '@/request/api/onlineMarketing'
export default {
    name: 'PhotoAlbum',
    components: {
        TopBar
    },
    data() {
        return {
            data: []
        }
    },
    computed: { ...mapGetters(['projectId']) },
    mounted() {
        this.formatData()
    },
    methods: {
        async formatData() {
            let res = await API.getProjectDetail({
                lpId: this.projectId
            })
            const list = res.lpxiangce
            let obj = {}
            let urls = []
            list.map(item => {
                if (!obj[item.imgType]) {
                    obj[item.imgType] = []
                }
                urls.push(item.uri)
                obj[item.imgType].push(item)
            })
            for (var key in obj) {
                this.data.push({
                    type: key,
                    list: obj[key]
                })
            }
        },
        previewImg(list, index) {
            let imgList = list.map(item => {
                return item.uri
            })
            this.$utils.previewImageList(imgList, index)
        }
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    padding: 0 15px;
    .section {
        padding-bottom: 18px;
        .section-title {
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000000;
            line-height: 18px;
            padding: 24px 0 18px;
        }
        /deep/ .van-grid {
            padding-left: 0 !important;
            .van-grid-item__content {
                padding: 0;
            }
        }
    }
}
</style>
