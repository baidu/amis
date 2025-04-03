/* eslint-disable */
import * as React from 'react';
import {
  Editor,
  ShortcutKey,
  BasePlugin,
  setThemeConfig,
  PluginEvent,
  GlobalVariableEventContext,
  GlobalVariablesEventContext
} from '../src/index';
import {Select, Renderer, uuid, Button} from 'amis';
import {currentLocale} from 'i18n-runtime';
import {Portal} from 'react-overlays';
import {Icon} from './icons/index';
import LayoutList from './layout/index';
import {cxdData} from 'amis-theme-editor-helper';

// 测试组织属性配置面板的国际化，可以放开如下注释
// import './renderer/InputTextI18n';
// import './renderer/TextareaI18n';
// import './utils/overwriteSchemaTpl';
// const i18nEnabled = true;
const i18nEnabled = false;
setThemeConfig(cxdData);

const schema = {
  type: 'page',
  title: 'Simple Form Page',
  regions: ['body'],
  body: [
    {
      type: 'form',
      body: [
        {
          type: 'input-text',
          name: 'a',
          label: 'Text'
        }
      ]
    }
  ]
};

const formSchema = {
  type: 'doc-entity',
  fields: []
};

const schemas = [
  {
    type: 'object',
    properties: {
      'amisUser': {
        type: 'object',
        title: '用户信息',
        properties: {
          id: {
            type: 'string',
            title: '用户ID'
          },
          name: {
            type: 'string',
            title: '用户名'
          },
          email: {
            type: 'string',
            title: '邮箱'
          },
          nickName: {
            type: 'string',
            title: '昵称'
          },
          phone: {
            type: 'string',
            title: '手机号'
          },
          avatar: {
            type: 'string',
            title: '用户头像'
          }
        }
      },
      'amisApp': {
        type: 'object',
        title: '应用信息',
        properties: {
          id: {
            type: 'string',
            title: '应用ID'
          },
          name: {
            type: 'string',
            title: '应用名称'
          },
          logo: {
            type: 'string',
            title: '应用Logo'
          },
          env: {
            type: 'string',
            title: '当前运行环境'
          }
        }
      },
      'amisCompany': {
        type: 'object',
        title: '组织信息',
        properties: {
          id: {
            type: 'string',
            title: '组织ID'
          },
          name: {
            type: 'string',
            title: '组织名称'
          },
          logo: {
            type: 'string',
            title: '组织Logo'
          },
          key: {
            type: 'string',
            title: '组织标识'
          }
        }
      },
      'window:location': {
        type: 'object',
        title: '浏览器变量',
        properties: {
          href: {
            type: 'string',
            title: 'href'
          },
          origin: {
            type: 'string',
            title: 'origin'
          },
          protocol: {
            type: 'string',
            title: 'protocol'
          },
          host: {
            type: 'string',
            title: 'host'
          },
          hostname: {
            type: 'string',
            title: 'hostname'
          },
          port: {
            type: 'string',
            title: 'port'
          },
          pathname: {
            type: 'string',
            title: 'pathname'
          },
          search: {
            type: 'string',
            title: 'search'
          },
          hash: {
            type: 'string',
            title: 'hash'
          }
        }
      }
    }
  },
  {
    type: 'object',
    properties: {
      __query: {
        title: '页面入参',
        type: 'object',
        required: [],
        properties: {
          name: {
            type: 'string',
            title: '用户名'
          }
        }
      },
      __page: {
        title: '页面变量',
        type: 'object',
        required: [],
        properties: {
          num: {
            type: 'number',
            title: '数量'
          }
        }
      }
    }
  }
];

const variableSchemas = {
  type: 'object',
  $id: 'appVariables',
  properties: {
    ProductName: {
      type: 'string',
      title: '产品名称',
      default: '对象存储'
    },
    Banlance: {
      type: 'number',
      title: '账户余额',
      default: '0.00'
    },
    ProductNum: {
      type: 'integer',
      title: '产品数量',
      default: '0.00'
    },
    isOnline: {
      type: 'boolean',
      title: '是否线上环境',
      default: 'false'
    },
    ProductList: {
      type: 'array',
      items: {
        type: 'string',
        title: '产品名称'
      },
      title: '产品列表',
      default: '["BOS", "CFS", "PFS", "CloudFlow", "MongoDB"]'
    },
    PROFILE: {
      type: 'object',
      title: '个人信息',
      properties: {
        FirstName: {
          type: 'string',
          title: '名字'
        },
        Age: {
          type: 'integer',
          title: '年龄'
        },
        Address: {
          type: 'object',
          title: '地址',
          required: ['street', 'postcode'],
          properties: {
            street: {
              type: 'string',
              title: '街道名称'
            },
            postcode: {
              type: 'number',
              title: '邮编'
            }
          }
        }
      }
    }
  },
  default: {
    ProductName: 'BCC',
    Banlance: 1234.888,
    ProductNum: 10,
    isOnline: false,
    ProductList: ['BCC', 'BOS', 'VPC'],
    PROFILE: {
      FirstName: 'Amis',
      Age: 18,
      Address: {
        street: 'ShangDi',
        postcode: 100001
      }
    }
  }
};

const variableDefaultData = {
  appVariables: {
    ProductName: 'BCC',
    Banlance: 1234.888,
    ProductNum: 10,
    isOnline: false,
    ProductList: ['BCC', 'BOS', 'VPC'],
    PROFILE: {
      FirstName: 'Amis',
      Age: 18,
      Address: {
        street: 'ShangDi',
        postcode: 100001
      }
    }
  }
};

const variables: any = [
  {
    name: 'appVariables',
    title: '内存变量',
    parentId: 'root',
    order: 1,
    schema: variableSchemas
  }
];

const EditorType = {
  EDITOR: 'editor',
  MOBILE: 'mobile',
  FORM: 'form'
};

const editorLanguages = [
  {
    label: '简体中文',
    value: 'zh-CN'
  },
  {
    label: 'English',
    value: 'en-US'
  }
];

const globalEvents = [
  {
    name: 'globalEventA',
    label: '全局事件A',
    description: '全局事件动作A',
    mapping: [
      {
        key: 'name',
        type: 'string'
      },
      {
        key: 'age',
        type: 'number'
      }
    ]
  },
  {
    name: 'globalEventB',
    label: '全局事件B',
    description: '全局事件动作A',
    mapping: [
      {
        key: 'name',
        type: 'string'
      }
    ]
  }
];

/**
 * 自定义渲染器示例
 */
// @Renderer({
//   type: 'my-renderer',
//   name: 'my-renderer'
// })
// export class MyRenderer extends React.Component {
//   static defaultProps = {
//     target: 'world'
//   };

//   render() {
//     const {target, width, height} = this.props;

//     return (
//       <p style={{width: width || 'auto', height: height || 'auto'}}>
//         Hello {target}!
//       </p>
//     );
//   }
// }

/**
 * 自定义渲染器编辑插件
 */
class MyRendererPlugin extends BasePlugin {
  // 这里要跟对应的渲染器名字对应上
  // 注册渲染器的时候会要求指定渲染器名字
  rendererName = 'my-renderer';

  // 暂时只支持这个，配置后会开启代码编辑器
  $schema = '/schemas/UnkownSchema.json';

  // 用来配置名称和描述
  name = '自定义渲染器';
  description = '这只是个示例';

  // tag，决定会在哪个 tab 下面显示的
  tags = ['自定义', '表单项'];

  // 图标
  icon = 'fa fa-user';

  // 用来生成预览图的
  previewSchema = {
    type: 'my-renderer',
    target: 'demo'
  };

  // 拖入组件里面时的初始数据
  scaffold = {
    type: 'my-renderer',
    target: '233'
  };

  // 右侧面板相关
  panelTitle = '自定义组件';
  panelBody = [
    {
      type: 'tabs',
      tabsMode: 'line',
      className: 'm-t-n-xs',
      contentClassName: 'no-border p-l-none p-r-none',
      tabs: [
        {
          title: '常规',
          body: [
            {
              name: 'target',
              label: 'Target',
              type: 'input-text'
            }
          ]
        },

        {
          title: '外观',
          body: []
        }
      ]
    }
  ];

  // /**
  //  * 配置了 panelControls 自动生成配置面板
  //  * @param context
  //  * @param panels
  //  */
  // buildEditorPanel(context, panels) {
  //   panels.push({
  //     key: 'xxxx',
  //     title: '设置',
  //     render: () => {
  //       return <div>面板内容</div>;
  //     }
  //   });
  // }

  // scaffoldForm = {
  //   title: '标题',
  //   body: [
  //     {
  //       name: 'target',
  //       label: 'Target',
  //       type: 'input-text'
  //     }
  //   ]
  // };

  // onActive(event) {
  //   const context = event.context;

  //   if (context.info?.plugin !== this || !context.node) {
  //     return;
  //   }

  //   const node = context.node;
  //   node.setHeightMutable(true);
  //   node.setWidthMutable(true);
  // }

  // onWidthChangeStart(event) {
  //   return this.onSizeChangeStart(event, 'horizontal');
  // }

  // onHeightChangeStart(event) {
  //   return this.onSizeChangeStart(event, 'vertical');
  // }

  // onSizeChangeStart(event, direction = 'both') {
  //   const context = event.context;
  //   const node = context.node;
  //   if (node.info?.plugin !== this) {
  //     return;
  //   }

  //   const resizer = context.resizer;
  //   const dom = context.dom;
  //   const frameRect = dom.parentElement.getBoundingClientRect();
  //   const rect = dom.getBoundingClientRect();
  //   const startX = context.nativeEvent.pageX;
  //   const startY = context.nativeEvent.pageY;

  //   event.setData({
  //     onMove: e => {
  //       const dy = e.pageY - startY;
  //       const dx = e.pageX - startX;
  //       const height = Math.max(50, rect.height + dy);
  //       const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
  //       const state = {
  //         width,
  //         height
  //       };

  //       if (direction === 'both') {
  //         resizer.setAttribute('data-value', `${width}px x ${height}px`);
  //       } else if (direction === 'vertical') {
  //         resizer.setAttribute('data-value', `${height}px`);
  //         delete state.width;
  //       } else {
  //         resizer.setAttribute('data-value', `${width}px`);
  //         delete state.height;
  //       }

  //       node.updateState(state);

  //       requestAnimationFrame(() => {
  //         node.calculateHighlightBox();
  //       });
  //     },
  //     onEnd: e => {
  //       const dy = e.pageY - startY;
  //       const dx = e.pageX - startX;
  //       const height = Math.max(50, rect.height + dy);
  //       const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
  //       const state = {
  //         width,
  //         height
  //       };

  //       if (direction === 'vertical') {
  //         delete state.width;
  //       } else if (direction === 'horizontal') {
  //         delete state.height;
  //       }

  //       resizer.removeAttribute('data-value');
  //       node.updateSchema(state);
  //       requestAnimationFrame(() => {
  //         node.calculateHighlightBox();
  //       });
  //     }
  //   });
  // }

  popOverBody = [
    {
      name: 'target',
      label: 'Target',
      type: 'input-text'
    }
  ];
}

LayoutList.push(MyRendererPlugin);

export default class AMisSchemaEditor extends React.Component<any, any> {
  state: any = {
    preview: localStorage.getItem('editting_preview') ? true : false,
    type: localStorage.getItem('editting_preview_type') || EditorType.EDITOR,
    schema: localStorage.getItem('editting_schema')
      ? JSON.parse(localStorage.getItem('editting_schema')!)
      : schema,
    curLanguage: currentLocale() // 获取当前语料类型
  };

  constructor(props: any) {
    super(props);

    if (i18nEnabled) {
      this.state = {
        ...this.state,
        replaceText: {
          'i18n:1189fb5d-ac5b-4558-b363-068ce5decc99': uuid()
        }
      };
    }

    const type =
      localStorage.getItem('editting_preview_type') || EditorType.EDITOR;

    this.state.schema = this.getSchema(type);
  }

  getSchema(type: string) {
    if (type === EditorType.FORM) {
      const schema = localStorage.getItem('editting_schema_form');

      if (schema) {
        return JSON.parse(schema);
      }
      return formSchema;
    }

    const lsSchema = localStorage.getItem('editting_schema');

    if (lsSchema) {
      return JSON.parse(lsSchema);
    }

    return schema;
  }

  handleChange = (value: any) => {
    const type = this.state.type;

    if (type === EditorType.FORM) {
      localStorage.setItem('editting_schema_form', JSON.stringify(value));
    } else {
      localStorage.setItem('editting_schema', JSON.stringify(value));
    }

    this.setState({
      schema: value
    });
  };

  changeLocale(value: any) {
    localStorage.setItem('suda-i18n-locale', value);
    window.location.reload();
  }

  onSave = () => {
    const curSchema = this.state.schema;
    localStorage.setItem('editting_schema', JSON.stringify(curSchema));
  };

  handlePreviewChange = (preview: any) => {
    localStorage.setItem('editting_preview', preview ? 'true' : '');

    this.setState({
      preview: !!preview
    });
  };

  togglePreview = () => {
    this.handlePreviewChange(!this.state.preview);
  };

  handleTypeChange = (editorType: any) => {
    const type = editorType || EditorType.EDITOR;
    localStorage.setItem('editting_preview_type', type);

    this.setState({
      type: type,
      schema: this.getSchema(type)
    });
  };

  clearCache = () => {
    localStorage.removeItem('editting_schema');
    this.setState({
      schema: schema
    });
  };

  renderEditor() {
    const {theme} = this.props;
    const {preview, type, schema} = this.state;
    const isMobile = type === EditorType.MOBILE;
    const {replaceText} = this.state;

    return (
      <Editor
        preview={preview}
        isMobile={isMobile}
        value={schema}
        schemas={schemas}
        variables={variables}
        onChange={this.handleChange}
        onPreview={this.handlePreviewChange}
        onSave={this.onSave}
        className="is-fixed"
        i18nEnabled={i18nEnabled}
        theme={theme || 'cxd'}
        showCustomRenderersPanel={true}
        plugins={LayoutList} // 存放常见布局组件
        $schemaUrl={`${location.protocol}//${location.host}/schema.json`}
        actionOptions={{
          showOldEntry: false,
          globalEventGetter: () => globalEvents
        }}
        onGlobalVariableInit={onGlobalVariableInit}
        onGlobalVariableSave={onGlobalVariableSave}
        onGlobalVariableDelete={onGlobalVariableDelete}
        amisEnv={
          {
            variable: {
              id: 'appVariables',
              namespace: 'appVariables',
              schema: variableSchemas,
              data: variableDefaultData
            },
            replaceText
          } as any
        }
        ctx={{
          __page: {
            num: 2
          },
          ...variableDefaultData
        }}
      />
    );
  }

  render() {
    const {preview, type, curLanguage} = this.state;
    return (
      <div className="Editor-inner">
        <Portal container={() => document.querySelector('#headerBar') as any}>
          <>
            <div className="Editor-view-mode-group-container">
              <div className="Editor-view-mode-group">
                <div
                  className={`Editor-view-mode-btn ${
                    type === EditorType.EDITOR ? 'is-active' : ''
                  }`}
                  onClick={() => {
                    this.handleTypeChange(EditorType.EDITOR);
                  }}
                >
                  <Icon icon="pc-preview" title="PC模式" />
                </div>
                <div
                  className={`Editor-view-mode-btn ${
                    type === EditorType.MOBILE ? 'is-active' : ''
                  }`}
                  onClick={() => {
                    this.handleTypeChange(EditorType.MOBILE);
                  }}
                >
                  <Icon icon="h5-preview" title="移动模式" />
                </div>
              </div>
            </div>

            <div className="Editor-header-actions">
              <ShortcutKey />
              {
                // @ts-ignore
                // vite编译时替换
                __editor_i18n ? (
                  <Select
                    className="margin-left-space "
                    options={editorLanguages}
                    value={curLanguage}
                    clearable={false}
                    onChange={(e: any) => this.changeLocale(e.value)}
                  />
                ) : null
              }

              {i18nEnabled && (
                <Button
                  className="ml-2"
                  level="info"
                  onClick={() => {
                    let _uuid = uuid();
                    console.log('点击测试国际化按钮', _uuid);
                    this.setState({
                      appLocale: _uuid,
                      replaceText: {
                        'i18n:1189fb5d-ac5b-4558-b363-068ce5decc99': _uuid
                      }
                    });
                  }}
                >
                  切换语料内容
                </Button>
              )}

              <div
                className={`header-action-btn ${preview ? 'primary' : ''}`}
                onClick={() => {
                  this.togglePreview();
                }}
              >
                {preview ? '编辑' : '预览'}
              </div>
            </div>
          </>
        </Portal>

        {this.renderEditor()}
      </div>
    );
  }
}

// 通过 localstorage 存储全局变量
// 实际场景肯定是后端存储到数据库里面
// 可以参考这个利用这三个事件来实现全局变量的增删改查
function getGlobalVariablesFromStorage(): Array<any> {
  const key = 'amis-editor-example-global-variable';
  let globalVariables = localStorage.getItem(key);
  let variables: Array<any> = [];

  if (globalVariables) {
    variables = JSON.parse(globalVariables);
  }

  return variables;
}

function saveGlobalVariablesToStorage(variables: Array<any>) {
  const key = 'amis-editor-example-global-variable';
  localStorage.setItem(key, JSON.stringify(variables));
}

function onGlobalVariableInit(event: PluginEvent<GlobalVariablesEventContext>) {
  event.setData(getGlobalVariablesFromStorage() || []);
}

function onGlobalVariableSave(event: PluginEvent<GlobalVariableEventContext>) {
  const item = event.data;
  const variables = getGlobalVariablesFromStorage();
  const idx = item.id
    ? variables.findIndex((it: any) => it.id === item.id)
    : -1;

  if (idx === -1) {
    item.id = uuid();
    variables.push(item);
  } else {
    variables[idx] = item;
  }

  saveGlobalVariablesToStorage(variables);
}

function onGlobalVariableDelete(
  event: PluginEvent<GlobalVariableEventContext>
) {
  const item = event.data;
  const variables = getGlobalVariablesFromStorage();
  const idx = item.id
    ? variables.findIndex((it: any) => it.id === item.id)
    : -1;

  if (idx === -1) {
    return;
  } else {
    variables.splice(idx, 1);
  }

  saveGlobalVariablesToStorage(variables);
}
