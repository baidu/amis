import React from 'react';
import {
  makeColumnClassBuild,
  makeHorizontalDeeper,
  isVisible,
  isDisabled
} from 'amis-core';
import {getExprProperties} from 'amis-core';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';
import {IFormItemStore, IFormStore} from 'amis-core';
import {SchemaClassName, SchemaCollection, SchemaObject} from '../../Schema';

/**
 * InputGroup
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-group
 */
export interface InputGroupControlSchema extends FormBaseControl {
  type: 'input-group';

  /**
   * FormItem 集合
   */
  body: SchemaCollection;
}

export interface InputGroupProps extends FormControlProps {
  body: Array<any>;
  formStore: IFormStore;
}

interface InputGroupState {
  isFocused: boolean;
}

export class InputGroup extends React.Component<
  InputGroupProps,
  InputGroupState
> {
  constructor(props: InputGroupProps) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      isFocused: false
    };
  }

  handleFocus() {
    this.setState({
      isFocused: true
    });
  }

  handleBlur() {
    this.setState({
      isFocused: false
    });
  }

  renderControl(control: any, index: any, otherProps?: any) {
    const {render, onChange} = this.props;

    if (!control) {
      return null;
    }

    const subSchema: any = control;

    return render(`${index}`, subSchema, {
      onChange,
      ...otherProps
    });
  }

  validate() {
    const {formItem} = this.props;

    const errors: Array<string> = [];

    // issue 处理这个，按理不需要这么弄。
    formItem?.subFormItems.forEach((item: IFormItemStore) => {
      if (item.errors.length) {
        errors.push(...item.errors);
      }
    });

    return errors.length ? errors : '';
  }

  render() {
    let {
      body,
      controls,
      className,
      mode,
      horizontal,
      formMode,
      formHorizontal,
      data,
      classnames: cx
    } = this.props;

    formMode = mode || formMode;
    let inputs: Array<any> = Array.isArray(controls) ? controls : body;
    if (!Array.isArray(inputs)) {
      inputs = [];
    }

    inputs = inputs.filter(item => {
      if (item && (item.hidden || item.visible === false)) {
        return false;
      }

      const exprProps = getExprProperties(item || {}, data);
      if (exprProps.hidden || exprProps.visible === false) {
        return false;
      }

      return true;
    });

    let horizontalDeeper =
      horizontal ||
      (formHorizontal
        ? makeHorizontalDeeper(formHorizontal as any, inputs.length)
        : undefined);
    return (
      <div
        className={cx(`InputGroup`, className, {
          'is-focused': this.state.isFocused
        })}
      >
        {inputs.map((control, index) => {
          const isAddOn = ~[
            'icon',
            'plain',
            'tpl',
            'button',
            'submit',
            'reset'
          ].indexOf(control && control.type);

          let dom = this.renderControl(control, index, {
            formHorizontal: horizontalDeeper,
            formMode: 'normal',
            inputOnly: true,
            key: index,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur
          });

          return isAddOn ? (
            <span
              key={index}
              className={cx(
                control.addOnclassName,
                ~['button', 'submit', 'reset'].indexOf(control && control.type)
                  ? 'InputGroup-btn'
                  : 'InputGroup-addOn'
              )}
            >
              {dom}
            </span>
          ) : (
            dom
          );
        })}
      </div>
    );
  }
}

@FormItem({
  type: 'input-group',
  strictMode: false
})
export default class InputGroupRenderer extends InputGroup {}
