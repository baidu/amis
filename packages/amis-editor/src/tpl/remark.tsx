import {setSchemaTpl} from 'amis-editor-core';
import {remarkTpl} from '../component/BaseControl';

setSchemaTpl('remark', () =>
  remarkTpl({
    name: 'remark',
    label: '控件提示',
    labelRemark:
      '在输入控件旁展示提示，注意控件宽度需设置，否则提示触发图标将自动换行'
  })
);

setSchemaTpl('labelRemark', () =>
  remarkTpl({
    name: 'labelRemark',
    label: '标题提示',
    labelRemark: '在标题旁展示提示'
  })
);
