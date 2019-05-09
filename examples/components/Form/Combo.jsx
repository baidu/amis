export default {
    $schema: "https://houtai.baidu.com/v2/schemas/page.json#",
    title: "Combo 示例",
    body: [
        {
            type: "form",
            api: "/api/mock2/saveForm?waitSeconds=2",
            title: "",
            mode: "horizontal",
            // debug: true,
            controls: [
                {
                    type: 'text',
                    label: '文本',
                    name: 'a'
                },
                {
                    type: 'divider'
                },
                {
                    type: "combo",
                    name: "combo1",
                    label: "组合多条多行",
                    multiple: true,
                    multiLine: true,
                    value: [{}],
                    controls: [
                        {
                            name: "a",
                            label: "文本",
                            type: "text",
                            placeholder: "文本",
                            value: '',
                            size: 'full'
                        },
                        {
                            name: "b",
                            label: "选项",
                            type: "select",
                            options: ["a", "b", "c"],
                            size: 'full'
                        }
                    ]
                },

                {
                    type: "button",
                    label: "独立排序",
                    level: "dark",
                    className: "m-t-n-xs",
                    size: "sm",
                    actionType: "dialog",
                    visibleOn: "data.combo1.length > 1",
                    dialog: {
                        title: "对 Combo 进行 拖拽排序",
                        body: {
                            type: "form",
                            controls: [
                                {
                                    type: "combo",
                                    name: "combo1",
                                    label: false,
                                    multiple: true,
                                    draggable: true,
                                    addable: false,
                                    removable: false,
                                    value: [{}],
                                    controls: [
                                        {
                                            name: "a",
                                            type: "static",
                                            tpl: "${a} - ${b}"
                                        }
                                    ]
                                }
                            ]
                        },
                        actions: [
                            {
                                type: "submit",
                                mergeData: true,
                                label: "确认",
                                level: "primary"
                            },

                            {
                                type: "button",
                                actionType: "close",
                                label: "取消"
                            }
                        ]
                    }
                },

                {
                    type: "combo",
                    name: "combo2",
                    label: "组合多条单行",
                    multiple: true,
                    value: [{}],
                    controls: [
                        {
                            name: "a",
                            type: "text",
                            placeholder: "文本",
                            value: ''
                        },
                        {
                            name: "b",
                            type: "select",
                            options: ["a", "b", "c"]
                        }
                    ]
                },
                {
                    type: 'divider'
                },
                {
                    type: "combo",
                    name: "combo3",
                    label: "组合单条多行",
                    multiLine: true,
                    controls: [
                        {
                            name: "a",
                            label: "文本",
                            type: "text",
                            placeholder: "文本",
                            value: '',
                            size: 'full'
                        },
                        {
                            name: "b",
                            label: "选项",
                            type: "select",
                            options: ["a", "b", "c"]
                        }
                    ]
                },

                {
                    type: "combo",
                    name: "combo4",
                    label: "组合单条单行",
                    controls: [
                        {
                            name: "a",
                            type: "text",
                            placeholder: "文本",
                            value: '',
                            size: 'full'
                        },
                        {
                            name: "b",
                            type: "select",
                            options: ["a", "b", "c"]
                        }
                    ]
                },

                {
                    type: 'divider'
                },
                {
                    type: "combo",
                    name: "combo11",
                    label: "组合多条多行内联",
                    multiple: true,
                    multiLine: true,
                    inline: true,
                    value: [{}],
                    controls: [
                        {
                            name: "a",
                            label: "文本",
                            type: "text",
                            placeholder: "文本",
                            value: ''
                        },
                        {
                            name: "b",
                            label: "选项",
                            type: "select",
                            options: ["a", "b", "c"]
                        }
                    ]
                },

                {
                    type: "combo",
                    name: "combo22",
                    label: "组合多条单行内联",
                    multiple: true,
                    inline: true,
                    value: [{}],
                    controls: [
                        {
                            name: "a",
                            type: "text",
                            placeholder: "文本",
                            value: ''
                        },
                        {
                            name: "b",
                            type: "select",
                            options: ["a", "b", "c"]
                        }
                    ]
                },
                {
                    type: 'divider'
                },
                {
                    type: "combo",
                    name: "combo33",
                    label: "组合单条多行内联",
                    multiLine: true,
                    inline: true,
                    controls: [
                        {
                            name: "a",
                            label: "文本",
                            type: "text",
                            placeholder: "文本",
                            value: ''
                        },
                        {
                            name: "b",
                            label: "选项",
                            type: "select",
                            options: ["a", "b", "c"]
                        }
                    ]
                },

                {
                    type: "combo",
                    name: "combo44",
                    label: "组合单条单行内联",
                    inline: true,
                    controls: [
                        {
                            name: "a",
                            type: "text",
                            placeholder: "文本",
                            value: ''
                        },
                        {
                            name: "b",
                            type: "select",
                            options: ["a", "b", "c"]
                        }
                    ]
                },

                {
                    type: 'divider'
                },

                {
                    type: "combo",
                    name: "combo666",
                    label: "组合多条唯一",
                    multiple: true,
                    value: [{}],
                    controls: [
                        {
                            name: "a",
                            type: "text",
                            placeholder: "文本",
                            value: '',
                            unique: true
                        },
                        {
                            name: "b",
                            type: "select",
                            options: ["a", "b", "c"],
                            unique: true
                        }
                    ]
                },

                {
                    type: 'divider'
                },

                {
                    type: "combo",
                    name: "combo777",
                    label: "可拖拽排序",
                    multiple: true,
                    value: [{a: '1', b: "a"}, {a: '2', b: "b"}],
                    draggable: true,
                    controls: [
                        {
                            name: "a",
                            type: "text",
                            placeholder: "文本",
                            unique: true
                        },
                        {
                            name: "b",
                            type: "select",
                            options: ["a", "b", "c"],
                            unique: true
                        }
                    ]
                },

                {
                    type: 'divider'
                },

                {
                    type: "combo",
                    name: "combo888",
                    label: "可打平只存储值",
                    multiple: true,
                    flat: true,
                    value: ["red", "pink"],
                    draggable: true,
                    controls: [
                        {
                            name: "a",
                            type: "color",
                            placeholder: "选取颜色"
                        }
                    ]
                },
                {
                    type: "static",
                    name: "combo888",
                    label: "当前值",
                    tpl: "<pre>${combo888|json}</pre>"
                },
            ]
        }
    ]
};
