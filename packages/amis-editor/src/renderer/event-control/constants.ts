// 下拉展示可赋值属性范围
export const SELECT_PROPS_CONTAINER = ['form'];

// 是否下拉展示可赋值属性
export const SHOW_SELECT_PROP = `${JSON.stringify(
  SELECT_PROPS_CONTAINER
)}.includes(this.__rendererName)`;

// 不支持静态表单项组件（反向枚举是因为表单项组件数量太多）
export const NO_SUPPORT_STATIC_FORMITEM_CMPTS = [
  'button-toolbar',
  'condition-builder',
  'diff-editor',
  'editor',
  'formula',
  'hidden',
  'icon-picker',
  'input-excel',
  'input-file',
  'input-formula',
  'input-image',
  'input-repeat',
  'input-rich-text',
  'input-sub-form',
  'input-table',
  'picker',
  'uuid'
];

export const SUPPORT_DISABLED_CMPTS = [
  'button-group',
  'action',
  'button',
  'submit',
  'reset',
  'collapse',
  'container',
  'dropdown-button',
  'flex',
  'flex-item',
  'grid',
  'grid-2d',
  'link',
  'nav',
  'wizard'
  // 'card2'
];
