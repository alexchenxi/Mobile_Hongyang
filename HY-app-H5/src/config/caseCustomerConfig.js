import Vue from 'vue'
import { commonData } from '@/config/commonData'
export const customerConfig = [
    //空白任务
    {
        name: '未完善空白任务',
        code: 'ST.CUSTOMER.UNBLANK',
        nameField: 'customerName',
        fieldList: [
            {
                name: '最新到访时间',
                field: 'receptionTime',
            },

            {
                name: '接待时长',
                field: 'receptionDuration',
                unit: '分钟',
            },
        ],
        filterList: [
            {
                name: '最新到访时间区间',
                type: 'date',
                field: 'dateTime',
                dateName: ['receptionTimeBegin', 'receptionTimeEnd'],
            },
        ],
        actions: {
            reception: true,
            information: true,
        },
    },
    {
        name: '已完善空白任务',
        code: 'ST.CUSTOMER.BLANK',
        nameField: 'customerName',
        fieldList: [
            {
                name: '最新到访时间',
                field: 'receptionTime',
            },

            {
                name: '接待时长',
                field: 'receptionDuration',
                unit: '分钟',
            },
            // {
            //     name: '信息完善时间',
            //     field: 'fullCompletedate'
            // }
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'visitChannelOneName',
            },
        ],
        filterList: [
            {
                name: '分配时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['receptionTimeBegin', 'receptionTimeEnd'],
            },
            {
                name: '白板信息完善时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['fullCompletedateBegin', 'fullCompletedateEnd'],
            },
        ],
        actions: {
            reception: true,
            information: true,
        },
    },
    //全民营销待分配
    {
        name: '全民营销待分配',
        code: 'ST.CUSTOMER.NOVISITASSIGN',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '创建时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                ],
            },
            {
                name: '创建时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: true,
        },
    },
    // 全民营销已分配
    {
        name: '全民营销已分配',
        code: 'ST.CUSTOMER.NOVISIT',
        nameField: 'customerName',
        fieldList: [
            {
                name: '创建时间',
                field: 'userStatusTime',
            },
            // {
            //     name: '未到访保护期截止时间',
            //     field: 'unvisitProtectDate'
            // }
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                ],
            },
            {
                name: '创建时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: false,
            setTag: true,
            switch: true,
        },
    },
    // 逾期
    {
        name: '逾期',
        code: 'ST.CUSTOMER.OVERDUE',
        nameField: 'customerName',
        fieldList: [
            {
                name: '逾期时间',
                field: 'userStatusTime',
            },
        ],
        overdueDays: {
            field: 'overdueDays',
        },
        tagList: [
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
            {
                name: '逾期类型',
                type: 'loseReason',
                field: 'loseReason',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '逾期类型',
                type: 'check',
                field: 'overTypeList',
                list: [
                    {
                        label: '逾期未到访',
                        value: '1',
                    },
                    {
                        label: '首访逾期处理',
                        value: '2',
                    },
                    {
                        label: '逾期未跟进',
                        value: '3',
                    },
                    {
                        label: '逾期未成交',
                        value: '4',
                    },
                    {
                        label: '逾期未签约',
                        value: '5',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'customerLevel',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '逾期时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    //今日接待
    {
        name: '今日接待',
        code: 'ST.HOME.ACQK.JDZKH',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '创建时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'customerStep',
                field: 'customerStep',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
    },
    //今日跟客情况
    {
        name: '今日跟客情况',
        code: 'ST.HOME.ACQK.GJQK',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '最近跟进时间',
                field: 'lastFollowDate',
            },
        ],
        tagList: [
            {
                name: '首访复访',
                type: 'visit',
                field: 'isFirstVisit',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
    },
    {
        name: '接待中',
        code: 'ST.CUSTOMER.FOLLOWING',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '创建时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户状态',
                type: 'isVisit',
                field: 'status',
                tagList: { 10: '报备成功', 20: '已到访', 30: '已认筹', 40: '已认购', 50: '已签约', 60: '已回款' },
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
    },
    //签到客户
    {
        name: '签到',
        code: 'ST.HOME.ACQK.QDGW',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '创建时间',
                field: 'userStatusTime',
            },
        ],
    },
    //首访客户
    {
        name: '首访客户',
        code: 'AC.STAT.SFL',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '首访时间',
                field: 'userStatusTimeStr',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
    },
    //复访客户
    {
        name: '复访客户',
        code: 'AC.STAT.FFL',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '复访时间',
                field: 'userStatusTimeStr',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
    },
    // 全部
    {
        name: '全部',
        code: 'ST.CUSTOMER.TOTAL',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '到访时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '客户状态',
                type: 'isVisit',
                field: 'status',
                tagList: { 10: '报备成功', 20: '已到访', 30: '已认筹', 40: '已认购', 50: '已签约', 60: '已回款' },
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户状态',
                type: 'check',
                field: 'statusList',
                list: [
                    {
                        label: '已报备',
                        value: 10,
                    },
                    {
                        label: '已到访',
                        value: 20,
                    },
                    {
                        label: '已认筹',
                        value: 30,
                    },
                    {
                        label: '已认购',
                        value: 40,
                    },
                    {
                        label: '已签约',
                        value: 50,
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: false,
        },
    },
    // 未到访
    {
        name: '未到访',
        code: 'ST.CUSTOMER.UNVISIT',
        nameField: 'customerName',
        fieldList: [
            {
                name: '创建时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        actions: {
            collect: true,
            setTag: true,
        },
    },
    // 到访
    {
        name: '到访',
        code: 20,
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            // {
            //     name: '首访时间',
            //     field: 'userStatusTime'
            // },
            {
                name: '最近到访时间',
                field: 'lastVisitDate',
            },
        ],
        tagList: [
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户状态',
                type: 'isVisit',
                field: 'status',
                tagList: { 10: '报备成功', 20: '已到访', 30: '已认筹', 40: '已认购', 50: '已签约', 60: '已回款' },
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },

            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '首访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
            {
                name: '最近到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitStartTime', 'visitEndTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 认筹
    {
        name: '认筹',
        code: 30,
        nameField: 'customerName',
        fieldList: [
            {
                name: '认筹时间',
                field: 'userStatusTime',
            },
            {
                name: '最近到访时间',
                field: 'lastVisitDate',
            },
        ],
        tagList: [
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户状态',
                type: 'isVisit',
                field: 'status',
                tagList: { 10: '报备成功', 20: '已到访', 30: '已认筹', 40: '已认购', 50: '已签约', 60: '已回款' },
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '认筹时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
            {
                name: '最近到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitStartTime', 'visitEndTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 认购
    {
        name: '认购',
        code: 40,
        nameField: 'customerName',
        fieldList: [
            {
                name: '认购时间',
                field: 'userStatusTime',
            },
            {
                name: '最近到访时间',
                field: 'lastVisitDate',
            },
        ],
        tagList: [
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户状态',
                type: 'isVisit',
                field: 'status',
                tagList: { 10: '报备成功', 20: '已到访', 30: '已认筹', 40: '已认购', 50: '已签约', 60: '已回款' },
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },

            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '认购时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
            {
                name: '最近到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitStartTime', 'visitEndTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 签约
    {
        name: '签约',
        code: 50,
        nameField: 'customerName',
        fieldList: [
            {
                name: '签约时间',
                field: 'userStatusTime',
            },
            {
                name: '最近到访时间',
                field: 'lastVisitDate',
            },
        ],
        tagList: [
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户状态',
                type: 'isVisit',
                field: 'status',
                tagList: { 10: '报备成功', 20: '已到访', 30: '已认筹', 40: '已认购', 50: '已签约', 60: '已回款' },
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },

            {
                name: '签约时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
            {
                name: '最近到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitStartTime', 'visitEndTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 收藏
    {
        name: '收藏',
        code: 'ST.CUSTOMER.FAV',
        nameField: 'customerName',
        filterList: [
            {
                name: '客户状态',
                type: 'check',
                field: 'customerStatus',
                list: [
                    {
                        label: '未到访',
                        value: 10,
                    },
                    {
                        label: '到访',
                        value: 20,
                    },
                    {
                        label: '认筹',
                        value: 30,
                    },
                    {
                        label: '认购',
                        value: 40,
                    },
                    {
                        label: '签约',
                        value: 50,
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '最近到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitStartTime', 'visitEndTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
        },
    },
    // 公客池
    {
        name: '公客池',
        code: 'ST.CUSTOMER.PUBLIC',
        nameField: 'customerName',
        fieldList: [
            {
                name: '首次进入公客时间',
                field: 'firstPublicPoolDate',
            },
            {
                name: '最近进入公客时间',
                field: 'lastPublicPoolDate',
            },
            {
                name: '进入公客原因',
                field: 'loseReason',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '意向等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '进入公客原因',
                type: 'check',
                field: 'overTypeList',
                fixedWidth: false,
                list: [
                    {
                        label: '未到访保护期过期',
                        value: '11',
                    },
                    {
                        label: '到访保护期过期',
                        value: '12',
                    },
                    {
                        label: '跟进保护期过期',
                        value: '13',
                    },
                    {
                        label: '无意向',
                        value: '14',
                    },
                    {
                        label: '已购其他项目',
                        value: '15',
                    },
                    {
                        label: '其他',
                        value: '16',
                    },
                ],
            },
            {
                name: '首次进入公客时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
            {
                name: '进入公客次数',
                type: 'range',
                fieldName: ['publicTimesStart', 'publicTimesEnd'],
            },
        ],
    },
    {
        name: '线上预约',
        code: 'ST.HOME.FOLLOWALERT.YYKH',
        nameField: 'customerName',
        avatarField: 'customerAvatar',
        showAvatar: true,
        fieldList: [
            {
                name: '手机号码',
                field: 'customerPhone',
                type: 'show',
            },
            {
                name: '预约时间',
                field: 'appointmentDate',
                type: 'show',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'appointmentType',
                field: 'appointmentType',
            },
        ],
        filterList: [
            {
                name: '预约类型',
                type: 'check',
                field: 'appointmentType',
                list: [
                    {
                        label: '特惠好房',
                        value: '2',
                    },
                    {
                        label: '楼盘',
                        value: '1',
                    },
                ],
            },
            {
                name: '预约时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            setTag: false,
            switch: true,
        },
    },
    // 弃客池
    {
        name: '弃客池',
        code: 'ST.CUSTOMER.LOST',
        nameField: 'customerName',
        fieldList: [
            {
                name: '进入弃客时间',
                field: 'lastLoseDate',
            },
            {
                name: '弃客原因',
                field: 'loseReason',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '弃客原因',
                type: 'check',
                field: 'overTypeList',
                list: [
                    {
                        label: '无意向',
                        value: '21',
                    },
                    {
                        label: '已购其他项目',
                        value: '22',
                    },
                    {
                        label: '其它原因',
                        value: '23',
                    },
                ],
            },
            {
                name: '意向等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '进入弃客时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['recentLoseDateStart', 'recentLoseDateEnd'],
            },
            {
                name: '最近跟进时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['lastFollowStartDate', 'lastFollowEndDate'],
            },
        ],
    },
    // 分配
    {
        name: '分配',
        codeType: 'ASSIGN',
        code: 'ASSIGN',
        nameField: 'customerName',
        filterList: [
            {
                name: '客户类型',
                type: 'check',
                field: 'clientTypes',
                list: Vue.prototype.$utils.mapToArray(commonData.customerFilterList),
            },
            {
                name: '最近跟进时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        fieldList: [
            {
                name: '最近跟进时间',
                field: 'lastFollowDate',
            },
        ],
        tagList: [
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户状态',
                type: 'channel',
                field: 'customerType',
            },
        ],
    },
    // 3日内需跟进
    {
        name: '3日内需跟进',
        code: 'ST.HOME.FOLLOWALERT.LOSING',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号',
                field: 'customerPhone',
            },
            {
                name: '最近跟进',
                field: 'lastFollowingTime',
            },
            {
                name: '累计跟进次数',
                field: 'totalFollowingCount',
                unit: '次',
            },
            {
                name: '即将流失原因',
                field: 'overdueReason',
            },
        ],
        tagList: [
            {
                name: '首访/复访',
                type: 'visit',
                field: 'isFirstVisit',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            // {
            //     name: '过期类型',
            //     type: 'check',
            //     field: 'reminderTypeList',
            //     fixedWidth: false,
            //     list: [
            //         {
            //             label: '跟进保护期将流失',
            //             value: 2
            //         }
            //     ]
            // },
            {
                name: '客户等级',
                type: 'check',
                field: 'customerLevel',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '最近跟进时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['lastFollowStartDate', 'lastFollowEndDate'],
            },
        ],
        actions: {
            setTag: true,
        },
        //流失天数
        overdueDeadlineDays: {
            field: 'overdueDeadlineDays',
        },
        //流失天数单位
        overdueDeadlineUnit: {
            field: 'overdueDeadlineUnit',
        },
    },
    // 首页穿透已跟进客户
    {
        name: '已跟进客户',
        code: 'AC.STAT.YGJ',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号',
                field: 'customerTel',
            },
            {
                name: '最近跟进时间',
                field: 'lastFollowDate',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        actions: {
            setTag: true,
            collect: true,
        },
    },
    // 首页穿透已跟进客户
    {
        name: '已接访客户',
        code: 'AC.STAT.YJF',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号',
                field: 'customerTel',
            },
            {
                name: '最近到访时间',
                field: 'userStatusTimeStr',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        actions: {
            setTag: true,
            collect: true,
        },
    },
    // 今日待跟进
    {
        name: '待跟进',
        code: 'ST.HOME.FOLLOWALERT.TOFOLLOWUP',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号',
                field: 'customerPhone',
            },
            {
                name: '最近跟进',
                field: 'lastFollowingTime',
            },
        ],
        tagList: [
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'customerLevel',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            // {
            //     name: '最近跟进时间',
            //     type: 'date',
            //     field: 'dateTime',
            //     dateName: ['lastFollowStartDate', 'lastFollowEndDate']
            // }
        ],
        actions: {
            setTag: true,
        },
    },
    // 待完善
    {
        name: '首访待完善',
        code: 'ST.HOME.FOLLOWALERT.FINISHRECEPTION',
        nameField: 'customerName',
        tagList: [
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        fieldList: [
            {
                name: '手机号码',
                field: 'customerPhone',
            },
            {
                name: '首访时间',
                field: 'firstVisitDate',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'customerLevel',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '首访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitStartDate', 'visitEndDate'],
            },
        ],
        actions: {
            setTag: true,
        },
        //流失天数
        overdueDeadlineDays: {
            field: 'overdueDeadlineDays',
        },
        //流失天数单位
        overdueDeadlineUnit: {
            field: 'overdueDeadlineUnit',
        },
    },
    // 到访待处理
    {
        name: '到访待处理',
        code: 'ST.HOME.FOLLOWALERT.VISITTODO',
        nameField: 'customerName',
        fieldList: [
            {
                name: '分配时间',
                field: 'assignDate',
            },
        ],
        tagList: [
            {
                name: '首访/复访',
                type: 'visit',
                field: 'isFirstVisit',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'customerLevel',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '分配时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['assignStartDate', 'assignEndDate'],
            },
        ],
        actions: {
            setTag: true,
            reception: true,
            information: true,
        },
    },
    // 计划跟进
    {
        name: '计划跟进',
        code: 'ST.HOME.FOLLOWALERT.TOVISIT',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerPhone',
            },
            {
                name: '最近跟进时间',
                field: 'lastFollowingTime',
            },
        ],
        tagList: [
            {
                name: '首访/复访',
                type: 'visit',
                field: 'isFirstVisit',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'customerLevel',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '最近跟进',
                type: 'date',
                field: 'dateTime',
                dateName: ['lastFollowStartDate', 'lastFollowEndDate'],
            },
        ],
        actions: {
            setTag: true,
        },
    },
    // 今日待到访
    {
        name: '问询待到访',
        code: 'ST.HOME.FOLLOWALERT.TOARRIVE',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerPhone',
            },
            // {
            //     name: '首访时间',
            //     field: 'firstVisitDate'
            // }
            // {
            //     name: '邀约到访时间',
            //     field: 'reserveVisitDate'
            // },
        ],
        tagList: [
            {
                name: '首访/复访',
                type: 'visit',
                field: 'isFirstVisit',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
        ],
        actions: {
            setTag: true,
        },
    },
    // 首访未完善
    {
        name: '到访未完善',
        code: 'ST.HOME.OVERALERT.OVERACCESS',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerPhone',
            },
        ],
        tagList: [
            {
                name: '首访/复访',
                type: 'visit',
                field: 'isFirstVisit',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'customerLevel',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '完善类型',
                type: 'check',
                field: 'completeFirstVisit',
                list: [
                    {
                        label: '未完善资料',
                        value: 1,
                    },
                    {
                        label: '未完成接待',
                        value: 4,
                    },
                ],
            },
            {
                name: '到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['lastVisitStartDate', 'lastVisitEndDate'],
            },
        ],
        actions: {
            setTag: true,
            reception: true,
            information: true,
            showComplete: true,
        },
        overdueDays: {
            field: 'overdueDays',
        },
    },
    // 逾期未到访
    {
        name: '逾期未到访',
        code: 'ST.HOME.OVERALERT.OVERVISIT',
        nameField: 'customerName',
        fieldList: [
            {
                name: '录入时间',
                field: 'reportDate',
            },
            {
                name: '累计跟进',
                field: 'totalFollowingCount',
                unit: '次',
            },
            {
                name: '最近跟进',
                field: 'lastFollowingTime',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                ],
            },
            {
                name: '最近跟进',
                type: 'date',
                field: 'dateTime',
                dateName: ['lastFollowStartDate', 'lastFollowEndDate'],
            },
        ],
        actions: {
            setTag: true,
        },
        overdueDays: {
            field: 'overdueDays',
        },
    },
    // 逾期未跟进
    {
        name: '逾期未跟进',
        code: 'ST.HOME.OVERALERT.OVERFOLLOW',
        nameField: 'customerName',
        fieldList: [
            {
                name: '首访时间',
                field: 'firstVisitDate',
            },
            {
                name: '最近跟进',
                field: 'lastFollowingTime',
            },
        ],
        tagList: [
            {
                name: '首访/复访',
                type: 'visit',
                field: 'isFirstVisit',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'customerLevel',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '最近跟进',
                type: 'date',
                field: 'dateTime',
                dateName: ['lastFollowStartDate', 'lastFollowEndDate'],
            },
            {
                name: '首访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitStartDate', 'visitEndDate'],
            },
        ],
        actions: {
            setTag: true,
        },
        overdueDays: {
            field: 'overdueDays',
        },
    },
    // 逾期未成交
    {
        name: '逾期未成交',
        code: 'ST.HOME.OVERALERT.OVERORDER',
        nameField: 'customerName',
        fieldList: [
            {
                name: '首访时间',
                field: 'firstVisitDate',
            },
            {
                name: '最近跟进',
                field: 'lastFollowingTime',
            },
        ],
        tagList: [
            {
                name: '首访/复访',
                type: 'visit',
                field: 'isFirstVisit',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户等级',
                type: 'check',
                field: 'customerLevel',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '最近跟进',
                type: 'date',
                field: 'dateTime',
                dateName: ['lastFollowStartDate', 'lastFollowEndDate'],
            },
            {
                name: '首访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitStartDate', 'visitEndDate'],
            },
        ],
        actions: {
            setTag: true,
        },
        overdueDays: {
            field: 'overdueDays',
        },
    },
    // 逾期未签约
    {
        name: '认购未签约',
        code: 'ST.HOME.OVERALERT.OVERCONTRACT',
        nameField: 'customerName',
        noShowAvatar: true,
        fieldList: [
            {
                name: '房间',
                field: 'roomInfo',
            },
            {
                name: '手机号码',
                field: 'customerPhone',
            },
            {
                name: '认购时间',
                field: 'orderDate',
            },
            {
                name: '预计签约时间',
                field: 'exceptContractDate',
            },
            {
                name: '建筑面积',
                unit: '㎡',
                field: 'area',
            },
        ],
        tagList: [],
        filterList: [
            {
                name: '预计签约时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['exceptContractStartDate', 'exceptContractEndDate'],
            },
        ],
        actions: {
            setTag: true,
        },
        overdueDays: {
            field: 'overdueDays',
        },
    },
    //客户详情交易单据未成交已成交
    {
        name: '交易单据认筹已成交',
        code: 'ST.TRADEFORM.DEAL.0',
        nameField: 'roomNo',
        noShowAvatar: true,
        fieldList: [
            {
                name: '认筹单号',
                field: 'formNo',
            },
            {
                name: '认筹时间',
                field: 'formTime',
            },
            {
                name: '认筹金额',
                field: 'formMoney',
            },
        ],
        tagList: [
            {
                name: '已成交/未成交',
                type: 'channel',
                field: 'formStatus',
            },
        ],
    },
    {
        name: '交易单据认购已成交',
        code: 'ST.TRADEFORM.DEAL.1',
        nameField: 'roomNo',
        noShowAvatar: true,
        fieldList: [
            {
                name: '认购单号',
                field: 'formNo',
            },
            {
                name: '认购时间',
                field: 'formTime',
            },
            {
                name: '认购金额',
                field: 'formMoney',
            },
        ],
        tagList: [
            {
                name: '已成交/未成交',
                type: 'channel',
                field: 'formStatus',
            },
        ],
    },
    {
        name: '交易单据签约已成交',
        code: 'ST.TRADEFORM.DEAL.2',
        nameField: 'roomNo',
        noShowAvatar: true,
        fieldList: [
            {
                name: '签约单号',
                field: 'formNo',
            },
            {
                name: '签约时间',
                field: 'formTime',
            },
            {
                name: '签约金额',
                field: 'formMoney',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'channel',
                field: 'formStatus',
            },
        ],
    },
    {
        name: '交易单据认筹未成交',
        code: 'ST.TRADEFORM.NODEAL.0',
        nameField: 'roomNo',
        noShowAvatar: true,
        fieldList: [
            {
                name: '姓名',
                field: 'customerName',
            },
            {
                name: '手机号',
                field: 'customerTel',
            },
            {
                name: '置业顾问',
                field: 'zygwName',
            },
            {
                name: '成交来源',
                field: 'customerSource',
            },
            {
                name: '认筹单号',
                field: 'formNo',
            },
            {
                name: '认筹时间',
                field: 'formTime',
            },
            {
                name: '认筹金额',
                field: 'formMoney',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'channel',
                field: 'formStatus',
            },
            {
                name: '未成交原因',
                type: 'error',
                field: 'closeReason',
            },
        ],
    },
    {
        name: '交易单据认购未成交',
        code: 'ST.TRADEFORM.NODEAL.1',
        nameField: 'roomNo',
        noShowAvatar: true,
        fieldList: [
            {
                name: '姓名',
                field: 'customerName',
            },
            {
                name: '手机号',
                field: 'customerTel',
            },
            {
                name: '置业顾问',
                field: 'zygwName',
            },
            {
                name: '成交来源',
                field: 'customerSource',
            },
            {
                name: '认购时间',
                field: 'formTime',
            },
            {
                name: '认购金额',
                field: 'formMoney',
            },
            {
                name: '建筑面积',
                field: 'area',
                unit: '㎡',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'channel',
                field: 'formStatus',
            },
            {
                name: '未成交原因',
                type: 'error',
                field: 'closeReason',
            },
        ],
    },
    {
        name: '交易单据签约未成交',
        code: 'ST.TRADEFORM.NODEAL.2',
        nameField: 'roomNo',
        noShowAvatar: true,
        fieldList: [
            {
                name: '姓名',
                field: 'customerName',
            },
            {
                name: '手机号',
                field: 'customerTel',
            },
            {
                name: '置业顾问',
                field: 'zygwName',
            },
            {
                name: '成交来源',
                field: 'customerSource',
            },
            {
                name: '签约单号',
                field: 'formNo',
            },
            {
                name: '签约时间',
                field: 'formTime',
            },
            {
                name: '签约金额',
                field: 'formMoney',
            },
            {
                name: '建筑面积',
                field: 'area',
                unit: '㎡',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'channel',
                field: 'formStatus',
            },
            {
                name: '未成交原因',
                type: 'error',
                field: 'closeReason',
            },
        ],
    },
    {
        name: '全部',
        code: '',
        nameField: 'customerName',
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 已报备
    {
        name: '已报备',
        code: 'recommend',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '报备时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已报备',
                class: 'common-tag-0',
            },
            {
                name: '二级渠道',
                type: 'channel',
                field: 'secondChannelName',
            },
        ],
        filterList: [
            {
                name: '客户标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '报备时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 已到访
    {
        name: '已到访',
        code: 'houseInspection',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '到访时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已到访',
                class: 'common-orange',
            },
            {
                name: '二级渠道',
                type: 'channel',
                field: 'secondChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 已认筹
    {
        name: '已认筹',
        code: 'recognization',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '认筹时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已认筹',
                class: 'common-orange',
            },
            {
                name: '二级渠道',
                type: 'channel',
                field: 'secondChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '认筹时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 已认购
    {
        name: '已认购',
        code: 'subscribe',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '认购时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已认购',
                class: 'common-tag-orange',
            },
            {
                name: '二级渠道',
                type: 'channel',
                field: 'secondChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '认购时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 已签约
    {
        name: '已签约',
        code: 'sign',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '签约时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已签约',
                class: 'common-tag-orange',
            },
            {
                name: '二级渠道',
                type: 'channel',
                field: 'secondChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '签约时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 已失效
    {
        name: '已失效',
        code: 'invalidation',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '失效时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已失效',
                class: 'common-housing-gray',
            },
            {
                name: '二级渠道',
                type: 'channel',
                field: 'secondChannelName',
            },
        ],
        filterList: [
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
            {
                name: '失效时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
            switch: true,
        },
    },
    // 登记客户
    {
        name: '我登记的',
        code: 'registerCustomer',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '报备时间',
                field: 'userStatusTime',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'statusField',
            },
            {
                name: '二级渠道',
                type: 'channel',
                field: 'secondChannelName',
            },
        ],
        filterList: [
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户状态',
                type: 'check',
                field: 'customerStatus',
                list: [
                    {
                        label: '已报备',
                        value: 10,
                    },
                    {
                        label: '已到访',
                        value: 20,
                    },
                    {
                        label: '已认筹',
                        value: 30,
                    },
                    {
                        label: '已认购',
                        value: 40,
                    },
                    {
                        label: '已签约',
                        value: 50,
                    },
                    {
                        label: '已失效',
                        value: 0,
                    },
                ],
            },
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
        },
    },
    // 接待客户
    {
        name: '我接待的',
        code: 'receiveCustomer',
        nameField: 'customerName',
        filterList: [
            {
                name: '客户等级',
                type: 'check',
                field: 'clientLevelList',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '客户状态',
                type: 'check',
                field: 'customerStatus',
                list: [
                    {
                        label: '已报备',
                        value: 10,
                    },
                    {
                        label: '已到访',
                        value: 20,
                    },
                    {
                        label: '已认筹',
                        value: 30,
                    },
                    {
                        label: '已认购',
                        value: 40,
                    },
                    {
                        label: '已签约',
                        value: 50,
                    },
                ],
            },
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1CodeList',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '自然来访',
                        value: 'C05',
                    },
                ],
            },
            {
                name: '标签',
                type: 'check',
                field: 'tagNames',
                list: [],
            },
        ],
        actions: {
            collect: true,
            setTag: true,
        },
        tagList: [
            {
                name: '状态',
                type: 'statusField',
            },
            {
                name: '一级渠道',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
    },
    // 分配登记客户
    {
        name: '登记客户',
        code: 'REGISTER',
        nameField: 'customerName',
        fieldList: [
            {
                name: '报备时间',
                field: 'reportDate',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'statusField',
            },
        ],
        filterList: [
            {
                name: '客户状态',
                type: 'check',
                field: 'status',
                list: [
                    {
                        label: '已报备',
                        value: 10,
                    },
                    {
                        label: '已到访',
                        value: 20,
                    },
                    {
                        label: '已认购',
                        value: 40,
                    },
                    {
                        label: '已签约',
                        value: 50,
                    },
                    {
                        label: '已失效',
                        value: -1,
                    },
                ],
            },
            {
                name: '报备时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            collect: false,
            setTag: false,
        },
    },
    // 分配-潜在客户
    {
        name: '潜在客户',
        code: 'POTENTIAL',
        nameField: 'customerName',
        avatarField: 'customerAvatar',
        showAvatar: true,
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'tookType',
                field: 'obtainCustomerType',
            },
        ],
        filterList: [
            {
                name: '客户状态',
                type: 'check',
                field: 'obtainCustomerType',
                list: [
                    {
                        label: '线上拓客',
                        value: 1,
                    },
                    {
                        label: '官网获客',
                        value: 2,
                    },
                ],
            },
        ],
        actions: {
            setTag: false,
        },
    },
    // 分配-公客池
    {
        name: '公客池',
        code: '1',
        nameField: 'customerName',
        avatarField: 'customerAvatar',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '流入公客池时间',
                field: 'lastPublicPoolDate',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户来源',
                type: 'check',
                checkType: 'radio',
                field: 'obtainCustomerType',
                list: [
                    {
                        label: '全民营销',
                        value: 'CO1',
                    },
                    {
                        label: '机构分销',
                        value: 'CO2',
                    },
                    {
                        label: '行销自拓',
                        value: 'CO3',
                    },
                ],
            },
            {
                name: '客户状态',
                type: 'check',
                checkType: 'radio',
                field: 'status',
                list: [
                    {
                        label: '已到访',
                        value: '20',
                    },
                    {
                        label: '已认筹',
                        value: '30',
                    },
                    {
                        label: '已认购',
                        value: '40',
                    },
                    {
                        label: '已签约',
                        value: '50',
                    },
                ],
            },
            {
                name: '意向等级',
                type: 'check',
                checkType: 'radio',
                field: 'level',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '首访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['firstVisitStartTime', 'firstVisitEndTime'],
            },
            {
                name: '最近到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['lastVisitStartTime', 'lastVisitEndTime'],
            },
        ],
        actions: {
            setTag: false,
        },
    },
    // 分配-跟进中
    {
        name: '跟进中',
        code: '2',
        nameField: 'customerName',
        avatarField: 'customerAvatar',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '最新到访时间',
                field: 'lastVisitDate',
            },
            {
                name: '最近跟进时间',
                field: 'lastFollowDate',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '首访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['firstVisitStartTime', 'firstVisitEndTime'],
            },
        ],
        actions: {
            setTag: false,
        },
    },
    // 分配-销售登记
    {
        name: '销售登记',
        code: '3',
        nameField: 'customerName',
        avatarField: 'customerAvatar',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '问询录入时间',
                field: 'reportDate',
            },
            {
                name: '最近跟进时间',
                field: 'lastFollowDate',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '客户来源',
                type: 'check',
                checkType: 'radio',
                field: 'obtainCustomerType',
                list: [
                    {
                        label: '全民营销',
                        value: 'CO1',
                    },
                    {
                        label: '机构分销',
                        value: 'CO2',
                    },
                    {
                        label: '行销自拓',
                        value: 'CO3',
                    },
                ],
            },
            {
                name: '客户状态',
                type: 'check',
                checkType: 'radio',
                field: 'status',
                list: [
                    {
                        label: '已到访',
                        value: '20',
                    },
                    {
                        label: '已认筹',
                        value: '30',
                    },
                    {
                        label: '已认购',
                        value: '40',
                    },
                    {
                        label: '已签约',
                        value: '50',
                    },
                ],
            },
            {
                name: '意向等级',
                type: 'check',
                checkType: 'radio',
                field: 'level',
                list: [
                    {
                        label: 'A级',
                        value: 'A',
                    },
                    {
                        label: 'B级',
                        value: 'B',
                    },
                    {
                        label: 'C级',
                        value: 'C',
                    },
                    {
                        label: 'D级',
                        value: 'D',
                    },
                    {
                        label: 'E级',
                        value: 'E',
                    },
                ],
            },
            {
                name: '首访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['firstVisitStartTime', 'firstVisitEndTime'],
            },
            {
                name: '最近到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['lastVisitStartTime', 'lastVisitEndTime'],
            },
        ],
        actions: {
            setTag: false,
        },
    },
    // 分配-线上预约
    {
        name: '线上预约',
        code: '4',
        nameField: 'customerName',
        avatarField: 'customerAvatar',
        showAvatar: true,
        fieldList: [
            {
                name: '手机号码',
                field: 'customerPhone',
                type: 'show',
            },
            {
                name: '预约时间',
                field: 'appointmentDate',
                type: 'show',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'appointmentType',
                field: 'appointmentType',
            },
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        filterList: [
            {
                name: '预约类型',
                type: 'check',
                field: 'appointmentType',
                list: [
                    {
                        label: '特惠好房',
                        value: '2',
                    },
                    {
                        label: '楼盘',
                        value: '1',
                    },
                ],
            },
            {
                name: '预约时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            setTag: false,
        },
    },
    // 交易单据-认筹订单
    {
        name: '认筹订单',
        code: 'bill-0',
        nameField: 'roomInfo',
        type: 'bills',
        fieldList: [
            {
                name: '认筹单号',
                field: 'formNo',
            },
            {
                name: '认筹时间',
                field: 'formTime',
            },
            {
                name: '客户姓名',
                field: 'customerName',
            },
            {
                name: '认筹金额',
                field: 'formMoney',
                unit: '元',
                type: 'price',
            },
        ],
        tagList: [
            {
                name: '无效原因',
                type: 'error',
                field: 'dataStatusName',
            },
        ],
        filterList: [
            {
                name: '单据状态',
                type: 'check',
                field: 'statusList',
                list: [
                    {
                        label: '有效',
                        value: 1,
                    },
                    {
                        label: '无效',
                        value: 0,
                    },
                ],
            },
            {
                name: '无效原因',
                type: 'check',
                field: 'closeStatusList',
                list: [
                    {
                        label: '认筹作废',
                        value: 31,
                    },
                    {
                        label: '退认筹',
                        value: 32,
                    },
                ],
            },
            {
                name: '认筹时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            switch: true,
        },
    },
    // 交易单据-认购订单
    {
        name: '认购订单',
        code: 'bill-1',
        nameField: 'roomInfo',
        type: 'bills',
        fieldList: [
            {
                name: '认购单号',
                field: 'formNo',
            },
            {
                name: '认购时间',
                field: 'formTime',
            },
            {
                name: '客户姓名',
                field: 'customerName',
            },
            {
                name: '认购金额',
                field: 'formMoney',
                unit: '元',
                type: 'price',
            },
        ],
        tagList: [
            {
                name: '无效原因',
                type: 'error',
                field: 'dataStatusName',
            },
        ],
        filterList: [
            {
                name: '单据状态',
                type: 'check',
                field: 'statusList',
                list: [
                    {
                        label: '有效',
                        value: 1,
                    },
                    {
                        label: '无效',
                        value: 0,
                    },
                ],
            },
            {
                name: '无效原因',
                type: 'check',
                field: 'closeStatusList',
                list: [
                    {
                        label: '认购作废',
                        value: 41,
                    },
                    {
                        label: '退认购',
                        value: 42,
                    },
                ],
            },
            {
                name: '认购时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            switch: true,
        },
    },
    // 交易单据-签约订单
    {
        name: '签约订单',
        code: 'bill-2',
        nameField: 'roomInfo',
        type: 'bills',
        fieldList: [
            {
                name: '签约单号',
                field: 'formNo',
            },
            {
                name: '签约时间',
                field: 'formTime',
            },
            {
                name: '客户姓名',
                field: 'customerName',
            },
            {
                name: '签约金额',
                field: 'formMoney',
                unit: '元',
                type: 'price',
            },
        ],
        tagList: [
            {
                name: '无效原因',
                type: 'error',
                field: 'dataStatusName',
            },
        ],
        filterList: [
            {
                name: '单据状态',
                type: 'check',
                field: 'statusList',
                list: [
                    {
                        label: '有效',
                        value: 1,
                    },
                    {
                        label: '无效',
                        value: 0,
                    },
                ],
            },
            {
                name: '无效原因',
                type: 'check',
                field: 'closeStatusList',
                list: [
                    {
                        label: '签约作废',
                        value: 51,
                    },
                    {
                        label: '退签约',
                        value: 52,
                    },
                ],
            },
            {
                name: '签约时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['startTime', 'endTime'],
            },
        ],
        actions: {
            switch: true,
        },
    },
    // 带看确认单-未确认
    {
        name: '未确认',
        code: 'takelook-2',
        nameField: 'customerName',
        type: 'takelook',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerPhone',
            },
            {
                name: '到访时间',
                field: 'receptionTime',
            },
        ],
        tagList: [
            {
                name: '首访复访',
                type: 'visit',
                field: 'visitType',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'level',
            },
            {
                name: '渠道',
                type: 'channel',
                field: 'channelDetail',
            },
        ],
        filterList: [
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1List',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                ],
            },
            {
                name: '到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitBeginTime', 'visitEndTime'],
            },
        ],
        actions: {
            sign: true,
        },
    },
    // 带看确认单-已确认
    {
        name: '未确认',
        code: 'takelook-1',
        nameField: 'customerName',
        type: 'takelook',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerPhone',
            },
            {
                name: '到访时间',
                field: 'receptionTime',
            },
        ],
        tagList: [
            {
                name: '首访复访',
                type: 'visit',
                field: 'visitType',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'level',
            },
            {
                name: '渠道',
                type: 'channel',
                field: 'channelDetail',
            },
        ],
        filterList: [
            {
                name: '客户来源',
                type: 'check',
                field: 'channel1List',
                list: [
                    {
                        label: '全民营销',
                        value: 'C01',
                    },
                    {
                        label: '中介分销',
                        value: 'C02',
                    },
                    {
                        label: '行销自拓',
                        value: 'C03',
                    },
                    {
                        label: '销售登记',
                        value: 'C04',
                    },
                ],
            },
            {
                name: '到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['visitBeginTime', 'visitEndTime'],
            },
        ],
        actions: {
            sign: true,
        },
    },
    // 未获电客户
    {
        name: '未获电',
        code: 'ST.CUSTOMER.NOTPHONE',
        nameField: 'viewUserName',
        avatarField: 'viewUserAvatar',
        showAvatar: true,
        fieldList: [
            {
                name: '首次浏览时间',
                field: 'createAt',
            },
            // {
            //     name: '浏览次数',
            //     field: 'overdueDays',
            //     unit: '次'
            // }
        ],
        bottomInfo: {
            actionType: 'title',
            textField: 'actionInfo',
            dateField: 'datetime',
        },
        filterList: [],
        actions: {
            switch: false,
        },
    },
    // 已获电客户
    {
        name: '已获电',
        code: 'ST.CUSTOMER.PHONE',
        nameField: 'customerName',
        avatarField: 'customerAvatar',
        showAvatar: true,
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            // {
            //     name: '浏览次数',
            //     field: 'overdueDays',
            //     unit: '次'
            // },
            {
                name: '创建时间',
                field: 'obtainCustomerAt',
            },
        ],
        bottomInfo: {
            actionType: 'title',
            textField: 'actionInfo',
            dateField: 'datetime',
        },
        tagList: [
            {
                name: '状态',
                type: 'tookType',
                field: 'obtainCustomerType',
            },
        ],
        filterList: [
            {
                name: '获客方式',
                type: 'check',
                field: 'obtainCustomerType',
                list: [
                    {
                        label: '线上拓客',
                        value: 1,
                    },
                    {
                        label: '官网拓客',
                        value: 2,
                    },
                ],
            },
            {
                name: '状态',
                type: 'check',
                field: 'status',
                list: [
                    {
                        label: '有效',
                        value: 10,
                    },
                    {
                        label: '无效',
                        value: 20,
                    },
                ],
            },
            // {
            //     name: '浏览次数',
            //     type: 'range',
            //     fieldName: ['publicTimesStart', 'publicTimesEnd']
            // }
        ],
        actions: {
            switch: true,
            call: true,
            register: true,
            reception: false,
        },
    },
    // 待办中心
    {
        name: '待办中心',
        code: 'TO-DO-CENTER',
        nameField: 'userName',
        fieldList: [
            {
                name: '手机号码 ',
                field: 'tel',
            },
            {
                name: '经纪人上线',
                field: 'parentName',
            },
            {
                name: '申请解绑原因',
                field: 'reason',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'auditStatus',
                field: 'auditStatus',
            },
        ],
        actions: {
            setTag: false,
        },
    },
    {
        name: '补卡申请',
        code: 'SUPPLEMENTARY-CARD',
        nameField: 'userName',
        fieldList: [
            {
                name: '补卡班次 ',
                field: 'signDate',
            },
            {
                name: '补卡类型',
                field: 'signType',
            },
            {
                name: '申请时间',
                field: 'createDate',
            },
            {
                name: '补卡理由',
                field: 'reason',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'auditStatus',
                field: 'status',
            },
        ],
        actions: {
            setTag: false,
        },
    },
    {
        code: 'ZT.RANK.GROUP.BB',
        name: '报备量',
        nameField: 'customerName',
        noShowAvatar: true,
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '报备时间',
                field: 'reportDate',
            },
            {
                name: '报备人',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.RANK.GROUP.DF',
        name: '到访量',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '最新到访时间',
                field: 'lastVisitDate',
            },
            {
                name: '报备人',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
            {
                name: '首访复访',
                type: 'customerStep',
                field: 'customerStep',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.RANK.STAFF.BB',
        name: '报备量',
        nameField: 'customerName',
        noShowAvatar: true,
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '报备时间',
                field: 'reportDate',
            },
            {
                name: '报备人',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.RANK.STAFF.DF',
        name: '到访量',
        nameField: 'customerName',
        isShowTip: true,
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '最新到访时间',
                field: 'lastVisitDate',
            },
            {
                name: '报备人',
                field: 'reportName',
            },
            {
                name: '置业顾问',
                field: 'staffName',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
            {
                name: '首访复访',
                type: 'customerStep',
                field: 'customerStep',
            },
        ],
        actions: {},
    },
    {
        code: 'ST.RANK.STAFF.RG',
        name: '认购',
        nameField: 'Roominfo',
        noShowAvatar: true,
        fieldList: [
            {
                name: '姓名',
                field: 'cstname',
            },
            {
                name: '手机号码',
                field: 'cstmobile',
            },
            {
                name: '置业顾问',
                field: 'zygwname',
            },
            {
                name: '成交来源',
                field: 'CustomerSource',
            },
            {
                name: '建筑面积 ',
                field: 'bldarea',
                unit: '㎡',
            },
            {
                name: '认购金额',
                field: 'CjTotal',
                unit: '元',
            },
            {
                name: '认购时间',
                field: 'qsdate',
            },
        ],
        tagList: [
            {
                name: '单据状态',
                type: 'CloseReason',
                field: 'CloseReason',
            },
        ],
        actions: {},
    },
    {
        code: 'ST.RANK.STAFF.RWQ',
        name: '认未签',
        nameField: 'Roominfo',
        noShowAvatar: true,
        fieldList: [
            {
                name: '姓名',
                field: 'cstname',
            },
            {
                name: '手机号码',
                field: 'cstmobile',
            },
            {
                name: '置业顾问',
                field: 'zygwname',
            },
            {
                name: '成交来源',
                field: 'CustomerSource',
            },
            {
                name: '建筑面积 ',
                field: 'bldarea',
                unit: '㎡',
            },
            {
                name: '认购金额',
                field: 'CjTotal',
                unit: '元',
            },
            {
                name: '认购时间',
                field: 'qsdate',
            },
        ],
        tagList: [
            {
                name: '单据状态',
                type: 'CloseReason',
                field: 'CloseReason',
            },
        ],
        actions: {},
    },
    {
        code: 'ST.RANK.STAFF.QY',
        name: '签约',
        nameField: 'Roominfo',
        noShowAvatar: true,
        fieldList: [
            {
                name: '姓名',
                field: 'cstname',
            },
            {
                name: '手机号码',
                field: 'cstmobile',
            },
            {
                name: '置业顾问',
                field: 'zygwname',
            },
            {
                name: '成交来源',
                field: 'CustomerSource',
            },
            {
                name: '建筑面积 ',
                field: 'bldarea',
                unit: '㎡',
            },
            {
                name: '签约金额',
                field: 'qyamount',
                unit: '元',
            },
            {
                name: '签约时间',
                field: 'qsdate',
            },
        ],
        tagList: [
            {
                name: '单据状态',
                type: 'CloseReason',
                field: 'CloseReason',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.RANK.VISIT',
        name: '',
        nameField: 'customerName',
        isShowTip: true,
        isVisit: {
            field: 'visitTimes',
        },
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '首访时间',
                field: 'firstVisitDate',
            },
            {
                name: '最新到访时间',
                field: 'lastVisitDate',
            },

            {
                name: '置业顾问',
                field: 'staffName',
            },
        ],
        tagList: [
            {
                name: '客户来源',
                type: 'channel',
                field: 'firstChannelName',
            },
            {
                name: '首访复访',
                type: 'visit',
                field: 'visitType',
            },
        ],
        actions: {},
    },
]
// 客户列表tab
export const customerTabConfig = [
    {
        name: '到访客户',
        code: 'ST.CUSTOMER.FOLLOWING',
        tabList: [
            {
                value: 20,
                name: '到访',
            },
            {
                value: 30,
                name: '认筹',
            },
            {
                value: 40,
                name: '认购',
            },
            {
                value: 50,
                name: '签约',
            },
        ],
    },
    {
        name: '销售登记客户',
        code: 'ST.CUSTOMER.INPUT',
        tabList: [
            {
                value: '',
                name: '全部',
            },
            {
                value: 10,
                name: '已报备',
                code: 'recommend',
                class: 'common-tag-0',
            },
            {
                value: 20,
                name: '已到访',
                code: 'houseInspection',
                class: 'common-tag-orange',
            },
            {
                value: 30,
                name: '已认筹',
                code: 'recognization',
                class: 'common-tag-orange',
            },
            {
                value: 40,
                name: '已认购',
                code: 'subscribe',
                class: 'common-tag-orange',
            },
            {
                value: 50,
                name: '已签约',
                code: 'sign',
                class: 'common-tag-orange',
            },
            {
                value: -1,
                name: '已失效',
                code: 'invalidation',
                class: 'common-housing-gray',
            },
        ],
    },
    {
        name: '问询到访客户',
        code: 'ST.HOME.FOLLOWALERT.TOARRIVE',
        tabList: [
            {
                value: '',
                name: '全部',
            },
            {
                value: 10,
                name: '已报备',
                code: 'recommend',
                class: 'common-tag-0',
            },
            {
                value: 20,
                name: '已到访',
                code: 'houseInspection',
                class: 'common-tag-orange',
            },
            {
                value: 40,
                name: '已认购',
                code: 'subscribe',
                class: 'common-tag-orange',
            },
            {
                value: 50,
                name: '已签约',
                code: 'sign',
                class: 'common-tag-orange',
            },
            {
                value: -1,
                name: '已失效',
                code: 'invalidation',
                class: 'common-housing-gray',
            },
        ],
    },
    {
        name: '重点客户',
        code: 'ST.CUSTOMER.FAV',
        tabList: [
            {
                value: 'receiveCustomer',
                name: '我接待的',
            },
            {
                value: 'registerCustomer',
                name: '我登记的',
            },
        ],
    },
    {
        name: '分配客户',
        code: 'ST.CUSTOMER.ASSIGN',
        tabList: [
            {
                value: '1',
                name: '到访客户',
            },
            {
                value: '2',
                name: '未到访客户',
            },
            // {
            //     value: '3',
            //     name: '全民报备'
            // },
            // {
            //     value: '4',
            //     name: '预约看房'
            // }
        ],
    },
]
export const sortConfig = [
    {
        name: '全部',
        code: 'ST.CUSTOMER.TOTAL',
        sortOptions: [
            {
                text: '最近创建',
                value: 1,
            },
            {
                text: '最早创建',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '全民营销待分配',
        code: 'ST.CUSTOMER.NOVISITASSIGN',
        sortOptions: [
            {
                text: '最近创建',
                value: 1,
            },
            {
                text: '最早创建',
                value: 2,
            },
        ],
    },
    {
        name: '全民营销已分配',
        code: 'ST.CUSTOMER.NOVISIT',
        sortOptions: [
            {
                text: '最近创建',
                value: 1,
            },
            {
                text: '最早创建',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '逾期',
        code: 'ST.CUSTOMER.OVERDUE',
        sortOptions: [
            {
                text: '最近逾期',
                value: 1,
            },
            {
                text: '最早逾期',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '到访',
        code: 20,
        sortOptions: [
            {
                text: '最近到访',
                value: 1,
            },
            {
                text: '最早到访',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '认筹',
        code: 30,
        sortOptions: [
            {
                text: '最近认筹',
                value: 1,
            },
            {
                text: '最早认筹',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '认购',
        code: 40,
        sortOptions: [
            {
                text: '最近认购',
                value: 1,
            },
            {
                text: '最早认购',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '签约',
        code: 50,
        sortOptions: [
            {
                text: '最近签约',
                value: 1,
            },
            {
                text: '最早签约',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '我接待的',
        code: 'receiveCustomer',
        sortOptions: [
            {
                text: '最近关注',
                value: 1,
            },
            {
                text: '最早关注',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '我登记的',
        code: 'registerCustomer',
        sortOptions: [
            {
                text: '最近关注',
                value: 1,
            },
            {
                text: '最早关注',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '公客池',
        code: 'ST.CUSTOMER.PUBLIC',
        sortOptions: [
            {
                text: '最近进入时间',
                value: 1,
            },
            {
                text: '最早进入时间',
                value: 2,
            },
        ],
    },
    {
        name: '预约客户',
        code: 'ST.HOME.FOLLOWALERT.YYKH',
        sortOptions: [
            {
                text: '最早预约',
                value: 1,
            },
            {
                text: '最新预约',
                value: 2,
            },
        ],
    },
    {
        name: '弃客池',
        code: 'ST.CUSTOMER.LOST',
        sortOptions: [
            {
                text: '最近进入时间',
                value: 1,
            },
            {
                text: '最早进入时间',
                value: 2,
            },
        ],
    },
    {
        name: '3天后将流失',
        code: 'ST.HOME.FOLLOWALERT.LOSING',
        sortOptions: [
            {
                text: '最近跟进',
                value: 1,
            },
            {
                text: '最早跟进',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '待跟进',
        code: 'ST.HOME.FOLLOWALERT.TOFOLLOWUP',
        sortOptions: [
            {
                text: '最近跟进',
                value: 1,
            },
            {
                text: '最早跟进',
                value: 2,
            },
        ],
    },
    {
        name: '将流失',
        code: 'ST.HOME.FOLLOWALERT.FINISHRECEPTION',
        sortOptions: [
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '到访待处理',
        code: 'ST.HOME.FOLLOWALERT.VISITTODO',
        sortOptions: [
            {
                text: '最近分配',
                value: 1,
            },
            {
                text: '最早分配',
                value: 2,
            },
        ],
    },
    {
        name: '今日待回访',
        code: 'ST.HOME.FOLLOWALERT.TOVISIT',
        sortOptions: [
            {
                text: '最近跟进',
                value: 1,
            },
            {
                text: '最早跟进',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '待到访',
        code: 'ST.HOME.FOLLOWALERT.TOARRIVE',
        sortOptions: [
            {
                text: '最近更新',
                value: 1,
            },
            {
                text: '最早更新',
                value: 2,
            },
        ],
    },
    {
        name: '首访未完善',
        code: 'ST.HOME.OVERALERT.OVERACCESS',
        sortOptions: [
            {
                text: '最近更新',
                value: 1,
            },
            {
                text: '最早更新',
                value: 2,
            },
        ],
    },
    {
        name: '逾期未到访',
        code: 'ST.HOME.OVERALERT.OVERVISIT',
        sortOptions: [
            {
                text: '最近更新',
                value: 1,
            },
            {
                text: '最早更新',
                value: 2,
            },
        ],
    },
    {
        name: '逾期未跟进',
        code: 'ST.HOME.OVERALERT.OVERFOLLOW',
        sortOptions: [
            {
                text: '最近更新',
                value: 1,
            },
            {
                text: '最早更新',
                value: 2,
            },
        ],
    },
    {
        name: '逾期未成交',
        code: 'ST.HOME.OVERALERT.OVERORDER',
        sortOptions: [
            {
                text: '最近更新',
                value: 1,
            },
            {
                text: '最早更新',
                value: 2,
            },
        ],
    },
    {
        name: '逾期未签约',
        code: 'ST.HOME.OVERALERT.OVERCONTRACT',
        sortOptions: [],
    },
    {
        name: '全部',
        code: '',
        sortOptions: [
            {
                text: '最近创建',
                value: 1,
            },
            {
                text: '最早创建',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '已报备',
        code: 'recommend',
        sortOptions: [
            {
                text: '最近报备',
                value: 1,
            },
            {
                text: '最早报备',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '已到访',
        code: 'houseInspection',
        sortOptions: [
            {
                text: '最近到访',
                value: 1,
            },
            {
                text: '最早到访',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '已认筹',
        code: 'recognization',
        sortOptions: [
            {
                text: '最近认筹',
                value: 1,
            },
            {
                text: '最早认筹',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '已认购',
        code: 'subscribe',
        sortOptions: [
            {
                text: '最近认购',
                value: 1,
            },
            {
                text: '最早认购',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '已签约',
        code: 'sign',
        sortOptions: [
            {
                text: '最近签约',
                value: 1,
            },
            {
                text: '最早签约',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '已失效',
        code: 'invalidation',
        sortOptions: [
            {
                text: '最近失效',
                value: 1,
            },
            {
                text: '最早失效',
                value: 2,
            },
            {
                text: '最近更新',
                value: 3,
            },
            {
                text: '最早更新',
                value: 4,
            },
        ],
    },
    {
        name: '认筹订单',
        code: 'bill-0',
        sortOptions: [
            {
                text: '最近认筹',
                value: 1,
            },
            {
                text: '最早认筹',
                value: 2,
            },
        ],
    },
    {
        name: '认购订单',
        code: 'bill-1',
        sortOptions: [
            {
                text: '最近认购',
                value: 1,
            },
            {
                text: '最早认购',
                value: 2,
            },
        ],
    },
    {
        name: '签约订单',
        code: 'bill-2',
        sortOptions: [
            {
                text: '最近签约',
                value: 1,
            },
            {
                text: '最早签约',
                value: 2,
            },
        ],
    },
    {
        name: '带看确认单-未确认',
        code: 'takelook-2',
        sortOptions: [
            {
                text: '最近到访',
                value: 1,
            },
            {
                text: '最早到访',
                value: 2,
            },
        ],
    },
    {
        name: '带看确认单-已确认',
        code: 'takelook-1',
        sortOptions: [
            {
                text: '最近到访',
                value: 1,
            },
            {
                text: '最早到访',
                value: 2,
            },
        ],
    },
    {
        name: '未获电客户',
        code: 'ST.CUSTOMER.NOTPHONE',
        sortOptions: [
            {
                text: '最新浏览',
                value: 1,
            },
            {
                text: '最早浏览',
                value: 2,
            },
        ],
    },
    {
        name: '已获电客户',
        code: 'ST.CUSTOMER.PHONE',
        sortOptions: [
            {
                text: '最新浏览',
                value: 1,
            },
            {
                text: '最早浏览',
                value: 2,
            },
            {
                text: '最新创建',
                value: 3,
            },
            {
                text: '最早创建',
                value: 4,
            },
        ],
    },
]

export function getConfig(type) {
    return (
        customerConfig.find((item) => {
            return item.code === type
        }) || ''
    )
}

export function getSortOptions(type) {
    return (
        sortConfig.find((item) => {
            return item.code === type
        })?.sortOptions || ''
    )
}

export function getTabList(type) {
    return (
        customerTabConfig.find((item) => {
            return item.code === type
        }) || ''
    )
}

export function getCodeType(type, code) {
    return (
        customerTabConfig
            .find((item) => {
                return item.code === type
            })
            .tabList.find((x) => x.value == code)?.code || ''
    )
}

export function getCustomerStatus(type, status) {
    return (
        customerTabConfig
            .find((item) => {
                return item.code === type
            })
            .tabList.find((x) => x.value === status) || ''
    )
}
