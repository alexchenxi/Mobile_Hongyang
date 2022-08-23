export const customerConfig = [
    // 全部客户
    {
        name: '全部客户',
        nameField: 'customerName',
        code: '',
        filterList: [
            {
                name: '报备时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['beginTime', 'endTime'],
            },
        ],
        actions: {
            setTag: true,
            collect: true,
        },
    },
    // 未获电客户
    {
        name: '未获电客户',
        nameField: 'viewUserName',
        code: 1,
        avatarField: 'viewUserAvatar',
        showAvatar: true,
        filterList: [],
        fieldList: [
            [
                {
                    name: '首次浏览时间',
                    field: 'createAt',
                },
                // {
                //     name: '浏览次数',
                //     field: 'beeUserName',
                //     unit: '次'
                // }
            ],
        ],
        bottomInfo: {
            actionType: 'title',
            textField: 'actionInfo',
            dateField: 'datetime',
        },
        actions: {
            setTag: false,
        },
    },
    // 已获电客户
    {
        name: '线上获电',
        nameField: 'customerName',
        code: 2,
        avatarField: 'customerAvatar',
        showAvatar: true,
        fieldList: [
            [
                {
                    name: '手机号码',
                    field: 'customerTel',
                },
                // {
                //     name: '浏览次数',
                //     field: 'avaStatus',
                //     unit: '次'
                // }
            ],
            [
                {
                    name: '创建时间',
                    field: 'obtainCustomerAt',
                },
            ],
        ],
        filterList: [
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
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'obtainCustomerType',
                class: [
                    {
                        name: '线上拓客',
                        code: 1,
                        class: 'common-tag-blue',
                    },
                    {
                        name: '官网获客',
                        code: 2,
                        class: 'common-tag-blue',
                    },
                ],
            },
        ],
        bottomInfo: {
            actionType: 'title',
            textField: 'actionInfo',
            dateField: 'datetime',
        },
        actions: {
            report: true,
            call: true,
        },
    },
    // 待报备
    {
        name: '待报备',
        nameField: 'customerName',
        code: 5,
        fieldList: [
            [
                {
                    name: '手机号码',
                    field: 'customerTel',
                },
                {
                    name: '拓客方式',
                    field: 'secondChannelName',
                },
            ],
            {
                name: 'beeUserType',
                field: 'beeUserName',
            },
            {
                name: '提交时间',
                field: 'dealDate',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '待报备',
                class: 'common-tag-blue',
            },
        ],
        filterList: [],
        actions: {
            setTag: false,
            recommend: true,
        },
        operating: [
            {
                text: '删除',
                type: 'del',
                bgColor: '#eb6877',
            },
        ],
    },
    // 已报备
    {
        name: '已报备',
        nameField: 'customerName',
        code: 10,
        fieldList: [
            {
                name: '电话号码',
                field: 'customerTel',
            },

            {
                name: 'beeUserType',
                field: 'beeUserName',
            },
            {
                name: '报备时间',
                field: 'dealDate',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已报备',
                class: 'common-tag-orange',
            },
        ],
        filterList: [
            {
                name: '报备时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['beginTime', 'endTime'],
            },
        ],
        actions: {
            setTag: true,
            collect: true,
        },
    },
    // 已到访
    {
        name: '已到访',
        nameField: 'customerName',
        code: 20,
        fieldList: [
            {
                name: '电话号码',
                field: 'customerTel',
            },

            {
                name: 'beeUserType',
                field: 'beeUserName',
            },
            {
                name: '最新到访时间',
                field: 'dealDate',
            },
            {
                name: '置业顾问',
                field: 'zygwName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已到访',
                class: 'common-tag-orange',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'level',
            },
        ],
        filterList: [
            {
                name: '最新到访时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['beginTime', 'endTime'],
            },
        ],
        actions: {
            setTag: true,
            collect: true,
        },
    },
    // 已认筹
    {
        name: '已认筹',
        nameField: 'customerName',
        code: 30,
        fieldList: [
            {
                name: '电话号码',
                field: 'customerTel',
            },

            {
                name: 'beeUserType',
                field: 'beeUserName',
            },
            {
                name: '认筹时间',
                field: 'dealDate',
            },
            {
                name: '置业顾问',
                field: 'zygwName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已认筹',
                class: 'common-tag-orange',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'level',
            },
        ],
        filterList: [
            {
                name: '认筹时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['beginTime', 'endTime'],
            },
        ],
        actions: {
            setTag: true,
            collect: true,
        },
    },
    // 已认购
    {
        name: '已认购',
        nameField: 'customerName',
        code: 40,
        fieldList: [
            {
                name: '电话号码',
                field: 'customerTel',
            },

            {
                name: 'beeUserType',
                field: 'beeUserName',
            },
            {
                name: '认购时间',
                field: 'dealDate',
            },
            {
                name: '置业顾问',
                field: 'zygwName',
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
                name: '客户等级',
                type: 'level',
                field: 'level',
            },
        ],
        filterList: [
            {
                name: '认购时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['beginTime', 'endTime'],
            },
        ],
        actions: {
            setTag: true,
            collect: true,
        },
    },
    // 已签约
    {
        name: '已签约',
        nameField: 'customerName',
        code: 50,
        fieldList: [
            {
                name: '电话号码',
                field: 'customerTel',
            },

            {
                name: 'beeUserType',
                field: 'beeUserName',
            },
            {
                name: '签约时间',
                field: 'dealDate',
            },
            {
                name: '置业顾问',
                field: 'zygwName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已签约',
                class: 'common-tag-red',
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'level',
            },
        ],
        filterList: [
            {
                name: '签约时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['beginTime', 'endTime'],
            },
        ],
        actions: {
            setTag: true,
            collect: true,
        },
    },
    // 已失效
    {
        name: '已失效',
        nameField: 'customerName',
        code: -1,
        fieldList: [
            {
                name: '电话号码',
                field: 'customerTel',
            },

            {
                name: 'beeUserType',
                field: 'beeUserName',
            },
            {
                name: '失效时间',
                field: 'dealDate',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: '已失效',
                class: 'common-housing-gray',
            },
        ],
        filterList: [
            {
                name: '失效时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['beginTime', 'endTime'],
            },
        ],
        actions: {
            setTag: true,
            collect: true,
            recommendAgain: true,
        },
    },
    // 重点客户
    {
        name: '重点客户',
        nameField: 'customerName',
        code: -2,
        filterList: [
            {
                name: '报备时间',
                type: 'date',
                field: 'dateTime',
                dateName: ['beginTime', 'endTime'],
            },
        ],
        actions: {
            setTag: true,
        },
    },
    {
        name: '关键人我的客户',
        nameField: 'customerName',
        code: 'keyCustomer',
        fieldList: [
            [
                {
                    name: '手机号码',
                    field: 'customerTel',
                },
            ],
            [
                {
                    name: '报备时间',
                    field: 'reportDate',
                },
            ],
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'clueStatus',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
        ],
        filterList: [
            {
                name: '客户状态',
                type: 'check',
                checkType: 'radio',
                field: 'status',
                list: [
                    {
                        label: '报备',
                        value: 10,
                    },
                    {
                        label: '到访',
                        value: 20,
                    },
                    {
                        label: '认购',
                        value: 40,
                    },
                    {
                        label: '签约',
                        value: 50,
                    },
                    {
                        label: '已失效',
                        value: 0,
                    },
                ],
            },
        ],
        actions: {},
    },
    {
        name: '小蜜蜂我的客户',
        nameField: 'customerName',
        code: 'beeCustomer',
        fieldList: [
            [
                {
                    name: '手机号码',
                    field: 'customerTel',
                },
            ],
            [
                {
                    name: '提交时间',
                    field: 'reportDate',
                },
            ],
        ],
        tagList: [
            {
                name: '拓客方式',
                type: 'status',
                field: 'channelName',
                class: 'common-tag-blue',
            },
        ],
        filterList: [],
        actions: {},
    },
    {
        name: '关键人',
        nameField: 'name',
        code: 'keyPerson',
        fieldList: [
            [
                {
                    name: '手机号码',
                    field: 'phone',
                },
                {
                    name: '报备数',
                    field: 'totalCustomers',
                },
            ],
            [
                {
                    name: '加入团队时间',
                    field: 'bindingTime',
                },
            ],
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'memberStatus',
                class: [
                    {
                        name: '有效',
                        code: 1,
                        class: 'common-tag-blue',
                    },
                    {
                        name: '失效',
                        code: 0,
                        class: 'common-housing-gray',
                    },
                ],
            },
        ],
        filterList: [
            {
                name: '客户状态',
                type: 'check',
                checkType: 'radio',
                field: 'status',
                list: [
                    {
                        label: '有效',
                        value: 1,
                    },
                    {
                        label: '失效',
                        value: 0,
                    },
                ],
            },
        ],
        actions: {},
        operating: [
            {
                text: '解绑',
                type: 'logoff',
                bgColor: '#eb6877',
            },
        ],
    },
    {
        name: '小蜜蜂',
        nameField: 'name',
        code: 'beePerson',
        fieldList: [
            [
                {
                    name: '手机号码',
                    field: 'phone',
                },
                {
                    name: '报备数',
                    field: 'totalCustomers',
                },
            ],
            [
                {
                    name: '加入团队时间',
                    field: 'bindingTime',
                },
            ],
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'memberStatus',
                class: [
                    {
                        name: '有效',
                        code: 1,
                        class: 'common-tag-blue',
                    },
                    {
                        name: '失效',
                        code: 0,
                        class: 'common-housing-gray',
                    },
                ],
            },
        ],
        filterList: [
            {
                name: '客户状态',
                type: 'check',
                checkType: 'radio',
                field: 'status',
                list: [
                    {
                        label: '有效',
                        value: 1,
                    },
                    {
                        label: '失效',
                        value: 0,
                    },
                ],
            },
        ],
        actions: {},
        operating: [
            {
                text: '解绑',
                type: 'logoff',
                bgColor: '#eb6877',
            },
        ],
    },
    {
        code: 'ZT.REPORT.TJ',
        name: '报备量',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '报备时间',
                field: 'userStatusTimeStr',
            },
            {
                name: '渠道主管',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.REPORT.SF',
        name: '首访量',
        nameField: 'customerName',
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
                name: '置业顾问',
                field: 'staffName',
                className: 'w-50',
            },
            {
                name: '渠道主管',
                field: 'reportName',
                className: 'w-50',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认筹',
                        code: '30',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.REPORT.FF',
        name: '复访量',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '最新到访时间',
                field: 'userStatusTimeStr',
            },
            {
                name: '置业顾问',
                field: 'staffName',
                className: 'w-50',
            },
            {
                name: '渠道主管',
                field: 'reportName',
                className: 'w-50',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认筹',
                        code: '30',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.REPORT.DF',
        name: '到访量',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '最新到访时间',
                field: 'userStatusTimeStr',
            },
            {
                name: '置业顾问',
                field: 'staffName',
            },
            {
                name: '渠道主管',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.RANK.GROUP.BB',
        name: '报备量',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '报备时间',
                field: 'userStatusTimeStr',
            },
            {
                name: '拓客方式',
                field: 'secondChannelName',
            },
            {
                name: '渠道主管',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
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
                field: 'userStatusTimeStr',
            },
            {
                name: '置业顾问',
                field: 'staffName',
            },
            {
                name: '拓客方式',
                field: 'secondChannelName',
            },
            {
                name: '渠道主管',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.RANK.STAFF.BB',
        name: '报备量',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '报备时间',
                field: 'userStatusTimeStr',
            },
            {
                name: '拓客方式',
                field: 'secondChannelName',
            },
            {
                name: '渠道主管',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.RANK.STAFF.DF',
        name: '到访量',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '最新到访时间',
                field: 'userStatusTimeStr',
            },
            {
                name: '置业顾问',
                field: 'staffName',
            },
            {
                name: '拓客方式',
                field: 'secondChannelName',
            },
            {
                name: '渠道主管',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.RANK.CHANNEL.BB',
        name: '报备量',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '报备时间',
                field: 'userStatusTimeStr',
            },
            {
                name: '拓客方式',
                field: 'secondChannelName',
            },
            {
                name: '渠道主管',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
        ],
        actions: {},
    },
    {
        code: 'ZT.RANK.CHANNEL.DF',
        name: '到访量',
        nameField: 'customerName',
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '最新到访时间',
                field: 'userStatusTimeStr',
            },
            {
                name: '置业顾问',
                field: 'staffName',
            },
            {
                name: '拓客方式',
                field: 'secondChannelName',
            },
            {
                name: '渠道主管',
                field: 'reportName',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'status',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认购',
                        code: '40',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已签约',
                        code: '50',
                        class: 'common-tag-red',
                    },
                    {
                        name: '已失效',
                        code: '0',
                        class: 'common-housing-gray',
                    },
                ],
            },
            {
                name: '客户等级',
                type: 'level',
                field: 'customerLevel',
            },
        ],
        actions: {},
    },
    {
        name: '渠道专员',
        code: 'ZT.CUSTOMER.CHANNEL',
        nameField: 'customerName',
        filterList: [
            {
                name: '客户状态',
                type: 'check',
                field: 'statusList',
                list: [
                    {
                        label: '报备',
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
                ],
            },
            {
                name: '渠道团队',
                type: 'check',
                field: 'groupIdList',
                list: [],
            },
        ],
        fieldList: [
            {
                name: '手机号码',
                field: 'customerTel',
            },
            {
                name: '时间',
                field: 'dealDate',
            },
        ],
        tagList: [
            {
                name: '状态',
                type: 'status',
                field: 'clueStatus',
                class: [
                    {
                        name: '已报备',
                        code: '10',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已到访',
                        code: '20',
                        class: 'common-tag-orange',
                    },
                    {
                        name: '已认筹',
                        code: '30',
                        class: 'common-tag-orange',
                    },
                ],
            },
            {
                name: '拓客方式',
                type: 'status',
                field: 'channel2Name',
                class: 'common-tag-blue',
            },
        ],
        actions: {},
    },
    {
        name: '自渠下线经纪人',
        code: 'ZT.REFERRAL.BROKER',
        nameField: 'name',
        filterList: [
            {
                name: '渠道团队',
                type: 'check',
                field: 'groupIdList',
                list: [],
            },
        ],
        fieldList: [
            {
                name: '手机号码',
                field: 'tel',
            },
        ],

        actions: {},
    },
]

export const sortConfig = [
    {
        code: '',
        name: '全部客户',
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
            {
                text: '今日即将逾期',
                value: 5,
            },
            {
                text: '三天内逾期',
                value: 6,
            },
        ],
    },
    {
        code: 1,
        name: '未获电',
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
        code: 2,
        name: '线上获电',
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
    {
        code: 5,
        name: '待报备',
        sortOptions: [
            {
                text: '最近提交',
                value: 1,
            },
            {
                text: '最早提交',
                value: 2,
            },
        ],
    },
    {
        code: 10,
        name: '已报备',
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
            {
                text: '今日即将逾期',
                value: 5,
            },
            {
                text: '三天内逾期',
                value: 6,
            },
        ],
    },
    {
        code: 20,
        name: '已到访',
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
            {
                text: '今日即将逾期',
                value: 5,
            },
            {
                text: '三天内逾期',
                value: 6,
            },
        ],
    },
    {
        code: 30,
        name: '已认筹',
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
        code: 40,
        name: '已认购',
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
        code: 50,
        name: '已签约',
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
        code: -1,
        name: '已失效',
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
        code: -2,
        name: '重点客户',
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
            {
                text: '今日即将逾期',
                value: 5,
            },
            {
                text: '三天内逾期',
                value: 6,
            },
        ],
    },
    {
        code: 'keyCustomer',
        name: '关键人我的客户',
        sortOptions: [
            {
                text: '最近提交',
                value: 1,
            },
            {
                text: '最早提交',
                value: 2,
            },
        ],
    },
    {
        code: 'beeCustomer',
        name: '小蜜蜂我的客户',
        sortOptions: [
            {
                text: '最近提交',
                value: 1,
            },
            {
                text: '最早提交',
                value: 2,
            },
        ],
    },
    {
        code: 'keyPerson',
        name: '关键人',
        sortOptions: [
            {
                text: '最多拓客',
                value: 1,
            },
            {
                text: '最少拓客',
                value: 2,
            },
            {
                text: '最近加入团队',
                value: 3,
            },
            {
                text: '最早加入团队',
                value: 4,
            },
        ],
    },
    {
        code: 'beePerson',
        name: '小蜜蜂',
        sortOptions: [
            {
                text: '最多拓客',
                value: 1,
            },
            {
                text: '最少拓客',
                value: 2,
            },
            {
                text: '最近加入团队',
                value: 3,
            },
            {
                text: '最早加入团队',
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

export function getTagColor(classList, value) {
    return (
        classList.find((item) => {
            return item.code == value
        }) || ''
    )
}
