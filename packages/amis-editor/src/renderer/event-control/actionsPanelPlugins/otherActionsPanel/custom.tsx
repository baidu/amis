import {registerActionPanel} from '../../actionsPanelManager';

registerActionPanel('custom', {
  label: '自定义JS',
  tag: '其他',
  description: '通过JavaScript自定义动作逻辑',
  schema: {
    type: 'js-editor',
    allowFullscreen: true,
    required: true,
    name: 'script',
    label: '自定义JS',
    mode: 'horizontal',
    options: {
      automaticLayout: true,
      lineNumbers: 'off',
      glyphMargin: false,
      tabSize: 2,
      fontSize: '12px',
      wordWrap: 'on',
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0,
      selectOnLineNumbers: true,
      scrollBeyondLastLine: false,
      folding: true
    },
    className: 'ae-event-control-action-js-editor',
    value: `/* 自定义JS使用说明：
      * 1.动作执行函数doAction，可以执行所有类型的动作
      * 2.通过上下文对象context可以获取当前组件实例，例如context.props可以获取该组件相关属性
      * 3.事件对象event，在doAction之后执行event.stopPropagation();可以阻止后续动作执行
      */
      const myMsg = '我是自定义JS';
      doAction({
      actionType: 'toast',
      args: {
      msg: myMsg
      }
      });
      `
  }
});
