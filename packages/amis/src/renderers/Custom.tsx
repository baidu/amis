import React from 'react';
import ReactDOM from 'react-dom';
import memoize from 'lodash/memoize';
import isString from 'lodash/isString';
import {AMISSchemaBase, Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {FormControlProps} from 'amis-core';
import isEqual from 'lodash/isEqual';

/**
 * 自定义组件
 */
/**
 * 自定义组件，占位用于扩展自渲染逻辑。支持传入自定义渲染器。
 */
export interface AMISCustomSchema extends AMISSchemaBase {
  /**
   * 指定为 custom 组件
   */
  type: 'custom';

  /**
   * 组件挂载时的回调函数
   */
  onMount?: Function | string;

  /**
   * 组件更新时的回调函数
   */
  onUpdate?: Function | string;

  /**
   * 组件卸载时的回调函数
   */
  onUnmount?: Function | string;

  /**
   * 是否内联渲染
   */
  inline?: boolean;

  /**
   * 组件唯一标识符
   */
  id?: string;

  /**
   * HTML 字符串
   */
  html?: string;
}

export interface CustomProps extends FormControlProps, AMISCustomSchema {
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

  childElemArr: HTMLElement[] = []; // 用于记录子元素的Dom节点，以便销毁

  constructor(props: CustomProps) {
    super(props);
    this.dom = React.createRef();
    this.initOnMount(props);
    this.initOnUpdate(props);
    this.initOnUnmount(props);
    this.renderChild = this.renderChild.bind(this);
    this.recordChildElem = this.recordChildElem.bind(this);
    this.unmountChildElem = this.unmountChildElem.bind(this);
  }

  initOnMount(props: CustomProps) {
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
  }

  initOnUpdate(props: CustomProps) {
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
  }

  initOnUnmount(props: CustomProps) {
    if (props.onUnmount) {
      if (typeof props.onUnmount === 'string') {
        this.onUnmount = getFunction('props', props.onUnmount);
      } else {
        this.onUnmount = props.onUnmount;
      }
    }
  }

  componentDidUpdate(prevProps: CustomProps) {
    if (!isEqual(this.props.onUpdate, prevProps.onUpdate)) {
      this.initOnUpdate(this.props);
    }
    if (
      !isEqual(this.props.onUpdate, prevProps.onUpdate) ||
      !isEqual(this.props.data, prevProps.data)
    ) {
      this.onUpdate(this.dom, this.props.data, prevProps.data, this.props);
    }
    if (!isEqual(this.props.onMount, prevProps.onMount)) {
      this.initOnMount(this.props);
    }
    if (!isEqual(this.props.onUnmount, prevProps.onUnmount)) {
      this.initOnUnmount(this.props);
    }
  }

  componentDidMount() {
    const {value, onChange} = this.props;
    this.onMount(this.dom.current, value, onChange, this.props);
  }

  componentWillUnmount() {
    this.onUnmount(this.props);
    // 自动销毁所有子节点
    this.unmountChildElem();
  }

  // 记录子元素的dom节点
  recordChildElem(insertElem: HTMLElement) {
    if (insertElem && !this.childElemArr.some(item => item === insertElem)) {
      this.childElemArr.push(insertElem);
    }
  }

  // 销毁所有子元素的dom节点
  unmountChildElem() {
    if (this.childElemArr && this.childElemArr.length > 0) {
      this.childElemArr.forEach(childElemItem =>
        ReactDOM.unmountComponentAtNode(childElemItem)
      );
    }
  }

  /**
   * 渲染子元素
   * 备注：现有custom组件通过props.render生成的子元素是react虚拟dom对象，需要使用ReactDOM.render渲染，不能直接插入到当前dom中。
   **/
  renderChild(
    schemaPosition: string,
    childSchema: any,
    insertElemDom: HTMLElement | string
  ) {
    const {render} = this.props;
    let childEleCont = null;
    let curInsertElemDom: any = null;
    if (isString(insertElemDom)) {
      const _curInsertElem = document.getElementById(insertElemDom);
      if (_curInsertElem) {
        curInsertElemDom = _curInsertElem as HTMLElement;
      }
    } else {
      curInsertElemDom = insertElemDom;
    }
    if (childSchema && curInsertElemDom) {
      const childHTMLElem = render(schemaPosition, childSchema);
      childEleCont = ReactDOM.render(childHTMLElem, curInsertElemDom, () => {
        this.recordChildElem(curInsertElemDom);
      });
    }
    return childEleCont;
  }

  render() {
    const {
      className,
      style,
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
        style={style}
        id={id}
        dangerouslySetInnerHTML={{__html: html ? html : ''}}
      ></Component>
    );
  }
}

@Renderer({
  type: 'custom'
})
export class CustomRenderer extends Custom {}
