export default {
    $schema: "https://houtai.baidu.com/v2/schemas/page.json#",
    definitions: {
        aa: {
            type: 'text',
            name: 'jack',
            value: 'refs value',
            remark: '通过<code>\\$ref</code>引入的组件'
        },
        bb: {
            type: 'combo',
            multiple: true,
            multiLine: true,
            remark: '<code>combo</code>中的子项引入自身，实现嵌套的效果',
            controls: [
                {
                    label: 'combo 1',
                    type: 'text',
                    name: 'key'
                },
                {
                    label: 'combo 2',
                    name: 'value',
                    $ref: 'aa',
                    remark: '<code>definitions</code> 中可以引用 <code>definitions</code> 中其他的属性'
                },
                {
                    name: 'children',
                    label: 'children',
                    $ref: 'bb'
                }
            ]
        }
    },
    type: 'page',
    title: '引用',
    body: [
        {
            type: 'form',
            api: 'api/xxx',
            actions: [],
            controls: [
                {
                    label: 'text2',
                    $ref: 'aa',
                    name: 'refs1'
                },
                {
                    label: 'combo',
                    $ref: 'bb',
                    name: 'refs2'
                }
            ]
        },
        {
            type: 'form',
            api: 'api/xxx',
            actions: [],
            controls: [
                {
                    label: 'select',
                    $ref: 'aa',
                    name: 'select',
                    type: 'select',
                    value: 1,
                    options: [
                        {
                            label: 'Option A',
                            value: 1
                        },
                        {
                            label: 'Option B',
                            value: 2
                        }
                    ],
                    remark: '原属性会覆盖引用中的属性'
                },
                {
                    label: 'radios',
                    $ref: 'bb',
                    type: 'radios',
                    name: 'radios',
                    value: 'Option A',
                    options: [
                        'Option A',
                        'Option B',
                    ],
                    remark: '原属性会覆盖引用中的属性'
                }
            ]
        }
    ]
};
