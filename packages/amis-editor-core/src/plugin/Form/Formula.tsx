import {defaultValue, getSchemaTpl} from '../../component/schemaTpl';
import {registerEditorPlugin} from '../../manager';
import {BasePlugin} from '../../plugin';

export class FormulaControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'formula';
  $schema = '/schemas/FormulaControlSchema.json';

  // 组件名称
  name = '公式';
  isBaseComponent = true;
  icon = 'fa fa-calculator';
  description = `通过公式计算指定的变量值，并将其结果作用到指定的变量中`;
  docLink = '/amis/zh-CN/components/form/formula';
  tags = ['表单项'];
  scaffold = {
    type: 'formula',
    name: 'formula'
  };
  previewSchema: any = {
    type: 'tpl',
    tpl: '计算公式'
  };

  panelTitle = '公式';
  panelBody = [
    {
      label: '字段名',
      name: 'name',
      type: 'input-text',
      description: '公式计算结果会作用到此字段名对应的变量中。'
    },
    {
      type: 'input-text',
      name: 'value',
      label: '默认值'
    },
    {
      type: 'input-text',
      name: 'formula',
      label: '公式',
      description:
        '支持 JS 表达式，如： <code>data.var_a + 2</code>，即当表单项 <code>var_a</code> 变化的时候，会自动给当前表单项设置为 <code>var_a + 2</code> 的值。若设置为字符串，则需要加引号'
    },
    {
      type: 'input-text',
      name: 'condition',
      label: '作用条件',
      description:
        '支持如：<code>\\${xxx}</code>或者<code>data.xxx == "a"</code> 表达式来配置作用条件，当满足该作用条件时，会将计算结果设置到目标变量上。'
    },
    getSchemaTpl('switch', {
      name: 'initSet',
      label: '是否初始应用',
      description: '是否初始化的时候运行公式结果，并设置到目标变量上。',
      pipeIn: defaultValue(true)
    }),
    getSchemaTpl('switch', {
      name: 'autoSet',
      label: '是否自动应用',
      description:
        '是否自动计算公式结果，有变化时自动设置到目标变量上。<br />关闭后，通过按钮也能触发运算。',
      pipeIn: defaultValue(true)
    })
  ];

  renderRenderer(props: any) {
    return this.renderPlaceholder('功能组件（公式）', props.key);
  }
}

registerEditorPlugin(FormulaControlPlugin);
