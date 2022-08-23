<template>
    <div class="common-page">
        <top-bar title="楼盘信息" />
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <section class="info-section">
                <template v-for="x in list">
                    <van-cell :key="x.lable" :class="x.splitField ? 'split' : ''" :title="x.lable" :value="info[x.fieldName]"></van-cell>
                </template>
            </section>
        </div>
    </div>
</template>
<script>
import TopBar from '@c/TopBar'
import API from '@/request/api/onlineMarketing'
import { mapGetters } from 'vuex'
export default {
    name: 'UserInfo',
    components: {
        TopBar
    },
    data() {
        return {
            list: [
                {
                    lable: '项目名称',
                    fieldName: 'salesName',
                    splitField: true
                },
                {
                    lable: '户型面积(m²)',
                    fieldName: 'areaRange'
                },
                {
                    lable: '销售状态',
                    fieldName: 'salesStatusName'
                },
                {
                    lable: '装修情况',
                    fieldName: 'zhuangxiu'
                },
                {
                    lable: '开盘时间',
                    fieldName: 'kpDate',
                    splitField: true
                },
                {
                    lable: '交房时间',
                    fieldName: 'jfDate'
                },
                {
                    lable: '售楼处热线',
                    fieldName: 'acTel'
                },
                {
                    lable: '售楼处地址',
                    fieldName: 'acAddress'
                },
                {
                    lable: '项目地址',
                    fieldName: 'lpAddress'
                },
                {
                    lable: '优惠信息',
                    fieldName: 'discountInfo',
                    splitField: true
                },
                {
                    lable: '佣金说明',
                    fieldName: 'commissionDescription'
                },
                {
                    lable: '产品类型',
                    fieldName: 'productType',
                    splitField: true
                },
                {
                    lable: '产权年限',
                    fieldName: 'chanquan'
                },
                {
                    lable: '建筑面积',
                    fieldName: 'jianzhumj'
                },
                {
                    lable: '占地面积',
                    fieldName: 'zhandimj'
                },
                {
                    lable: '车位信息',
                    fieldName: 'chewei'
                },
                {
                    lable: '容积率',
                    fieldName: 'rongjilv'
                },
                {
                    lable: '绿化率',
                    fieldName: 'lvhualv'
                },
                {
                    lable: '物业公司',
                    fieldName: 'wyCompanyName'
                },
                {
                    lable: '楼盘特色',
                    fieldName: 'lptese'
                }
            ],
            info: {}
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    mounted() {
        this.getMoreProjectInfo()
    },
    methods: {
        // 获取更多信息
        getMoreProjectInfo() {
            API.getMoreProjectInfo({
                lpId: this.projectId
            }).then(res => {
                this.info = res
                this.info.salesStatusName = res.salesStatus === 1 ? '在售' : '待售'
            })
        }
    }
}
</script>
<style scoped lang="less">
.common-page-container {
    background-color: #f6f8fa;
    .info-section {
        /deep/ .van-cell.split {
            margin-top: 10px;
        }
        /deep/ .van-cell__title span {
            font-size: 15px;
            color: #999;
        }
        .van-cell__value {
            flex: 2;
            font-size: 15px;
            color: @header-text-color;
        }
    }
}
</style>
