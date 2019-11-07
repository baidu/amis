import React from 'react';
import makeMarkdownRenderer from './MdRenderer';

export default {
  prefix: ({classnames: cx}) => <li className={cx('AsideNav-divider')} />,
  label: '文档',
  children: [
    {
      label: '快速开始',
      icon: 'fa fa-flash',
      path: '/docs/getting-started',
      getComponent: (location, cb) =>
        require(['../../docs/getting_started.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '基本用法',
      icon: 'fa fa-file',
      path: '/docs/basic',
      getComponent: (location, cb) =>
        require(['../../docs/basic.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '高级用法',
      icon: 'fa fa-rocket',
      path: '/docs/advanced',
      getComponent: (location, cb) =>
        require(['../../docs/advanced.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '渲染器手册',
      icon: 'fa fa-diamond',
      path: '/docs/renderers',
      getComponent: (location, cb) =>
        require(['../../docs/renderers.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        }),
      children: [
        {
          label: 'Page',
          path: '/docs/renderers/Page',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Page.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },

        {
          label: 'Definitions',
          path: '/docs/renderers/Definitions',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Definitions.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },

        {
          label: 'Form',
          path: '/docs/renderers/Form/Form',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Form/Form.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            }),
          children: [
            {
              label: 'FormItem',
              path: '/docs/renderers/Form/FormItem',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/FormItem.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },

            {
              label: 'List',
              path: '/docs/renderers/Form/List',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/List.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },

            {
              label: 'Button-Group',
              path: '/docs/renderers/Form/Button-Group',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Button-Group.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },

            {
              label: 'Service',
              path: '/docs/renderers/Form/Service',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Service.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },

            {
              label: 'Tabs',
              path: '/docs/renderers/Form/Tabs',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Tabs.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },

            {
              label: 'Table',
              path: '/docs/renderers/Form/Table',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Table.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },

            {
              label: 'HBox',
              path: '/docs/renderers/Form/HBox',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/HBox.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },

            {
              label: 'Grid',
              path: '/docs/renderers/Form/Grid',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Grid.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Panel',
              path: '/docs/renderers/Form/Panel',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Panel.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Hidden',
              path: '/docs/renderers/Form/Hidden',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Hidden.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Text',
              path: '/docs/renderers/Form/Text',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Text.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Input-Group',
              path: '/docs/renderers/Form/Input-Group',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Input-Group.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Textarea',
              path: '/docs/renderers/Form/Textarea',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Textarea.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Url',
              path: '/docs/renderers/Form/Url',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Url.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Email',
              path: '/docs/renderers/Form/Email',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Email.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Password',
              path: '/docs/renderers/Form/Password',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Password.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Number',
              path: '/docs/renderers/Form/Number',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Number.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Tag',
              path: '/docs/renderers/Form/Tag',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Tag.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Select',
              path: '/docs/renderers/Form/Select',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Select.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Chained-Select',
              path: '/docs/renderers/Form/Chained-Select',
              getComponent: (location, cb) =>
                require([
                  '../../docs/renderers/Form/Chained-Select.md'
                ], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Checkbox',
              path: '/docs/renderers/Form/Checkbox',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Checkbox.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Checkboxes',
              path: '/docs/renderers/Form/Checkboxes',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Checkboxes.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'City',
              path: '/docs/renderers/Form/City',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/City.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Radios',
              path: '/docs/renderers/Form/Radios',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Radios.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Switch',
              path: '/docs/renderers/Form/Switch',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Switch.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Rating',
              path: '/docs/renderers/Form/Rating',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Rating.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Date',
              path: '/docs/renderers/Form/Date',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Date.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Datetime',
              path: '/docs/renderers/Form/Datetime',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Datetime.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Time',
              path: '/docs/renderers/Form/Time',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Time.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Date-Range',
              path: '/docs/renderers/Form/Date-Range',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Date-Range.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Color',
              path: '/docs/renderers/Form/Color',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Color.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Range',
              path: '/docs/renderers/Form/Range',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Range.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Image',
              path: '/docs/renderers/Form/Image',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Image.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'File',
              path: '/docs/renderers/Form/File',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/File.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Matrix',
              path: '/docs/renderers/Form/Matrix',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Matrix.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Tree',
              path: '/docs/renderers/Form/Tree',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Tree.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'TreeSelect',
              path: '/docs/renderers/Form/TreeSelect',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/TreeSelect.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'NestedSelect',
              path: '/docs/renderers/Form/NestedSelect',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/NestedSelect.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Button',
              path: '/docs/renderers/Form/Button',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Button.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Button-Toolbar',
              path: '/docs/renderers/Form/Button-Toolbar',
              getComponent: (location, cb) =>
                require([
                  '../../docs/renderers/Form/Button-Toolbar.md'
                ], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Combo',
              path: '/docs/renderers/Form/Combo',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Combo.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Array',
              path: '/docs/renderers/Form/Array',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Array.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'SubForm',
              path: '/docs/renderers/Form/SubForm',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/SubForm.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Picker',
              path: '/docs/renderers/Form/Picker',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Picker.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Formula',
              path: '/docs/renderers/Form/Formula',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Formula.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Group',
              path: '/docs/renderers/Form/Group',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Group.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'FieldSet',
              path: '/docs/renderers/Form/FieldSet',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/FieldSet.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Repeat',
              path: '/docs/renderers/Form/Repeat',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Repeat.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Rich-Text',
              path: '/docs/renderers/Form/Rich-Text',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Rich-Text.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Editor',
              path: '/docs/renderers/Form/Editor',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Form/Editor.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Static',
              path: '/docs/renderers/Static',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Static.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            }
          ]
        },
        {
          label: 'Divider',
          path: '/docs/renderers/Divider',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Divider.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Wizard',
          path: '/docs/renderers/Wizard',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Wizard.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Each',
          path: '/docs/renderers/Each',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Each.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Tpl',
          path: '/docs/renderers/Tpl',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Tpl.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Plain',
          path: '/docs/renderers/Plain',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Plain.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Html',
          path: '/docs/renderers/Html',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Html.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Alert',
          path: '/docs/renderers/Alert',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Alert.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Action',
          path: '/docs/renderers/Action',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Action.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Dialog',
          path: '/docs/renderers/Dialog',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Dialog.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Drawer',
          path: '/docs/renderers/Drawer',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Drawer.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'CRUD',
          path: '/docs/renderers/CRUD',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/CRUD.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            }),
          children: [
            {
              label: 'CRUD-Table',
              path: '/docs/renderers/CRUD-Table',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/CRUD-Table.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },

            {
              label: 'CRUD-Cards',
              path: '/docs/renderers/CRUD-Cards',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/CRUD-Cards.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },

            {
              label: 'CRUD-List',
              path: '/docs/renderers/CRUD-List',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/CRUD-List.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            }
          ]
        },
        {
          label: 'Panel',
          path: '/docs/renderers/Panel',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Panel.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Wrapper',
          path: '/docs/renderers/Wrapper',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Wrapper.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Service',
          path: '/docs/renderers/Service',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Service.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Chart',
          path: '/docs/renderers/Chart',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Chart.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Collapse',
          path: '/docs/renderers/Collapse',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Collapse.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Carousel',
          path: '/docs/renderers/Carousel',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Carousel.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Audio',
          path: '/docs/renderers/Audio',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Audio.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Video',
          path: '/docs/renderers/Video',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Video.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Table',
          path: '/docs/renderers/Table',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Table.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            }),
          children: [
            {
              label: 'Column',
              path: '/docs/renderers/Column',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Column.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            },
            {
              label: 'Operation',
              path: '/docs/renderers/Operation',
              getComponent: (location, cb) =>
                require(['../../docs/renderers/Operation.md'], doc => {
                  cb(null, makeMarkdownRenderer(doc));
                })
            }
          ]
        },
        {
          label: 'List',
          path: '/docs/renderers/List',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/List.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Card',
          path: '/docs/renderers/Card',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Card.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Cards',
          path: '/docs/renderers/Cards',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Cards.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Field',
          path: '/docs/renderers/Field',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Field.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Tabs',
          path: '/docs/renderers/Tabs',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Tabs.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Grid',
          path: '/docs/renderers/Grid',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Grid.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },

        {
          label: 'HBox',
          path: '/docs/renderers/HBox',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/HBox.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'ButtonGroup',
          path: '/docs/renderers/ButtonGroup',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/ButtonGroup.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'iFrame',
          path: '/docs/renderers/iFrame',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/iFrame.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Nav',
          path: '/docs/renderers/Nav',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Nav.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'Tasks',
          path: '/docs/renderers/Tasks',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Tasks.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: 'QRCode',
          path: '/docs/renderers/QRCode',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/QRCode.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        },
        {
          label: '类型说明',
          path: '/docs/renderers/Types',
          getComponent: (location, cb) =>
            require(['../../docs/renderers/Types.md'], doc => {
              cb(null, makeMarkdownRenderer(doc));
            })
        }
      ]
    },

    {
      label: 'API 说明',
      path: '/docs/api',
      icon: 'fa fa-cloud',
      getComponent: (location, cb) =>
        require(['../../docs/api.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '如何定制',
      path: '/docs/sdk',
      icon: 'fa fa-cubes',
      getComponent: (location, cb) =>
        require(['../../docs/sdk.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '自定义组件',
      path: '/docs/dev',
      icon: 'fa fa-code',
      getComponent: (location, cb) =>
        require(['../../docs/dev.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '样式说明',
      path: '/docs/style',
      icon: 'fa fa-laptop',
      getComponent: (location, cb) =>
        require(['../../docs/style.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    }
  ]
};
