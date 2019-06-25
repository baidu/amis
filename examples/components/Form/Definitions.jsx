export default {
    $schema: "https://houtai.baidu.com/v2/schemas/page.json#",
    definitions: {
        options: {
            type: 'combo',
            multiple: true,
            multiLine: true,
            controls: [
                {
                    type: 'group',
                    controls: [
                        {
                            label: "名称",
                            name: "label",
                            type: "text",
                            required: true
                        },
        
                        {
                            label: "值",
                            name: "value",
                            type: "text",
                            required: true
                        },
                    ]
                },

                {
                    $ref: 'options',
                    label: "子选项",
                    name: "children",
                    addButtonText: '新增子选项'
                }
            ]
        },

        queryItem: {
            type: 'combo',
            multiple: true,
            multiLine: true,
            controls: [
                {
                    type: 'hidden',
                    name: '_type',
                    value: 'item'
                },
                {
                    type: 'group',
                    visibleOn: 'this._type === "item"',
                    controls: [
                        {
                            name: 'key',
                            type: 'text',
                            placeholder: '字段名',
                            required: true
                        },
        
                        {
                            name: 'type',
                            type: 'select',
                            value: 0,
                            options: [
                                {
                                    label: 'int64',
                                    value: 0
                                },
                                {
                                    label: 'double64',
                                    value: 1
                                },
                                {
                                    label: 'string',
                                    value: 2
                                },
                                {
                                    label: 'version',
                                    value: 3
                                }
                            ]
                        },
        
                        {
                            type: 'formula',
                            name: 'opt',
                            formula: '""',
                            condition: '${type}'
                        },
        
                        {
                            name: 'opt',
                            type: 'select',
                            placeholder: '请选择',
                            required: true,
                            options: [
                                {
                                    label: '>',
                                    value: '>',
                                    visibleOn: '~[0,1,3].indexOf(this.type)'
                                },
                                {
                                    label: '<',
                                    value: '<',
                                    visibleOn: '~[0,1,3].indexOf(this.type)'
                                },
                                {
                                    label: '==',
                                    value: '=='
                                },
                                {
                                    label: '>=',
                                    value: '>=',
                                    visibleOn: '~[0,1,3].indexOf(this.type)'
                                },
                                {
                                    label: '<=',
                                    value: '<=',
                                    visibleOn: '~[0,1,3].indexOf(this.type)'
                                },
                                {
                                    label: 'in',
                                    value: 'in',
                                },
                                {
                                    label: 'not in',
                                    value: 'not in',
                                },
                                {
                                    label: '!=',
                                    value: '!='
                                },
                            ]
                        },
        
                        {
                            name: 'val',
                            type: 'text',
                            placeholder: '值',
                            required: true,
                            visibleOn: '~[">", "<", ">=", "<=", "==", "!="].indexOf(this.opt)'
                        },
        
                        {
                            name: 'val',
                            type: 'array',
                            required: true,
                            minLength: 1,
                            value: [{}],
                            items: {
                                type: 'text',
                                placeholder: '值',
                                required: true,
                            },
                            visibleOn: '~["in", "not in"].indexOf(this.opt)'
                        }
                    ]
                },

                {
                    type: "button-group",
                    name: 'connect',
                    value: '&',
                    clearable: false,
                    size: 'xs',
                    visibleOn: 'this._type === "group"',
                    options: [
                        {
                            label: 'AND',
                            value: '&'
                        },

                        {
                            label: 'OR',
                            value: '|'
                        }
                    ]
                },
                {
                    $ref: 'queryItem',
                    name: 'exprs',
                    visibleOn: 'this._type === "group"',
                    minLength: 1,
                    value: [{}]
                },

                {
                    name: '_type',
                    type: 'button-group',
                    size: 'xs',
                    options: [
                        {
                            label: 'Item',
                            value: 'item'
                        },

                        {
                            label: 'Group',
                            value: 'group'
                        }
                    ]
                }
            ]
        },

        queryGroup: {
            type: 'combo',
            multiple: false,
            multiLine: true,
            controls: [
                {
                    type: "button-group",
                    name: 'connect',
                    value: '&',
                    clearable: false,
                    size: 'sm',
                    options: [
                        {
                            label: 'AND',
                            value: '&'
                        },

                        {
                            label: 'OR',
                            value: '|'
                        }
                    ]
                },
                {
                    $ref: 'queryItem',
                    name: 'exprs',
                    minLength: 1,
                    value: [{}]
                }
            ]
        }
    },
    type: 'page',
    title: '引用',
    body: [
        '<p>引用可以用来减少重复的结构定义，<code>最主要的是可以用来实现结构的递归定义</code>。</p>',
        
        {
            type: 'form',
            api: '/api/mock/saveForm',
            mode: 'horizontal',
            controls: [
                {
                    $ref: 'options',
                    name: 'options',
                    value: [{
                        label: '选项1',
                        value: '1'
                    }],
                    minLength: 1,
                    label: '选项配置'
                }
            ]
        },
        
        {
            type: 'form',
            api: '/api/mock/saveForm',
            controls: [
                {
                    $ref: 'queryGroup',
                    name: 'q',
                    value: {},
                    label: 'Query'
                }
            ]
        },
    ]
};
