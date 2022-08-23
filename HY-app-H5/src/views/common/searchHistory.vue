<template>
    <div class="common-page">
        <div class="search-section" :style="{ paddingTop: topSafe }">
            <form action="/">
                <search-bar :placeholder="placeholder" back filter @focus="onFocus" @blur="onBlur" @changeInput="changeInput" @returnSearch="search(searchVal)">
                    <div slot="filter-append"><span :class="['search-text', isFocus ? 'search-focused' : '']" @click="search(searchVal)">搜索</span></div>
                </search-bar>
            </form>
        </div>
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <van-empty v-if="searchedList.length === 0" class="custom-image" :image="$baseImgUrl + '/no-history.png'" description="没有任何搜索记录~" />
            <template v-else>
                <div class="history-title">
                    历史记录
                    <i @click="removeHistory" class="iconfont iconshanchu"></i>
                </div>
                <div class="page-historySearch">
                    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                        <van-cell @click="search(item)" v-for="item in searchedList" :key="item" :title="item" />
                    </van-list>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
import SearchBar from '@c/SearchBar'
import { getSearchPlaceholder, commonData } from '@/config/commonData'
export default {
    name: 'searchHistory',
    components: {
        SearchBar,
        Toast,
    },
    data() {
        return {
            historyList: [],
            searchedList: [],
            loading: false,
            finished: false,
            refreshing: false,
            placeholder: '',
            currentObj: {},
			isFocus: false,
			searchVal: ''
        }
    },
    created() {},
    mounted() {
        this.currentObj = commonData.configData[this.$route.query.type]
        this.init()
        this.initSearchText()
        // this.$utils.inputHandle()
    },
    methods: {
        initSearchText() {
            if (this.$route.query.dataType) {
                this.placeholder = getSearchPlaceholder(this.$route.query.dataType) ? getSearchPlaceholder(this.$route.query.dataType) : '请输入客户姓名/手机号'
            } else {
                this.placeholder = '请输入客户姓名/手机号'
            }
        },
        //初始化获取缓存搜索列表
        init() {
            this.historyList = JSON.parse(localStorage.getItem(this.currentObj.storageText)) || []
            const historyList = JSON.parse(JSON.stringify(this.historyList))
            this.searchedList = historyList?.length ? historyList.splice(0, 6) : []
        },
        removeHistory() {
            localStorage.removeItem(this.currentObj.storageText)
            this.init()
        },
        //选中下一步操作
        searchDone(item) {
            //案场客户
            this.$router.push({
                path: this.currentObj.path,
                query: {
                    searchKey: item,
                    dataType: this.$route.query.dataType,
                    activeTab: this.$route.query.activeTab
                },
            }).catch(()=>{})
        },
        search(val) {
            //存缓存(有搜索数值时)，被搜索的内容放到首位
            if (!!val) {
                let historyList = []
                historyList = JSON.parse(localStorage.getItem(this.currentObj.storageText)) || []
                let indexValue = historyList.indexOf(val)
                if (indexValue > -1) {
                    for (var i = 0; i < historyList.length; i++) {
                        if (historyList[i] === val) {
                            historyList.splice(i, 1)
                            break
                        }
                    }
                }
                historyList.unshift(val)
                localStorage.setItem(this.currentObj.storageText, JSON.stringify(historyList))
                this.searchDone(val)
            } else {
                Toast(this.placeholder)
            }
        },
        onLoad() {
            this.loading = false
        },
        goBack() {
            this.$router.go(-1)
        },
		onFocus() {
			this.isFocus = true
		},
		onBlur() {
			this.isFocus = false
		},
		changeInput(val) {
			this.searchVal = val
		}
    },
}
</script>
<style scoped lang="less">
.van-cell {
    font-size: 16px;
}

.search-section {
    padding: 0 15px;
    background: #ffffff;
	.search-text {
		font-size: 15px;
		line-height: 15px;
		color: #999999;
		font-weight: 400;
	}
	.search-focused {
		color: @theme-color;
	}
}

.history-title {
    background: @bg-color;
    .common-flex-between();
    padding: 18px 15px;
    height: 14px;
    font-size: 14px;
    color: #999990;
    line-height: 14px;
}
.common-page-container {
    position: relative;
}
.page-historySearch {
    height: calc(100% - 50px);
    overflow: auto;
}
.custom-image {
	margin-top: 150px;
	/deep/ .van-empty__description {
		margin-top: -13px;
	}
}
</style>
