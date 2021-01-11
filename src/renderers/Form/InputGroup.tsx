import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import {Schema} from '../../types';
import Collapse from '../Collapse';
import {
  makeColumnClassBuild,
  makeHorizontalDeeper,
  isVisible,
  isDisabled
} from '../../utils/helper';
import cx from 'classnames';
import getExprProperties from '../../utils/filter-schema';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  FormControlSchema
} from './Item';
import {IFormItemStore, IFormStore} from '../../store/form';
import {SchemaClassName} from '../../Schema';

/**
 * InputGroup
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-group
 */
export interface InputGroupControlSchema extends FormBaseControl {
  type: 'input-group';

  /**
   * FormItem 集合
   */
  controls: Array<FormControlSchema>;
}

export interface InputGroupProps extends FormControlProps {
  controls: Array<any>;
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

    const subSchema: any =
      control && (control as Schema).type === 'control'
        ? control
        : {
            type: 'control',
            control
          };

    if (subSchema.control) {
      let control = subSchema.control as Schema;
      control.hiddenOn && (subSchema.hiddenOn = control.hiddenOn);
      control.visibleOn && (subSchema.visibleOn = control.visibleOn);
    }

    return render(`${index}`, subSchema, {
      onChange,
      ...otherProps
    });
  }

  validate() {
    const {formItem} = this.props;

    const errors: Array<string> = [];

    formItem?.subFormItems.forEach((item: IFormItemStore) => {
      if (item.errors.length) {
        errors.push(...item.errors);
      }
    });

    return errors.length ? errors : '';
  }

  render() {
    let {
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

    controls = controls.filter(item => {
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
      makeHorizontalDeeper(formHorizontal as any, controls.length);
    return (
      <div
        className={cx(`InputGroup`, className, {
          'is-focused': this.state.isFocused
        })}
      >
        {controls.map((control, index) => {
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
