/**
 * @file TableFormItem.jsx.
 * @author fex
 */

import React from 'react';
import {RendererProps} from 'amis-core';
import hoistNonReactStatic from 'hoist-non-react-statics';
import omit from 'lodash/omit';

export interface QuickEditProps extends RendererProps {
  name?: string;
  label?: string;
  isTableFormItem?: string;
  [x: string]: any
}

export const HocTableItem =
  () =>
  (Component: React.ComponentType<any>): any => {
    class TableFormItemComponent extends React.PureComponent<
      QuickEditProps,
      {}
    > {
      target: HTMLElement;
      overlay: HTMLElement;
      static ComposedComponent = Component;
      constructor(props: QuickEditProps) {
        super(props);

        this.overlayRef = this.overlayRef.bind(this);
        this.formRef = this.formRef.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }

      handleChange(values: object) {
        const {onQuickChange} = this.props;
        onQuickChange(
          values,
          true,
          false
        );
      }

      formRef(ref: any) {
        const {tableFormItemRef, rowIndex, colIndex} = this.props;

        if (tableFormItemRef) {
          while (ref && ref.getWrappedInstance) {
            ref = ref.getWrappedInstance();
          }

          tableFormItemRef(ref, colIndex, rowIndex);
        }
      }

      overlayRef(ref: any) {
        this.overlay = ref;
      }

      buildSchema() {
        let {column} = this.props;

        let schema = {
          mode: 'normal',
          type: 'form',
          wrapWithPanel: false,
          body: [
            {
              ...omit(column, ['isTableFormItem']),
              label: false
            }
          ],
          actions: []
        };
        return schema || 'error';
      }

      render() {
        const {
          classnames: cx,
          render,
          canAccessSuperData,
          column,
        } = this.props;

        if (!column?.isTableFormItem) {
          return <Component {...this.props} />;
        }

        return (
          <Component {...this.props}>
            {render('inline-form', this.buildSchema(), {
              value: undefined,
              wrapperComponent: 'div',
              className: cx('Form--table-formItem'),
              ref: this.formRef,
              simpleMode: true,
              formLazyChange: false,
              onChange: this.handleChange,
              canAccessSuperData
            })}
          </Component>
        );
      }
    }

    hoistNonReactStatic(TableFormItemComponent, Component);

    return TableFormItemComponent;
  };

export default HocTableItem;
