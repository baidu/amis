export default {
  type: 'page',
  body: [
    {
      type: 'tabs',
      tabs: [
        {
          title: '个人',
          hash: 'person',
          body: [
            {
              type: 'page',
              messages: {},
              body: [
                {
                  type: 'service',
                  messages: {},
                  body: [
                    {
                      type: 'crud',
                      headerToolbar: [
                        'bulkActions',
                        {
                          label: '新建商机',
                          type: 'button',
                          actionType: 'dialog',
                          level: 'primary',
                          className: 'm-b-sm',
                          dialog: {
                            title: '新增表单',
                            body: [
                              {
                                type: 'form',
                                api: {
                                  method: 'post',
                                  url: 'api://7DXkaR4C1a5GwjafDXax8J',
                                  adaptor:
                                    'return {\n    ...payload,\n    status: payload.error\n}'
                                },
                                controls: [
                                  {
                                    type: 'text',
                                    name: 'competitorName',
                                    label: '竞品up主昵称',
                                    validations: {},
                                    required: true
                                  },
                                  {
                                    type: 'text',
                                    name: 'competitorId',
                                    label: '竞品up主ID',
                                    readOnly: false,
                                    required: true
                                  },
                                  {
                                    type: 'select',
                                    label: '平台',
                                    name: 'platformId',
                                    options: [
                                      {
                                        label: '选项B',
                                        value: 'B'
                                      }
                                    ],
                                    checkAll: false,
                                    source: {
                                      method: 'get',
                                      url: 'api://wrutsYpUP1HeX5uUQ81ty9',
                                      adaptor: ''
                                    },
                                    autoComplete: '',
                                    required: true,
                                    searchable: true,
                                    clearable: true
                                  },
                                  {
                                    type: 'select',
                                    label: '标签',
                                    name: 'tagId',
                                    options: [],
                                    required: true,
                                    checkAll: false,
                                    source: {
                                      method: 'get',
                                      url: 'api://aP3eMrAjtMLhTfy4dnTfXY',
                                      adaptor: ''
                                    },
                                    clearable: true,
                                    searchable: true
                                  },
                                  {
                                    type: 'number',
                                    label: '视频数量',
                                    name: 'videoNum'
                                  },
                                  {
                                    type: 'number',
                                    label: '粉丝数量',
                                    name: 'fansNum'
                                  },
                                  {
                                    type: 'number',
                                    label: '总播放量',
                                    name: 'totalPlay'
                                  },
                                  {
                                    type: 'text',
                                    label: '平台主页链接',
                                    name: 'channelLink',
                                    validations: {
                                      isUrl: true
                                    }
                                  },
                                  {
                                    type: 'datetime',
                                    label: '最后更新时间',
                                    name: 'lastUpdateTime'
                                  },
                                  {
                                    type: 'textarea',
                                    label: '主页简介',
                                    name: 'homePageIntro'
                                  },
                                  {
                                    type: 'select',
                                    label: '负责人',
                                    name: 'operatorOid',
                                    options: [],
                                    checkAll: false,
                                    searchable: true,
                                    clearable: true,
                                    required: true,
                                    autoComplete: {
                                      method: 'get',
                                      url: 'api://mw53b3sTmacz3xCiCD5Gap',
                                      responseData: {
                                        options:
                                          '${list|pick:label~userName,value~uid}'
                                      },
                                      data: {
                                        staffName: '$value'
                                      },
                                      replaceData: false
                                    }
                                  }
                                ]
                              }
                            ],
                            type: 'dialog'
                          },
                          icon: 'fa fa-plus'
                        }
                      ],
                      filter: {
                        title: '',
                        submitText: '',
                        controls: [
                          {
                            type: 'group',
                            controls: [
                              {
                                type: 'select',
                                label: '商机阶段',
                                name: 'followStep',
                                options: [],
                                checkAll: false,
                                source: {
                                  method: 'get',
                                  url: 'api://rF2FKcGBmCZoDLEcpatPER',
                                  adaptor: ''
                                },
                                searchable: true,
                                selectFirst: false,
                                clearable: true
                              },
                              {
                                type: 'select',
                                label: '直播平台:',
                                name: 'platformIds',
                                options: [],
                                placeholder: '请选择直播平台',
                                checkAll: false,
                                source: {
                                  method: 'get',
                                  url: 'api://wrutsYpUP1HeX5uUQ81ty9',
                                  adaptor: ''
                                },
                                columnRatio: 3,
                                autoComplete: '',
                                selectFirst: false,
                                searchable: true,
                                multiple: true,
                                joinValues: true,
                                clearable: true
                              },
                              {
                                type: 'select',
                                label: '标签:',
                                name: 'tagIds',
                                options: [],
                                placeholder: '下拉搜索多选',
                                checkAll: false,
                                multiple: true,
                                joinValues: true,
                                searchable: true,
                                source: {
                                  method: 'get',
                                  url: 'api://aP3eMrAjtMLhTfy4dnTfXY',
                                  adaptor: ''
                                },
                                columnRatio: 3,
                                clearable: true
                              }
                            ],
                            gap: 'sm',
                            className: ''
                          },
                          {
                            type: 'group',
                            controls: [
                              {
                                type: 'select',
                                name: 'mcnIds',
                                options: [],
                                label: 'MCN:',
                                placeholder: '请选择直播平台',
                                checkAll: false,
                                source: {
                                  method: 'get',
                                  url: 'api://jY9LbFvnyoBmwGVJLoa1TF',
                                  adaptor: ''
                                },
                                autoComplete: '',
                                selectFirst: false,
                                columnRatio: 3,
                                searchable: true,
                                multiple: true,
                                joinValues: true,
                                clearable: true
                              },
                              {
                                type: 'group',
                                label: '粉丝数:',
                                controls: [
                                  {
                                    type: 'number',
                                    name: 'fansMin',
                                    className: 'w-xs',
                                    min: '0'
                                  },
                                  {
                                    type: 'number',
                                    name: 'fansMin',
                                    className: 'w-xs',
                                    min: '0'
                                  }
                                ]
                              },
                              {
                                type: 'select',
                                label: '竞品up主:',
                                name: 'competitorIds',
                                options: [],
                                checkAll: false,
                                source: '',
                                autoComplete: {
                                  method: 'get',
                                  url: 'api://mMu9pCfGjU77hj4qK6VhTk',
                                  adaptor:
                                    'return {\n    ...payload,\n    status: payload.error,\n    data: {\n        ...payload.data,\n        options: (payload.data.list || []).map((item) => {\n            return {\n                "label": item.competitorName || "",\n                "value": item.competitorId || "",\n            }\n        })\n    }\n}',
                                  data: {
                                    uploader: '$value'
                                  },
                                  requestAdaptor: ''
                                },
                                multiple: true,
                                joinValues: true,
                                searchable: true,
                                clearable: true
                              }
                            ],
                            gap: 'sm',
                            className: ''
                          },
                          {
                            type: 'group',
                            controls: [
                              {
                                type: 'button-group',
                                name: 'followStatus',
                                options: [
                                  {
                                    label: '未跟进',
                                    value: '1'
                                  },
                                  {
                                    label: '跟进中',
                                    value: '2'
                                  },
                                  {
                                    label: '已完成',
                                    value: '3'
                                  },
                                  {
                                    label: '全部',
                                    value: '0'
                                  }
                                ],
                                joinValues: true,
                                submitOnChange: true,
                                __sourceFromAPICenter: false,
                                value: '1'
                              }
                            ]
                          }
                        ],
                        className: '',
                        submitOnChange: true,
                        actions: [
                          {
                            type: 'reset',
                            label: '重置',
                            actionType: '',
                            dialog: {
                              title: '系统提示',
                              body: '对你点击了'
                            }
                          },
                          {
                            type: 'submit',
                            label: '搜索',
                            actionType: '',
                            dialog: {
                              title: '系统提示',
                              body: '对你点击了'
                            },
                            level: 'primary'
                          }
                        ]
                      },
                      bulkActions: [
                        {
                          label: '合并',
                          actionType: 'dialog',
                          dialog: {
                            title: '合并商机',
                            body: [
                              {
                                type: 'form',
                                title: '表单',
                                controls: [
                                  {
                                    label: '商机对象',
                                    type: 'select',
                                    name: 'mergeInto',
                                    options: [],
                                    checkAll: false,
                                    source: '',
                                    autoComplete: {
                                      method: 'get',
                                      url: 'api://woGMHHGZY68sHG5sxvZv14',
                                      data: {
                                        uploaderIds: '$ids'
                                      },
                                      adaptor:
                                        'return {\n  ...payload,\n  status: payload.error,\n  data: {\n    ...payload.data,\n    options: (payload.data || []).map((item) => {\n      return {\n        "label": `${item.platformName}-${item.competitorName}-${item.roomId}` || "",\n        "value": item.id || 0,\n      }\n    })\n  }\n}'
                                    },
                                    defaultCheckAll: false,
                                    checkAllLabel: '全选',
                                    required: true,
                                    searchable: false
                                  }
                                ],
                                api: {
                                  method: 'post',
                                  url: 'api://iFbqjtdAekJ6KpNkLddWzC',
                                  requestAdaptor:
                                    'return {\n    ...api,\n    data: {\n        beMerged: (api.data.ids || "").split(",").map((item) => {\n            return item\n        }),\n        mergeInto: api.data.mergeInto\n    }\n}',
                                  adaptor: ''
                                }
                              }
                            ],
                            type: 'dialog',
                            closeOnEsc: false,
                            showCloseButton: true
                          },
                          api: {
                            method: 'post',
                            url: 'api://ucyD6my3HSDpjH6aSBaRjo',
                            data: null,
                            replaceData: false,
                            requestAdaptor:
                              'return {\n    ...api,\n    data: {\n        ids: api.data.ids.split(",").map((item) => {\n            return parseInt(item, 10)\n        })\n\n    }\n}'
                          },
                          level: 'info'
                        },
                        {
                          label: '转交',
                          actionType: 'dialog',
                          dialog: {
                            title: '分配商机',
                            body: [
                              {
                                type: 'form',
                                title: '表单',
                                controls: [
                                  {
                                    label: '转交人员',
                                    type: 'select',
                                    name: 'operatorOid',
                                    options: [],
                                    checkAll: false,
                                    source: '',
                                    autoComplete: {
                                      method: 'get',
                                      url: 'api://mw53b3sTmacz3xCiCD5Gap',
                                      data: {
                                        staffName: '$value'
                                      },
                                      adaptor:
                                        'return {\n    ...payload,\n    status: payload.error,\n    data: {\n        ...payload.data,\n        options: (payload.data.list || []).map((item) => {\n            return {\n                "label": item.staffName || "",\n                "value": item.staffId || 0,\n            }\n        })\n    }\n}'
                                    },
                                    defaultCheckAll: false,
                                    checkAllLabel: '全选',
                                    required: true,
                                    searchable: true
                                  }
                                ],
                                api: {
                                  method: 'post',
                                  url: 'api://mK5awEkWpErRvKaX9mx3pt',
                                  requestAdaptor:
                                    'return {\n  ...api,\n  data: {\n    ids: (api.data.ids || "").split(",").map((item) => {\n      return item\n    }),\n    operatorOid: api.data.operatorOid\n  }\n}'
                                }
                              }
                            ],
                            type: 'dialog',
                            closeOnEsc: false,
                            showCloseButton: true
                          },
                          api: {
                            method: 'post',
                            url: 'api://mK5awEkWpErRvKaX9mx3pt',
                            data: null,
                            replaceData: false,
                            requestAdaptor:
                              'return {\n    ...api,\n    data: {\n        ids: api.data.ids.split(",").map((item) => {\n            return parseInt(item, 10)\n        })\n\n    }\n}'
                          },
                          level: 'info'
                        },
                        {
                          label: '删除',
                          actionType: 'dialog',
                          dialog: {
                            title: '删除',
                            body: [
                              {
                                type: 'form',
                                title: '表单',
                                controls: [],
                                api: {
                                  method: 'post',
                                  url: 'api://hbK4vn3mtv4tPxUhRQjqaj',
                                  requestAdaptor:
                                    'return {\n  ...api,\n  data: {\n    ids: (api.data.ids || "").split(",").map((item) => {\n      return item\n    })\n  }\n}'
                                },
                                __apiFromAPICenter: true
                              },
                              {
                                type: 'tpl',
                                tpl: '是否确认删除下面主播 ？',
                                inline: false,
                                className: 'm-b'
                              },
                              {
                                type: 'tpl',
                                tpl:
                                  '<% if (data.items &&data.items.length) { %>主播: <% data.items.forEach(function(item) { %> <span class=\'label label-default\'><%= item["competitorName"] %></span> <% }); %><% } %>',
                                inline: false
                              }
                            ],
                            type: 'dialog',
                            closeOnEsc: false,
                            showCloseButton: true
                          },
                          api: {
                            method: 'post',
                            url: 'api://ucyD6my3HSDpjH6aSBaRjo',
                            data: null,
                            replaceData: false,
                            requestAdaptor:
                              'return {\n    ...api,\n    data: {\n        ids: api.data.ids.split(",").map((item) => {\n            return parseInt(item, 10)\n        })\n\n    }\n}'
                          },
                          level: 'info'
                        },
                        {
                          label: '退回',
                          actionType: 'dialog',
                          dialog: {
                            title: '退回',
                            body: [
                              {
                                type: 'form',
                                title: '表单',
                                controls: [],
                                api: {
                                  method: 'post',
                                  url: 'api://cMR967wWd79CUXegJmVhai',
                                  requestAdaptor:
                                    'return {\n  ...api,\n  data: {\n    ids: (api.data.ids || "").split(",").map((item) => {\n      return item\n    })\n  }\n}'
                                },
                                __apiFromAPICenter: true
                              },
                              {
                                type: 'tpl',
                                tpl: '是否确认退回下面主播 ？',
                                inline: false,
                                className: 'm-b'
                              },
                              {
                                type: 'tpl',
                                tpl:
                                  '<% if (data.items &&data.items.length) { %>主播: <% data.items.forEach(function(item) { %> <span class=\'label label-default\'><%= item["competitorName"] %></span> <% }); %><% } %>',
                                inline: false
                              }
                            ],
                            type: 'dialog',
                            closeOnEsc: false,
                            showCloseButton: true
                          },
                          api: {
                            method: 'post',
                            url: 'api://ucyD6my3HSDpjH6aSBaRjo',
                            data: null,
                            replaceData: false,
                            requestAdaptor:
                              'return {\n    ...api,\n    data: {\n        ids: api.data.ids.split(",").map((item) => {\n            return parseInt(item, 10)\n        })\n\n    }\n}'
                          },
                          level: 'info'
                        }
                      ],
                      columns: [
                        {
                          name: 'competitorName',
                          label: '竞品up主名称',
                          type: 'text',
                          placeholder: '-',
                          fixed: 'left'
                        },
                        {
                          type: 'plain',
                          tpl: '',
                          inline: false,
                          label: '竞品UP主uid',
                          placeholder: '-',
                          name: 'competitorId'
                        },
                        {
                          type: 'tpl',
                          tpl: '${platformsMap[$platform] | default: 未知} ',
                          inline: false,
                          name: 'platform',
                          label: '平台'
                        },
                        {
                          type: 'text',
                          label: '标签',
                          name: 'tagName',
                          placeholder: '-'
                        },
                        {
                          type: 'text',
                          inline: false,
                          label: '粉丝数',
                          name: 'fansNum'
                        },
                        {
                          type: 'text',
                          label: '视频数量',
                          name: 'videoNum'
                        },
                        {
                          type: 'text',
                          label: '粉丝数量',
                          name: 'fansNum'
                        },
                        {
                          type: 'text',
                          label: '总播放量',
                          name: 'totalPlay'
                        },
                        {
                          type: 'link',
                          label: '平台主页链接',
                          name: 'channelLink'
                        },
                        {
                          type: 'plain',
                          label: '最后更新时间',
                          name: 'lastUpdateTime',
                          placeholder: '-',
                          tpl:
                            "<%= data.lastUpdateTime>0 ? date(data.lastUpdateTime, 'YYYY-MM-DD HH:mm:ss') : '-' %>",
                          inline: true
                        },
                        {
                          type: 'plain',
                          label: '主页简介',
                          name: 'homePageIntro',
                          tpl: '',
                          inline: false
                        },
                        {
                          type: 'plain',
                          label: '飞瓜指数',
                          name: 'flyingMelonIndex',
                          tpl: '',
                          inline: false,
                          placeholder: '-'
                        },
                        {
                          type: 'plain',
                          label: '卡思指数',
                          name: 'cassIndex',
                          tpl: '',
                          inline: false,
                          placeholder: '-'
                        },
                        {
                          type: 'plain',
                          label: '负责人',
                          name: 'operatorName',
                          tpl: '',
                          inline: false
                        },
                        {
                          type: 'plain',
                          label: '商机阶段',
                          tpl: '${stepsMap[$followStep] | default:"未知"}',
                          inline: false,
                          placeholder: '-'
                        },
                        {
                          type: 'plain',
                          tpl: '',
                          inline: false,
                          label: '赢率',
                          name: 'winRate'
                        },
                        {
                          type: 'operation',
                          label: '操作',
                          buttons: [
                            {
                              label: '详情',
                              type: 'button',
                              actionType: 'link',
                              link: './up主详情页面?upid=${id}',
                              level: 'link'
                            }
                          ],
                          fixed: 'right'
                        }
                      ],
                      messages: {},
                      api: {
                        method: 'get',
                        url: 'api://fKc3j7WGRiXXGDeTwbY2Vh',
                        data: {
                          '&': '$$',
                          'fansNum': "${fansMin || '0'},${fansMax || '0'}"
                        },
                        adaptor: ''
                      },
                      pageField: 'current',
                      perPageField: 'size',
                      source: '$records',
                      __apiFromAPICenter: false,
                      __quickSaveApiFromAPICenter: false,
                      __quickSaveItemApiFromAPICenter: false
                      // perPage: '$records'
                    }
                  ],
                  __apiFromAPICenter: true
                }
              ],
              title: '',
              cssVars: {
                '--Page-body-padding': '5px',
                '--Panel-bodyPadding': '5px',
                '--Panel-marginBottom': '5px'
              }
            }
          ]
          // visibleOn: 'this.authority.listPrivPers===1'
        },
        {
          title: '部门',
          body: [
            {
              type: 'page',
              messages: {},
              title: '',
              body: [
                {
                  type: 'service',
                  body: [
                    {
                      type: 'crud',
                      headerToolbar: [
                        'bulkActions',
                        {
                          type: 'dialog',
                          title: '新增表单',
                          body: [
                            {
                              type: 'form',
                              api: {
                                method: 'post',
                                url: 'api://7DXkaR4C1a5GwjafDXax8J',
                                adaptor:
                                  'return {\n    ...payload,\n    status: payload.error\n}'
                              },
                              controls: [
                                {
                                  type: 'text',
                                  name: 'competitorName',
                                  label: '竞品up主昵称',
                                  validations: {},
                                  required: true
                                },
                                {
                                  type: 'text',
                                  name: 'competitorId',
                                  label: '竞品up主ID',
                                  readOnly: false,
                                  required: true
                                },
                                {
                                  type: 'select',
                                  label: '平台',
                                  name: 'platformId',
                                  options: [
                                    {
                                      label: '选项B',
                                      value: 'B'
                                    }
                                  ],
                                  checkAll: false,
                                  source: {
                                    method: 'get',
                                    url: 'api://wrutsYpUP1HeX5uUQ81ty9',
                                    adaptor: ''
                                  },
                                  autoComplete: '',
                                  required: true,
                                  searchable: true,
                                  clearable: true
                                },
                                {
                                  type: 'select',
                                  label: '标签',
                                  name: 'tagId',
                                  options: [],
                                  required: true,
                                  checkAll: false,
                                  source: {
                                    method: 'get',
                                    url: 'api://aP3eMrAjtMLhTfy4dnTfXY',
                                    adaptor: ''
                                  },
                                  clearable: true,
                                  searchable: true
                                },
                                {
                                  type: 'number',
                                  label: '视频数量',
                                  name: 'videoNum'
                                },
                                {
                                  type: 'number',
                                  label: '粉丝数量',
                                  name: 'fansNum'
                                },
                                {
                                  type: 'number',
                                  label: '总播放量',
                                  name: 'totalPlay'
                                },
                                {
                                  type: 'text',
                                  label: '平台主页链接',
                                  name: 'channelLink',
                                  validations: {
                                    isUrl: true
                                  }
                                },
                                {
                                  type: 'datetime',
                                  label: '最后更新时间',
                                  name: 'lastUpdateTime'
                                },
                                {
                                  type: 'textarea',
                                  label: '主页简介',
                                  name: 'homePageIntro'
                                },
                                {
                                  type: 'select',
                                  label: '负责人:',
                                  name: 'operatorOid',
                                  options: [],
                                  checkAll: false,
                                  searchable: true,
                                  clearable: true,
                                  source: {
                                    method: 'get',
                                    url: 'api://q49MZhqHtJKNUbYTBkH548',
                                    replaceData: false,
                                    responseData: {
                                      options:
                                        '${list|pick:label~staffName,value~staffId}'
                                    }
                                  },
                                  multiple: false,
                                  joinValues: true,
                                  creatable: false
                                }
                              ]
                            }
                          ]
                        }
                      ],
                      filter: {
                        title: '',
                        submitText: '',
                        controls: [
                          {
                            type: 'group',
                            controls: [
                              {
                                type: 'select',
                                label: '部门:',
                                name: 'departmentId',
                                options: [],
                                checkAll: false,
                                source: 'get:api://gnVZKF9BVL8pkThi6VuVgA',
                                searchable: true,
                                clearable: true,
                                selectFirst: true,
                                multiple: false,
                                joinValues: true
                              },
                              {
                                type: 'select',
                                label: '负责人:',
                                name: 'operatorOids',
                                options: [],
                                checkAll: false,
                                source: '',
                                searchable: true,
                                autoComplete: {
                                  method: 'get',
                                  url:
                                    'api://fotL4BhK3x1CHEXzpPb9qE?deptId=${departmentId}',
                                  replaceData: false,
                                  data: {
                                    staffName: '$value'
                                  },
                                  responseData: {
                                    options:
                                      '${list|pick:label~staffName,value~staffId}'
                                  }
                                },
                                multiple: true,
                                joinValues: true,
                                clearable: true
                              },
                              {
                                type: 'select',
                                label: '商机阶段:',
                                name: 'followStep',
                                options: [],
                                checkAll: false,
                                source: {
                                  method: 'get',
                                  url: 'api://rF2FKcGBmCZoDLEcpatPER',
                                  adaptor: ''
                                },
                                searchable: true
                              },
                              {
                                type: 'select',
                                label: '直播平台:',
                                name: 'platformIds',
                                options: [],
                                placeholder: '请选择直播平台',
                                checkAll: false,
                                source: {
                                  method: 'get',
                                  url: 'api://wrutsYpUP1HeX5uUQ81ty9',
                                  adaptor: ''
                                },
                                columnRatio: 3,
                                autoComplete: '',
                                selectFirst: false,
                                searchable: true,
                                multiple: true,
                                joinValues: true,
                                clearable: true
                              },
                              {
                                type: 'select',
                                label: '标签:',
                                name: 'tagIds',
                                options: [],
                                placeholder: '下拉搜索多选',
                                checkAll: false,
                                multiple: true,
                                joinValues: true,
                                searchable: true,
                                source: 'get:api://aP3eMrAjtMLhTfy4dnTfXY',
                                columnRatio: 3
                              }
                            ],
                            gap: 'sm',
                            className: ''
                          },
                          {
                            type: 'group',
                            controls: [
                              {
                                type: 'select',
                                name: 'mcnIds',
                                options: [],
                                label: 'MCN:',
                                placeholder: '请选择直播平台',
                                checkAll: false,
                                source: {
                                  method: 'get',
                                  url: 'api://jY9LbFvnyoBmwGVJLoa1TF',
                                  adaptor: ''
                                },
                                autoComplete: '',
                                selectFirst: false,
                                columnRatio: 3,
                                searchable: true,
                                multiple: true,
                                joinValues: true
                              },
                              {
                                type: 'group',
                                label: '粉丝数:',
                                controls: [
                                  {
                                    type: 'number',
                                    name: 'fansMin',
                                    className: 'w-xs',
                                    min: '0'
                                  },
                                  {
                                    type: 'number',
                                    name: 'fansMin',
                                    className: 'w-xs',
                                    min: '0'
                                  }
                                ]
                              },
                              {
                                type: 'select',
                                label: '竞品up主',
                                name: 'competitorIds',
                                options: [],
                                checkAll: false,
                                source: '',
                                autoComplete: {
                                  method: 'get',
                                  url: 'api://mMu9pCfGjU77hj4qK6VhTk',
                                  adaptor:
                                    'return {\n    ...payload,\n    status: payload.error,\n    data: {\n        ...payload.data,\n        options: (payload.data.list || []).map((item) => {\n            return {\n                "label": item.competitorName || "",\n                "value": item.competitorId || "",\n            }\n        })\n    }\n}',
                                  data: {
                                    uploader: '$value'
                                  }
                                },
                                multiple: true,
                                joinValues: true,
                                searchable: true,
                                clearable: true
                              }
                            ],
                            gap: 'sm',
                            className: ''
                          },
                          {
                            type: 'group',
                            controls: [
                              {
                                type: 'button-group',
                                name: 'distributionStatus',
                                options: [
                                  {
                                    label: '全部商机',
                                    value: '0'
                                  },
                                  {
                                    label: '已分配商机',
                                    value: '2'
                                  },
                                  {
                                    label: '未分配商机',
                                    value: '1'
                                  }
                                ],
                                joinValues: true,
                                submitOnChange: true,
                                value: '1'
                              }
                            ]
                          }
                        ],
                        className: '',
                        submitOnChange: true,
                        actions: [
                          {
                            type: 'reset',
                            label: '重置',
                            actionType: '',
                            dialog: {
                              title: '系统提示',
                              body: '对你点击了'
                            }
                          },
                          {
                            type: 'submit',
                            label: '搜索',
                            actionType: '',
                            dialog: {
                              title: '系统提示',
                              body: '对你点击了'
                            },
                            level: 'primary'
                          }
                        ]
                      },
                      bulkActions: [
                        {
                          label: '分配',
                          actionType: 'dialog',
                          api: {
                            method: 'post',
                            url: 'api://ucyD6my3HSDpjH6aSBaRjo',
                            data: null,
                            replaceData: false,
                            requestAdaptor:
                              'return {\n    ...api,\n    data: {\n        ids: api.data.ids.split(",").map((item) => {\n            return parseInt(item, 10)\n        })\n\n    }\n}'
                          },
                          dialog: {
                            type: 'dialog',
                            title: '分配商机',
                            body: [
                              {
                                type: 'form',
                                title: '表单',
                                controls: [
                                  {
                                    label: '负责人:',
                                    type: 'select',
                                    name: 'operatorOid',
                                    options: [],
                                    checkAll: false,
                                    source: '',
                                    autoComplete: {
                                      method: 'get',
                                      url:
                                        'api://fotL4BhK3x1CHEXzpPb9qE?deptId=${departmentId}',
                                      data: {
                                        staffName: '$value'
                                      },
                                      replaceData: false,
                                      responseData: {
                                        options:
                                          '${list|pick:label~staffName,value~staffId}'
                                      }
                                    },
                                    searchable: true,
                                    multiple: true,
                                    joinValues: true,
                                    clearable: true
                                  }
                                ],
                                api: {
                                  method: 'post',
                                  url: 'api://ucyD6my3HSDpjH6aSBaRjo',
                                  adaptor: '',
                                  requestAdaptor:
                                    'return {\n  ...api,\n  data: {\n    ids: (api.data.ids || "").split(",").map((item) => {\n      return item\n    }),\n    operatorOid: api.data.operatorOid\n  }\n}'
                                }
                              }
                            ],
                            closeOnEsc: false,
                            showCloseButton: true
                          },
                          level: 'info'
                        },
                        {
                          label: '认领',
                          actionType: 'dialog',
                          dialog: {
                            title: '认领',
                            body: [
                              {
                                type: 'form',
                                title: '表单',
                                controls: [],
                                api: {
                                  method: 'post',
                                  url: 'api://ik8j9Rsa3MaV6QQjqTokp4',
                                  requestAdaptor:
                                    'return {\n    ...api,\n    data: {\n        ids: (api.data.ids || "").split(",").map((item) => {\n            return item\n        })\n    }\n}'
                                }
                              },
                              {
                                type: 'tpl',
                                tpl: '是否确认认领下面主播 ？',
                                inline: false,
                                className: 'm-b'
                              },
                              {
                                type: 'tpl',
                                tpl:
                                  '<% if (data.items &&data.items.length) { %>主播: <% data.items.forEach(function(item) { %> <span class=\'label label-default\'><%= item["competitorName"] %></span> <% }); %><% } %>',
                                inline: false
                              }
                            ],
                            type: 'dialog',
                            closeOnEsc: false,
                            showCloseButton: true
                          },
                          api: {
                            method: 'post',
                            url: 'api://ucyD6my3HSDpjH6aSBaRjo',
                            data: null,
                            replaceData: false,
                            requestAdaptor:
                              'return {\n    ...api,\n    data: {\n        ids: api.data.ids.split(",").map((item) => {\n            return parseInt(item, 10)\n        })\n\n    }\n}'
                          },
                          level: 'info'
                        },
                        {
                          label: '合并',
                          actionType: 'dialog',
                          dialog: {
                            title: '合并商机',
                            body: [
                              {
                                type: 'form',
                                title: '表单',
                                controls: [
                                  {
                                    label: '商机对象',
                                    type: 'select',
                                    name: 'mergeInto',
                                    options: [],
                                    checkAll: false,
                                    source: '',
                                    autoComplete: {
                                      method: 'get',
                                      url: 'api://woGMHHGZY68sHG5sxvZv14',
                                      data: {
                                        uploaderIds: '$ids'
                                      },
                                      adaptor:
                                        'return {\n  ...payload,\n  status: payload.error,\n  data: {\n    ...payload.data,\n    options: (payload.data || []).map((item) => {\n      return {\n        "label": `${item.platformName}-${item.competitorName}-${item.roomId}` || "",\n        "value": item.id || 0,\n      }\n    })\n  }\n}'
                                    },
                                    defaultCheckAll: false,
                                    checkAllLabel: '全选',
                                    required: true,
                                    searchable: false
                                  }
                                ],
                                api: {
                                  method: 'post',
                                  url: 'api://iFbqjtdAekJ6KpNkLddWzC',
                                  adaptor: '',
                                  requestAdaptor:
                                    'return {\n    ...api,\n    data: {\n        beMerged: (api.data.ids || "").split(",").map((item) => {\n            return item\n        }),\n        mergeInto: api.data.mergeInto\n    }\n}'
                                }
                              }
                            ],
                            type: 'dialog',
                            closeOnEsc: false,
                            showCloseButton: true
                          },
                          api: {
                            method: 'post',
                            url: 'api://ucyD6my3HSDpjH6aSBaRjo',
                            data: null,
                            replaceData: false,
                            requestAdaptor:
                              'return {\n    ...api,\n    data: {\n        ids: api.data.ids.split(",").map((item) => {\n            return parseInt(item, 10)\n        })\n\n    }\n}'
                          },
                          level: 'info'
                        },
                        {
                          label: '转交',
                          actionType: 'dialog',
                          api: {
                            method: 'post',
                            url: 'api://mK5awEkWpErRvKaX9mx3pt',
                            data: null,
                            replaceData: false,
                            requestAdaptor:
                              'return {\n    ...api,\n    data: {\n        ids: api.data.ids.split(",").map((item) => {\n            return parseInt(item, 10)\n        })\n\n    }\n}'
                          },
                          dialog: {
                            type: 'dialog',
                            title: '分配商机',
                            body: [
                              {
                                type: 'form',
                                title: '表单',
                                controls: [
                                  {
                                    label: '转交人员',
                                    type: 'select',
                                    name: 'operatorOid',
                                    options: [],
                                    checkAll: false,
                                    source: '',
                                    autoComplete: {
                                      method: 'get',
                                      url: 'api://mw53b3sTmacz3xCiCD5Gap',
                                      data: {
                                        staffName: '$value'
                                      },
                                      adaptor:
                                        'return {\n    ...payload,\n    status: payload.error,\n    data: {\n        ...payload.data,\n        options: (payload.data.list || []).map((item) => {\n            return {\n                "label": item.staffName || "",\n                "value": item.staffId || 0,\n            }\n        })\n    }\n}'
                                    },
                                    defaultCheckAll: false,
                                    checkAllLabel: '全选',
                                    required: true,
                                    searchable: true
                                  }
                                ],
                                api: {
                                  method: 'post',
                                  url: 'api://mK5awEkWpErRvKaX9mx3pt',
                                  requestAdaptor:
                                    'return {\n  ...api,\n  data: {\n    ids: (api.data.ids || "").split(",").map((item) => {\n      return item\n    }),\n    operatorOid: api.data.operatorOid\n  }\n}'
                                },
                                __apiFromAPICenter: true
                              }
                            ],
                            closeOnEsc: false,
                            showCloseButton: true
                          },
                          level: 'info'
                        },
                        {
                          label: '退回',
                          actionType: 'dialog',
                          dialog: {
                            title: '退回',
                            body: [
                              {
                                type: 'form',
                                title: '表单',
                                controls: [],
                                api: {
                                  method: 'post',
                                  url: 'api://3aHSNXCX4qcXHWPje8F2dV',
                                  requestAdaptor:
                                    'return {\n  ...api,\n  data: {\n    ids: (api.data.ids || "").split(",").map((item) => {\n      return item\n    })\n  }\n}'
                                },
                                __apiFromAPICenter: true
                              },
                              {
                                type: 'tpl',
                                tpl: '是否确认退回下面主播 ？',
                                inline: false,
                                className: 'm-b'
                              },
                              {
                                type: 'tpl',
                                tpl:
                                  '<% if (data.items &&data.items.length) { %>主播: <% data.items.forEach(function(item) { %> <span class=\'label label-default\'><%= item["competitorName"] %></span> <% }); %><% } %>',
                                inline: false
                              }
                            ],
                            type: 'dialog',
                            closeOnEsc: false,
                            showCloseButton: true
                          },
                          api: {
                            method: 'post',
                            url: 'api://ucyD6my3HSDpjH6aSBaRjo',
                            data: null,
                            replaceData: false,
                            requestAdaptor:
                              'return {\n    ...api,\n    data: {\n        ids: api.data.ids.split(",").map((item) => {\n            return parseInt(item, 10)\n        })\n\n    }\n}'
                          },
                          level: 'info'
                        }
                      ],
                      columns: [
                        {
                          name: 'competitorName',
                          label: '竞品up主名称',
                          type: 'text',
                          placeholder: '-',
                          fixed: 'left'
                        },
                        {
                          type: 'plain',
                          tpl: '',
                          inline: false,
                          label: '竞品UP主uid',
                          placeholder: '-',
                          name: 'competitorId'
                        },
                        {
                          type: 'plain',
                          tpl: '',
                          inline: false,
                          label: '平台',
                          placeholder: '-',
                          name: 'platformName'
                        },
                        {
                          type: 'text',
                          label: '标签',
                          name: 'tagName',
                          placeholder: '-'
                        },
                        {
                          type: 'text',
                          inline: false,
                          label: '粉丝数',
                          name: 'fansNum'
                        },
                        {
                          type: 'text',
                          label: '视频数量',
                          name: 'videoNum'
                        },
                        {
                          type: 'text',
                          label: '粉丝数量',
                          name: 'fansNum'
                        },
                        {
                          type: 'text',
                          label: '总播放量',
                          name: 'totalPlay'
                        },
                        {
                          type: 'link',
                          label: '平台主页链接',
                          name: 'channelLink'
                        },
                        {
                          type: 'plain',
                          label: '最后更新时间',
                          name: 'lastUpdateTime',
                          placeholder: '-',
                          tpl:
                            "<%= data.lastUpdateTime>0 ? date(data.lastUpdateTime, 'YYYY-MM-DD HH:mm:ss') : '-' %>",
                          inline: true
                        },
                        {
                          type: 'plain',
                          label: '主页简介',
                          name: 'homePageIntro',
                          tpl: '',
                          inline: false,
                          width: 240
                        },
                        {
                          type: 'plain',
                          label: '飞瓜指数',
                          name: 'flyingMelonIndex',
                          tpl: '',
                          inline: false,
                          placeholder: '-'
                        },
                        {
                          type: 'plain',
                          label: '卡思指数',
                          name: 'cassIndex',
                          tpl: '',
                          inline: false,
                          placeholder: '-'
                        },
                        {
                          type: 'plain',
                          label: '负责人',
                          name: 'operatorName',
                          tpl: '',
                          inline: false
                        },
                        {
                          type: 'plain',
                          label: '商机阶段',
                          tpl: '',
                          inline: false,
                          placeholder: '-',
                          name: 'followStepName'
                        },
                        {
                          type: 'plain',
                          tpl: '',
                          inline: false,
                          label: '赢率',
                          name: 'winRate'
                        },
                        {
                          type: 'operation',
                          label: '操作',
                          buttons: [
                            {
                              label: '详情',
                              type: 'button',
                              actionType: 'link',
                              link: './up主详情页面?upid=${id}',
                              level: 'link'
                            }
                          ],
                          fixed: 'right'
                        }
                      ],
                      messages: {},
                      api: {
                        method: 'get',
                        url: 'api://vjTzuRCWUag5FnXgeQuAim',
                        data: {
                          'current': '$page',
                          'size': '${perPage || 10}',
                          '&': '$$',
                          'fansNum': "${fansMin || '0'},${fansMax || '0'}"
                        },
                        adaptor: ''
                      },
                      itemActions: [],
                      pageField: 'current',
                      perPageField: 'size',
                      source: '${records}',
                      __apiFromAPICenter: false,
                      __quickSaveApiFromAPICenter: false,
                      __quickSaveItemApiFromAPICenter: false
                    }
                  ],
                  messages: {}
                }
              ],
              cssVars: {
                '--Page-body-padding': '5px',
                '--Panel-bodyPadding': '5px',
                '--Panel-marginBottom': '5px'
              }
            }
          ],
          hash: 'department',
          visibleOn: 'this.authority.listPrivDept===1'
        }
      ],
      activeKey: 'department',
      tabsMode: 'radio'
    }
  ],
  cssVars: {
    '--Page-body-padding': '5px',
    '--Panel-bodyPadding': '5px',
    '--Panel-marginBottom': '5px'
  },
  messages: {},
  // initApi: 'get:api://mo36UYrE2HFdhXJnGnoAwV',
  __initApiFromAPICenter: true,
  initFetch: true
};
