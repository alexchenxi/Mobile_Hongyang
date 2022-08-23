<template>
  <div class="common-page">
    <div class="common-page-top">
      <top-bar
        title="带看确认单详情"
        :need-white="true"
      />
    </div>
    <div
      ref="topBg"
      class="top-bg"
    >
      <section class="base-info">
        <p class="name">
          {{ bases.length ? bases[0].fieldValue : '' }}
        </p>
        <ul class="base-ul">
          <template v-for="(item, index) in bases">
            <li
              v-if="index > 0"
              :key="item.fieldkey"
              class="base-li"
            >
              <span class="label">{{ item.fieldName }}：</span>
              {{ item.fieldValue }}
            </li>
          </template>
        </ul>
      </section>
    </div>
    <div
      class="common-page-middle"
      :style="{ height: parseInt(isShowSign ? pageContentWithButtonHeight : pageWithoutTabHeight) - topBgHeight + 'px', 'margin-top': topBgHeight - topHeight + 'px' }"
    >
      <van-tabs
        v-model="active"
        scrollspy
        sticky
        :offset-top="topBgHeight"
      >
        <van-tab
          v-for="(value, key) in typeList"
          :key="key"
          :title="value.name"
        >
          <div class="section-title">
            <span class="title-bar" />
            {{ value.name }}
          </div>
          <template v-for="x in listData[key]">
            <van-cell-group
              v-if="key === 'signs'"
              :key="x.fieldkey"
              :class="x.fieldValue ? 'hideline' : ''"
            >
              <van-cell
                :title="x.fieldName"
                :class="x.hasSigned ? '' : 'no-sign'"
                :value="x.hasSigned ? x.signTime : '未签字'"
              />
              <van-image
                v-if="x.fieldValue"
                class="sign-img"
                fit="contain"
                :src="x.fieldValue"
              />
            </van-cell-group>
            <van-cell-group
              v-else
              :key="x.fieldkey"
            >
              <van-cell
                :title="x.fieldName"
                :value="x.fieldValue"
              />
            </van-cell-group>
          </template>
          <div class="split" />
        </van-tab>
      </van-tabs>
    </div>
    <div
      v-if="declare.show && declare.info"
      class="declare"
      :style="{ bottom: bottomHeight + 'px' }"
    >
      <div class="title">
        <span>
          <i class="iconfont icontishi2" />
          声明：
        </span>
        <i
          class="iconfont icondel"
          @click="declare.show = false"
        />
      </div>
      <p>{{ declare.info }}</p>
    </div>
    <div
      v-if="isShowSign"
      class="common-fix-bottom"
      :style="{ paddingBottom: bottomSafe }"
    >
      <van-button
        round
        block
        type="save"
        native-type="submit"
        @click="sign"
      >
        在线签名
      </van-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import API from '@/request/api/my'
export default {
    name: 'CustChooseConsultant',
    components: {
        TopBar
    },
    computed: {
        ...mapGetters(['tabData', 'safeArea', 'currentRole'])
    },
    data() {
        return {
            active: 'customers',
            // 导航高度(包括安全距离)
            topHeight: 0,
            // 按钮高度(包括安全距离)
            bottomHeight: 0,
            // 头部背景高度
            topBgHeight: 183,
            // 是否展示签名
            isShowSign: false,
            declare: {
                show: true,
                info: ''
            },
            id: '',
            // 基本信息
            bases: [],
            typeList: {
                customers: {
                    name: '客户信息',
                    code: 'customers'
                },
                channels: {
                    name: '报备人信息',
                    code: 'channels'
                },
                signs: {
                    name: '签字信息',
                    code: 'signs'
                }
            },
            listData: {
                customers: [],
                channels: [],
                signs: []
            }
        }
    },
    created() {
        this.id = this.$route.query.id
        this.getDetail()
    },
    mounted() {
        this.topHeight = this.topBarHeight + parseFloat(this.safeArea.topSafe)
        this.bottomHeight = this.buttonAreaHeight + parseFloat(this.safeArea.bottomSafe)
    },
    methods: {
        // 获取详情
        getDetail() {
            API.getTakelookDetail(this.id).then(res => {
                this.listData.signs = res.autograph
                for (let item of res.content) {
                    if (item.type === 2) {
                        this.listData.customers.push(item)
                    }
                    if (item.type === 3) {
                        this.listData.channels.push(item)
                    }
                    if (item.type === 1) {
                        this.bases.push(item)
                    }
                    if (item.type === 5) {
                        this.declare.info = item.fieldName
                    }
                }
                for (let v in this.typeList) {
                    if (!this.listData[v].length) {
                        delete this.typeList[v]
                    }
                }
                let itemData = this.listData.signs.find(x => x.fieldKey === this.currentRole.roleCode)
                this.isShowSign = itemData ? (itemData.hasSigned ? false : true) : false
                if (!this.isShowSign) {
                    this.bottomHeight = parseFloat(this.safeArea.bottomSafe)
                }
                this.topBgHeight = this.$refs.topBg.offsetHeight
            })
        },
        // 签名
        sign() {
            this.$router
                .push({
                    path: '/signature',
                    query: {
                        id: this.id
                    }
                })
                .catch(() => {})
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    .footer-bar {
        .common-flex-center();
        height: @tab-bar-height;
        padding: 0 15px;
    }
}
.top-bg {
    position: absolute;
    top: 0;
    height: 183px;
    width: 100%;
    background: url('@{baseImgUrl}/takelook-bg.png');
    .base-info {
        position: absolute;
        bottom: 15px;
        color: #fff;
        padding: 15px;
        width: calc(100% - 30px);
        .name {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 500;
        }
        .base-li {
            display: inline-block;
            width: 50%;
            font-size: 14px;
            .label {
                color: rgba(255, 255, 255, 0.59);
            }
        }
    }
}
.common-page-middle {
    z-index: 2;
    position: relative;
    .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        height: 56px;
        display: flex;
        align-items: center;
        position: relative;
        &::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            left: 0;
            border-bottom: 1px solid #ebedf0;
            transform: scaleY(0.5);
        }
        .title-bar {
            margin-right: 12px;
            width: 3px;
            height: 16px;
            background: @theme-color;
        }
    }
    .split {
        width: 100%;
        height: 10px;
        background: #f6f8fa;
    }
    .sign-img {
        padding: 0 15px 15px 15px;
        height: 150px;
        width: calc(100% - 30px);
        /deep/ .van-image__img {
            background: #f6f7f9;
        }

    }
}
.declare {
    position: fixed;
    padding: 12px 15px;
    width: calc(100% - 30px);
    background: #fff4f5;
    z-index: 2;
    color: @danger-color;
    font-size: 14px;
    .title {
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .icontishi2 {
        margin-right: 4px;
        font-size: 14px;
    }
    .icondel {
        font-size: 22px;
    }
}
/deep/ .van-cell::after {
    left: 0;
}
/deep/ .hideline .van-cell::after {
    left: 15px;
    border-bottom: none;
}
/deep/ .van-cell__title span {
    font-size: 15px;
}
/deep/ .van-tab__pane:last-child {
    .split {
        display: none;
    }
}

/deep/ .van-cell__value {
    color: #333;
}
/deep/ .no-sign .van-cell__value {
    color: #999;
}
</style>
