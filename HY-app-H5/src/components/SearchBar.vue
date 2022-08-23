<template>
    <div class="search-bar">
        <div class="search-container">
        	<div class="search-pre" v-if="back">
                 <div  class="icon-container" @click="handleGoBack">
                    <i class="iconfanhui iconfont" ></i>
                </div>
            </div>
            <div class="search-l">
                <form action="/">
                    <van-search
                        :disabled="disabled"
                        :readonly="readonly"
                        shape="round"
                        :autofocus="autofocus"
                        v-model="searchValue"
                        :placeholder="placeholder"
                        @input="onChange"
                        @search="onSearch"
                        @focus="onFocus"
                        @blur="onBlur"
                    >
                        <i class="iconfont iconsousuo search-icon" slot="left-icon"></i>
                    </van-search>
                </form>
            </div>
            <div class="search-r" v-if="filter">
                <div class="filter-button">
                    <slot name="filter-append"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchBar',
    props: {
        placeholder: {
            type: String,
            default: '',
        },
        filter: {
            type: Boolean,
            default: false,
        },
        back: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        data: {
            type: String,
        },
        disabled: {
            type: Boolean,
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            searchValue: '',
        }
    },
    watch: {
        data(val) {
            this.searchValue = val
        },
    },
    methods: {
        onSearch(val) {
            this.$emit('returnSearch', val)
        },
        onFocus(e) {
            this.$emit('focus', e)
        },
        onBlur(e) {
            window.scroll(0,0)
            this.$emit('blur', e)
        },
        onChange(e) {
            this.$emit('changeInput', e)
        },
         // 左侧返回按钮操作
        handleGoBack() {
            if (this.backPath) {
                this.$emit('back')
            } else {
                this.$router.go(-1)
            }
        },
        clear() {
            this.searchValue = ''
        }
    },
}
</script>

<style scoped lang="less">
.search-bar {
    height: @search-bar-height;
    .common-flex-between();
    // align-items: flex-start;
    .search-container {
        flex-grow: 1;
        .common-flex-between();
		.iconfanhui{
			margin-right: 8px;
		}
        .search-l {
            flex-grow: 1;
            ::v-deep .van-search {
                display: flex;
                align-items: flex-start;
                height: 34px;
                padding: 0;
                background: none;
                .van-search__content {
                    height: 100%;
                    background-color: #f5f7f9;
                    .van-field__left-icon {
                        .iconsousuo {
                        	padding: 5px;
                            font-size: 13px;
                            color: #cccccc;
                        }
                    }
                    .van-field__control {
                        font-size: 12px;
                    }
                }
            }
        }
        .search-r {
            flex-grow: 0;
            margin-left: 15px;
        }
    }
}
</style>
