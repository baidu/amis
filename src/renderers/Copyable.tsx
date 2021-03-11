/**
 * @file scoped.jsx.
 * @author fex
 */

import React from 'react';
import {RendererProps} from '../factory';
import cx from 'classnames';
import hoistNonReactStatic from 'hoist-non-react-statics';
import Button from '../components/Button';
import {filter} from '../utils/tpl';
import {Icon} from '../components/icons';
import {SchemaIcon, SchemaTpl} from '../Schema';

export interface SchemaCopyableObject {
  /**
   * 可以配置图标
   */
  icon?: SchemaIcon;

  /**
   * 配置复制时的内容模板。
   */
  content?: SchemaTpl;
}

export type SchemaCopyable = boolean | SchemaCopyableObject;

export interface CopyableProps extends RendererProps {
  name?: string;
  label?: string;
  copyable: SchemaCopyable;
}

export const HocCopyable = () => (Component: React.ComponentType<any>): any => {
  class QuickEditComponent extends React.PureComponent<CopyableProps, any> {
    static ComposedComponent = Component;
    handleClick(content: string) {
      const {env} = this.props;
      env.copy && env.copy(content);
    }
    render() {
      const {
        copyable,
        name,
        className,
        data,
        noHoc,
        classnames: cx,
        translate: __
      } = this.props;

      if (copyable && !noHoc) {
        const content = filter(
          (copyable as SchemaCopyableObject).content ||
            '${' + name + ' | raw }',
          data
        );
        if (content) {
          return (
            <Component
              {...this.props}
              className={cx(`Field--copyable`, className)}
            >
              <Component {...this.props} wrapperComponent={''} noHoc />
              <a
                key="edit-btn"
                data-tooltip={__('Copyable.tip')}
                className={cx('Field-copyBtn')}
                onClick={this.handleClick.bind(this, content)}
              >
                <Icon icon="copy" className="icon" />
              </a>
            </Component>
          );
        }
      }
      return <Component {...this.props} />;
    }
  }
  hoistNonReactStatic(QuickEditComponent, Component);
  return QuickEditComponent;
};

export default HocCopyable;
