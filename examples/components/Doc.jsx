import * as React from 'react';
import makeMarkdownRenderer from './MdRenderer';

export default {
    prefix: ({classnames: cx}) => (<li className={cx('AsideNav-divider')}></li>),
    label: '文档',
    children: [
        {
            label: '快速开始',
            icon: 'fa fa-flash',
            path: '/docs/getting-started',
            getComponent: (location, cb) => require(['../../docs/getting_started.md'], (doc) => {
                cb(null, makeMarkdownRenderer(doc));
            })
        },

        {
            label: '高级用法',
            icon: 'fa fa-rocket',
            path: '/docs/advanced',
            getComponent: (location, cb) => require(['../../docs/advanced.md'], (doc) => {
                cb(null, makeMarkdownRenderer(doc));
            })
        },

        {
            label: '渲染器手册',
            icon: 'fa fa-diamond',
            path: '/docs/renderers',
            getComponent: (location, cb) => require(['../../docs/renderers.md'], (doc) => {
                cb(null, makeMarkdownRenderer(doc));
            }),
            children: [
                {
                    label: 'Page',
                    path: '/docs/renderers/page',
                    getComponent: (location, cb) => require(['../../docs/renderers/Page.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },

                {
                    label: 'Form',
                    path: '/docs/renderers/form',
                    getComponent: (location, cb) => require(['../../docs/renderers/Form.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                    children: [
                        {
                            label: 'FormItem',
                            path: '/docs/renderers/FormItem',
                            getComponent: (location, cb) => require(['../../docs/renderers/FormItem.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },

                        {
                            label: 'FormItem-List',
                            path: '/docs/renderers/FormItem-List',
                            getComponent: (location, cb) => require(['../../docs/renderers/FormItem-List.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },

                        {
                            label: 'FormItem-Button-Group',
                            path: '/docs/renderers/FormItem-Button-Group',
                            getComponent: (location, cb) => require(['../../docs/renderers/FormItem-Button-Group.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },

                        {
                            label: 'FormItem-Service',
                            path: '/docs/renderers/FormItem-Service',
                            getComponent: (location, cb) => require(['../../docs/renderers/FormItem-Service.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },

                        {
                            label: 'FormItem-Tabs',
                            path: '/docs/renderers/FormItem-Tabs',
                            getComponent: (location, cb) => require(['../../docs/renderers/FormItem-Tabs.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },

                        {
                            label: 'FormItem-Table',
                            path: '/docs/renderers/FormItem-Table',
                            getComponent: (location, cb) => require(['../../docs/renderers/FormItem-Table.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },

                        {
                            label: 'FormItem-HBox',
                            path: '/docs/renderers/FormItem-HBox',
                            getComponent: (location, cb) => require(['../../docs/renderers/FormItem-HBox.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },

                        {
                            label: 'FormItem-Grid',
                            path: '/docs/renderers/FormItem-Grid',
                            getComponent: (location, cb) => require(['../../docs/renderers/FormItem-Grid.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'FormItem-Panel',
                            path: '/docs/renderers/FormItem-Panel',
                            getComponent: (location, cb) => require(['../../docs/renderers/FormItem-Panel.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Hidden',
                            path: '/docs/renderers/Hidden',
                            getComponent: (location, cb) => require(['../../docs/renderers/Hidden.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Text',
                            path: '/docs/renderers/Text',
                            getComponent: (location, cb) => require(['../../docs/renderers/Text.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Textarea',
                            path: '/docs/renderers/Textarea',
                            getComponent: (location, cb) => require(['../../docs/renderers/Textarea.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Url',
                            path: '/docs/renderers/Url',
                            getComponent: (location, cb) => require(['../../docs/renderers/Url.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Email',
                            path: '/docs/renderers/Email',
                            getComponent: (location, cb) => require(['../../docs/renderers/Email.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Password',
                            path: '/docs/renderers/Password',
                            getComponent: (location, cb) => require(['../../docs/renderers/Password.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Number',
                            path: '/docs/renderers/Number',
                            getComponent: (location, cb) => require(['../../docs/renderers/Number.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Divider',
                            path: '/docs/renderers/Divider',
                            getComponent: (location, cb) => require(['../../docs/renderers/Divider.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Select',
                            path: '/docs/renderers/Select',
                            getComponent: (location, cb) => require(['../../docs/renderers/Select.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Chained-Select',
                            path: '/docs/renderers/Chained-Select',
                            getComponent: (location, cb) => require(['../../docs/renderers/Chained-Select.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Checkbox',
                            path: '/docs/renderers/Checkbox',
                            getComponent: (location, cb) => require(['../../docs/renderers/Checkbox.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Checkboxes',
                            path: '/docs/renderers/Checkboxes',
                            getComponent: (location, cb) => require(['../../docs/renderers/Checkboxes.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Radios',
                            path: '/docs/renderers/Radios',
                            getComponent: (location, cb) => require(['../../docs/renderers/Radios.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Switch',
                            path: '/docs/renderers/Switch',
                            getComponent: (location, cb) => require(['../../docs/renderers/Switch.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Date',
                            path: '/docs/renderers/Date',
                            getComponent: (location, cb) => require(['../../docs/renderers/Date.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Datetime',
                            path: '/docs/renderers/Datetime',
                            getComponent: (location, cb) => require(['../../docs/renderers/Datetime.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Time',
                            path: '/docs/renderers/Time',
                            getComponent: (location, cb) => require(['../../docs/renderers/Time.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Date-Range',
                            path: '/docs/renderers/Date-Range',
                            getComponent: (location, cb) => require(['../../docs/renderers/Date-Range.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Color',
                            path: '/docs/renderers/Color',
                            getComponent: (location, cb) => require(['../../docs/renderers/Color.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Range',
                            path: '/docs/renderers/Range',
                            getComponent: (location, cb) => require(['../../docs/renderers/Range.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Image',
                            path: '/docs/renderers/Image',
                            getComponent: (location, cb) => require(['../../docs/renderers/Image.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'File',
                            path: '/docs/renderers/File',
                            getComponent: (location, cb) => require(['../../docs/renderers/File.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Matrix',
                            path: '/docs/renderers/Matrix',
                            getComponent: (location, cb) => require(['../../docs/renderers/Matrix.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Tree',
                            path: '/docs/renderers/Tree',
                            getComponent: (location, cb) => require(['../../docs/renderers/Tree.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'TreeSelect',
                            path: '/docs/renderers/TreeSelect',
                            getComponent: (location, cb) => require(['../../docs/renderers/TreeSelect.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'NestedSelect',
                            path: '/docs/renderers/NestedSelect',
                            getComponent: (location, cb) => require(['../../docs/renderers/NestedSelect.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Button',
                            path: '/docs/renderers/Button',
                            getComponent: (location, cb) => require(['../../docs/renderers/Button.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Button-Toolbar',
                            path: '/docs/renderers/Button-Toolbar',
                            getComponent: (location, cb) => require(['../../docs/renderers/Button-Toolbar.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Combo',
                            path: '/docs/renderers/Combo',
                            getComponent: (location, cb) => require(['../../docs/renderers/Combo.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Array',
                            path: '/docs/renderers/Array',
                            getComponent: (location, cb) => require(['../../docs/renderers/Array.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'SubForm',
                            path: '/docs/renderers/SubForm',
                            getComponent: (location, cb) => require(['../../docs/renderers/SubForm.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Picker',
                            path: '/docs/renderers/Picker',
                            getComponent: (location, cb) => require(['../../docs/renderers/Picker.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Formula',
                            path: '/docs/renderers/Formula',
                            getComponent: (location, cb) => require(['../../docs/renderers/Formula.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Group',
                            path: '/docs/renderers/Group',
                            getComponent: (location, cb) => require(['../../docs/renderers/Group.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'FieldSet',
                            path: '/docs/renderers/FieldSet',
                            getComponent: (location, cb) => require(['../../docs/renderers/FieldSet.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Repeat',
                            path: '/docs/renderers/Repeat',
                            getComponent: (location, cb) => require(['../../docs/renderers/Repeat.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Rich-Text',
                            path: '/docs/renderers/Rich-Text',
                            getComponent: (location, cb) => require(['../../docs/renderers/Rich-Text.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Editor',
                            path: '/docs/renderers/Editor',
                            getComponent: (location, cb) => require(['../../docs/renderers/Editor.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                        {
                            label: 'Static',
                            path: '/docs/renderers/Static',
                            getComponent: (location, cb) => require(['../../docs/renderers/Static.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                    ]
                },
                {
                    label: 'Wizard',
                    path: '/docs/renderers/Wizard',
                    getComponent: (location, cb) => require(['../../docs/renderers/Wizard.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Tpl',
                    path: '/docs/renderers/Tpl',
                    getComponent: (location, cb) => require(['../../docs/renderers/Tpl.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Plain',
                    path: '/docs/renderers/Plain',
                    getComponent: (location, cb) => require(['../../docs/renderers/Plain.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Html',
                    path: '/docs/renderers/Html',
                    getComponent: (location, cb) => require(['../../docs/renderers/Html.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Action',
                    path: '/docs/renderers/Action',
                    getComponent: (location, cb) => require(['../../docs/renderers/Action.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Dialog',
                    path: '/docs/renderers/Dialog',
                    getComponent: (location, cb) => require(['../../docs/renderers/Dialog.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Drawer',
                    path: '/docs/renderers/Drawer',
                    getComponent: (location, cb) => require(['../../docs/renderers/Drawer.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'CRUD',
                    path: '/docs/renderers/CRUD',
                    getComponent: (location, cb) => require(['../../docs/renderers/CRUD.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                    children: [
                        {
                            label: 'CRUD-Table',
                            path: '/docs/renderers/CRUD-Table',
                            getComponent: (location, cb) => require(['../../docs/renderers/CRUD-Table.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },

                        {
                            label: 'CRUD-Cards',
                            path: '/docs/renderers/CRUD-Cards',
                            getComponent: (location, cb) => require(['../../docs/renderers/CRUD-Cards.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },

                        {
                            label: 'CRUD-List',
                            path: '/docs/renderers/CRUD-List',
                            getComponent: (location, cb) => require(['../../docs/renderers/CRUD-List.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        }
                    ]
                },
                {
                    label: 'Panel',
                    path: '/docs/renderers/Panel',
                    getComponent: (location, cb) => require(['../../docs/renderers/Panel.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Wrapper',
                    path: '/docs/renderers/Wrapper',
                    getComponent: (location, cb) => require(['../../docs/renderers/Wrapper.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Service',
                    path: '/docs/renderers/Service',
                    getComponent: (location, cb) => require(['../../docs/renderers/Service.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Chart',
                    path: '/docs/renderers/Chart',
                    getComponent: (location, cb) => require(['../../docs/renderers/Chart.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Collapse',
                    path: '/docs/renderers/Collapse',
                    getComponent: (location, cb) => require(['../../docs/renderers/Collapse.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Audio',
                    path: '/docs/renderers/Audio',
                    getComponent: (location, cb) => require(['../../docs/renderers/Audio.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Video',
                    path: '/docs/renderers/Video',
                    getComponent: (location, cb) => require(['../../docs/renderers/Video.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Table',
                    path: '/docs/renderers/Table',
                    getComponent: (location, cb) => require(['../../docs/renderers/Table.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                    children: [
                        {
                            label: 'Column',
                            path: '/docs/renderers/Column',
                            getComponent: (location, cb) => require(['../../docs/renderers/Column.md'], (doc) => {
                                cb(null, makeMarkdownRenderer(doc));
                            }),
                        },
                    ]
                },
                {
                    label: 'List',
                    path: '/docs/renderers/List',
                    getComponent: (location, cb) => require(['../../docs/renderers/List.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Card',
                    path: '/docs/renderers/Card',
                    getComponent: (location, cb) => require(['../../docs/renderers/Card.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Cards',
                    path: '/docs/renderers/Cards',
                    getComponent: (location, cb) => require(['../../docs/renderers/Cards.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Field',
                    path: '/docs/renderers/Field',
                    getComponent: (location, cb) => require(['../../docs/renderers/Field.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Tabs',
                    path: '/docs/renderers/Tabs',
                    getComponent: (location, cb) => require(['../../docs/renderers/Tabs.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Grid',
                    path: '/docs/renderers/Grid',
                    getComponent: (location, cb) => require(['../../docs/renderers/Grid.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                
                {
                    label: 'HBox',
                    path: '/docs/renderers/HBox',
                    getComponent: (location, cb) => require(['../../docs/renderers/HBox.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Button-Group',
                    path: '/docs/renderers/Button-Group',
                    getComponent: (location, cb) => require(['../../docs/renderers/Button-Group.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'iFrame',
                    path: '/docs/renderers/iFrame',
                    getComponent: (location, cb) => require(['../../docs/renderers/iFrame.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Nav',
                    path: '/docs/renderers/Nav',
                    getComponent: (location, cb) => require(['../../docs/renderers/Nav.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'Tasks',
                    path: '/docs/renderers/Tasks',
                    getComponent: (location, cb) => require(['../../docs/renderers/Tasks.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: 'QRCode',
                    path: '/docs/renderers/QRCode',
                    getComponent: (location, cb) => require(['../../docs/renderers/QRCode.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
                {
                    label: '类型说明',
                    path: '/docs/renderers/Types',
                    getComponent: (location, cb) => require(['../../docs/renderers/Types.md'], (doc) => {
                        cb(null, makeMarkdownRenderer(doc));
                    }),
                },
            ]
        },

        {
            label: '开源渲染器',
            path: '/docs/sdk',
            icon: 'fa fa-cubes',
            getComponent: (location, cb) => require(['../../docs/sdk.md'], (doc) => {
                cb(null, makeMarkdownRenderer(doc));
            })
        },

        {
            label: '自定义组件',
            path: '/docs/dev',
            icon: 'fa fa-code',
            getComponent: (location, cb) => require(['../../docs/dev.md'], (doc) => {
                cb(null, makeMarkdownRenderer(doc));
            })
        },

        {
            label: '样式说明',
            path: '/docs/style',
            icon: 'fa fa-laptop',
            getComponent: (location, cb) => require(['../../docs/style.md'], (doc) => {
                cb(null, makeMarkdownRenderer(doc));
            })
        }
    ]
}