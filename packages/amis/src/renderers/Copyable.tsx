/**
 * @file scoped.jsx.
 * @author fex
 */

import React from 'react';
import {RendererProps} from 'amis-core';

import hoistNonReactStatic from 'hoist-non-react-statics';

import {filter} from 'amis-core';
import {Icon} from 'amis-ui';
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

export const HocCopyable =
  () =>
  (Component: React.ComponentType<any>): any => {
    class QuickEditComponent extends React.PureComponent<CopyableProps, any> {
      static ComposedComponent = Component;
      handleClick(content: string) {
        const {env, copyFormat} = this.props;
        env.copy && env.copy(content, {format: copyFormat});
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
