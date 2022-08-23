<template>
    <div class="common-page">
        <top-bar :title="title" />
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <iframe id="frameNav" name="frameNav" style="width:100%;height:100%" frameborder="0" :src="$route.query.src"></iframe>
        </div>
    </div>
</template>
<script>
import TopBar from '@c/TopBar'
export default {
    name: 'VRView',
    components: {
        TopBar
    },
    data() {
        return {
            title: 'VR'
        }
    },
    created() {},
    mounted() {},
    methods: {}
}
</script>
<style scoped lang="less"></style>
