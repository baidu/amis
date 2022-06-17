import type {RendererPluginAction} from 'amis-editor-core';

// 表单类动作
const formActions: RendererPluginAction[] = [
  {
    actionLabel: '提交',
    actionType: 'submit',
    description: '提交表单数据至数据源'
  },
  {
    actionLabel: '清空',
    actionType: 'clear',
    description: '清空表单数据'
  },
  {
    actionLabel: '重置',
    actionType: 'reset',
    description: '重置表单数据'
  },
  {
    actionLabel: '校验',
    actionType: 'validate',
    description: '校验表单数据'
  }
];

// 页面类动作
const pageActions: RendererPluginAction[] = [
  {
    actionLabel: '打开页面',
    actionType: 'openPage',
    description: '打开/跳转至指定页面'
  },
  {
    actionLabel: '刷新页面',
    actionType: 'refresh',
    description: '触发浏览器刷新页面'
  },
  {
    actionLabel: '回退',
    actionType: 'goBack',
    description: '浏览器回退'
  }
];

// 弹框类动作
const dialogActions: RendererPluginAction[] = [
  {
    actionLabel: '打开弹窗',
    actionType: 'dialog',
    description: '打开弹框，弹窗内支持复杂的交互设计'
  },
  {
    actionLabel: '关闭弹窗',
    actionType: 'closeDialog',
    description: '关闭当前弹窗' // 或者关闭指定弹窗
  },
  {
    actionLabel: '打开抽屉',
    actionType: 'drawer',
    description: '打开抽屉，抽屉内支持复杂的交互设计'
  },
  {
    actionLabel: '关闭抽屉',
    actionType: 'closeDrawer',
    description: '关闭当前抽屉' // 或者关闭指定抽屉
  },
  // 暂时下掉，看后面具体设计
  // {
  //   actionLabel: '打开提示对话框',
  //   actionType: 'alert',
  //   description: '弹个提示对话框'
  // },
  // {
  //   actionLabel: '打开确认对话框',
  //   actionType: 'confirm',
  //   description: '弹个确认对话框'
  // },
  {
    actionLabel: '消息提醒',
    actionType: 'toast',
    description: '弹出消息提醒'
  }
];

// 服务类动作
const serviceActions: RendererPluginAction[] = [
  {
    actionLabel: '发送请求',
    actionType: 'ajax',
    description: '配置并发送API请求'
  },
  {
    actionLabel: '下载文件',
    actionType: 'download',
    description: '触发下载文件'
  }
];

const ACTION_TYPE_TREE: RendererPluginAction[] = [
  {
    actionLabel: '页面',
    actionType: 'page',
    children: pageActions
  },
  {
    actionLabel: '弹框消息',
    actionType: 'form',
    children: dialogActions
  },
  {
    actionLabel: '表单',
    actionType: 'form',
    children: formActions
  },
  {
    actionLabel: '服务',
    actionType: 'service',
    children: serviceActions
  },
  {
    actionLabel: '组件',
    actionType: 'cmpt',
    children: [
      {
        actionLabel: '刷新',
        actionType: 'reload',
        description: '请求并重新加载所选组件的数据'
      },
      {
        actionLabel: '显示',
        actionType: 'show',
        description: '显示所选的组件'
      },
      {
        actionLabel: '隐藏',
        actionType: 'hidden',
        description: '隐藏所选的组件'
      },
      {
        actionLabel: '启用',
        actionType: 'enabled',
        description: '启用所选的组件'
      },
      {
        actionLabel: '禁用',
        actionType: 'disabled',
        description: '禁用所选的组件'
      },
      {
        actionLabel: '变量赋值',
        actionType: 'setValue',
        description: '修改所选组件的数据值'
      },
      {
        actionLabel: '组件特性动作',
        actionType: 'component',
        description: '触发所选组件的特性动作'
      }
    ]
  },
  // {
  //   actionLabel: '广播',
  //   actionType: 'broadcast',
  //   description: '发送广播事件'
  // },
  {
    actionLabel: '自定义JS',
    actionType: 'custom',
    description: '通过JavaScript自定义动作逻辑'
  },
  {
    actionLabel: '其他',
    actionType: 'others',
    children: [
      {
        actionLabel: '复制内容',
        actionType: 'copy',
        description: '复制文本内容至粘贴板'
      }
    ]
  }
];

export default ACTION_TYPE_TREE;
