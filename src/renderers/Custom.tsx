import React from 'react';
import ReactDOM from 'react-dom';
import memoize from 'lodash/memoize';
import {Renderer, RendererProps} from '../factory';

import {anyChanged} from '../utils/helper';
import {BaseSchema} from '../Schema';
import FormItem, {FormControlProps} from './Form/Item';

/**
 * 自定义组件
 */
export interface CustomSchema extends BaseSchema {
  /**
   * 实现自定义功能的渲染器，主要给 JS SDK 和可视化编辑器里使用。
   *
   * 文档：https://baidu.gitee.io/amis/components/custom
   */
  type: 'custom';
  onMount?: Function | string;
  onUpdate?: Function | string;
  onUnmount?: Function | string;
  inline?: boolean;
  id?: string;
  html?: string;
}

export interface CustomProps extends FormControlProps, CustomSchema {
  className?: string;
  value?: any;
  wrapperComponent?: any;
  inline?: boolean;
}

// 添加resolver，指定所有参数的联合字符串为key。因为最后一个参数为函数体
// 缓存一下，避免在 crud 中的自定义组件被大量执行
const getFunction = memoize(
  (...args) => {
    return new Function(...args);
  },
  (...args) => JSON.stringify(args)
);

export class Custom extends React.Component<CustomProps, object> {
  static defaultProps: Partial<CustomProps> = {
    inline: false
  };

  dom: any;
  onUpdate: Function = () => {};
  onMount: Function = () => {};
  onUnmount: Function = () => {};

  constructor(props: CustomProps) {
    super(props);
    this.dom = React.createRef();
    if (props.onMount) {
      if (typeof props.onMount === 'string') {
        this.onMount = getFunction(
          'dom',
          'value',
          'onChange',
          'props',
          props.onMount
        );
      } else {
        this.onMount = props.onMount;
      }
    }
    if (props.onUpdate) {
      if (typeof props.onUpdate === 'string') {
        this.onUpdate = getFunction(
          'dom',
          'data',
          'prevData',
          'props',
          props.onUpdate
        );
      } else {
        this.onUpdate = props.onUpdate;
      }
    }
    if (props.onUnmount) {
      if (typeof props.onUnmount === 'string') {
        this.onUnmount = getFunction('props', props.onUnmount);
      } else {
        this.onUnmount = props.onUnmount;
      }
    }
    this.renderChild = this.renderChild.bind(this);
  }

  componentDidUpdate(prevProps: CustomProps) {
    if (anyChanged(['data'], this.props, prevProps)) {
      const {data} = this.props;
      this.onUpdate(this.dom, data, prevProps.data, this.props);
    }
  }

  componentDidMount() {
    const {value, onChange} = this.props;
    this.onMount(this.dom.current, value, onChange, this.props);
  }

  componentWillUnmount() {
    this.onUnmount(this.props);
  }

  /**
   * 渲染子元素
   * 备注：现有custom组件通过props.render生成的子元素是react虚拟dom对象，需要使用ReactDOM.render渲染，不能直接插入到当前dom中。
   **/
   renderChild(
    schemaPosition: string,
    childSchema: any,
    insertElemId: string,
  ) {
    const { render } = this.props;
    let childEleCont = null;
    if (childSchema && insertElemId) {
      const childElem = render(schemaPosition, childSchema);
      childEleCont = ReactDOM.render(
        childElem,
        document.getElementById(insertElemId),
      );
    }
    return childEleCont;
  }

  render() {
    const {
      className,
      html,
      id,
      wrapperComponent,
      inline,
      translate: __,
      classnames: cx
    } = this.props;
    const Component = wrapperComponent || inline ? 'span' : 'div';
    return (
      <Component
        ref={this.dom}
        className={cx(className)}
        id={id}
        dangerouslySetInnerHTML={{__html: html ? html : ''}}
      ></Component>
    );
  }
}

@FormItem({
  type: 'custom'
})
export class CustomRenderer extends Custom {}
